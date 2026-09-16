import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InquiryService, InquiryPayload } from '../../services/inquiry.service';
import { ProjectService, Project } from '../../services/project.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | undefined;
  relatedProjects: Project[] = [];
  selectedImage: string | null = null;
  activeGalleryIndex: number = 0;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  
  // Inquiry form model
  inquiry = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };
  inquirySubmitted = false;

  // Brochure Download Modal
  isBrochureModalOpen: boolean = false;
  brochureForm = {
    name: '',
    phone: '',
    email: ''
  };
  brochureSubmitted: boolean = false;
  isBrochureSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private inquiryService: InquiryService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProject(id);
      }
    });
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.projectService.getProjectById(id).subscribe({
      next: (proj) => {
        if (proj) {
          this.project = proj;
        }
        this.isLoading = false;

        // Fetch other projects from MongoDB for related developments
        this.projectService.getProjects().subscribe({
          next: (all) => {
            const currentId = this.project?.projectId || id;
            this.relatedProjects = all
              .filter(p => p.projectId !== currentId && p.projectId !== 'ayodhara-plotting')
              .slice(0, 3);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Failed to load related projects:', err)
        });

        this.activeGalleryIndex = 0;
        this.inquirySubmitted = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load project details:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Open Brochure Download Modal
   */
  openBrochureModal(): void {
    this.isBrochureModalOpen = true;
    this.brochureSubmitted = false;
    this.isBrochureSubmitting = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Close Brochure Download Modal
   */
  closeBrochureModal(): void {
    this.isBrochureModalOpen = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  /**
   * Submits lead to MongoDB Atlas CRM (inquiryType: 'Brochure Download')
   * and triggers the brochure file download without WhatsApp redirect
   */
  submitBrochureDownload(): void {
    if (!this.brochureForm.name || !this.brochureForm.phone || this.isBrochureSubmitting) {
      return;
    }

    this.isBrochureSubmitting = true;

    const payload: InquiryPayload = {
      name: this.brochureForm.name.trim(),
      phone: this.brochureForm.phone.trim(),
      email: (this.brochureForm.email || '').trim(),
      projectName: this.project?.name || 'Chalamaji Project',
      inquiryType: 'Brochure Download',
      sourcePage: `/projects/${this.project?.projectId || this.project?.id || ''}`
    };

    this.inquiryService.submitInquiry(payload).subscribe({
      next: (res) => {
        console.log('Brochure inquiry recorded for CRM:', res);
        this.isBrochureSubmitting = false;
        this.brochureSubmitted = true;
        this.cdr.detectChanges();

        // Trigger file download
        const brochurePath = this.project?.brochureUrl || 'assets/Chalamaji_Signature_Brochure.pdf';
        const link = document.createElement('a');
        link.href = brochurePath;
        link.download = `${(this.project?.name || 'Project').replace(/\s+/g, '_')}_Brochure.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Auto close modal after download
        setTimeout(() => {
          this.closeBrochureModal();
          this.brochureForm = { name: '', phone: '', email: '' };
          this.brochureSubmitted = false;
          this.cdr.detectChanges();
        }, 3500);
      },
      error: (err) => {
        this.isBrochureSubmitting = false;
        console.error('Failed to save brochure inquiry to CRM:', err);
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Smoothly scrolls user down to the private consultation inquiry section
   */
  scrollToEnquiry(): void {
    const el = document.getElementById('enquiry-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Maps amenity strings to elegant FontAwesome icons
   */
  getAmenityIcon(amenity: string): string {
    const lower = (amenity || '').toLowerCase();
    if (lower.includes('pool') || lower.includes('swim')) return 'fa-person-swimming';
    if (lower.includes('gym') || lower.includes('fitness')) return 'fa-dumbbell';
    if (lower.includes('garden') || lower.includes('park') || lower.includes('green') || lower.includes('tree') || lower.includes('plantation')) return 'fa-tree';
    if (lower.includes('security') || lower.includes('cctv') || lower.includes('compound') || lower.includes('automated')) return 'fa-shield-halved';
    if (lower.includes('club') || lower.includes('lounge') || lower.includes('community')) return 'fa-champagne-glasses';
    if (lower.includes('play') || lower.includes('child')) return 'fa-child-reaching';
    if (lower.includes('track') || lower.includes('jogging') || lower.includes('walk')) return 'fa-person-walking';
    if (lower.includes('hall') || lower.includes('lobby') || lower.includes('plaza')) return 'fa-building-columns';
    if (lower.includes('yoga') || lower.includes('spa') || lower.includes('wellness')) return 'fa-spa';
    if (lower.includes('court') || lower.includes('tennis') || lower.includes('game') || lower.includes('sports')) return 'fa-table-tennis-paddle-ball';
    if (lower.includes('elevator') || lower.includes('lift')) return 'fa-arrows-up-down';
    if (lower.includes('power') || lower.includes('backup') || lower.includes('solar') || lower.includes('cabling')) return 'fa-bolt';
    if (lower.includes('water') || lower.includes('harvesting') || lower.includes('tank')) return 'fa-droplet';
    if (lower.includes('smart') || lower.includes('home')) return 'fa-house-signal';
    if (lower.includes('concierge')) return 'fa-bell-concierge';
    if (lower.includes('road') || lower.includes('street') || lower.includes('lighting')) return 'fa-road';
    if (lower.includes('vaastu') || lower.includes('vastu')) return 'fa-compass';
    return 'fa-gem';
  }

  // ---- LIGHTBOX CONTROLS ----

  openLightbox(image: string, index: number): void {
    this.selectedImage = image;
    this.activeGalleryIndex = index;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox(): void {
    this.selectedImage = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  nextImage(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.project && this.project.gallery && this.project.gallery.length > 0) {
      this.activeGalleryIndex = (this.activeGalleryIndex + 1) % this.project.gallery.length;
      this.selectedImage = this.project.gallery[this.activeGalleryIndex];
    }
  }

  prevImage(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.project && this.project.gallery && this.project.gallery.length > 0) {
      this.activeGalleryIndex = (this.activeGalleryIndex - 1 + this.project.gallery.length) % this.project.gallery.length;
      this.selectedImage = this.project.gallery[this.activeGalleryIndex];
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.selectedImage) return;
    if (event.key === 'Escape') {
      this.closeLightbox();
    } else if (event.key === 'ArrowRight') {
      this.nextImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevImage();
    }
  }

  // ---- INQUIRY SUBMISSION ----

  submitInquiry(): void {
    if (!this.inquiry.name || !this.inquiry.phone || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const payload: InquiryPayload = {
      name: this.inquiry.name.trim(),
      phone: this.inquiry.phone.trim(),
      email: (this.inquiry.email || '').trim(),
      message: (this.inquiry.message || '').trim(),
      projectName: this.project?.name || 'Project Detail',
      inquiryType: 'Project Detail Inquiry',
      sourcePage: `/projects/${this.project?.projectId || this.project?.id || ''}`
    };

    this.inquiryService.submitInquiry(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.inquirySubmitted = true;
        this.cdr.detectChanges();

        // Redirect to WhatsApp with pre-filled message per requirements
        this.inquiryService.redirectToWhatsApp({
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          projectName: payload.projectName,
          inquiryType: payload.inquiryType,
          message: payload.message
        });

        // Reset form after delay
        setTimeout(() => {
          this.inquiry = { name: '', phone: '', email: '', message: '' };
          this.cdr.detectChanges();
        }, 7000);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Failed to save project inquiry:', err);
        this.cdr.detectChanges();
      }
    });
  }
}
