import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PROJECTS } from '../data/projects.data';
import { LoadingService } from './loading.service';

export interface Project {
  _id?: string;
  id?: string;
  projectId: string;
  name: string;
  location: string;
  type: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed' | 'Ready to Move';
  category: 'apartments' | 'plotting' | 'villas' | 'residential' | 'commercial';
  reraNumber?: string;
  description: string;
  fullDescription: string;
  amenities: string[];
  mainImage: string;
  carouselImage?: string;
  gallery: string[];
  brochureUrl?: string;
  isPublished?: boolean;
  plots?: any[];
  layoutDetails?: {
    village?: string;
    mandal?: string;
    district?: string;
    surveyNo?: string;
    lpmNos?: string[];
    totalPlots?: number;
    totalExtentSqYds?: number;
    lpNumber?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectsApiResponse {
  success: boolean;
  count?: number;
  data: Project[];
  message?: string;
}

export interface ProjectApiResponse {
  success: boolean;
  data: Project;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public get baseApiUrl(): string {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return 'http://localhost:5001/api';
    }
    return environment.apiUrl;
  }

  public get apiUrl(): string {
    return `${this.baseApiUrl}/projects`;
  }

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  /**
   * Fetch all published projects from MongoDB
   * Supports optional category & status filtering
   */
  getProjects(category?: string, status?: string): Observable<Project[]> {
    this.loadingService.expectData();
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.set('category', category.toLowerCase());
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ProjectsApiResponse>(this.apiUrl, { params }).pipe(
      tap(() => this.loadingService.notifyDataReceived()),
      map((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          return res.data.map((p) => this.normalizeProject(p));
        }
        return this.fallbackProjects(category, status);
      }),
      catchError((error) => {
        console.warn('⚠️ ProjectService: Failed to fetch from MongoDB, using local fallback:', error.message);
        this.loadingService.notifyDataReceived();
        return of(this.fallbackProjects(category, status));
      })
    );
  }

  /**
   * Fetch a single project from MongoDB by its unique projectId
   */
  getProjectById(projectId: string): Observable<Project | null> {
    this.loadingService.expectData();
    const cleanId = (projectId || '').trim().toLowerCase();
    const url = `${this.apiUrl}/${cleanId}`;

    return this.http.get<ProjectApiResponse>(url).pipe(
      tap(() => this.loadingService.notifyDataReceived()),
      map((res) => {
        if (res && res.success && res.data) {
          return this.normalizeProject(res.data);
        }
        return this.fallbackProjectById(cleanId);
      }),
      catchError((error) => {
        console.warn(`⚠️ ProjectService: Failed to fetch project '${cleanId}', using local fallback:`, error.message);
        this.loadingService.notifyDataReceived();
        return of(this.fallbackProjectById(cleanId));
      })
    );
  }

  /**
   * Normalizes document fields ensuring both `id` and `projectId` are accessible
   */
  private normalizeProject(p: any): Project {
    return {
      ...p,
      id: p.projectId || p.id,
      projectId: p.projectId || p.id
    };
  }

  /**
   * Fallback data source from projects.data.ts if MongoDB service is unavailable
   */
  private fallbackProjects(category?: string, status?: string): Project[] {
    let list: any[] = PROJECTS;
    if (category && category !== 'all') {
      const cleanCat = category.toLowerCase();
      if (cleanCat === 'residential') {
        list = list.filter((p) => p.category === 'residential' || p.category === 'apartments' || p.category === 'villas');
      } else {
        list = list.filter((p) => p.category === cleanCat);
      }
    }
    if (status) {
      list = list.filter((p) => p.status === status);
    }
    return list.map((p) => this.normalizeProject(p));
  }

  /**
   * Fallback single lookup from projects.data.ts
   */
  private fallbackProjectById(projectId: string): Project | null {
    const found = PROJECTS.find((p) => (p.id || '').toLowerCase() === projectId);
    return found ? this.normalizeProject(found) : null;
  }

  // ================= ADMIN PANEL METHODS =================

  /**
   * Fetch all projects including unpublished for admin management
   */
  getAllProjectsAdmin(): Observable<Project[]> {
    return this.http.get<ProjectsApiResponse>(`${this.apiUrl}?all=true`).pipe(
      map((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          return res.data.map((p) => this.normalizeProject(p));
        }
        return this.fallbackProjects('all');
      }),
      catchError((err) => {
        console.warn('Admin: Failed to fetch from backend, returning local fallback:', err);
        return of(this.fallbackProjects('all'));
      })
    );
  }

  /**
   * Update an existing project
   */
  updateProject(projectId: string, payload: Partial<Project>): Observable<ProjectApiResponse> {
    const cleanId = (projectId || '').trim().toLowerCase();
    return this.http.patch<ProjectApiResponse>(`${this.apiUrl}/${cleanId}`, payload);
  }

  /**
   * Create a new project
   */
  createProject(payload: Partial<Project>): Observable<ProjectApiResponse> {
    return this.http.post<ProjectApiResponse>(this.apiUrl, payload);
  }

  /**
   * Delete a project
   */
  deleteProject(projectId: string): Observable<any> {
    const cleanId = (projectId || '').trim().toLowerCase();
    return this.http.delete(`${this.apiUrl}/${cleanId}`);
  }

  /**
   * Upload an image file directly to the backend
   */
  uploadPhoto(file: File): Observable<{ success: boolean; url: string; relativeUrl: string; message: string }> {
    const formData = new FormData();
    formData.append('image', file, file.name);
    return this.http.post<{ success: boolean; url: string; relativeUrl: string; message: string }>(
      `${this.baseApiUrl}/upload`,
      formData
    );
  }

  /**
   * Update Ayodhara plot status
   */
  updatePlotStatus(projectId: string, plotNo: number, status: string): Observable<any> {
    const cleanId = (projectId || '').trim().toLowerCase();
    return this.http.patch(`${this.apiUrl}/${cleanId}/plots/${plotNo}`, { status });
  }

  /**
   * Fetch customer inquiries (brochures, contact forms)
   */
  getInquiries(): Observable<any[]> {
    return this.http.get<any>(`${this.baseApiUrl}/inquiries`).pipe(
      map((res) => (res && res.data ? res.data : [])),
      catchError(() => of([]))
    );
  }

  /**
   * Fetch connect inquiries
   */
  getConnectInquiries(): Observable<any[]> {
    return this.http.get<any>(`${this.baseApiUrl}/connect-inquiries`).pipe(
      map((res) => (res && res.data ? res.data : [])),
      catchError(() => of([]))
    );
  }
}
