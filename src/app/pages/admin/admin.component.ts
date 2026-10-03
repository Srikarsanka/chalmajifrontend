import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../services/project.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  // Authentication
  isAuthenticated = false;
  passcode = '';
  authError = '';
  private readonly ADMIN_PASSCODE = 'chalmaji2026';
  private readonly STORAGE_KEY = 'chalmaji_admin_auth_v1';

  // Navigation & Tabs
  activeTab: 'projects' | 'plots' | 'inquiries' = 'projects';

  // Projects State
  projects: Project[] = [];
  isLoadingProjects = false;
  searchQuery = '';
  statusFilter = 'all';
  categoryFilter = 'all';

  // Selected Project Editor
  selectedProject: Project | null = null;
  editForm: Partial<Project> = {};
  newAmenity = '';
  newGalleryUrl = '';
  isSaving = false;
  isUploading = false;
  uploadTarget: 'mainImage' | 'carouselImage' | 'gallery' | null = null;

  // New Project Modal
  isCreateModalOpen = false;
  isCreating = false;
  newProjectForm: {
    name: string;
    projectId: string;
    location: string;
    type: string;
    status: 'Ongoing' | 'Upcoming' | 'Completed';
    category: 'residential' | 'plotting';
    reraNumber: string;
    description: string;
    mainImage: string;
  } = {
    name: '',
    projectId: '',
    location: '',
    type: '',
    status: 'Ongoing',
    category: 'residential',
    reraNumber: '',
    description: '',
    mainImage: ''
  };

  // Ayodhara Plots
  ayodharaProject: Project | null = null;
  isLoadingPlots = false;
  isUpdatingPlot = false;
  plotFilter = 'all';

  // Inquiries State
  inquiries: any[] = [];
  connectInquiries: any[] = [];
  isLoadingInquiries = false;
  inquirySearchQuery = '';

  // Image Zoom Modal
  zoomImageUrl: string | null = null;

  // Toast Notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null = null;
  private toastTimer: any = null;

  // Amenity Presets
  commonAmenities = [
    'Swimming Pool',
    'Clubhouse',
    'Gymnasium',
    '24/7 Security & CCTV',
    'Landscaped Gardens',
    'Power Backup',
    "Children's Play Area",
    'Covered Stilt Parking',
    'High-Speed Elevators',
    'Rainwater Harvesting',
    'Jogging Track',
    'Rooftop Lounge'
  ];

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored === 'true') {
        this.isAuthenticated = true;
        this.loadInitialData();
      }
    }
  }

  // ================= AUTHENTICATION =================

  login(code?: string): void {
    const input = (code !== undefined ? code : this.passcode).trim();
    if (input === this.ADMIN_PASSCODE) {
      this.isAuthenticated = true;
      this.authError = '';
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, 'true');
      }
      this.loadInitialData();
    } else {
      this.authError = 'Incorrect access passcode. Please try again.';
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.passcode = '';
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  loadInitialData(): void {
    this.loadProjects();
    this.loadInquiries();
  }

  // ================= PROJECTS =================

  loadProjects(): void {
    this.isLoadingProjects = true;
    this.projectService.getAllProjectsAdmin().subscribe({
      next: (data) => {
        this.projects = data || [];
        this.isLoadingProjects = false;
        // Check for Ayodhara for plots tab
        const foundAyodhara = this.projects.find((p) => p.projectId === 'ayodhara-plotting');
        if (foundAyodhara) {
          this.ayodharaProject = foundAyodhara;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showToast('Failed to load projects from server.', 'error');
        this.isLoadingProjects = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredProjects(): Project[] {
    return this.projects.filter((p) => {
      const q = this.searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.type && p.type.toLowerCase().includes(q)) ||
        (p.projectId && p.projectId.toLowerCase().includes(q));

      const matchStatus = this.statusFilter === 'all' || p.status === this.statusFilter;
      const matchCategory =
        this.categoryFilter === 'all' ||
        (this.categoryFilter === 'residential' && (p.category === 'residential' || p.category === 'apartments' || p.category === 'villas')) ||
        p.category === this.categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }

  selectProject(project: Project): void {
    this.selectedProject = project;
    // Deep clone to isolate edits until saved
    this.editForm = JSON.parse(JSON.stringify(project));
    if (!this.editForm.gallery) this.editForm.gallery = [];
    if (!this.editForm.amenities) this.editForm.amenities = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeEditor(): void {
    this.selectedProject = null;
    this.editForm = {};
    this.newAmenity = '';
    this.newGalleryUrl = '';
  }

  saveProject(): void {
    if (!this.selectedProject || !this.editForm.projectId) return;

    this.isSaving = true;
    this.projectService.updateProject(this.editForm.projectId, this.editForm).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res && res.success && res.data) {
          // Update in local projects list
          const index = this.projects.findIndex((p) => p.projectId === this.editForm.projectId);
          if (index !== -1) {
            this.projects[index] = { ...this.projects[index], ...res.data };
          }
          this.selectedProject = { ...this.selectedProject, ...res.data };
          this.editForm = JSON.parse(JSON.stringify(this.selectedProject));
          this.showToast(`✓ Changes saved for "${this.selectedProject.name}"!`, 'success');
        } else {
          this.showToast('Project updated successfully.', 'success');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error updating project:', err);
        this.showToast('Failed to save changes. Please try again.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  // ================= PHOTO & MEDIA MANAGEMENT =================

  onFileUpload(event: Event, target: 'mainImage' | 'carouselImage' | 'gallery'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.isUploading = true;
    this.uploadTarget = target;

    let completed = 0;
    let errors = 0;

    files.forEach((file) => {
      this.projectService.uploadPhoto(file).subscribe({
        next: (res) => {
          completed++;
          if (res && res.success) {
            const photoUrl = res.url || res.relativeUrl;
            if (target === 'mainImage') {
              this.editForm.mainImage = photoUrl;
            } else if (target === 'carouselImage') {
              this.editForm.carouselImage = photoUrl;
            } else if (target === 'gallery') {
              if (!this.editForm.gallery) this.editForm.gallery = [];
              this.editForm.gallery.push(photoUrl);
            }
          }

          if (completed + errors === files.length) {
            this.isUploading = false;
            this.uploadTarget = null;
            input.value = '';
            this.showToast(
              completed > 1
                ? `✓ ${completed} photos uploaded successfully!`
                : `✓ Photo uploaded successfully!`,
              'success'
            );
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          errors++;
          console.error('Upload error:', err);
          if (completed + errors === files.length) {
            this.isUploading = false;
            this.uploadTarget = null;
            input.value = '';
            this.showToast('Photo upload encountered an issue.', 'error');
            this.cdr.detectChanges();
          }
        }
      });
    });
  }

  addGalleryUrl(): void {
    const url = (this.newGalleryUrl || '').trim();
    if (!url) return;

    if (!this.editForm.gallery) {
      this.editForm.gallery = [];
    }

    this.editForm.gallery.push(url);
    this.newGalleryUrl = '';
    this.showToast('Photo added to gallery preview.', 'info');
  }

  removeGalleryPhoto(index: number): void {
    if (!this.editForm.gallery) return;
    this.editForm.gallery.splice(index, 1);
    this.showToast('Photo removed from gallery.', 'info');
  }

  setAsMainImage(url: string): void {
    this.editForm.mainImage = url;
    this.showToast('Set as Main Cover Photo!', 'success');
  }

  setAsCarouselImage(url: string): void {
    this.editForm.carouselImage = url;
    this.showToast('Set as Hero Carousel Banner!', 'success');
  }

  // ================= AMENITIES MANAGEMENT =================

  addAmenity(name?: string): void {
    const val = (name !== undefined ? name : this.newAmenity).trim();
    if (!val) return;

    if (!this.editForm.amenities) {
      this.editForm.amenities = [];
    }

    if (!this.editForm.amenities.includes(val)) {
      this.editForm.amenities.push(val);
      this.newAmenity = '';
      this.showToast(`Added amenity: "${val}"`, 'info');
    }
  }

  removeAmenity(index: number): void {
    if (!this.editForm.amenities) return;
    this.editForm.amenities.splice(index, 1);
  }

  // ================= NEW PROJECT CREATION =================

  openCreateModal(): void {
    this.newProjectForm = {
      name: '',
      projectId: '',
      location: 'Visakhapatnam',
      type: 'Residential Apartments',
      status: 'Ongoing',
      category: 'residential',
      reraNumber: '',
      description: '',
      mainImage: ''
    };
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  onNewProjectNameChange(): void {
    if (!this.newProjectForm.projectId || this.newProjectForm.projectId.length === 0) {
      this.newProjectForm.projectId = this.newProjectForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }

  createNewProject(): void {
    if (!this.newProjectForm.name || !this.newProjectForm.projectId) {
      this.showToast('Project name and Project ID are required.', 'error');
      return;
    }

    this.isCreating = true;
    this.projectService.createProject(this.newProjectForm).subscribe({
      next: (res) => {
        this.isCreating = false;
        this.isCreateModalOpen = false;
        if (res && res.success && res.data) {
          this.projects.push(res.data);
          this.selectProject(res.data);
          this.showToast(`✓ Project "${res.data.name}" created successfully!`, 'success');
        } else {
          this.loadProjects();
          this.showToast('Project created!', 'success');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isCreating = false;
        console.error('Error creating project:', err);
        const msg = err?.error?.message || 'Failed to create project.';
        this.showToast(msg, 'error');
        this.cdr.detectChanges();
      }
    });
  }

  deleteProject(p: Project, event?: Event): void {
    if (event) event.stopPropagation();
    const confirmed = confirm(
      `Are you sure you want to delete "${p.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    this.projectService.deleteProject(p.projectId).subscribe({
      next: () => {
        this.projects = this.projects.filter((item) => item.projectId !== p.projectId);
        if (this.selectedProject?.projectId === p.projectId) {
          this.closeEditor();
        }
        this.showToast(`✓ Project "${p.name}" deleted.`, 'info');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting project:', err);
        this.showToast('Failed to delete project.', 'error');
      }
    });
  }

  // ================= AYODHARA PLOTS =================

  get filteredPlots(): any[] {
    if (!this.ayodharaProject?.plots) return [];
    if (this.plotFilter === 'all') return this.ayodharaProject.plots;
    return this.ayodharaProject.plots.filter((plot) => plot.status === this.plotFilter);
  }

  updatePlot(plotNo: number, newStatus: string): void {
    if (!this.ayodharaProject) return;

    this.isUpdatingPlot = true;
    this.projectService.updatePlotStatus('ayodhara-plotting', plotNo, newStatus).subscribe({
      next: () => {
        this.isUpdatingPlot = false;
        const target = this.ayodharaProject?.plots?.find((p) => p.plotNo === plotNo);
        if (target) {
          target.status = newStatus;
        }
        this.showToast(`Plot #${plotNo} marked as ${newStatus}`, 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isUpdatingPlot = false;
        console.error('Error updating plot:', err);
        this.showToast(`Failed to update Plot #${plotNo}`, 'error');
        this.cdr.detectChanges();
      }
    });
  }

  // ================= INQUIRIES & LEADS =================

  loadInquiries(): void {
    this.isLoadingInquiries = true;
    this.projectService.getInquiries().subscribe({
      next: (data) => {
        this.inquiries = data || [];
        this.isLoadingInquiries = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingInquiries = false;
      }
    });

    this.projectService.getConnectInquiries().subscribe({
      next: (data) => {
        this.connectInquiries = data || [];
        this.cdr.detectChanges();
      }
    });
  }

  get allInquiriesCombined(): any[] {
    const list: any[] = [];
    (this.inquiries || []).forEach((item) => {
      list.push({ ...item, source: 'Brochure / Project Inquiry' });
    });
    (this.connectInquiries || []).forEach((item) => {
      list.push({ ...item, source: 'Contact Page Inquiry' });
    });

    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const q = this.inquirySearchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.projectName && item.projectName.toLowerCase().includes(q))
    );
  }

  getWhatsAppLink(phone: string, name?: string): string {
    const cleanNumber = (phone || '').replace(/[^0-9]/g, '');
    const validNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
    const text = encodeURIComponent(`Hello ${name || 'Sir/Madam'}, thank you for contacting Chalamaji Infra. How can we assist you today?`);
    return `https://wa.me/${validNumber}?text=${text}`;
  }

  // ================= ZOOM MODAL & TOAST =================

  openZoom(url: string): void {
    this.zoomImageUrl = url;
  }

  closeZoom(): void {
    this.zoomImageUrl = null;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = setTimeout(() => {
      this.toast = null;
      this.cdr.detectChanges();
    }, 4000);
  }
}
