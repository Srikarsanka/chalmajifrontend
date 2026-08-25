import { Component, ElementRef, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-impproject',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './impproject.html',
  styleUrl: './impproject.css',
})
export class Impproject implements OnInit, OnDestroy {
  isVisible = false;
  private observer: IntersectionObserver | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(
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
      const el = document.querySelector('.impproject-section');
      if (el && this.observer) this.observer.observe(el);
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
