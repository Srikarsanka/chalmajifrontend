import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface HeaderImage {
  src: string;
  alt: string;
  label: string;
}

@Component({
  selector: 'app-projects-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-header.component.html',
  styleUrl: './projects-header.component.css'
})
export class ProjectsHeaderComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<string>();

  isVisible = false;
  activeFilter = 'all';
  activeImageIndex = 0;
  private intervalId: any;

  filters = [
    { label: 'All', value: 'all' },
    { label: 'Plots', value: 'plotting' },
    { label: 'Apartments', value: 'apartments' },
    { label: 'Villas', value: 'villas' },
    { label: 'Commercial', value: 'commercial' }
  ];

  images: HeaderImage[] = [
    {
      src: '/assets/images/projects-header/plots.jpg',
      alt: 'Plotted residential community with tree-lined roads at golden hour',
      label: 'Plotted Communities'
    },
    {
      src: '/assets/images/projects-header/apartment.jpg',
      alt: 'Modern apartment facade with wood-and-stone cladding and hanging plants',
      label: 'Contemporary Apartments'
    },
    {
      src: '/assets/images/projects-header/villa.jpg',
      alt: 'Standalone luxury villa with private garden and evening landscape lighting',
      label: 'Standalone Villas'
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
      this.cdr.detectChanges();
    }, 200);

    this.intervalId = setInterval(() => {
      this.activeImageIndex = (this.activeImageIndex + 1) % this.images.length;
      this.cdr.detectChanges();
    }, 4500);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  setFilter(value: string) {
    this.activeFilter = value;
    this.filterChange.emit(value);
  }

  setActiveImage(index: number) {
    this.activeImageIndex = index;
    // Reset the auto-cycle timer
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.activeImageIndex = (this.activeImageIndex + 1) % this.images.length;
      this.cdr.detectChanges();
    }, 4500);
  }
}
