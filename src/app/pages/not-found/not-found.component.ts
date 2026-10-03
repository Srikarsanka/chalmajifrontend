import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-page">
      <div class="not-found-container">
        <span class="error-eyebrow">404 · NOTICE</span>
        <h1 class="error-title">Page Not Found</h1>
        <div class="accent-rule"></div>
        <p class="error-desc">
          The architectural address or folio you requested does not exist or has been relocated.
          Please explore our active projects or return to the main portal.
        </p>

        <div class="action-buttons">
          <a routerLink="/" class="btn primary-btn">
            <i class="fa-solid fa-house"></i>
            <span>Return to Home</span>
          </a>
          <a routerLink="/projects" class="btn secondary-btn">
            <i class="fa-solid fa-compass"></i>
            <span>Explore Projects</span>
          </a>
          <a routerLink="/connect" class="btn outline-btn">
            <i class="fa-solid fa-envelope"></i>
            <span>Contact Desk</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #FCFBF7;
      padding: 140px 24px 80px;
      font-family: var(--font-body, 'Inter', sans-serif);
      color: #111111;
      text-align: center;
    }

    .not-found-container {
      max-width: 620px;
      margin: 0 auto;
    }

    .error-eyebrow {
      font-size: 11px;
      letter-spacing: 3px;
      font-weight: 700;
      color: #C57642;
      text-transform: uppercase;
      display: block;
      margin-bottom: 12px;
    }

    .error-title {
      font-family: var(--font-display, 'Playfair Display', serif);
      font-size: clamp(36px, 5vw, 56px);
      font-weight: 700;
      color: #111111;
      line-height: 1.15;
      margin: 0 0 16px;
    }

    .accent-rule {
      width: 48px;
      height: 2px;
      background: #C57642;
      margin: 0 auto 24px;
    }

    .error-desc {
      font-size: 16px;
      line-height: 1.7;
      color: #555555;
      margin: 0 0 40px;
    }

    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 13px 26px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .primary-btn {
      background: #111111;
      color: #FFFFFF;
      border: 1px solid #111111;
    }

    .primary-btn:hover {
      background: #EC1C24;
      border-color: #EC1C24;
      transform: translateY(-2px);
    }

    .secondary-btn {
      background: #C57642;
      color: #FFFFFF;
      border: 1px solid #C57642;
    }

    .secondary-btn:hover {
      background: #a96130;
      border-color: #a96130;
      transform: translateY(-2px);
    }

    .outline-btn {
      background: transparent;
      color: #111111;
      border: 1.5px solid #E8E5DE;
    }

    .outline-btn:hover {
      border-color: #111111;
      transform: translateY(-2px);
    }

    @media (max-width: 640px) {
      .action-buttons {
        flex-direction: column;
        width: 100%;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class NotFoundComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.setNoIndex('Page Not Found | Chalamaji Infra Projects');
  }
}
