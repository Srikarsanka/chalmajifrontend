import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PROJECTS } from '../data/projects.data';

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
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch all published projects from MongoDB
   * Supports optional category & status filtering
   */
  getProjects(category?: string, status?: string): Observable<Project[]> {
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.set('category', category.toLowerCase());
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ProjectsApiResponse>(this.apiUrl, { params }).pipe(
      map((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          return res.data.map((p) => this.normalizeProject(p));
        }
        return this.fallbackProjects(category, status);
      }),
      catchError((error) => {
        console.warn('⚠️ ProjectService: Failed to fetch from MongoDB, using local fallback:', error.message);
        return of(this.fallbackProjects(category, status));
      })
    );
  }

  /**
   * Fetch a single project from MongoDB by its unique projectId
   */
  getProjectById(projectId: string): Observable<Project | null> {
    const cleanId = (projectId || '').trim().toLowerCase();
    const url = `${this.apiUrl}/${cleanId}`;

    return this.http.get<ProjectApiResponse>(url).pipe(
      map((res) => {
        if (res && res.success && res.data) {
          return this.normalizeProject(res.data);
        }
        return this.fallbackProjectById(cleanId);
      }),
      catchError((error) => {
        console.warn(`⚠️ ProjectService: Failed to fetch project '${cleanId}', using local fallback:`, error.message);
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
      list = list.filter((p) => p.category === category);
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
}
