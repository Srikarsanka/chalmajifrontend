import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preloader" *ngIf="!hidden">
      <div class="preloader-inner">
        <div class="wave-c" data-text="C">C</div>
        <div class="loading-text">LOADING</div>
      </div>
    </div>
  `,
  styles: [`
    .preloader {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #1B1B1B;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      overflow: hidden;
      animation: preloaderFade 0.8s ease 2.5s forwards;
    }
    @keyframes preloaderFade {
      to {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }
    }
    .preloader-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .wave-c {
      position: relative;
      font-family: 'Playfair Display', serif;
      font-size: 80px;
      font-weight: 700;
      color: transparent;
      -webkit-text-stroke: 1.5px #ffffff;
      text-transform: uppercase;
      line-height: 1;
      display: inline-block;
    }
    .wave-c::before {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      color: #800000;
      -webkit-text-stroke: 0px transparent;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'%3E%3Cpath d='M 0 50 Q 25 35 50 50 T 100 50 T 150 50 T 200 50 L 200 150 L 0 150 Z' fill='%23800000'/%3E%3C/svg%3E") repeat-x;
      background-size: 200px 60%;
      background-position: 0 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: wave 2s linear infinite;
    }
    @keyframes wave {
      0% { background-position: 0 100%; }
      100% { background-position: 200px 100%; }
    }
    .loading-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 6px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 18px;
      padding-left: 6px;
      animation: pulseLoading 1.5s ease-in-out infinite alternate;
    }
    @keyframes pulseLoading {
      0% { opacity: 0.4; }
      100% { opacity: 1; }
    }
  `]
})
export class PreloaderComponent implements OnInit, OnDestroy {
  hidden = false;
  private routerSub!: Subscription;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone, private router: Router) {}

  ngOnInit() {
    this.startPreloader();

    // Trigger on route changes
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.startPreloader();
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  startPreloader() {
    this.hidden = false;
    this.cdr.detectChanges();
    
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.hidden = true;
          this.cdr.detectChanges();
        });
      }, 3200);
    });
  }
}
