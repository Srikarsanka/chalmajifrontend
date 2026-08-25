import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PROJECTS, Project } from '../../data/projects.data';

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
  
  // Inquiry form model
  inquiry = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };
  inquirySubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
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
    this.project = PROJECTS.find(p => p.id === id);
    if (!this.project) {
      this.project = PROJECTS[0];
    }
    
    this.relatedProjects = PROJECTS.filter(p => p.id !== this.project?.id).slice(0, 3);
    this.activeGalleryIndex = 0;
    this.inquirySubmitted = false;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  getAmenityIcon(amenity: string): string {
    const lower = amenity.toLowerCase();
    if (lower.includes('pool')) return 'fa-person-swimming';
    if (lower.includes('gym')) return 'fa-dumbbell';
    if (lower.includes('garden') || lower.includes('park')) return 'fa-tree';
    if (lower.includes('security') || lower.includes('cctv')) return 'fa-shield-halved';
    if (lower.includes('club')) return 'fa-champagne-glasses';
    if (lower.includes('play') || lower.includes('child')) return 'fa-child-reaching';
    if (lower.includes('track') || lower.includes('jogging') || lower.includes('walk')) return 'fa-person-walking';
    if (lower.includes('hall')) return 'fa-building-columns';
    if (lower.includes('yoga')) return 'fa-spa';
    if (lower.includes('court') || lower.includes('game')) return 'fa-table-tennis-paddle-ball';
    if (lower.includes('elevator') || lower.includes('lift')) return 'fa-arrows-up-down';
    if (lower.includes('power') || lower.includes('backup')) return 'fa-bolt';
    if (lower.includes('water')) return 'fa-droplet';
    if (lower.includes('smart') || lower.includes('home')) return 'fa-house-signal';
    if (lower.includes('concierge') || lower.includes('lounge') || lower.includes('spa')) return 'fa-bell-concierge';
    return 'fa-circle-check';
  }

  openLightbox(image: string, index: number): void {
    this.selectedImage = image;
    this.activeGalleryIndex = index;
  }

  closeLightbox(): void {
    this.selectedImage = null;
  }

  nextImage(): void {
    if (this.project && this.project.gallery.length > 0) {
      this.activeGalleryIndex = (this.activeGalleryIndex + 1) % this.project.gallery.length;
      this.selectedImage = this.project.gallery[this.activeGalleryIndex];
    }
  }

  prevImage(): void {
    if (this.project && this.project.gallery.length > 0) {
      this.activeGalleryIndex = (this.activeGalleryIndex - 1 + this.project.gallery.length) % this.project.gallery.length;
      this.selectedImage = this.project.gallery[this.activeGalleryIndex];
    }
  }

  submitInquiry(): void {
    if (this.inquiry.name && this.inquiry.phone) {
      this.inquirySubmitted = true;
      setTimeout(() => {
        this.inquiry = { name: '', phone: '', email: '', message: '' };
        this.cdr.detectChanges();
      }, 5000);
    }
  }
}
