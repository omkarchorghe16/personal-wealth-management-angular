import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  CountryPortfolio,
  MetricCardModel,
  PortfolioOverview,
  StockAsset,
} from '../../core/models/wealth.models';
import { WealthService } from '../../core/services/wealth.service';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { ShellComponent } from '../../shared/components/shell/shell.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ShellComponent, MetricCardComponent],
  template: `
    <app-shell [wideRail]="true">
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Your wealth overview across US and India portfolios.</p>
          </div>
          <span class="sample-note">Prototype · illustrative sample data, not live market values</span>
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

        <section class="card growth-panel" aria-labelledby="growth-heading">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Portfolio performance · sample</span>
              <h2 id="growth-heading">Portfolio growth</h2>
            </div>
            <span class="growth-return">+$216.4K <small>illustrative gain</small></span>
          </div>
          <div class="growth-chart-wrap">
            <svg class="growth-chart" viewBox="0 0 900 230" role="img" aria-labelledby="growth-chart-title growth-chart-desc" preserveAspectRatio="none">
              <title id="growth-chart-title">Illustrative portfolio growth chart</title>
              <desc id="growth-chart-desc">A sample upward-trending portfolio value line over twelve months.</desc>
              <defs>
                <linearGradient id="growth-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#4b8cff" stop-opacity=".28"/>
                  <stop offset="100%" stop-color="#4b8cff" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="42" x2="900" y2="42" class="chart-gridline"/>
              <line x1="0" y1="98" x2="900" y2="98" class="chart-gridline"/>
              <line x1="0" y1="154" x2="900" y2="154" class="chart-gridline"/>
              <path class="chart-area" d="M0 184 L82 169 L164 177 L246 138 L328 145 L410 119 L492 128 L574 92 L656 105 L738 68 L820 75 L900 28 L900 220 L0 220 Z"/>
              <polyline class="chart-line" points="0,184 82,169 164,177 246,138 328,145 410,119 492,128 574,92 656,105 738,68 820,75 900,28"/>
              <circle cx="900" cy="28" r="5" class="chart-point"/>
            </svg>
          </div>
          <div class="chart-months" aria-hidden="true">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </section>

        <section class="allocation-section" aria-labelledby="allocation-heading">
          <div class="section-heading">
            <div>
              <span class="eyebrow">Portfolio breakdown</span>
              <h2 id="allocation-heading">Asset allocation by country</h2>
            </div>
            <p>Allocation percentages are illustrative and shown separately in each portfolio's currency.</p>
          </div>
          <div class="country-grid">
            <section class="card country-card" *ngFor="let portfolio of countryPortfolios">
              <div class="country-header">
                <div>
                  <span class="eyebrow">{{ portfolio.country }} · {{ portfolio.currency }}</span>
                  <h3>{{ portfolio.totalValue }}</h3>
                </div>
                <span class="country-mark" aria-hidden="true">{{ portfolio.country === 'India' ? 'IN' : 'US' }}</span>
              </div>
              <div class="allocation-list">
                <div class="allocation-row" *ngFor="let allocation of portfolio.allocations">
                  <span class="allocation-name">{{ allocation.name }}</span>
                  <div class="allocation-track" role="progressbar"
                    [attr.aria-label]="allocation.name + ' allocation'"
                    [attr.aria-valuenow]="allocation.percent"
                    aria-valuemin="0" aria-valuemax="100">
                    <span [style.width.%]="allocation.percent"></span>
                  </div>
                  <strong>{{ allocation.percent }}%</strong>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section class="card panel-block portfolios-panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Your accounts</span>
              <h2>All portfolios</h2>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>Portfolio</th><th>Country</th><th>Asset types</th><th>Value</th><th>Profit</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let portfolio of portfolios">
                  <td><strong>{{ portfolio.name }}</strong></td>
                  <td>{{ portfolio.country }}</td>
                  <td>{{ portfolio.type }}</td>
                  <td>{{ portfolio.value }}</td>
                  <td [ngClass]="portfolio.tone === 'up' ? 'text-success' : 'text-danger'">{{ portfolio.profit }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="stats-grid">
          <div class="right-stats">
            <section class="card panel-block">
              <div class="panel-header">
                <div>
                  <span class="eyebrow">Positive momentum</span>
                  <h2>Top gainers</h2>
                </div>
              </div>
              <div class="gainer-list">
                <div class="gainer-row" *ngFor="let stock of gainers">
                  <div>
                    <strong>{{ stock.symbol }}</strong>
                    <small>{{ stock.name }}</small>
                  </div>
                  <span class="gainer-change">+{{ stock.change }}%</span>
                </div>
              </div>
            </section>

            <section class="card panel-block">
              <div class="panel-header">
                <div>
                  <span class="eyebrow">Negative momentum</span>
                  <h2>Top losers</h2>
                </div>
              </div>
              <div class="gainer-list">
                <div class="gainer-row loser-row" *ngFor="let stock of losers">
                  <div>
                    <strong>{{ stock.symbol }}</strong>
                    <small>{{ stock.name }}</small>
                  </div>
                  <span class="loser-change">{{ stock.change }}%</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </app-shell>
  `,
  styles: [`
    .sample-note { color:var(--muted); font-size:.75rem; }
    .section-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:18px; margin:26px 0 14px; }
    .section-heading h2,.panel-header h2 { margin:7px 0 0; font-size:1.2rem; }
    .section-heading p { max-width:440px; margin:0; color:var(--muted); font-size:.78rem; text-align:right; }
    .country-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; margin-bottom:20px; }
    .country-card,.panel-block { padding:20px; }
    .country-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
    .country-header h3 { margin:8px 0 0; font-size:1.45rem; }
    .country-mark { display:grid; place-items:center; width:38px; height:38px; border:1px solid var(--border); border-radius:50%; color:var(--accent); font-size:.7rem; font-weight:700; }
    .allocation-list { display:grid; gap:11px; }
    .allocation-row { display:grid; grid-template-columns:minmax(125px,1fr) minmax(70px,1.3fr) 36px; align-items:center; gap:10px; font-size:.76rem; }
    .allocation-name { color:var(--muted); }
    .allocation-row strong { text-align:right; font-size:.74rem; }
    .allocation-track { height:6px; overflow:hidden; border-radius:99px; background:#ffffff12; }
    .allocation-track span { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,var(--primary),var(--accent)); }
    .portfolios-panel { margin-bottom:18px; }
    .panel-header { margin-bottom:16px; }
    .panel-header h2 { margin:7px 0 0; font-size:1.2rem; }
    .growth-panel { padding:20px; margin-bottom:20px; }
    .growth-return { color:var(--positive); font-size:.95rem; font-weight:700; text-align:right; }
    .growth-return small { display:block; margin-top:4px; color:var(--muted); font-size:.68rem; font-weight:400; }
    .growth-chart-wrap { height:210px; }
    .growth-chart { display:block; width:100%; height:100%; overflow:visible; }
    .chart-gridline { stroke:var(--border); stroke-width:1; stroke-dasharray:4 6; }
    .chart-area { fill:url(#growth-fill); }
    .chart-line { fill:none; stroke:var(--primary); stroke-width:3; stroke-linecap:round; stroke-linejoin:round; vector-effect:non-scaling-stroke; }
    .chart-point { fill:var(--accent); stroke:var(--panel); stroke-width:3; vector-effect:non-scaling-stroke; }
    .chart-months { display:grid; grid-template-columns:repeat(12,1fr); gap:4px; margin-top:7px; color:var(--muted); font-size:.65rem; text-align:center; }
    .stats-grid { grid-template-columns:1fr; align-items:start; }
    .right-stats { display:grid; gap:16px; }
    .gainer-row small { display:block; margin-top:4px; color:var(--muted); font-size:.7rem; }
    .gainer-list { display:grid; }
    .gainer-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 4px; border-bottom:1px solid var(--border); }
    .gainer-row:last-child { border-bottom:0; }
    .gainer-change { color:var(--positive); font-weight:700; font-size:.82rem; }
    .loser-change { color:var(--negative); font-weight:700; font-size:.82rem; }
    @media(max-width:900px) { .country-grid,.stats-grid { grid-template-columns:1fr; } }
    @media(max-width:620px) {
      .section-heading { align-items:flex-start; flex-direction:column; }
      .section-heading p { text-align:left; }
      .country-card,.panel-block { padding:15px; }
      .allocation-row { grid-template-columns:minmax(108px,1fr) minmax(45px,1fr) 32px; gap:7px; font-size:.68rem; }
      .growth-panel { padding:15px; }
      .growth-chart-wrap { height:165px; }
      .chart-months { font-size:.56rem; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  metrics: MetricCardModel[] = [];
  countryPortfolios: CountryPortfolio[] = [];
  portfolios: PortfolioOverview[] = [];
  gainers: StockAsset[] = [];
  losers: StockAsset[] = [];

  constructor(private readonly wealthService: WealthService) {}

  ngOnInit(): void {
    this.metrics = this.wealthService.getMetricCards();
    this.countryPortfolios = this.wealthService.getCountryPortfolios();
    this.portfolios = this.wealthService.getPortfolioOverviews();
    this.gainers = this.wealthService.getTopGainers();
    this.losers = this.wealthService.getTopLosers();
  }
}
