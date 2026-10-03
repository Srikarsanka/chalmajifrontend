import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InquiryService, InquiryPayload } from '../../services/inquiry.service';

@Component({
  selector: 'app-connect-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connect-section.component.html',
  styleUrl: './connect-section.component.css'
})
export class ConnectSectionComponent implements OnInit {
  isVisible = false;
  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private inquiryService: InquiryService
  ) {}

  ngOnInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isVisible) {
            this.isVisible = true;
            this.cdr.detectChanges();
          }
        });
      },
      { threshold: 0.2 }
    );
    setTimeout(() => {
      const el = document.querySelector('.connect-section');
      if (el) observer.observe(el);
    });
  }

  onSubmit() {
    if (!this.formData.name || !this.formData.phone) return;

    const payload: InquiryPayload = {
      name: this.formData.name,
      phone: this.formData.phone,
      email: this.formData.email,
      message: this.formData.message,
      projectName: 'General Inquiry',
      inquiryType: 'Home Connect Section',
      sourcePage: '/'
    };

    this.inquiryService.submitInquiry(payload).subscribe({
      next: (res) => {
        console.log('Connect section inquiry saved:', res);
        this.inquiryService.redirectToWhatsApp({
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          projectName: payload.projectName,
          inquiryType: payload.inquiryType,
          message: payload.message
        });
        alert('Thank you for your inquiry! We will get back to you soon.');
        this.formData = { name: '', email: '', phone: '', message: '' };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to submit connect section inquiry:', err);
        alert('Unable to submit your inquiry at this moment. Please check your connection or reach us directly at +91 92579 25788.');
        this.cdr.detectChanges();
      }
    });
  }

  getDirectWhatsAppUrl(): string {
    return this.inquiryService.getDirectWhatsAppUrl();
  }
}

