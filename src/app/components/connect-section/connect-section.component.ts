import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private cdr: ChangeDetectorRef) {}

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
    console.log('Form submitted:', this.formData);
    alert('Thank you for your inquiry! We will get back to you soon.');
    this.formData = { name: '', email: '', phone: '', message: '' };
  }
}
