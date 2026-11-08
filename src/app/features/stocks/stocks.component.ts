import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StockAsset } from '../../core/models/wealth.models';
import { WealthService } from '../../core/services/wealth.service';
import { ShellComponent } from '../../shared/components/shell/shell.component';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <app-shell>
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h1>Stocks</h1>
            <p>Screen the market, compare sectors, and monitor trend strength.</p>
          </div>
          <div class="topbar-actions">
            <span class="chip">Screener active</span>
          </div>
        </div>

        <div class="resource-grid">
          <section class="card panel-block">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Sector pulse</span>
                <h3>Technology outperforms</h3>
              </div>
            </div>
            <div class="sector-list">
              <div><span>Technology</span><strong>+3.8%</strong></div>
              <div><span>Healthcare</span><strong>+1.9%</strong></div>
              <div><span>Energy</span><strong>-0.7%</strong></div>
              <div><span>Industrials</span><strong>+0.9%</strong></div>
            </div>
          </section>

          <section class="card panel-block">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Fundamental view</span>
                <h3>Quality rankings</h3>
              </div>
            </div>
            <div class="quality-list">
              <div><span>ROE > 18%</span><strong>43 stocks</strong></div>
              <div><span>Debt ratio < 0.35</span><strong>31 stocks</strong></div>
              <div><span>Revenue growth > 10%</span><strong>27 stocks</strong></div>
            </div>
          </section>
        </div>

        <section class="card panel-block">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Market screen</span>
              <h3>Stock universe</h3>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Sector</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>Volume</th>
                  <th>Quality</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let stock of stocks">
                  <td>{{ stock.symbol }}</td>
                  <td>{{ stock.name }}</td>
                  <td>{{ stock.sector }}</td>
                  <td>&#36;{{ stock.price }}</td>
                  <td class="text-success">+{{ stock.change }}%</td>
                  <td>{{ stock.volume }}</td>
                  <td>{{ stock.score }}/100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </app-shell>
  `,
  styles: [
    `
      .panel-block { padding: 22px; }
      .panel-header { margin-bottom: 18px; }
      .panel-header h3 { margin:8px 0 0; font-size:1.3rem; }
      .sector-list, .quality-list { display:grid; gap:12px; }
      .sector-list div, .quality-list div { display:flex; justify-content:space-between; background: rgba(148,163,184,.04); padding: 12px 14px; border-radius:12px; }
      .sector-list span, .quality-list span { color: var(--muted); }
    `,
  ],
})
export class StocksComponent implements OnInit {
  stocks: StockAsset[] = [];

  constructor(private readonly wealthService: WealthService) {}

  ngOnInit(): void {
    this.stocks = this.wealthService.getTopStocks();
  }
}
