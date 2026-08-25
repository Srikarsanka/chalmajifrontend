import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-philosophy-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './philosophy-section.component.html',
  styleUrl: './philosophy-section.component.css'
})
export class PhilosophySectionComponent implements OnInit {
  isVisible = false;

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
      { threshold: 0.2 }
    );
    setTimeout(() => {
      const el = document.querySelector('.philosophy-section');
      if (el) observer.observe(el);
    });
  }
}
