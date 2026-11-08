import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CryptoAsset } from '../../core/models/wealth.models';
import { WealthService } from '../../core/services/wealth.service';
import { ShellComponent } from '../../shared/components/shell/shell.component';

@Component({
  selector: 'app-crypto',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <app-shell>
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h1>Crypto</h1>
            <p>Track digital assets, market capitalization, and risk exposure.</p>
          </div>
          <div class="topbar-actions">
            <span class="chip">4 assets</span>
          </div>
        </div>

        <div class="crypto-grid">
          <section class="card panel-block" *ngFor="let asset of cryptoAssets">
            <div class="ticker-row">
              <div>
                <span class="symbol">{{ asset.symbol }}</span>
                <small>{{ asset.name }}</small>
              </div>
              <span class="badge" [ngClass]="asset.change >= 0 ? 'up' : 'down'">{{ asset.change > 0 ? '+' : '' }}{{ asset.change }}%</span>
            </div>
            <div class="price">${{ asset.price.toLocaleString() }}</div>
            <div class="meta-row">
              <span>Market cap</span><strong>{{ asset.marketCap }}</strong>
            </div>
            <div class="meta-row">
              <span>24H volume</span><strong>{{ asset.volume }}</strong>
            </div>
          </section>
        </div>
      </div>
    </app-shell>
  `,
  styles: [
    `
      .panel-block { padding: 22px; }
      .ticker-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
      .symbol { display:block; font-size: 1.3rem; font-weight:800; }
      .ticker-row small { color: var(--muted); }
      .price { font-size: 2rem; font-weight: 800; margin: 8px 0 18px; }
      .meta-row { display:flex; justify-content:space-between; align-items:center; padding: 10px 0; border-top: 1px solid rgba(148,163,184,.12); color: var(--muted); }
      .meta-row strong { color: var(--text); }
      .badge.up { background: rgba(52,211,153,.12); color: var(--primary); }
      .badge.down { background: rgba(248,113,113,.12); color: var(--danger); }
    `,
  ],
})
export class CryptoComponent implements OnInit {
  cryptoAssets: CryptoAsset[] = [];

  constructor(private readonly wealthService: WealthService) {}

  ngOnInit(): void {
    this.cryptoAssets = this.wealthService.getCryptoAssets();
  }
}
