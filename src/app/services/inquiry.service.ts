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
   * Universal WhatsApp redirect helper.
   * Opens WhatsApp in a new tab addressed to 918599936363 with a pre-filled,
   * formatted inquiry message.
   */
  redirectToWhatsApp(payload: WhatsAppRedirectPayload): void {
    if (typeof window === 'undefined') return;

    const phoneNum = environment.whatsappBusinessNumber || '918599936363';
    const lines: string[] = ['Hello Chalamaji Infra,', ''];

    if (payload.referenceCode) {
      lines.push('I have submitted a consultation dossier on your website:');
      lines.push(`• Reference: ${payload.referenceCode}`);
    } else if (payload.projectName) {
      lines.push(`I have submitted an inquiry for ${payload.projectName} on your website:`);
    } else {
      lines.push('I have submitted an inquiry on your website:');
    }

    if (payload.name) lines.push(`• Name: ${payload.name}`);
    if (payload.phone) lines.push(`• Phone: ${payload.phone}`);
    if (payload.email) lines.push(`• Email: ${payload.email}`);
    if (payload.projectName && payload.referenceCode) lines.push(`• Project: ${payload.projectName}`);
    if (payload.inquiryType) lines.push(`• Inquiry Type: ${payload.inquiryType}`);
    if (payload.categoryTrack) lines.push(`• Track / Scope: ${payload.categoryTrack}`);
    if (payload.plotNo) lines.push(`• Plot No: Plot #${payload.plotNo}`);
    if (payload.extentSqYds) lines.push(`• Site Extent: ${payload.extentSqYds} Sq.Yds`);
    if (payload.preferredFacing) lines.push(`• Preferred Facing: ${payload.preferredFacing}`);
    if (payload.siteVisitDate) lines.push(`• Preferred Visit Date: ${payload.siteVisitDate}`);
    if (payload.message) lines.push(`• Message / Notes: ${payload.message}`);
    if (payload.remarks) lines.push(`• Remarks: ${payload.remarks}`);

    lines.push('');
    lines.push('Please connect with me regarding this request.');

    const encodedText = encodeURIComponent(lines.join('\n'));
    const waUrl = `https://wa.me/${phoneNum}?text=${encodedText}`;
    window.open(waUrl, '_blank');
  }
}
