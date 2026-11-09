import {
  HttpClient,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, TimeoutError, catchError, tap, throwError, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

export type WatchlistImportMarket = 'USA' | 'India';

export interface WatchlistImportResponse {
  watchlistsCreated: number;
  itemsCreated: number;
  watchlistNames: string[];
}

function isWatchlistImportResponse(value: unknown): value is WatchlistImportResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const response = value as Record<string, unknown>;
  return Number.isInteger(response['watchlistsCreated'])
    && Number.isInteger(response['itemsCreated'])
    && Array.isArray(response['watchlistNames'])
    && response['watchlistNames'].every((name) => typeof name === 'string');
}

@Injectable({ providedIn: 'root' })
export class WatchlistImportService {
  private readonly importUrl = `${environment.apiBaseUrl}/api/v1/watchlists/import`;

  constructor(private readonly http: HttpClient) {}

  importWatchlists(file: File, market: WatchlistImportMarket): Observable<HttpEvent<WatchlistImportResponse>> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const params = new HttpParams().set('market', market);
    const requestUrl = `${this.importUrl}?${params.toString()}`;
    console.info('[Watchlist CSV Import] Starting request', {
      method: 'POST',
      url: requestUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
      fileType: file.type || 'unknown',
      market,
    });

    return this.http.post<WatchlistImportResponse>(this.importUrl, formData, {
      params,
      reportProgress: true,
      observe: 'events',
    }).pipe(
      timeout({ each: 120_000 }),
      tap((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event.total ? Math.round((event.loaded / event.total) * 100) : undefined;
          console.info('[Watchlist CSV Import] Upload progress', {
            loadedBytes: event.loaded,
            totalBytes: event.total,
            percent: progress,
          });
        } else if (event instanceof HttpResponse) {
          if (!isWatchlistImportResponse(event.body)) {
            throw new Error('The server response did not contain valid watchlist import results.');
          }
          console.info('[Watchlist CSV Import] Server response', {
            status: event.status,
            statusText: event.statusText,
            body: event.body,
          });
        }
      }),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          console.error('[Watchlist CSV Import] HTTP request failed', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            responseBody: error.error,
          });
        } else if (error instanceof TimeoutError) {
          console.error('[Watchlist CSV Import] No server response within 120 seconds', error);
        } else {
          console.error('[Watchlist CSV Import] Request failed', error);
        }
        return throwError(() => error);
      }),
    );
  }
}
