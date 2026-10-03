import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preloader-overlay" [class.fade-out]="isFadingOut" *ngIf="!hidden">
      <div class="preloader-container">
        
        <!-- Logo M Vessel with Slow Animated Red Waves -->
        <div class="m-vessel-wrap">
          <svg class="m-svg" viewBox="0 0 170 70" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Exact 'M' Mark Silhouette from the Chalamaji Logo -->
              <clipPath id="logoMClip">
                <path [attr.d]="logoMPath" />
              </clipPath>

              <!-- Front Wave Gradient (Chalamaji Brand Red / Crimson) -->
              <linearGradient id="waveFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#A5001A" />
                <stop offset="100%" stop-color="#8B0015" />
              </linearGradient>

              <!-- Back Wave Gradient (Lighter Translucent Red for Depth) -->
              <linearGradient id="waveBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#D92D43" stop-opacity="0.55" />
                <stop offset="100%" stop-color="#8B0015" stop-opacity="0.75" />
              </linearGradient>
            </defs>

            <!-- 1. Hollow M Interior Base (Clean Hollow Cavity) -->
            <path class="m-hollow-bg" [attr.d]="logoMPath" />

            <!-- 2. Slow Animated Red Liquid Waves (Clipped within the Logo M) -->
            <g clip-path="url(#logoMClip)">
              <g class="waves-level-group" [style.transform]="'translateY(' + waveTranslateY + 'px)'">
                <!-- Back wave (undulating opposite direction, very slow gentle motion) -->
                <path class="wave-shape wave-back"
                      d="M 0 10 Q 50 0 100 10 T 200 10 T 300 10 T 400 10 T 500 10 V 100 H 0 Z" />
                <!-- Front wave (primary rich red rolling wave crest) -->
                <path class="wave-shape wave-front"
                      d="M 0 14 Q 50 24 100 14 T 200 14 T 300 14 T 400 14 T 500 14 V 100 H 0 Z" />
              </g>
            </g>

            <!-- 3. Hollow M Outer Outline / Rim -->
            <path class="m-hollow-outline" [class.full-glow]="fillPercent >= 100" [attr.d]="logoMPath" />
          </svg>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ========================================================
       PRELOADER — WHITE BACKGROUND WITH SLOW RED WAVE LOGO 'M'
       ======================================================== */
    .preloader-overlay {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background-color: #FFFFFF;
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .preloader-overlay.fade-out {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .preloader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      user-select: none;
    }

    /* ---- COMPACT M VESSEL ---- */
    .m-vessel-wrap {
      width: 95px;
      height: 40px;
      position: relative;
      filter: drop-shadow(0 6px 16px rgba(139, 0, 21, 0.08));
      transition: transform 0.6s ease;
    }

    .m-svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }

    /* Hollow M Base (empty cavity inside the logo M shape) */
    .m-hollow-bg {
      fill: #FBF8F5;
      stroke: #EDE5DA;
      stroke-width: 1;
    }

    /* Rising Liquid Group — Graceful fluid transition */
    .waves-level-group {
      transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform;
    }

    /* Very Slow, Peaceful Fluid Wave Rolling Animation */
    .wave-shape {
      will-change: transform;
    }

    .wave-back {
      fill: url(#waveBackGrad);
      animation: waveFlowBack 9s linear infinite;
    }

    .wave-front {
      fill: url(#waveFrontGrad);
      animation: waveFlowFront 7s linear infinite;
    }

    @keyframes waveFlowFront {
      0% { transform: translateX(0); }
      100% { transform: translateX(-200px); }
    }

    @keyframes waveFlowBack {
      0% { transform: translateX(-200px); }
      100% { transform: translateX(0); }
    }

    /* Outer Rim Outline */
    .m-hollow-outline {
      fill: none;
      stroke: #D8CEBE;
      stroke-width: 1.2;
      stroke-linejoin: round;
      stroke-linecap: round;
      transition: stroke 0.6s ease, filter 0.6s ease;
    }

    .m-hollow-outline.full-glow {
      stroke: #8B0015;
      filter: drop-shadow(0 0 6px rgba(139, 0, 21, 0.35));
    }
  `]
})
export class PreloaderComponent implements OnInit, OnDestroy {
  hidden = false;
  isFadingOut = false;
  fillPercent = 15;

  /**
   * The exact geometric silhouette of the 'M' mark from the official Chalamaji logo.
   */
  readonly logoMPath = `
    M 58 3 L 64 3 L 65 4 L 66 4 L 67 5 L 70 6 L 79 15 L 79 16 L 87 24 L 87 25 L 94 32 L 94 33 L 102 41 L 102 42 L 109 49 L 109 50 L 110 51 L 108 53 L 107 53 L 101 59 L 100 59 L 96 63 L 95 63 L 93 65 L 92 65 L 89 67 L 80 67 L 79 66 L 77 66 L 76 65 L 75 65 L 73 63 L 72 63 L 63 54 L 63 53 L 57 47 L 57 46 L 50 39 L 50 38 L 44 32 L 44 31 L 37 24 L 37 23 L 35 21 L 35 20 L 38 17 L 39 17 L 46 10 L 47 10 L 50 7 L 51 7 L 53 5 L 54 5 L 55 4 L 57 4 L 58 3 Z
    M 115 3 L 119 3 L 120 4 L 121 4 L 122 5 L 124 5 L 126 7 L 127 7 L 131 11 L 131 12 L 139 20 L 139 21 L 147 29 L 147 30 L 154 37 L 154 38 L 162 46 L 162 47 L 166 51 L 163 54 L 162 54 L 156 60 L 155 60 L 151 64 L 150 64 L 148 66 L 146 66 L 145 67 L 142 67 L 141 68 L 139 68 L 138 67 L 135 67 L 134 66 L 132 66 L 130 64 L 129 64 L 127 62 L 126 62 L 123 59 L 123 58 L 116 51 L 116 50 L 110 44 L 110 43 L 103 36 L 103 35 L 97 29 L 97 28 L 91 22 L 91 20 L 94 17 L 95 17 L 102 10 L 103 10 L 106 7 L 107 7 L 112 4 L 114 4 L 115 3 Z
    M 30 24 L 31 24 L 36 29 L 36 30 L 44 38 L 44 39 L 51 46 L 51 47 L 55 51 L 53 53 L 52 53 L 46 59 L 45 59 L 41 63 L 40 63 L 38 65 L 37 65 L 34 67 L 24 67 L 23 66 L 22 66 L 21 65 L 18 64 L 16 62 L 15 62 L 12 59 L 12 58 L 6 52 L 6 51 L 3 48 L 3 47 L 4 46 L 5 46 L 12 39 L 13 39 L 19 33 L 20 33 L 26 27 L 27 27 L 30 24 Z
  `;

  private subscriptions = new Subscription();
  private climbInterval?: any;
  private completeTimeout?: any;
  private fadeTimeout?: any;
  private hideTimeout?: any;
  private safetyTimeout?: any;
  private navEndTimeout?: any;

  private startTime = Date.now();
  // Minimum display duration tuned to 1400ms for a calm, luxurious experience
  private readonly minDisplayMs = 1400;
  private isCompleting = false;
  private isShowing = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  /**
   * Calculates the SVG translateY coordinate based on fillPercent (0 - 100)
   * Top of M is at Y=3, Bottom of M is at Y=68 (Height = 65px)
   */
  get waveTranslateY(): number {
    const startY = 72;
    const distance = 76;
    return startY - (distance * (this.fillPercent / 100));
  }

  ngOnInit() {
    // Show preloader on initial application startup
    this.showLoader();

    // Listen to Angular Router navigation events across the whole app
    this.subscriptions.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.showLoader();
        } else if (event instanceof NavigationEnd) {
          this.onNavigationEnd();
        } else if (event instanceof NavigationCancel || event instanceof NavigationError) {
          this.completeLoader();
        }
      })
    );

    // Listen to manual start triggers from LoadingService
    this.subscriptions.add(
      this.loadingService.startLoading$.subscribe(() => {
        this.showLoader();
      })
    );

    // Listen to backend data arrival signals
    this.subscriptions.add(
      this.loadingService.dataReceived$.subscribe(() => {
        this.completeLoader();
      })
    );
  }

  ngOnDestroy() {
    this.clearAllTimers();
    this.subscriptions.unsubscribe();
  }

  /**
   * Activates the preloader overlay and starts the gradual wave progress climb
   */
  private showLoader() {
    if (this.isShowing && !this.hidden && !this.isFadingOut) {
      return;
    }
    this.clearAllTimers();
    this.isShowing = true;
    this.isCompleting = false;
    this.isFadingOut = false;
    this.hidden = false;
    this.fillPercent = 12;
    this.startTime = Date.now();
    this.cdr.detectChanges();

    this.startProgressClimb();

    // Safety fallback: auto-complete if nothing signals within 5000ms
    this.safetyTimeout = setTimeout(() => {
      this.completeLoader();
    }, 5000);
  }

  private startProgressClimb() {
    if (this.climbInterval) {
      clearInterval(this.climbInterval);
    }
    // Slower, smooth incremental climb while data is in flight
    this.climbInterval = setInterval(() => {
      if (this.fillPercent < 75 && !this.isCompleting) {
        this.fillPercent += Math.floor(Math.random() * 3) + 2; // +2 to +4% every 200ms
        this.cdr.detectChanges();
      }
    }, 200);
  }

  private onNavigationEnd() {
    // If backend data is actively in-flight from MongoDB, DO NOT dismiss early.
    // The loader strictly waits until dataReceived$ emits upon receiving the backend response.
    if (this.loadingService.isAwaitingBackendData) {
      return;
    }

    // For routes without backend calls (e.g. /about, /connect), gracefully complete after transition
    if (this.navEndTimeout) {
      clearTimeout(this.navEndTimeout);
    }
    this.navEndTimeout = setTimeout(() => {
      if (!this.isCompleting && this.isShowing && !this.loadingService.isAwaitingBackendData) {
        this.completeLoader();
      }
    }, 1200);
  }

  /**
   * Completes the fill to 100% and smoothly fades out with deliberate luxury pacing
   */
  private completeLoader() {
    if (this.loadingService.isAwaitingBackendData) {
      return;
    }
    if (this.isCompleting || !this.isShowing) return;
    this.isCompleting = true;

    if (this.climbInterval) {
      clearInterval(this.climbInterval);
    }
    if (this.navEndTimeout) {
      clearTimeout(this.navEndTimeout);
    }

    const elapsed = Date.now() - this.startTime;
    const remainingDelay = Math.max(0, this.minDisplayMs - elapsed);

    this.completeTimeout = setTimeout(() => {
      // Gracefully surge liquid to 100% full
      this.fillPercent = 100;
      this.cdr.detectChanges();

      // Hold at 100% full for 450ms so user clearly appreciates the completed logo mark
      this.fadeTimeout = setTimeout(() => {
        this.isFadingOut = true;
        this.cdr.detectChanges();

        // Complete smooth fade-out over 600ms
        this.hideTimeout = setTimeout(() => {
          this.hidden = true;
          this.isShowing = false;
          this.isCompleting = false;
          this.cdr.detectChanges();
        }, 600);
      }, 450);
    }, remainingDelay);
  }

  private clearAllTimers() {
    if (this.climbInterval) clearInterval(this.climbInterval);
    if (this.completeTimeout) clearTimeout(this.completeTimeout);
    if (this.fadeTimeout) clearTimeout(this.fadeTimeout);
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    if (this.safetyTimeout) clearTimeout(this.safetyTimeout);
    if (this.navEndTimeout) clearTimeout(this.navEndTimeout);
  }
}
