import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InquiryPayload {
  name: string;
  phone: string;
  email?: string;
  projectName: string;
  inquiryType?: string;
  preferredFacing?: string;
  plotNo?: number;
  contactMethod?: string;
  siteVisitDate?: string;
  message?: string;
  remarks?: string;
  sourcePage?: string;
}

export interface ConnectInquiryPayload {
  name: string;
  phone: string;
  email: string;
  message?: string;
  sourcePage?: string;
  referenceCode?: string;
}

export interface WhatsAppRedirectPayload {
  name: string;
  phone: string;
  email?: string;
  projectName?: string;
  inquiryType?: string;
  preferredFacing?: string;
  plotNo?: number;
  extentSqYds?: number;
  remarks?: string;
  siteVisitDate?: string;
  categoryTrack?: string;
  referenceCode?: string;
  message?: string;
  sourcePage?: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private inquiriesUrl = `${environment.apiUrl}/inquiries`;
  private connectInquiriesUrl = `${environment.apiUrl}/connect-inquiries`;

  constructor(private http: HttpClient) {}

  submitInquiry(payload: InquiryPayload): Observable<InquiryResponse> {
    return this.http.post<InquiryResponse>(this.inquiriesUrl, {
      ...payload,
      sourcePage: payload.sourcePage || 'Main Website'
    });
  }

  submitConnectInquiry(payload: ConnectInquiryPayload): Observable<InquiryResponse> {
    return this.http.post<InquiryResponse>(this.connectInquiriesUrl, {
      ...payload,
      sourcePage: payload.sourcePage || 'Main Website'
    });
  }

  /**
   * Cleans phone number by removing +, spaces, brackets, and hyphens.
   * Ensures the standard country code (91) is present.
   */
  cleanPhoneNumber(phone: string): string {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    if (!digits) return '919257925788';
    return digits.startsWith('91') ? digits : `91${digits}`;
  }

  /**
   * Generates the official direct WhatsApp click-to-chat URL:
   * https://wa.me/<PHONE_NUMBER>?text=<ENCODED_MESSAGE>
   */
  getDirectWhatsAppUrl(options?: {
    projectName?: string;
    customMessage?: string;
    isAyodhara?: boolean;
    referenceCode?: string;
  }): string {
    const isAyodhara = options?.isAyodhara ||
      (options?.projectName && options.projectName.toLowerCase().includes('ayodhara'));

    const rawNumber = isAyodhara
      ? (environment.ayodharaWhatsappNumber || '918885888388')
      : (environment.whatsappBusinessNumber || '919257925788');

    const cleanPhone = this.cleanPhoneNumber(rawNumber);

    let messageText = '';
    if (options?.customMessage) {
      messageText = options.customMessage;
    } else if (options?.referenceCode) {
      messageText = `Hi, I have submitted inquiry ${options.referenceCode} on your website. I would like to know more about your projects.`;
    } else if (options?.projectName && options.projectName !== 'General' && options.projectName !== 'General Inquiry') {
      messageText = `Hi, I am interested in ${options.projectName}. I would like to know more about this project.`;
    } else {
      messageText = 'Hi, I would like to know more about your projects.';
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
  }

  /**
   * Universal WhatsApp direct click-to-chat helper.
   * Uses WhatsApp official direct click-to-chat URL:
   * https://wa.me/<PHONE_NUMBER>?text=<ENCODED_MESSAGE>
   */
  redirectToWhatsApp(payload: WhatsAppRedirectPayload): void {
    if (typeof window === 'undefined') return;

    const waUrl = this.getDirectWhatsAppUrl({
      projectName: payload.projectName,
      customMessage: payload.message,
      referenceCode: payload.referenceCode
    });

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }
}
