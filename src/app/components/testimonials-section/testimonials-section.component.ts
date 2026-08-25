import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.css'
})
export class TestimonialsSectionComponent implements OnInit {
  isVisible = false;
  currentIndex = 0;

  testimonials = [
    {
      text: 'Chalamaji Infra delivered beyond our expectations. The attention to detail in every corner of our apartment is remarkable. Truly a premium living experience.',
      name: 'Rajesh Kumar',
      designation: 'Chalamaji Signature Resident',
      rating: 5
    },
    {
      text: 'From the initial consultation to the final handover, the team was professional and transparent. The quality of construction and the thoughtful design of our villa exceeded all expectations.',
      name: 'Priya Sharma',
      designation: "Chalamaji's Landmark Owner",
      rating: 5
    },
    {
      text: 'We chose Chalamaji Alliance for its prime location and modern amenities. The project was delivered on time with excellent build quality. Highly recommended!',
      name: 'Venkat Rao',
      designation: 'Chalamaji Alliance Resident',
      rating: 5
    }
  ];

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
      const el = document.querySelector('.testimonials-section');
      if (el) observer.observe(el);
    });

    // Auto-rotate testimonials
    setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  nextTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  goToTestimonial(index: number) {
    this.currentIndex = index;
  }
}
