import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
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
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Chalamaji Infra Projects | Luxury Real Estate & Plotted Developments in Visakhapatnam',
      description: 'Chalamaji Infra Projects is a premier real estate developer in Visakhapatnam with 35+ years of excellence. Explore coastal luxury residences, gated plotted sanctuaries including Ayodhara, and landmark communities across Andhra Pradesh.',
      keywords: 'Chalamaji Infra, Chalamaji Infra Projects, real estate Visakhapatnam, Vizag luxury apartments, Ayodhara Vizianagaram, Chalamaji Signature, residential plots Vizag, construction company Visakhapatnam, AP RERA registered builders',
      canonicalUrl: 'https://chalamaji.com/',
      ogImage: 'https://res.cloudinary.com/djha4r2ys/image/upload/v1791024228/40a10a2f-fd5e-4c7a-b566-fc05f259df78.png',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        'name': 'Chalamaji Infra Projects Pvt Ltd',
        'alternateName': 'Chalamaji Infra',
        'url': 'https://chalamaji.com/',
        'logo': 'https://res.cloudinary.com/djha4r2ys/image/upload/v1791024228/40a10a2f-fd5e-4c7a-b566-fc05f259df78.png',
        'image': 'https://res.cloudinary.com/djha4r2ys/image/upload/v1791024228/40a10a2f-fd5e-4c7a-b566-fc05f259df78.png',
        'description': 'Premier real estate developer in Visakhapatnam with 35+ years of architectural excellence.',
        'telephone': '+919257925788',
        'email': 'info@chalamaji.com',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Door No. 7-5-18, Plot No. 37, Pandurangapuram',
          'addressLocality': 'Visakhapatnam',
          'addressRegion': 'Andhra Pradesh',
          'postalCode': '530003',
          'addressCountry': 'IN'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': 17.7159245,
          'longitude': 83.3205227
        },
        'hasMap': 'https://maps.app.goo.gl/91M6n4AgEXM9zENi6'
      }
    });
  }
}
