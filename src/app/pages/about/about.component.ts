import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface JourneyMilestone {
  era: string;
  title: string;
  description: string;
}

export interface FeaturedProject {
  id: string;
  name: string;
  location: string;
  type: string;
  details?: string;
  image: string;
  fallbackImage: string;
  link: string;
}

export interface DirectorProfile {
  name: string;
  designation: string;
  image?: string;
}

export interface TrustPillar {
  title: string;
  iconType: 'diamond' | 'leaf' | 'community' | 'building' | 'handshake';
}

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  // Hero background image (clean cropped background spanning full div)
  heroBgUrl = 'https://res.cloudinary.com/djha4r2ys/image/upload/c_crop,h_675,w_1983,y_0/v1790076037/a5fd7660-d38c-4086-8baa-7a5793bed978.png';

  // 5 Major Historical Eras matching the Mockup
  journeyMilestones: JourneyMilestone[] = [
    {
      era: '1987 – 1997',
      title: 'Early Residential Developments',
      description: 'Early Residential Developments in Visakhapatnam'
    },
    {
      era: '1999 – 2004',
      title: 'Infrastructure & Irrigation',
      description: 'Infrastructure & Irrigation Projects across India'
    },
    {
      era: '2006 – 2012',
      title: 'Commercial & Residential',
      description: 'Commercial & Residential Landmarks'
    },
    {
      era: '2016 – 2020',
      title: 'Modern Living',
      description: 'Modern Living Communities'
    },
    {
      era: '2022 – 2026',
      title: 'Expanding Horizons',
      description: 'Expanding Horizons with Iconic Developments'
    }
  ];

  // 4 Featured Projects: Chalamaji Alliance, Ayodhara, Pradhama Hospital, Fortune City
  featuredProjects: FeaturedProject[] = [
    {
      id: 'alliance',
      name: 'Chalamaji Alliance',
      location: 'Chinamusiliwada',
      type: 'Residential',
      details: '1,10,000 sq. ft.',
      image: 'assets/images/about/project-alliance.jpg',
      fallbackImage: 'assets/images/projects-header/apartment.jpg',
      link: '/projects'
    },
    {
      id: 'ayodhara',
      name: 'Ayodhara',
      location: 'Visakhapatnam',
      type: 'Sacred Landscape & Luxury Living',
      details: 'Plotted Community',
      image: 'assets/images/ayodhara/entrance-gate.jpg',
      fallbackImage: 'assets/images/ayodhara/entrance-gate.jpg',
      link: '/projects/ayodhara-plotting'
    },
    {
      id: 'pradhama',
      name: 'Pradhama Hospital',
      location: 'Visakhapatnam',
      type: 'Healthcare',
      details: '600 Beds',
      image: 'assets/images/about/project-pradhama.jpg',
      fallbackImage: 'assets/images/about/journey-healthcare.jpg',
      link: '/projects'
    },
    {
      id: 'fortune',
      name: 'Fortune City',
      location: 'Tagarapuvalasa',
      type: 'Plotted Development',
      details: '34 Acres',
      image: 'assets/images/about/project-fortune.jpg',
      fallbackImage: 'assets/images/projects-header/plots.jpg',
      link: '/projects'
    }
  ];

  // Exactly 3 Directors per user specification:
  // Visweswara Rao Mattapalli, Avinash Mattapalli, Anish Mattapalli
  directors: DirectorProfile[] = [
    {
      name: 'Sri Visweswara Rao Mattapalli',
      designation: 'Managing Director',
      image: 'https://res.cloudinary.com/djha4r2ys/image/upload/v1790919890/357164cc-4b33-4ca4-9aa3-14a516622bd9_lzonbs.png'
    },
    {
      name: 'Sri Avinash Mattapalli',
      designation: 'Director',
      image: 'https://res.cloudinary.com/djha4r2ys/image/upload/v1790921292/d4f09293-4d68-4cc5-b549-f962d0ce9027.png'
    },
    {
      name: 'Sri Anish Mattapalli',
      designation: 'Director',
      image: 'https://res.cloudinary.com/djha4r2ys/image/upload/v1790079466/18fa695b-a191-4e6e-93fa-2a057d41229b.png'
    }
  ];

  // 5 Pillars of Trust matching the Mockup
  trustPillars: TrustPillar[] = [
    { title: 'Quality Construction', iconType: 'diamond' },
    { title: 'Sustainable Development', iconType: 'leaf' },
    { title: 'Community Well-being', iconType: 'community' },
    { title: 'Diverse Expertise', iconType: 'building' },
    { title: 'Long-Term Value', iconType: 'handshake' }
  ];

  private intersectionObserver?: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollReveal();
    }
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  getInitials(name: string): string {
    if (!name) return 'CI';
    const parts = name.replace(/^Sri\s+/i, '').replace(/^Mr\.\s+/i, '').trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  onImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== fallbackUrl && fallbackUrl) {
      target.src = fallbackUrl;
    }
  }

  private initScrollReveal(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          this.intersectionObserver?.unobserve(entry.target);
        }
      });
    }, options);

    const revealElements = this.el.nativeElement.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el: Element) => {
      this.intersectionObserver?.observe(el);
    });
  }
}
