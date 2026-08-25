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
import { FormsModule } from '@angular/forms';
import { AYODHARA_PLOTS, AYODHARA_SPECS, AyodharaPlot } from '../../data/ayodhara-plots.data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-ayodhara-project',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ayodhara.component.html',
  styleUrl: './ayodhara.component.css'
})
export class AyodharaComponent implements OnInit, AfterViewInit, OnDestroy {
  specs = AYODHARA_SPECS;
  plots: AyodharaPlot[] = AYODHARA_PLOTS;
  selectedPlot: AyodharaPlot = AYODHARA_PLOTS[0] || { plotNo: 1, extentSqYds: 198.88, facing: 'East' };

  selectPlot(plot: AyodharaPlot): void {
    this.selectedPlot = plot;
    this.cdr.detectChanges();
  }

  distanceMatrix = [
    { name: 'Ramanarayanam Temple', dist: '0.1 KM', time: '1 min walk', cat: 'Sacred' },
    { name: 'NH-26 National Highway',dist: '1.5 KM', time: '3 mins drive',cat: 'Transit' },
    { name: 'Bhashyam School',      dist: '1 KM',   time: '2 mins drive',cat: 'Education' },
    { name: 'Y-Junction',           dist: '2 KM',   time: '4 mins drive',cat: 'Transit' },
    { name: 'SVN Lake Palace',      dist: '2 KM',   time: '4 mins drive',cat: 'Landmark' },
    { name: 'Sri Chaitanya School', dist: '2.5 KM', time: '5 mins drive',cat: 'Education' },
    { name: 'Pydithalli Temple',    dist: '3 KM',   time: '6 mins drive',cat: 'Sacred' },
    { name: 'APSRTC Bus Complex',   dist: '3.5 KM', time: '7 mins drive',cat: 'Transit' },
    { name: 'Medicover Super Speciality',dist: '3.5 KM', time: '7 mins drive',cat: 'Healthcare' },
    { name: 'Vizianagaram Railway Station',dist: '4 KM', time: '8 mins drive',cat: 'Transit' },
    { name: 'Govt. General Hospital',dist: '4 KM',  time: '8 mins drive',cat: 'Healthcare' },
    { name: 'Upcoming Bhogapuram Airport',dist: '28 KM', time: '30 mins drive',cat: 'Airport' },
  ];

  // Fullscreen Image Lightbox Modal
  isImageModalOpen: boolean = false;
  modalImageSrc: string = '';
  modalImageTitle: string = '';

  openImageModal(src: string, title: string): void {
    this.modalImageSrc = src;
    this.modalImageTitle = title;
    this.isImageModalOpen = true;
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
  }

  // Navigation menu dropdown
  menuOpen: boolean = false;

  // Active Tab for Palma-style Flat Tabs Section
  activeTab: 'location' | 'masterplan' | 'plots' | 'specification' = 'location';

  // Brochure Download Modal
  isBrochureModalOpen: boolean = false;
  brochureForm = {
    name: '',
    phone: '',
    email: '',
    consent: true
  };
  brochureSubmitted: boolean = false;

  // Plot Table Search, Filter & Sort State
  searchTerm: string = '';
  selectedFacingFilter: string = 'all';
  sortBy: 'plotNo' | 'extentSqYds' = 'plotNo';
  sortAscending: boolean = true;

  // Top Enquiry Form State
  heroInquiry = {
    name: '',
    email: '',
    phone: '',
    preferredFacing: '',
    consent: true
  };
  heroSubmitted: boolean = false;

  // Bottom Contact Form State
  contactInquiry = {
    name: '',
    email: '',
    phone: '',
    consent: true
  };
  contactSubmitted: boolean = false;

  private isBrowser: boolean;
  private scrollTriggers: ScrollTrigger[] = [];

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      window.scrollTo(0, 0);
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initWordReveals();
        this.initImageMaskReveals();
        this.initParallaxElements();
        this.initOdometerCounters();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.scrollTriggers.forEach(st => st.kill());
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  /**
   * Close the dropdown menu when clicking anywhere outside the .menu-dropdown element.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen) return;
    const target = event.target as HTMLElement;
    const menuDropdown = this.el.nativeElement.querySelector('.menu-dropdown');
    if (menuDropdown && !menuDropdown.contains(target)) {
      this.menuOpen = false;
      this.cdr.detectChanges();
    }
  }

  scrollToSection(sectionId: string): void {
    this.closeMenu();
    if (this.isBrowser) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // ----------------------------------------------------
  // Interactive Tab Controls
  // ----------------------------------------------------
  setTab(tab: 'location' | 'masterplan' | 'plots' | 'specification'): void {
    this.activeTab = tab;
    this.cdr.detectChanges();

    if (this.isBrowser) {
      gsap.fromTo(
        '.ayo-tab-pane',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }

  nextTab(): void {
    const tabs: ('location' | 'masterplan' | 'plots' | 'specification')[] = [
      'location',
      'masterplan',
      'plots',
      'specification'
    ];
    const currentIndex = tabs.indexOf(this.activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    this.setTab(tabs[nextIndex]);
  }

  prevTab(): void {
    const tabs: ('location' | 'masterplan' | 'plots' | 'specification')[] = [
      'location',
      'masterplan',
      'plots',
      'specification'
    ];
    const currentIndex = tabs.indexOf(this.activeTab);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    this.setTab(tabs[prevIndex]);
  }

  // ----------------------------------------------------
  // Brochure Modal
  // ----------------------------------------------------
  openBrochureModal(): void {
    this.isBrochureModalOpen = true;
    this.brochureSubmitted = false;
  }

  closeBrochureModal(): void {
    this.isBrochureModalOpen = false;
  }

  submitBrochureDownload(): void {
    if (this.brochureForm.name && this.brochureForm.phone && this.brochureForm.consent) {
      this.brochureSubmitted = true;
      if (this.isBrowser) {
        // Trigger download of the brochure
        const link = document.createElement('a');
        link.href = 'assets/Ayodhara_Brochure.pdf';
        link.download = 'Ayodhara_Brochure_Chalamaji.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  // ----------------------------------------------------
  // Plot Table Filtering & Sorting
  // ----------------------------------------------------
  get uniqueFacings(): string[] {
    const facings = new Set<string>();
    this.plots.forEach(p => facings.add(p.facing));
    return Array.from(facings);
  }

  get filteredPlots(): AyodharaPlot[] {
    return this.plots
      .filter(plot => {
        const matchesSearch =
          this.searchTerm.trim() === '' ||
          plot.plotNo.toString().includes(this.searchTerm.trim()) ||
          plot.facing.toLowerCase().includes(this.searchTerm.toLowerCase());

        const matchesFacing =
          this.selectedFacingFilter === 'all' ||
          plot.facing === this.selectedFacingFilter ||
          plot.facing.includes(this.selectedFacingFilter);

        return matchesSearch && matchesFacing;
      })
      .sort((a, b) => {
        let valA = a[this.sortBy];
        let valB = b[this.sortBy];
        if (this.sortAscending) {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }

  toggleSort(column: 'plotNo' | 'extentSqYds'): void {
    if (this.sortBy === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortBy = column;
      this.sortAscending = true;
    }
    this.cdr.detectChanges();
  }

  // ----------------------------------------------------
  // Form Submissions
  // ----------------------------------------------------
  submitHeroForm(): void {
    if (this.heroInquiry.name && this.heroInquiry.phone && this.heroInquiry.consent) {
      this.heroSubmitted = true;
      this.cdr.detectChanges();
    }
  }

  submitContactForm(): void {
    if (this.contactInquiry.name && this.contactInquiry.phone && this.contactInquiry.consent) {
      this.contactSubmitted = true;
      this.cdr.detectChanges();
    }
  }

  // ----------------------------------------------------
  // GSAP Animation Utilities (Palma Core)
  // ----------------------------------------------------
  private initWordReveals(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = this.el.nativeElement.querySelectorAll('.word-reveal');

    elements.forEach((el: HTMLElement) => {
      const rawText = el.innerText || el.textContent || '';
      const words = rawText.trim().split(/\s+/);

      el.innerHTML = words
        .map(
          w =>
            `<span class="word-wrap"><span class="word">${w}</span></span>`
        )
        .join(' ');

      if (prefersReducedMotion) return;

      const inners = el.querySelectorAll('.word');
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            inners,
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              stagger: 0.035,
              duration: 0.65,
              ease: 'power3.out'
            }
          );
        }
      });
      this.scrollTriggers.push(st);
    });
  }

  private initImageMaskReveals(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const maskElements = this.el.nativeElement.querySelectorAll('.reveal--top');

    maskElements.forEach((el: HTMLElement) => {
      const img = el.querySelector('img');
      if (!img) return;

      if (prefersReducedMotion) {
        el.style.clipPath = 'inset(0% 0 0 0)';
        img.style.transform = 'none';
        return;
      }

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0 0 0)' },
            {
              clipPath: 'inset(0% 0 0 0)',
              duration: 1.1,
              ease: 'power4.out'
            }
          );
          gsap.fromTo(
            img,
            { scale: 1.15 },
            {
              scale: 1,
              duration: 1.4,
              ease: 'power3.out'
            }
          );
        }
      });
      this.scrollTriggers.push(st);
    });
  }

  private initParallaxElements(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const parallaxItems = this.el.nativeElement.querySelectorAll('[dataspeed]');
    parallaxItems.forEach((el: HTMLElement) => {
      const speed = parseFloat(el.getAttribute('dataspeed') || '0.4');
      gsap.to(el, {
        yPercent: -30 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  private initOdometerCounters(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const odometers = this.el.nativeElement.querySelectorAll('.odometer');

    odometers.forEach((el: HTMLElement) => {
      const targetVal = parseFloat(el.getAttribute('data-target') || el.innerText || '0');
      const suffix = el.getAttribute('data-suffix') || '';

      if (isNaN(targetVal)) return;

      if (prefersReducedMotion) {
        el.innerText = `${targetVal}${suffix}`;
        return;
      }

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetVal,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              el.innerText = `${Math.floor(obj.val)}${suffix}`;
            }
          });
        }
      });
      this.scrollTriggers.push(st);
    });
  }
}
