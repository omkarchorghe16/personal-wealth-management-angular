import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WealthService } from '../../core/services/wealth.service';
import { Holding } from '../../core/models/wealth.models';
import { ShellComponent } from '../../shared/components/shell/shell.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <app-shell>
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h1>Portfolio</h1>
            <p>Track allocations, unrealized gains, and position-level contributions.</p>
          </div>
          <div class="topbar-actions">
            <span class="chip">Diversified</span>
          </div>
        </div>

        <div class="summary-grid">
          <section class="card panel-block">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Overview</span>
                <h3>$1,284,600</h3>
              </div>
              <span class="chip success">+ $18,450 today</span>
            </div>
            <div class="mini-row">
              <div><span>Monthly return</span><strong>+12.8%</strong></div>
              <div><span>Cash</span><strong>$186K</strong></div>
              <div><span>Risk</span><strong>67 / 100</strong></div>
            </div>
          </section>

          <section class="card panel-block">
            <div class="panel-header compact">
              <span class="eyebrow">Rebalance</span>
              <h3>Target check</h3>
            </div>
            <div class="progress-list">
              <div><label>Equity</label><div class="progress"><span style="width: 82%"></span></div><strong>82%</strong></div>
              <div><label>Crypto</label><div class="progress"><span style="width: 43%"></span></div><strong>43%</strong></div>
              <div><label>Fixed Income</label><div class="progress"><span style="width: 36%"></span></div><strong>36%</strong></div>
            </div>
          </section>
        </div>

        <section class="card panel-block">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Holdings</span>
              <h3>Current positions</h3>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Qty</th>
                  <th>Avg cost</th>
                  <th>Market value</th>
                  <th>Allocation</th>
                  <th>Unrealized</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let holding of holdings">
                  <td>{{ holding.symbol }}</td>
                  <td>{{ holding.company }}</td>
                  <td>{{ holding.quantity }}</td>
                  <td>${{ holding.avgCost }}</td>
                  <td>${{ holding.marketValue }}</td>
                  <td>{{ holding.allocation }}%</td>
                  <td class="text-success">+{{ holding.change }}%</td>
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
      .panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
      .panel-header h3 { margin:8px 0 0; font-size:1.3rem; }
      .mini-row { display:grid; grid-template-columns: repeat(3, minmax(120px, 1fr)); gap:16px; }
      .mini-row div { padding:14px; border-radius:16px; background: rgba(148,163,184,.04); }
      .mini-row span { color: var(--muted); display:block; font-size:0.72rem; text-transform: uppercase; }
      .mini-row strong { display:block; margin-top:8px; font-size:1.3rem; }
      .progress-list { display:grid; gap:16px; }
      .progress-list > div { display:grid; grid-template-columns: 90px 1fr 50px; gap:12px; align-items:center; }
      .progress { height: 8px; background: rgba(148,163,184,.08); border-radius:999px; overflow:hidden; }
      .progress span { display:block; height:100%; background: linear-gradient(90deg, #60a5fa, #34d399); border-radius:inherit; }
    `,
  ],
})
export class PortfolioComponent implements OnInit {
  holdings: Holding[] = [];

  constructor(private readonly wealthService: WealthService) {}

  ngOnInit(): void {
    this.holdings = this.wealthService.getPortfolioHoldings();
  }
}
