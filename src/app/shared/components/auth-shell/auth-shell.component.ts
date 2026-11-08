import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="auth-shell">
      <div class="auth-panel card">
        <div class="brand-row">
          <div class="brand-mark">W</div>
          <div>
            <div class="brand-name">WealthPilot</div>
            <div class="brand-subtitle">Your personal wealth cockpit</div>
          </div>
        </div>

        <ng-content></ng-content>
      </div>
      <div class="auth-visual">
        <div class="visual-card card">
          <div class="eyebrow">Market pulse</div>
          <h2>Portfolio momentum is strong</h2>
          <div class="summary-row">
            <div>
              <div class="kpi">$1.28M</div>
              <span>Net worth</span>
            </div>
            <div class="trend positive">+12.8%</div>
          </div>
          <div class="mini-bars">
            <span style="height: 40%"></span>
            <span style="height: 65%"></span>
            <span style="height: 55%"></span>
            <span style="height: 90%"></span>
            <span style="height: 80%"></span>
            <span style="height: 100%"></span>
          </div>
          <div class="link-row">
            <a [routerLink]="['/dashboard']">Open dashboard</a>
            <a [routerLink]="['/register']">Create account</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display:block; }
      .auth-shell { min-height: 100vh; display:grid; grid-template-columns: 1.05fr 1fr; background: linear-gradient(135deg, #071521 0%, #0d172a 100%); }
      .auth-panel { margin: 64px 24px 64px 64px; padding: 32px; border-radius: 28px; }
      .auth-visual { display:flex; align-items:center; justify-content:center; padding: 48px; }
      .brand-row { display:flex; align-items:center; gap:14px; margin-bottom: 28px; }
      .brand-mark { width: 42px; height: 42px; border-radius: 12px; display:grid; place-items:center; background: linear-gradient(135deg, #34d399, #1d4ed8); color:#fff; font-weight:800; }
      .brand-name { font-size: 1.2rem; font-weight:800; }
      .brand-subtitle { color: var(--muted); font-size: 0.74rem; }
      .visual-card { padding: 28px; width: min(100%, 440px); border-radius: 28px; }
      .eyebrow { color: var(--primary); font-size:0.72rem; letter-spacing:0.08em; text-transform: uppercase; font-weight:700; }
      .visual-card h2 { font-size: clamp(2rem, 3vw, 3rem); margin: 14px 0 20px; line-height:1.1; }
      .summary-row { display:flex; justify-content:space-between; align-items:end; margin-bottom:24px; }
      .kpi { font-size: 2rem; font-weight:800; }
      .trend.positive { color: var(--primary); font-weight:700; }
      .mini-bars { display:flex; align-items:flex-end; gap:10px; height:120px; margin: 16px 0 28px; }
      .mini-bars span { display:block; width: 100%; border-radius: 999px 999px 0 0; background: linear-gradient(180deg, #60a5fa, #34d399); }
      .link-row { display:flex; justify-content:space-between; gap:12px; color: var(--muted); }
      .link-row a { color: var(--text); opacity:0.85; }
      @media (max-width: 900px) { .auth-shell { grid-template-columns:1fr; } .auth-panel { margin: 20px; } .auth-visual { padding: 0 20px 32px; } }
    `,
  ],
})
export class AuthShellComponent {}
