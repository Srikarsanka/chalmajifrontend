import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProjectService, Project } from '../../services/project.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  logoVisible = true;
  isAboutPage = false;
  isAdminPage = false;
  isLightPage = false;
  isProjectsPage = false;
  ongoingProjects: Project[] = [];

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadOngoingProjects();
    this.checkRoute(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects || event.url);
      });
  }

  loadOngoingProjects(): void {
    this.projectService.getProjects(undefined, 'Ongoing').subscribe({
      next: (projects) => {
        this.ongoingProjects = projects;
      },
      error: (err) => console.error('Failed to load ongoing projects for header:', err)
    });
  }

  private checkRoute(url: string): void {
    const cleanUrl = url || '';
    this.isAboutPage = false;
    this.isAdminPage = cleanUrl.startsWith('/admin');
    this.isProjectsPage = cleanUrl.startsWith('/projects');
    this.isLightPage = cleanUrl.startsWith('/connect') || cleanUrl.startsWith('/projects') || cleanUrl.startsWith('/about');
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 100;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}
