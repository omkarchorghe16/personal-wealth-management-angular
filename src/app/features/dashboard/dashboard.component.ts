import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { ShellComponent } from '../../shared/components/shell/shell.component';
import { WealthService } from '../../core/services/wealth.service';
import { MetricCardModel, StockAsset, WatchlistItem, PortfolioSummary } from '../../core/models/wealth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ShellComponent, MetricCardComponent],
  template: `
    <app-shell>
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Overview of your investments, market activity, and wealth performance.</p>
          </div>
          <div class="topbar-actions">
            <span class="chip">AI view enabled</span>
          </div>
        </div>

        <div class="metric-grid">
          <app-metric-card
            *ngFor="let card of metrics"
            [title]="card.title"
            [value]="card.value"
            [change]="card.change"
            [detail]="card.detail"
            [tone]="card.tone"
          ></app-metric-card>
        </div>

        <div class="summary-grid">
          <section class="card market-panel">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Portfolio performance</span>
                <h3>Wealth growth</h3>
              </div>
              <span class="chip success">+{{ summary.monthlyReturn }}% MTD</span>
            </div>
            <div class="chart-bars">
              <span style="height:30%"></span>
              <span style="height:42%"></span>
              <span style="height:54%"></span>
              <span style="height:48%"></span>
              <span style="height:65%"></span>
              <span style="height:58%"></span>
              <span style="height:84%"></span>
              <span style="height:96%"></span>
              <span style="height:90%"></span>
              <span style="height:100%"></span>
              <span style="height:92%"></span>
              <span style="height:96%"></span>
            </div>
          </section>

          <section class="card side-panel">
            <div class="panel-header compact">
              <span class="eyebrow">Allocation</span>
              <h3>Asset mix</h3>
            </div>
            <div class="donut-wrap">
              <div class="donut-chart">
                <div class="donut-center">67%</div>
              </div>
            </div>
            <ul class="allocation-list">
              <li><span class="dot blue"></span>Equities <strong>48%</strong></li>
              <li><span class="dot green"></span>Crypto <strong>22%</strong></li>
              <li><span class="dot gold"></span>Fixed income <strong>18%</strong></li>
              <li><span class="dot purple"></span>Cash <strong>12%</strong></li>
            </ul>
          </section>
        </div>

        <div class="stats-grid">
          <section class="card panel-block">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Top movers</span>
                <h3>Stocks</h3>
              </div>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let stock of stocks">
                    <td>{{ stock.symbol }}</td>
                    <td>&#36;{{ stock.price }}</td>
                    <td class="text-success">+{{ stock.change }}%</td>
                    <td>{{ stock.score }}/100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="card panel-block">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Watchlist</span>
                <h3>Multi-asset watchlist</h3>
              </div>
            </div>
            <div class="watch-list">
              <div class="watch-item" *ngFor="let item of watchlist">
                <div>
                  <strong>{{ item.symbol }}</strong>
                  <small>{{ item.name }}</small>
                </div>
                <div class="watch-meta">
                  <span>&#36;{{ item.price }}</span>
                  <span class="badge" [ngClass]="item.change >= 0 ? 'up' : 'down'">{{ item.change > 0 ? '+' : '' }}{{ item.change }}%</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </app-shell>
  `,
  styles: [
    `
      .market-panel, .side-panel, .panel-block { padding: 22px; }
      .panel-header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:20px; }
      .panel-header h3 { margin: 8px 0 0; font-size: 1.3rem; }
      .success { background: rgba(52, 211, 153, 0.12); color: var(--primary); }
      .chart-bars { height: 220px; display:flex; align-items:flex-end; gap: 12px; padding-top:20px; }
      .chart-bars span { display:block; width: 100%; background: linear-gradient(180deg, #60a5fa 0%, #34d399 100%); border-radius: 8px 8px 0 0; }
      .donut-wrap { display:flex; justify-content:center; margin: 20px 0; }
      .donut-chart { width: 160px; height: 160px; border-radius: 50%; background: conic-gradient(#60a5fa 0 48%, #34d399 48% 70%, #fbbf24 70% 88%, #8b5cf6 88% 100%); position: relative; }
      .donut-chart::before { content:""; position:absolute; inset: 22px; border-radius:50%; background: rgba(9,20,32,1); }
      .donut-center { position:absolute; inset:0; display:grid; place-items:center; font-weight:800; font-size:1.2rem; }
      .allocation-list { list-style:none; padding:0; margin:0; display:grid; gap:10px; }
      .allocation-list li { display:flex; align-items:center; justify-content:space-between; color: var(--muted); }
      .dot { width:10px; height:10px; border-radius:50%; display:inline-block; margin-right:8px; }
      .dot.blue { background: #60a5fa; }
      .dot.green { background: #34d399; }
      .dot.gold { background: #fbbf24; }
      .dot.purple { background: #8b5cf6; }
      .watch-list { display:grid; gap:14px; }
      .watch-item { display:flex; align-items:center; justify-content:space-between; padding: 14px 10px; border-bottom: 1px solid rgba(148,163,184,.12); }
      .watch-item strong { display:block; }
      .watch-item small { color: var(--muted); }
      .watch-meta { display:flex; flex-direction:column; align-items:flex-end; gap:6px; }
      .badge.up { background: rgba(52, 211, 153, 0.12); color: var(--primary); }
      .badge.down { background: rgba(248, 113, 113, 0.12); color: var(--danger); }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  metrics: MetricCardModel[] = [];
  stocks: StockAsset[] = [];
  watchlist: WatchlistItem[] = [];
  summary: PortfolioSummary = { totalValue: 0, dayChange: 0, monthlyReturn: 0, riskScore: 0 };

  constructor(private readonly wealthService: WealthService) {}

  ngOnInit(): void {
    this.metrics = this.wealthService.getMetricCards();
    this.stocks = this.wealthService.getTopStocks();
    this.watchlist = this.wealthService.getWatchlist();
    this.summary = this.wealthService.getPortfolioSummary();
  }
}
