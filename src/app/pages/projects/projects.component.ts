import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectsSectionComponent } from '../../components/projects-section/projects-section.component';
import { ProjectsHeaderComponent } from '../../components/projects-header/projects-header.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectsSectionComponent, ProjectsHeaderComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeo({
      title: 'Our Projects | Luxury Coastal Residences & Plotted Layouts | Chalamaji Infra',
      description: 'Explore Chalamaji Infra\'s portfolio of ongoing and completed developments across Visakhapatnam and Vizianagaram, including sea-facing luxury apartments at Signature and divine plotted sanctuaries at Ayodhara.',
      keywords: 'Chalamaji projects, luxury apartments Visakhapatnam, Ayodhara plots Vizianagaram, Chalamaji Signature Pandurangapuram, residential properties Vizag, VMRDA approved plots, coastal residences Andhra Pradesh',
      canonicalUrl: 'https://chalamaji.com/projects',
      ogImage: 'https://res.cloudinary.com/djha4r2ys/image/upload/v1791024228/40a10a2f-fd5e-4c7a-b566-fc05f259df78.png',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Chalamaji Infra Projects Portfolio',
        'url': 'https://chalamaji.com/projects',
        'description': 'Bespoke residential communities, plotted sanctuaries, healthcare infrastructure, and coastal apartments in Visakhapatnam.',
        'publisher': {
          '@type': 'Organization',
          'name': 'Chalamaji Infra Projects Pvt Ltd',
          'url': 'https://chalamaji.com/'
        }
      }
    });

    window.scrollTo(0, 0);
  }
}
