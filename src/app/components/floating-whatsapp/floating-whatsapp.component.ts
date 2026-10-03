import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PROJECTS } from '../../data/projects.data';
import { InquiryService } from '../../services/inquiry.service';

@Component({
  selector: 'app-floating-whatsapp',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside *ngIf="!isAdmin" class="whatsapp-float-wrapper">
      <a
        [href]="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="whatsapp-float-btn"
        [attr.aria-label]="ariaLabel"
        (mouseenter)="isHovered = true"
        (mouseleave)="isHovered = false"
      >
        <span class="whatsapp-pulse"></span>
        <i class="fa-brands fa-whatsapp"></i>
        <span class="whatsapp-tooltip" [class.visible]="isHovered">
          {{ tooltipText }}
        </span>
      </a>
    </aside>
  `,
  styles: [`
    .whatsapp-float-wrapper {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 999;
      pointer-events: auto;
    }

    .whatsapp-float-btn {
      position: relative;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #25D366;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
    }

    .whatsapp-float-btn:hover {
      transform: scale(1.1) translateY(-3px);
      box-shadow: 0 8px 28px rgba(37, 211, 102, 0.55), 0 3px 10px rgba(0, 0, 0, 0.2);
      background: #20BA5A;
    }

    .whatsapp-pulse {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(37, 211, 102, 0.4);
      animation: waPulse 2.4s ease-out infinite;
      z-index: -1;
    }

    @keyframes waPulse {
      0% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.4);
        opacity: 0;
      }
      100% {
        transform: scale(1.4);
        opacity: 0;
      }
    }

    .whatsapp-tooltip {
      position: absolute;
      right: 70px;
      top: 50%;
      transform: translateY(-50%) translateX(10px);
      background: rgba(27, 27, 27, 0.94);
      color: #FFFFFF;
      font-family: var(--font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
      font-size: 13px;
      font-weight: 500;
      padding: 7px 14px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: all 0.25s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .whatsapp-tooltip::after {
      content: '';
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      border-width: 6px 0 6px 6px;
      border-style: solid;
      border-color: transparent transparent transparent rgba(27, 27, 27, 0.94);
    }

    .whatsapp-tooltip.visible {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }

    @media (max-width: 768px) {
      .whatsapp-float-wrapper {
        bottom: 20px;
        right: 20px;
      }

      .whatsapp-float-btn {
        width: 52px;
        height: 52px;
        font-size: 26px;
      }

      .whatsapp-tooltip {
        display: none;
      }
    }
  `]
})
export class FloatingWhatsappComponent implements OnInit, OnDestroy {
  isAdmin = false;
  isHovered = false;
  whatsappUrl = '';
  tooltipText = 'Chat on WhatsApp';
  ariaLabel = 'Chat on WhatsApp with Chalamaji Infra';

  private routerSub?: Subscription;

  constructor(
    private router: Router,
    private inquiryService: InquiryService
  ) {}

  ngOnInit(): void {
    this.updateForRoute(this.router.url);

    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.updateForRoute(e.urlAfterRedirects || e.url);
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private updateForRoute(url: string): void {
    const cleanUrl = url || '';
    this.isAdmin = cleanUrl.startsWith('/admin');

    if (cleanUrl.startsWith('/projects/')) {
      const slug = cleanUrl.replace('/projects/', '').split('?')[0].split('#')[0];
      const matchedProject = PROJECTS.find(p => p.id === slug);
      const projName = matchedProject ? matchedProject.name : 'your project';

      this.whatsappUrl = this.inquiryService.getDirectWhatsAppUrl({
        projectName: matchedProject?.name || undefined
      });
      this.tooltipText = `Enquire about ${projName}`;
      this.ariaLabel = `Chat on WhatsApp about ${projName}`;
    } else {
      this.whatsappUrl = this.inquiryService.getDirectWhatsAppUrl();
      this.tooltipText = 'Chat with us on WhatsApp';
      this.ariaLabel = 'Chat on WhatsApp with Chalamaji Infra Projects';
    }
  }
}
