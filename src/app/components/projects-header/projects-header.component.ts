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
    { label: 'Residential', value: 'residential' },
    { label: 'Plotting', value: 'plotting' }
  ];

  images: HeaderImage[] = [
    {
      src: '/assets/images/projects-header/apartment.jpg',
      alt: 'Modern residential apartments and luxury homes',
      label: 'Residential'
    },
    {
      src: '/assets/images/projects-header/plots.jpg',
      alt: 'Plotted residential community with tree-lined roads at golden hour',
      label: 'Plotting'
    },
    {
      src: '/assets/images/projects-header/villa.jpg',
      alt: 'Standalone luxury residential villas with private gardens',
      label: 'Luxury Residential'
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
