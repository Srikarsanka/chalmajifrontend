import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StatsService, StatItem } from '../../services/stats.service';

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-section.component.html',
  styleUrl: './stats-section.component.css'
})
export class StatsSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  isVisible = false;
  private observer?: IntersectionObserver;
  private statsSub?: Subscription;

  // 20 digits: 2 full cycles of 0-9 for realistic rolling reel effect
  readonly digitList: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  stats: StatItem[] = [];

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private statsService: StatsService
  ) {}

  ngOnInit() {
    this.statsSub = this.statsService.stats$.subscribe(data => {
      this.stats = this.statsService.getFormattedStats(data);
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.initObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.statsSub) {
      this.statsSub.unsubscribe();
    }
  }

  private initObserver() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      this.isVisible = true;
      this.cdr.detectChanges();
      return;
    }

    const sectionEl = this.el.nativeElement.querySelector('.stats-section') || this.el.nativeElement;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
          } else {
            // Reset when leaving view so scrolling near it re-triggers the animation
            this.isVisible = false;
          }
          this.cdr.detectChanges();
        });
      },
      {
        root: null,
        // Expands trigger zone by 150px downwards: triggers when user is near the section
        rootMargin: '100px 0px 150px 0px',
        threshold: 0.05
      }
    );

    this.observer.observe(sectionEl);
  }

  getDigitOffset(digit: number): string {
    // Each of the 20 items is 5% of height. Target sits in cycle 2 (index 10 + digit).
    const targetIndex = 10 + digit;
    return `translateY(-${targetIndex * 5}%)`;
  }
}
