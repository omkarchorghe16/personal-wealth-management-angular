import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="shell-layout">
      <aside class="sidebar card">
        <div class="brand-row">
          <div class="brand-mark">W</div>
          <div>
            <div class="brand-name">WealthPilot</div>
            <div class="brand-subtitle">Focus portfolio</div>
          </div>
        </div>

        <nav class="nav">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/portfolio" routerLinkActive="active">Portfolio</a>
          <a routerLink="/stocks" routerLinkActive="active">Stocks</a>
          <a routerLink="/ipo" routerLinkActive="active">IPO Screen</a>
          <a routerLink="/crypto" routerLinkActive="active">Crypto</a>
          <a routerLink="/watchlists" routerLinkActive="active">Watchlists</a>
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
          <a routerLink="/settings" routerLinkActive="active">Settings</a>
        </nav>

        <div class="sidebar-card">
          <span>AI Insights</span>
          <strong>Momentum +0.8%</strong>
          <small>Risk adjusted outlook</small>
        </div>
      </aside>

      <main class="main-panel">
        <header class="topbar">
          <div>
            <span class="eyebrow">Portfolio management</span>
            <h2>Good morning, Alex</h2>
          </div>
          <div class="topbar-actions">
            <button class="ghost-btn">Search</button>
            <button class="primary-btn">+ Add asset</button>
          </div>
        </header>

        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [
    `
      :host { display:block; }
      .shell-layout { display:grid; grid-template-columns: 260px 1fr; min-height: 100vh; background: linear-gradient(135deg, #071521 0%, #0d172a 100%); }
      .sidebar { margin: 24px 0 24px 24px; padding: 22px 18px; border-radius: 30px; background: rgba(15, 23, 42, 0.8); }
      .brand-row { display:flex; align-items:center; gap:12px; margin-bottom: 24px; }
      .brand-mark { width: 38px; height: 38px; background: linear-gradient(135deg, #34d399, #2563eb); border-radius: 12px; display:grid; place-items:center; font-weight:800; }
      .brand-name { font-weight:800; }
      .brand-subtitle { color: var(--muted); font-size: 0.7rem; }
      .nav { display:flex; flex-direction:column; gap:10px; }
      .nav a { padding: 12px 14px; border-radius: 12px; color: var(--muted); transition: all .2s ease; }
      .nav a.active, .nav a:hover { background: rgba(96,165,250,.12); color: var(--text); }
      .sidebar-card { margin-top: 26px; padding: 16px; border-radius: 18px; background: linear-gradient(135deg, rgba(52,211,153,.12), rgba(37,99,235,.18)); border:1px solid var(--border); }
      .sidebar-card span { display:block; color:var(--muted); font-size:0.74rem; text-transform:uppercase; letter-spacing:0.08em; }
      .sidebar-card strong { display:block; margin:10px 0 4px; font-size:1.2rem; }
      .sidebar-card small { color: var(--muted); }
      .main-panel { padding: 24px; }
      .topbar { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:20px; }
      .eyebrow { color: var(--primary); font-size:0.76rem; letter-spacing:0.08em; text-transform: uppercase; font-weight:700; }
      .topbar h2 { margin: 8px 0 0; font-size: clamp(1.4rem, 2vw, 2.2rem); }
      .topbar-actions { display:flex; align-items:center; gap:12px; }
      .ghost-btn, .primary-btn { border:none; border-radius:12px; padding: 12px 16px; font-weight:700; cursor:pointer; }
      .ghost-btn { background: rgba(148,163,184,.08); color: var(--text); }
      .primary-btn { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #04121b; }
      @media (max-width: 900px) { .shell-layout { grid-template-columns:1fr; } .sidebar { margin: 18px 18px 0; } .main-panel { padding: 16px 18px 28px; } .topbar { flex-direction: column; align-items:flex-start; } }
    `,
  ],
})
export class ShellComponent {}
