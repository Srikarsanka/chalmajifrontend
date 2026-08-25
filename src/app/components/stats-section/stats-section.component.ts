import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-section.component.html',
  styleUrl: './stats-section.component.css'
})
export class StatsSectionComponent implements OnInit {
  isVisible = false;
  stats = [
    { value: 0, target: 15, suffix: '+', label: 'Years of Experience' },
    { value: 0, target: 10, suffix: '+', label: 'Projects Delivered' },
    { value: 0, target: 2, suffix: 'M+', label: 'Sq. Ft. Developed' },
    { value: 0, target: 500, suffix: '+', label: 'Happy Families' }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isVisible) {
            this.isVisible = true;
            this.animateCounters();
            this.cdr.detectChanges();
          }
        });
      },
      { threshold: 0.3 }
    );
    setTimeout(() => {
      const el = document.querySelector('.stats-section');
      if (el) observer.observe(el);
    });
  }

  animateCounters() {
    this.stats.forEach((stat, index) => {
      const duration = 2000;
      const increment = stat.target / (duration / 16);
      const interval = setInterval(() => {
        stat.value += increment;
        if (stat.value >= stat.target) {
          stat.value = stat.target;
          clearInterval(interval);
        }
      }, 16);
    });
  }
}
