import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

export interface FmpProfile {
  id?: number | null;
  symbol: string;
  companyName?: string | null;
  currency?: string | null;
  cik?: string | null;
  isin?: string | null;
  cusip?: string | null;
  exchangeShortName?: string | null;
  website?: string | null;
  marketCap?: number | null;
  price?: number | null;
  beta?: number | null;
  lastDividend?: number | null;
  priceRange?: string | null;
  change?: number | null;
  changePercentage?: number | null;
  volume?: number | null;
  averageVolume?: number | null;
  ceo?: string | null;
  sector?: string | null;
  industry?: string | null;
  exchange?: string | null;
  country?: string | null;
  fullTimeEmployees?: number | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  ipoDate?: string | null;
  activelyTrading?: boolean | null;
  etf?: boolean | null;
  fund?: boolean | null;
  adr?: boolean | null;
  delisted?: boolean | null;
  description?: string | null;
  rawPayload?: unknown;
  updatedAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class FmpProfilesService {
  private readonly profilesUrl = '/api/fmp/profiles';

  constructor(private readonly http: HttpClient) {}

  getProfiles(symbols: string[]): Observable<unknown> {
    console.info('[FMP Profiles] Sending request through the Angular dev proxy', {
      browserUrl: this.profilesUrl,
      backendTarget: 'http://localhost:8082/api/fmp/profiles',
      symbolCount: symbols.length,
      symbols,
    });
    return this.http.post<unknown>(this.profilesUrl, { symbols }).pipe(
      tap((response) => {
        console.info('[FMP Profiles] Backend response received', {
          browserUrl: this.profilesUrl,
          responseStatus: '2xx',
          ...this.summarizeResponse(response),
        });
      }),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          console.error('[FMP Profiles] Request failed', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            backendTarget: 'http://localhost:8082/api/fmp/profiles',
            symbols,
          });
        } else {
          console.error('[FMP Profiles] Request failed', error);
        }
        return throwError(() => error);
      }),
    );
  }

  private summarizeResponse(response: unknown): Record<string, unknown> {
    if (Array.isArray(response)) {
      const profiles = response.filter(
        (entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null && !Array.isArray(entry),
      );
      return {
        responseType: 'array',
        profileCount: response.length,
        symbols: profiles.map((profile) => profile['symbol']).filter((symbol): symbol is string => typeof symbol === 'string'),
        firstProfileFields: profiles[0] ? Object.keys(profiles[0]).filter((key) => key !== 'rawPayload') : [],
        sampleProfiles: profiles.slice(0, 3).map((profile) => ({
          symbol: profile['symbol'],
          companyName: profile['companyName'],
          price: profile['price'],
          change: profile['change'],
          changePercentage: profile['changePercentage'],
          marketCap: profile['marketCap'],
          currency: profile['currency'],
          exchange: profile['exchange'],
          country: profile['country'],
          sector: profile['sector'],
          industry: profile['industry'],
          volume: profile['volume'],
          description: profile['description'],
          updatedAt: profile['updatedAt'],
        })),
      };
    }

    return {
      responseType: response === null ? 'null' : typeof response,
      topLevelFields: typeof response === 'object' && response !== null ? Object.keys(response) : [],
    };
  }
}
