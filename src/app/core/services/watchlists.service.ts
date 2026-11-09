import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WatchlistMarket } from '../models/wealth.models';
import { environment } from '../../../environments/environment';

export interface ApiWatchlistItem {
  id: number;
  symbol: string;
  name: string;
  isFavorite: boolean;
}

export interface ApiWatchlist {
  id: number;
  name: string;
  market: WatchlistMarket;
  currency: 'USD' | 'INR';
  userId: number;
  items: ApiWatchlistItem[];
}

export interface WatchlistPageResponse {
  content: ApiWatchlist[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class WatchlistsService {
  private readonly watchlistsUrl = `${environment.apiBaseUrl}/api/v1/watchlists`;

  constructor(private readonly http: HttpClient) {}

  getWatchlists(page: number, size: number, market: WatchlistMarket): Observable<WatchlistPageResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('market', market);
    return this.http.get<WatchlistPageResponse>(this.watchlistsUrl, { params });
  }
}
