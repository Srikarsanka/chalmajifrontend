import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Emits an event whenever loading should begin
  private startLoadingSubject = new Subject<void>();
  public startLoading$: Observable<void> = this.startLoadingSubject.asObservable();

  // Emits an event whenever backend data has arrived
  private dataReceivedSubject = new Subject<void>();
  public dataReceived$: Observable<void> = this.dataReceivedSubject.asObservable();

  // Counter of active backend requests in-flight
  private pendingRequests = 0;

  get isAwaitingBackendData(): boolean {
    return this.pendingRequests > 0;
  }

  /**
   * Signal that an asynchronous backend data fetch is starting
   */
  expectData(): void {
    this.pendingRequests++;
    this.startLoadingSubject.next();
  }

  /**
   * Signal that backend data (projects, plots, etc.) has arrived
   */
  notifyDataReceived(): void {
    if (this.pendingRequests > 0) {
      this.pendingRequests--;
    }
    // Emit when all pending data requests are resolved
    if (this.pendingRequests === 0) {
      this.dataReceivedSubject.next();
    }
  }

  /**
   * Signal that loading should begin manually (e.g. on navigation)
   */
  startLoading(): void {
    this.startLoadingSubject.next();
  }

  /**
   * Force completion of loading
   */
  finishLoading(): void {
    this.pendingRequests = 0;
    this.dataReceivedSubject.next();
  }
}
