import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CompanyStatsData {
  yearsOfExperience: number;
  foundingYear: number;
  autoCalculateYears: boolean;
  experienceSuffix: string;
  experienceLabel: string;
  projectsDelivered: number;
  projectsSuffix: string;
  projectsLabel: string;
  sftDeveloped: number;
  sftSuffix: string;
  sftLabel: string;
}

export interface StatItem {
  target: number;
  suffix: string;
  label: string;
  digits: number[];
}

export const DEFAULT_STATS: CompanyStatsData = {
  yearsOfExperience: 35,
  foundingYear: 1991, // 2026 - 1991 = 35; in 2027 becomes 36!
  autoCalculateYears: true,
  experienceSuffix: '+',
  experienceLabel: 'Years of Experience',
  projectsDelivered: 50,
  projectsSuffix: '+',
  projectsLabel: 'Projects Delivered',
  sftDeveloped: 25,
  sftSuffix: ' Lakh+',
  sftLabel: 'Sft Developed'
};

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly STORAGE_KEY = 'chalmaji_company_stats_v1';

  private statsSubject = new BehaviorSubject<CompanyStatsData>(this.getInitialStats());
  public stats$ = this.statsSubject.asObservable();

  private get baseApiUrl(): string {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return 'http://localhost:5001/api';
    }
    return environment.apiUrl;
  }

  private get apiUrl(): string {
    return `${this.baseApiUrl}/stats`;
  }

  constructor(private http: HttpClient) {
    this.refreshFromApi();
  }

  /**
   * Returns current value of company stats
   */
  get currentStats(): CompanyStatsData {
    return this.statsSubject.value;
  }

  /**
   * Calculates the live effective years:
   * If autoCalculateYears is ON, calculates currentYear - foundingYear (e.g. 2026 - 1991 = 35, 2027 = 36).
   * Otherwise returns manual yearsOfExperience.
   */
  getEffectiveYears(stats?: CompanyStatsData): number {
    const s = stats || this.currentStats;
    if (s.autoCalculateYears && s.foundingYear) {
      const currentYear = new Date().getFullYear();
      return Math.max(1, currentYear - s.foundingYear);
    }
    return s.yearsOfExperience;
  }

  /**
   * Transforms CompanyStatsData into array of StatItems for UI rendering
   */
  getFormattedStats(stats?: CompanyStatsData): StatItem[] {
    const s = stats || this.currentStats;
    const yearsTarget = this.getEffectiveYears(s);

    return [
      {
        target: yearsTarget,
        suffix: s.experienceSuffix || '+',
        label: s.experienceLabel || 'Years of Experience',
        digits: String(yearsTarget).split('').map(d => parseInt(d, 10))
      },
      {
        target: s.projectsDelivered,
        suffix: s.projectsSuffix || '+',
        label: s.projectsLabel || 'Projects Delivered',
        digits: String(s.projectsDelivered).split('').map(d => parseInt(d, 10))
      },
      {
        target: s.sftDeveloped,
        suffix: s.sftSuffix || ' Lakh+',
        label: s.sftLabel || 'Sft Developed',
        digits: String(s.sftDeveloped).split('').map(d => parseInt(d, 10))
      }
    ];
  }

  /**
   * Update stats from Admin Portal
   */
  updateStats(updated: Partial<CompanyStatsData>): Observable<CompanyStatsData> {
    const merged: CompanyStatsData = {
      ...this.currentStats,
      ...updated
    };

    // Update in-memory state and localStorage immediately
    this.saveToStorage(merged);
    this.statsSubject.next(merged);

    // Sync with backend API
    return this.http.put<{ success: boolean; data: CompanyStatsData }>(this.apiUrl, merged).pipe(
      map(res => (res && res.data ? res.data : merged)),
      tap(saved => {
        this.saveToStorage(saved);
        this.statsSubject.next(saved);
      }),
      catchError(err => {
        console.warn('⚠️ StatsService: Backend sync failed, kept in local storage:', err);
        return of(merged);
      })
    );
  }

  /**
   * Refresh stats from backend API
   */
  private refreshFromApi(): void {
    if (typeof window === 'undefined') return;

    this.http.get<{ success: boolean; data: CompanyStatsData }>(this.apiUrl).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res && res.success && res.data) {
        const merged: CompanyStatsData = {
          ...DEFAULT_STATS,
          ...res.data
        };
        this.saveToStorage(merged);
        this.statsSubject.next(merged);
      }
    });
  }

  private getInitialStats(): CompanyStatsData {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...DEFAULT_STATS, ...parsed };
        }
      } catch (e) {
        console.warn('Could not read stats from localStorage', e);
      }
    }
    return { ...DEFAULT_STATS };
  }

  private saveToStorage(stats: CompanyStatsData): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
      } catch (e) {
        console.warn('Could not save stats to localStorage', e);
      }
    }
  }
}
