import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metric-card card">
      <div class="metric-card__label">{{ title }}</div>
      <div class="metric-card__value">{{ value }}</div>
      <div class="metric-card__meta">
        <span class="badge" [ngClass]="tone">{{ change }}</span>
        <span class="metric-card__detail">{{ detail }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .metric-card { padding: 20px; }
      .metric-card__label { color: var(--muted); font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; }
      .metric-card__value { font-size: clamp(1.7rem, 2vw, 2.2rem); font-weight: 800; margin: 12px 0 10px; }
      .metric-card__meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .metric-card__detail { color: var(--muted); font-size: 0.76rem; }
      .badge.up { background: rgba(52, 211, 153, 0.12); color: var(--primary); }
      .badge.down { background: rgba(248, 113, 113, 0.12); color: var(--danger); }
      .badge.neutral { background: rgba(96, 165, 250, 0.12); color: var(--accent); }
    `,
  ],
})
export class MetricCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() change = '';
  @Input() tone: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() detail = '';
}
