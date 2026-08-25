import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PROJECTS, Project } from '../../data/projects.data';


interface FilterTab {
  label: string;
  value: string;
}

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects-section.component.html',
  styleUrl: './projects-section.component.css'
})
export class ProjectsSectionComponent implements OnInit {
  isVisible = false;
  projects: Project[] = PROJECTS;
  filteredProjects: Project[] = PROJECTS;
  currentIndex = 0;
  activeFilter = 'all';

  filters: FilterTab[] = [
    { label: 'All', value: 'all' },
    { label: 'Apartments', value: 'apartments' },
    { label: 'Villas', value: 'villas' },
    { label: 'Plotting', value: 'plotting' },
    { label: 'Residential', value: 'residential' }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isVisible) {
            this.isVisible = true;
            this.cdr.detectChanges();
          }
        });
      },
      { threshold: 0.15 }
    );
    setTimeout(() => {
      const el = document.querySelector('.projects-section');
      if (el) observer.observe(el);
    });
  }

  setFilter(value: string) {
    this.activeFilter = value;
    if (value === 'all') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(p => p.category === value);
    }
    this.currentIndex = 0;
  }

  get totalSlides(): number {
    return this.filteredProjects.length;
  }

  get currentSlideNumber(): number {
    return this.totalSlides > 0 ? this.currentIndex + 1 : 0;
  }

  get progressPercentage(): number {
    if (this.totalSlides === 0) return 0;
    return ((this.currentIndex + 1) / this.totalSlides) * 100;
  }

  prev() {
    if (this.totalSlides === 0) return;
    this.currentIndex = this.currentIndex === 0
      ? this.totalSlides - 1
      : this.currentIndex - 1;
  }

  next() {
    if (this.totalSlides === 0) return;
    this.currentIndex = this.currentIndex === this.totalSlides - 1
      ? 0
      : this.currentIndex + 1;
  }

  getSlidePosition(index: number): string {
    const diff = index - this.currentIndex;
    if (diff === 0) return 'center';
    if (diff === 1 || diff === -(this.totalSlides - 1)) return 'right';
    if (diff === -1 || diff === this.totalSlides - 1) return 'left';
    if (diff > 1) return 'far-right';
    return 'far-left';
  }
}
