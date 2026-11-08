import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ShellComponent } from '../../shared/components/shell/shell.component';

@Component({
  selector: 'app-watchlists',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <app-shell>
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h1>Watchlists</h1>
            <p>Create and manage custom watchlists for sectors, opportunities, and strategies.</p>
          </div>
          <div class="topbar-actions">
            <button class="primary-btn">+ New watchlist</button>
          </div>
        </div>

        <div class="watch-grid">
          <section class="card panel-block">
            <div class="panel-header">
              <span class="eyebrow">Core</span>
              <h3>Growth picks</h3>
            </div>
            <div class="watch-list">
              <div class="watch-item">
                <div><strong>NVDA</strong><small>NVIDIA</small></div>
                <div class="watch-meta"><span>$127.46</span><span class="badge up">+4.2%</span></div>
              </div>
              <div class="watch-item">
                <div><strong>MSFT</strong><small>Microsoft</small></div>
                <div class="watch-meta"><span>$426.18</span><span class="badge up">+1.9%</span></div>
              </div>
              <div class="watch-item">
                <div><strong>AMZN</strong><small>Amazon</small></div>
                <div class="watch-meta"><span>$183.35</span><span class="badge up">+1.1%</span></div>
              </div>
            </div>
          </section>

          <section class="card panel-block">
            <div class="panel-header">
              <span class="eyebrow">Crypto</span>
              <h3>Digital assets</h3>
            </div>
            <div class="watch-list">
              <div class="watch-item">
                <div><strong>BTC</strong><small>Bitcoin</small></div>
                <div class="watch-meta"><span>$67,342</span><span class="badge up">+3.8%</span></div>
              </div>
              <div class="watch-item">
                <div><strong>ETH</strong><small>Ethereum</small></div>
                <div class="watch-meta"><span>$3,528</span><span class="badge up">+2.4%</span></div>
              </div>
              <div class="watch-item">
                <div><strong>SOL</strong><small>Solana</small></div>
                <div class="watch-meta"><span>$154.40</span><span class="badge up">+5.7%</span></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </app-shell>
  `,
  styles: [
    `
      .panel-block { padding:22px; }
      .panel-header { margin-bottom:18px; }
      .panel-header h3 { margin:8px 0 0; font-size:1.3rem; }
      .watch-list { display:grid; gap:14px; }
      .watch-item { display:flex; justify-content:space-between; align-items:center; padding: 12px 10px; border-bottom: 1px solid rgba(148,163,184,.12); }
      .watch-item strong { display:block; }
      .watch-item small { color: var(--muted); }
      .watch-meta { display:flex; flex-direction:column; align-items:flex-end; gap:6px; }
      .badge.up { background: rgba(52,211,153,.12); color: var(--primary); }
      .primary-btn { border:none; border-radius:12px; background: linear-gradient(135deg, var(--primary), var(--accent)); color:#091521; font-weight:800; padding:12px 16px; cursor:pointer; }
    `,
  ],
})
export class WatchlistsComponent {}
