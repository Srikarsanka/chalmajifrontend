import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { VisionBannerComponent } from '../../components/vision-banner/vision-banner.component';
import { AboutSectionComponent } from '../../components/about-section/about-section.component';
import { ProjectsSectionComponent } from '../../components/projects-section/projects-section.component';
import { StatsSectionComponent } from '../../components/stats-section/stats-section.component';
import { PhilosophySectionComponent } from '../../components/philosophy-section/philosophy-section.component';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section.component';
import { ConnectSectionComponent } from '../../components/connect-section/connect-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    VisionBannerComponent,
    AboutSectionComponent,
    ProjectsSectionComponent,
    StatsSectionComponent,
    PhilosophySectionComponent,
    TestimonialsSectionComponent,
    ConnectSectionComponent
  ],
  template: `
    <main>
      <app-hero></app-hero>
      <app-vision-banner></app-vision-banner>
      <app-about-section></app-about-section>
      <app-projects-section></app-projects-section>
      <app-stats-section></app-stats-section>
      <app-philosophy-section></app-philosophy-section>
      <app-testimonials-section></app-testimonials-section>
      <app-connect-section></app-connect-section>
    </main>
  `,
  styles: [`
    /* --- Scroll Stacking Effect --- */

    /* Hero stays pinned in the background while everything scrolls over it */
    app-hero {
      display: block;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    /* Vision banner scrolls OVER the hero AND header (header is z-index:100) */
    app-vision-banner {
      display: block;
      position: relative;
      z-index: 101;
    }

    /* All other sections stack ABOVE the vision banner */
    app-about-section,
    app-projects-section,
    app-stats-section,
    app-philosophy-section,
    app-testimonials-section,
    app-connect-section {
      display: block;
      position: relative;
      z-index: 102;
    }
  `]
})
export class HomeComponent { }
