import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InquiryService, ConnectInquiryPayload } from '../../services/inquiry.service';
import { SeoService } from '../../services/seo.service';

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

@Component({
  selector: 'app-connect-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.css'
})
export class ConnectComponent implements OnInit {
  heroImageUrl = 'https://res.cloudinary.com/djha4r2ys/image/upload/v1787664854/341dab7e-9433-4890-9e54-9dd60148b3b0_dnem6y.png';

  isVisible = false;
  isSubmitting = false;
  isSubmitted = false;
  submitError: string | null = null;
  referenceCode = '';
  activeFaqIndex: number | null = 0;

  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  faqList: FaqItem[] = [
    {
      category: 'SITE VISITS',
      question: 'Can I schedule a guided private site inspection for Ayodhara or The Address?',
      answer:
        'Yes. Our executive concierge team arranges private, chauffeured site visits from Monday to Sunday. You can share your preferred details in the form above or connect directly through our WhatsApp hotline to reserve your inspection slot.'
    },
    {
      category: 'STATUTORY & LEGAL',
      question: 'Where can I inspect RERA registration documents and approved blueprints?',
      answer:
        'All statutory approvals, AP RERA registration certificates, sanctioned architectural working drawings, and clear title deeds are available for in-person review at our Pandurangapuram headquarters. We also provide secure digital copies upon preliminary inquiry.'
    },
    {
      category: 'NRI CONSULTATION',
      question: 'Do you provide specialized consultation for NRI buyers and overseas investors?',
      answer:
        'Absolutely. We have a dedicated NRI relationship desk that assists with overseas inward remittances, NRE/NRO banking protocols, power of attorney documentation, and virtual 3D walkthroughs across international time zones.'
    },
    {
      category: 'JOINT VENTURES',
      question: 'How do I initiate a Joint Venture (JV) or land development proposal with Chalamaji?',
      answer:
        'Landowners and institutional partners with prime parcels in Visakhapatnam and coastal Andhra Pradesh can submit an inquiry through the form above to connect directly with our Executive Director desk.'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private inquiryService: InquiryService,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Connect & Inquire | Pandurangapuram Headquarters | Chalamaji Infra',
      description: 'Schedule a private site visit or consult with Chalamaji Infra\'s advisory desk at our Pandurangapuram headquarters, Visakhapatnam. Connect via phone, WhatsApp, or consultation form.',
      keywords: 'contact Chalamaji Infra, Chalamaji office Pandurangapuram, site visit booking Vizag, real estate enquiry Visakhapatnam, buy property Vizag, Chalamaji address',
      canonicalUrl: 'https://chalamaji.com/connect',
      ogImage: 'https://res.cloudinary.com/djha4r2ys/image/upload/v1791024228/40a10a2f-fd5e-4c7a-b566-fc05f259df78.png',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        'name': 'Connect with Chalamaji Infra Projects',
        'url': 'https://chalamaji.com/connect',
        'description': 'Headquarters and private client advisory desk for Chalamaji Infra Projects in Pandurangapuram, Visakhapatnam.',
        'mainEntity': {
          '@type': 'RealEstateAgent',
          'name': 'Chalamaji Infra Projects Pvt Ltd',
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
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    setTimeout(() => {
      this.isVisible = true;
      this.cdr.detectChanges();
    }, 150);
  }

  toggleFaq(index: number): void {
    if (this.activeFaqIndex === index) {
      this.activeFaqIndex = null;
    } else {
      this.activeFaqIndex = index;
    }
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.phone || !this.formData.email) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;
    this.cdr.detectChanges();

    // Generate unique dossier reference code
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.referenceCode = `CI-REQ-${new Date().getFullYear()}-${randomNum}`;

    const payload: ConnectInquiryPayload = {
      name: this.formData.name,
      phone: this.formData.phone,
      email: this.formData.email,
      message: this.formData.message,
      sourcePage: 'Main Website',
      referenceCode: this.referenceCode
    };

    this.inquiryService.submitConnectInquiry(payload).subscribe({
      next: (res) => {
        console.log('Connect form saved to connectInquiries collection:', res);
        this.isSubmitting = false;
        this.isSubmitted = true;
        this.submitError = null;
        this.cdr.detectChanges();

        // Trigger WhatsApp redirection in a new tab
        this.inquiryService.redirectToWhatsApp({
          referenceCode: this.referenceCode,
          name: this.formData.name,
          phone: this.formData.phone,
          email: this.formData.email,
          message: this.formData.message,
          inquiryType: 'Connect Inquiry'
        });

        if (isPlatformBrowser(this.platformId)) {
          const formElem = document.getElementById('consultation-form-block');
          if (formElem) {
            formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      },
      error: (err) => {
        console.error('Failed to submit connect form:', err);
        this.isSubmitting = false;
        this.isSubmitted = false;
        this.submitError = 'We were unable to transmit your inquiry. Please check your network connection or reach our senior desk directly at +91 92579 25788.';
        this.cdr.detectChanges();
      }
    });
  }

  getDirectWhatsAppUrl(): string {
    return this.inquiryService.getDirectWhatsAppUrl();
  }

  getSuccessWhatsAppUrl(): string {
    return this.inquiryService.getDirectWhatsAppUrl({ referenceCode: this.referenceCode });
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.submitError = null;
    this.formData = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
    this.cdr.detectChanges();
  }

  copyAddress(): void {
    const address = 'Chalamaji Infra Projects Pvt Ltd, Door No. 7-5-18, Plot No. 37, Pandurangapuram, Visakhapatnam, AP - 530003';
    if (isPlatformBrowser(this.platformId) && navigator.clipboard) {
      navigator.clipboard.writeText(address).then(() => {
        alert('Headquarters address copied to clipboard!');
      });
    }
  }
}
