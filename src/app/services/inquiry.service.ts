import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:5001/api/inquiries';

  constructor(private http: HttpClient) {}

  submitInquiry(payload: InquiryPayload): Observable<InquiryResponse> {
    return this.http.post<InquiryResponse>(this.apiUrl, payload);
  }
}
