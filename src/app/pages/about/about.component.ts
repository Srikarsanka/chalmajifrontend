import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface CapabilityPillar {
  index: string;
  sheetCode: string;
  title: string;
  summary: string;
  metric: string;
  description: string;
  image: string;
  tags: string[];
}

export interface PortfolioItem {
  id: string;
  sheetCode: string;
  title: string;
  category: 'plots' | 'apartments' | 'villas' | 'commercial' | 'infrastructure' | 'healthcare';
  metric: string;
  location: string;
  image: string;
}

export interface DirectorProfile {
  name: string;
  specCode: string;
  role: string;
  initials: string;
  designation: string;
  focusArea: string;
  highlights: string[];
}

export interface ClientPartner {
  name: string;
  type: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface RevisionHistoryItem {
  code: string;
  year: string;
  phase: string;
  title: string;
  extent: string;
  description: string;
  seal: string;
}

export interface MaterialSpec {
  code: string;
  material: string;
  standard: string;
  rating: string;
  property: string;
  application: string;
}

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  // Title Block live sheet tracking
  currentSheet: string = '01';

  // Dynamic Animated Fluctuating Numbers (Upward, Downward, & Scramble)
  stat1Display: string = '00+ YRS';
  stat2Display: string = '999%';
  stat3Display: string = 'SPEC-9';
  isScramblingNumbers: boolean = false;

  // Section 03 Capability Accordion State
  activePillarIndex: number | null = 0;

  // Material Schedule (BOM) State
  activeMaterialIndex: number | null = 0;

  // Drawing Revision Scrubber State (Defaults to latest 2026)
  selectedRevisionIndex: number = 3;

  // Revision History
  revisions: RevisionHistoryItem[] = [
    {
      code: 'REV-A',
      year: '1987',
      phase: 'ORIGIN & TOWNSHIPS',
      title: 'Phani Enterprises — 200-Acre Master Layout',
      extent: '200 ACRES · LARGEST PRIVATE LAYOUT',
      description:
        'Inception of large-scale master community development in Chinnamushidiwada in collaboration with the Visakhapatnam Port Employees Union.',
      seal: 'RERA PRE-DATED · AP URBAN APPROVED'
    },
    {
      code: 'REV-B',
      year: '2001',
      phase: 'CIVIL & WATER INFRA',
      title: 'Nutech Engineers — National Canals & Heavy Works',
      extent: '120+ KM CANAL LINING',
      description:
        'Trimming and high-precision concrete canal lining for Telugu Ganga Canal, Sriram Sagar water projects, and Jabalpur RBC Canal with Class "A" certification.',
      seal: 'CLASS "A" GOVT CONTRACTOR'
    },
    {
      code: 'REV-C',
      year: '2014',
      phase: 'HEALTHCARE & INCORPORATION',
      title: 'Chalamaji Infra Projects & Pradhama Hospital',
      extent: '550,000 SQ.FT · 600 BEDS',
      description:
        'Incorporation of Chalamaji Infra Projects Pvt Ltd (CIN U45200AP2014PTC094736) and creation of Pradhama Super Specialty Hospital with Swisslog pneumatic transport.',
      seal: 'CIN REGISTERED · TERTIARY HOSPITAL'
    },
    {
      code: 'REV-D',
      year: '2026',
      phase: 'COASTAL HIGH-RISES & MIXED-USE',
      title: 'The Address, Landmark, Orchid & Integral',
      extent: '20 ACRES IT HUB · 15 LAKH SQ.FT COMMERCIAL',
      description:
        'Contemporary luxury residential high-rises and transformative mixed-use destinations on Madhurawada Highway with 100% AP RERA compliance.',
      seal: '100% AP RERA COMPLIANT'
    }
  ];

  // Schedule of Materials & Engineering Specs
  materialSchedule: MaterialSpec[] = [
    {
      code: 'SPEC-MAT-01',
      material: 'Grade Fe-550D TMT Reinforcement Steel',
      standard: 'IS 1786 : 2008 (High Ductility)',
      rating: '0.2% Proof Stress ≥ 550 N/mm²',
      property: 'Superior seismic energy absorption & marine saline corrosion resistance.',
      application: 'High-rise structural columns, core shear walls & deep pile foundations.'
    },
    {
      code: 'SPEC-MAT-02',
      material: 'M40 / M50 Self-Compacting High-Strength Concrete',
      standard: 'IS 456 : 2000 & IS 10262',
      rating: 'Compressive Strength ≥ 50 MPa',
      property: 'High flowability without segregation, zero honeycomb voids & ultra-low porosity.',
      application: 'Monolithic floor slabs, PT beams & hydraulic water-retaining structures.'
    },
    {
      code: 'SPEC-MAT-03',
      material: 'High-Density Concrete Canal Lining',
      standard: 'CWC & National Water Standards',
      rating: 'Laser-Levelled Grade M20/M25',
      property: 'Impervious hydraulic smooth surface reducing friction loss and zero seepage.',
      application: 'Telugu Ganga Canal & Sriram Sagar irrigation arterial waterways.'
    },
    {
      code: 'SPEC-MAT-04',
      material: 'Swisslog Automated Pneumatic Transport System',
      standard: 'DIN EN 10217-7 & ISO 9001',
      rating: '6-bar High-Speed Air Transmit',
      property: 'Rapid computerized point-to-point payload transit across multi-story medical wings.',
      application: 'Pradhama Super Specialty Hospital (Pharmacy, Pathology Labs & ICU Wings).'
    }
  ];

  // Capability Pillars (Section 03)
  capabilityPillars: CapabilityPillar[] = [
    {
      index: '01',
      sheetCode: 'A-01',
      title: 'Residential Architecture',
      summary: 'The Address · Chalamaji Landmark · The Orchid · Chalamaji Alliance',
      metric: '1,050,000+ SQ.FT DELIVERED',
      description:
        'Luxury high-rise sanctuaries, coastal apartments, and serene gated villa enclaves crafted with 100% Vaastu synergy, abundant natural illumination, and premium structural specifications across prime corridors.',
      image: 'assets/images/about/journey-residential.jpg',
      tags: ['The Address (Madhurawada)', 'Chalamaji Landmark', 'The Orchid (Yendada)', 'Chalamaji Alliance']
    },
    {
      index: '02',
      sheetCode: 'C-02',
      title: 'Civil & Water Infrastructure',
      summary: 'Telugu Ganga Canal · Sriram Sagar · Jabalpur RBC Canal · Karimnagar Irrigation',
      metric: '120+ KM CANAL LINED',
      description:
        'Through sister concern Nutech Engineers (incorporated 2001), our civil engineering division executes critical national water, dam, and irrigation infrastructure with Class "A" state recognition.',
      image: 'assets/images/about/journey-infrastructure.jpg',
      tags: ['Telugu Ganga Canal', 'Sriram Sagar Project', 'Jabalpur RBC Canal', 'Karimnagar Systems']
    },
    {
      index: '03',
      sheetCode: 'M-03',
      title: 'Commercial & Mixed-Use',
      summary: 'Integral 14-Acre Highway Hub · Multiplex & Retail Center · Prime Corridors',
      metric: '1,500,000 SQ.FT PLANNED',
      description:
        'Conceiving high-impact mixed-use ventures including "Integral" on Madhurawada Highway—an expansive 14-acre master destination with high-rise residential towers and energetic commercial entertainment hubs.',
      image: 'assets/images/about/journey-commercial.jpg',
      tags: ['14-Acre Integrated Venture', 'Multiplex & Entertainment', 'Madhurawada Highway Corridor']
    },
    {
      index: '04',
      sheetCode: 'H-04',
      title: 'Healthcare Engineering',
      summary: 'Pradhama Super Specialty Hospital · 600 Beds · 19 Modular OTs',
      metric: '550,000 SQ.FT FACILITY',
      description:
        'A tertiary healing campus on 2.5 prime urban acres equipped with 600 beds, 19 modular operation theatres, 62 specialist consultation chambers, and Swisslog automated pneumatic transport systems.',
      image: 'assets/images/about/journey-healthcare.jpg',
      tags: ['600 Beds Tertiary Center', '19 Modular Operation Theatres', 'Swisslog Pneumatic System']
    }
  ];

  // Portfolio Filters & Items (Section 05)
  activeCategory: string = 'all';

  portfolioFilters: FilterOption[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'Plots', value: 'plots' },
    { label: 'Apartments', value: 'apartments' },
    { label: 'Villas', value: 'villas' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Infrastructure', value: 'infrastructure' },
    { label: 'Healthcare', value: 'healthcare' }
  ];

  portfolioItems: PortfolioItem[] = [
    {
      id: 'the-address',
      sheetCode: 'DWG A-01',
      title: 'The Address IT Hub & Suites',
      category: 'apartments',
      metric: '20 ACRES · 9+ LAKH SQ.FT',
      location: 'Madhurawada, Visakhapatnam',
      image: 'assets/images/about/journey-residential.jpg'
    },
    {
      id: 'ayodhara',
      sheetCode: 'DWG P-02',
      title: 'Ayodhara Plotted Enclave',
      category: 'plots',
      metric: '40FT & 33FT BLACKTOP ROADS',
      location: 'Visakhapatnam',
      image: 'assets/images/about/journey-land.jpg'
    },
    {
      id: 'chalamaji-landmark',
      sheetCode: 'DWG V-03',
      title: 'Chalamaji Landmark Villas',
      category: 'villas',
      metric: '26 EXCLUSIVE VILLA UNITS',
      location: 'Madhurawada, Visakhapatnam',
      image: 'https://res.cloudinary.com/tney5nvf/image/upload/v1787645581/424b7c4f-6720-4a8a-b7cd-0f5931481c2e.png'
    },
    {
      id: 'integral-highway',
      sheetCode: 'DWG C-04',
      title: 'Integral Mixed-Use Hub',
      category: 'commercial',
      metric: '14 ACRES · 15 LAKH SQ.FT',
      location: 'Madhurawada Highway',
      image: 'assets/images/about/journey-commercial.jpg'
    },
    {
      id: 'telugu-ganga',
      sheetCode: 'DWG I-05',
      title: 'Telugu Ganga Canal Project',
      category: 'infrastructure',
      metric: 'CLASS A CONCRETE LINING',
      location: 'Andhra Pradesh & TN Border',
      image: 'assets/images/about/journey-infrastructure.jpg'
    },
    {
      id: 'pradhama-hospital',
      sheetCode: 'DWG H-06',
      title: 'Pradhama Super Specialty Hospital',
      category: 'healthcare',
      metric: '600 BEDS · 19 MODULAR OTS',
      location: 'Visakhapatnam',
      image: 'assets/images/about/journey-healthcare.jpg'
    },
    {
      id: 'phani-master-enclave',
      sheetCode: 'DWG P-07',
      title: 'Port Employees Master Layout',
      category: 'plots',
      metric: '200 ACRES MASTER LAYOUT',
      location: 'Chinnamushidiwada, Vizag',
      image: 'assets/images/about/journey-land.jpg'
    },
    {
      id: 'the-orchid',
      sheetCode: 'DWG A-08',
      title: 'The Orchid Coastal Tower',
      category: 'apartments',
      metric: 'LUXURY BAYFRONT SUITES',
      location: 'Yendada, Visakhapatnam',
      image: 'assets/images/about/journey-today.jpg'
    },
    {
      id: 'sriram-sagar',
      sheetCode: 'DWG I-09',
      title: 'Sriram Sagar Water Works',
      category: 'infrastructure',
      metric: 'HEAVY EARTHWORKS & CANAL',
      location: 'Telangana & AP Region',
      image: 'assets/images/about/journey-infrastructure.jpg'
    }
  ];

  // Executive Stewardship (Section 06)
  directors: DirectorProfile[] = [
    {
      name: 'Late Sri Mattapalli Challamayya',
      specCode: 'FOUNDER & PATRIARCH — SPEC 01',
      role: 'Founder & Visionary Patriarch',
      initials: 'MC',
      designation: 'Pioneering Industrialist & Philanthropist',
      focusArea: 'Established the enduring code of engineering honor, philanthropy, and institutional goodwill.',
      highlights: ['Founding Chairman', 'Philanthropist', 'Group Patriarch']
    },
    {
      name: 'Mr. M. Hanumantha Rao',
      specCode: 'MANAGING DIRECTOR — SPEC 02',
      role: 'Managing Director',
      initials: 'HR',
      designation: 'Operations & Corporate Governance',
      focusArea: 'Directs heavy procurement, machinery mobilization, and executive statutory compliance.',
      highlights: ['Strategic Operations', 'Machinery Fleet', 'Executive Governance']
    },
    {
      name: 'Mr. M. Satyanarayana Rao',
      specCode: 'EXECUTIVE DIRECTOR — SPEC 03',
      role: 'Director',
      initials: 'SR',
      designation: 'Visionary & Project Oversight',
      focusArea: 'Oversees architectural master planning and strategic coastal land acquisitions.',
      highlights: ['Master Planning', 'Land Banking', 'Quality Assurance']
    },
    {
      name: 'Mr. M. Visweswararao',
      specCode: 'DIRECTOR (GROWTH) — SPEC 04',
      role: 'Director',
      initials: 'VR',
      designation: 'Strategic Expansion',
      focusArea: 'Steers group expansion into premium high-rises and institutional infrastructure.',
      highlights: ['High-Rise Strategy', 'Institutional Growth', 'Business Dev']
    },
    {
      name: 'Mr. Ravi Tej Mattapalli',
      specCode: 'DIRECTOR (OPS) — SPEC 05',
      role: 'Director - Operations & Growth',
      initials: 'RM',
      designation: 'Client Experience & Marketing',
      focusArea: 'Drives transparent customer relations, marketing strategy, and plotted segment expansion.',
      highlights: ['Client Relations', 'Brand Leadership', 'Plotted Developments']
    },
    {
      name: 'Mr. Avinash Mattapalli',
      specCode: 'DIRECTOR (TECH) — SPEC 06',
      role: 'Director - Technology & Innovation',
      initials: 'AM',
      designation: 'Engineering Strategy & Smart Systems',
      focusArea: 'Integrates sustainable construction methodologies and modern smart infrastructure.',
      highlights: ['Green Systems', 'Modern Engineering', 'Smart Tech']
    },
    {
      name: 'Mr. Phani Kumar Mattapalli',
      specCode: 'DIRECTOR (EXEC) — SPEC 07',
      role: 'Director - Projects & Execution',
      initials: 'PM',
      designation: 'On-Site Precision & Quality Assurance',
      focusArea: 'Directs on-ground construction accuracy, structural audits, and strict on-time milestones.',
      highlights: ['Site Delivery', 'Structural Audits', 'Milestone Precision']
    }
  ];

  // Institutional Clients & Partners (Section 07)
  clientPartners: ClientPartner[] = [
    { name: 'Airports Authority of India', type: 'Central Public Sector' },
    { name: 'RINL - Vizag Steel', type: 'Navratna Enterprise' },
    { name: 'Hindustan Petroleum (HPCL)', type: 'Maharatna PSU' },
    { name: 'Coromandel International', type: 'Industrial Conglomerate' },
    { name: 'Greater Visakhapatnam Municipal Corp (GVMC)', type: 'Urban Authority' },
    { name: 'Visakhapatnam Urban Dev Authority (VUDA)', type: 'Metropolitan Planning' },
    { name: 'Hindustan Zinc', type: 'Mining & Metals Major' },
    { name: 'Nagarjuna Group', type: 'Agro & Industrial Major' }
  ];

  private intersectionObserver?: IntersectionObserver;
  private isTicking: boolean = false;
  private scrambleIntervalId: any = null;

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSharedObserver();
      this.updateScrollMetrics();
      this.triggerOdometerScramble();
    }
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.scrambleIntervalId) {
      clearInterval(this.scrambleIntervalId);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.isTicking) {
      window.requestAnimationFrame(() => {
        this.updateScrollMetrics();
        this.isTicking = false;
      });
      this.isTicking = true;
    }
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateScrollMetrics();
    }
  }

  selectRevision(index: number): void {
    this.selectedRevisionIndex = index;
    this.cdr.detectChanges();
  }

  togglePillar(index: number): void {
    if (this.activePillarIndex === index) {
      this.activePillarIndex = null;
    } else {
      this.activePillarIndex = index;
    }
    this.cdr.detectChanges();
  }

  toggleMaterial(index: number): void {
    if (this.activeMaterialIndex === index) {
      this.activeMaterialIndex = null;
    } else {
      this.activeMaterialIndex = index;
    }
    this.cdr.detectChanges();
  }

  setFilter(category: string): void {
    this.activeCategory = category;
    this.cdr.detectChanges();
  }

  get filteredPortfolio(): PortfolioItem[] {
    if (this.activeCategory === 'all') {
      return this.portfolioItems;
    }
    return this.portfolioItems.filter(item => item.category === this.activeCategory);
  }

  trackByItemId(index: number, item: PortfolioItem): string {
    return item.id;
  }

  /**
   * Mechanical Odometer & Scramble Animation
   * One number counts UP (0 -> 40+), one counts DOWN from random high digits (980% -> 100%),
   * and one scrambles technical classification strings before settling on actual authentic values!
   */
  triggerOdometerScramble(): void {
    if (!isPlatformBrowser(this.platformId) || this.isScramblingNumbers) return;
    this.isScramblingNumbers = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.stat1Display = '40+ YRS';
      this.stat2Display = '100%';
      this.stat3Display = 'CLASS A';
      this.isScramblingNumbers = false;
      this.cdr.detectChanges();
      return;
    }

    const duration = 1500;
    const startTime = performance.now();
    const classScrambleChars = ['SPEC-9', 'DIV-4', 'ZONE-2', 'AUDIT-A', 'SECT-1', 'ISO-90', 'CLASS A'];

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      if (progress < 1) {
        // Stat 1: Ascending / Upward roll (0 -> 40)
        const currentUp = Math.floor(ease * 40);
        const randomFlicker1 = progress < 0.85 ? Math.floor(Math.random() * 4) : 0;
        this.stat1Display = `${Math.min(40, currentUp + randomFlicker1)}+ YRS`;

        // Stat 2: Descending / Downward roll (990 -> 100)
        const currentDown = Math.floor(990 - (ease * 890));
        const randomFlicker2 = progress < 0.85 ? Math.floor(Math.random() * 15) : 0;
        this.stat2Display = `${Math.max(100, currentDown + randomFlicker2)}%`;

        // Stat 3: Technical Classification Code Scramble
        const scrambleIdx = Math.floor(Math.random() * classScrambleChars.length);
        this.stat3Display = classScrambleChars[scrambleIdx];

        this.cdr.detectChanges();
        requestAnimationFrame(animate);
      } else {
        // Final Actual Values Locked In
        this.stat1Display = '40+ YRS';
        this.stat2Display = '100%';
        this.stat3Display = 'CLASS A';
        this.isScramblingNumbers = false;
        this.cdr.detectChanges();
      }
    };

    requestAnimationFrame(animate);
  }

  private updateScrollMetrics(): void {
    // Determine current sheet number from section positions
    const sections = [
      { id: 'section-hero', sheet: '01' },
      { id: 'section-foundation', sheet: '02' },
      { id: 'section-capabilities', sheet: '03' },
      { id: 'section-materials', sheet: '04' },
      { id: 'section-portfolio', sheet: '05' },
      { id: 'section-stewardship', sheet: '06' },
      { id: 'section-closing', sheet: '07' }
    ];

    const offsetThreshold = window.innerHeight * 0.4;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= offsetThreshold) {
          if (this.currentSheet !== sections[i].sheet) {
            this.currentSheet = sections[i].sheet;
            this.cdr.detectChanges();
          }
          break;
        }
      }
    }
  }

  private initSharedObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: [0, 0.15, 0.3, 0.5]
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-state', 'drawn');
          entry.target.classList.add('is-drawn');

          if (entry.target.classList.contains('technical-stats-row')) {
            this.triggerOdometerScramble();
          }

          this.intersectionObserver?.unobserve(entry.target);
        }
      });
    }, options);

    const animatables = this.el.nativeElement.querySelectorAll(
      '.draft-draw, .dim-line, .title-block, .section-cut-wrap, .sheet-double-frame, .mca-stamp-badge, .compass-wrap, .technical-stats-row, .leadership-card, .portfolio-card, .material-table-container, .revision-scrubber-timeline'
    );
    animatables.forEach((el: Element) => {
      this.intersectionObserver?.observe(el);
    });
  }
}
