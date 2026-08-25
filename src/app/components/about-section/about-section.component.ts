import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css'
})
export class AboutSectionComponent implements OnInit {
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
      const el = document.querySelector('.about-section');
      if (el) observer.observe(el);
    });
  }
}
