import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PROJECTS, Project } from '../../data/projects.data';

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
  ongoingProjects: Project[] = PROJECTS.filter(p => p.status === 'Ongoing');

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkIfAboutPage(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkIfAboutPage(event.urlAfterRedirects || event.url);
      });
  }

  private checkIfAboutPage(url: string): void {
    this.isAboutPage = url.includes('ayodhara');
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
