import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ShellComponent } from '../../shared/components/shell/shell.component';

@Component({
  selector: 'app-ipo',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <app-shell>
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h1>IPO Screen</h1>
            <p>Monitor upcoming IPOs, valuation ranges, and listing sentiment.</p>
          </div>
          <div class="topbar-actions">
            <span class="chip">8 upcoming</span>
          </div>
        </div>

        <div class="watch-grid">
          <section class="card panel-block">
            <div class="panel-header">
              <span class="eyebrow">Upcoming</span>
              <h3>IPO pipeline</h3>
            </div>
            <div class="ipo-list">
              <div class="ipo-item">
                <div><strong>NovaGrid AI</strong><small>AI infrastructure</small></div>
                <div><span>Deal size</span><strong>$880M</strong></div>
                <div><span>Price range</span><strong>$24-28</strong></div>
                <span class="badge neutral">Watching</span>
              </div>
              <div class="ipo-item">
                <div><strong>BlueHarbor Bio</strong><small>Biotech</small></div>
                <div><span>Deal size</span><strong>$650M</strong></div>
                <div><span>Price range</span><strong>$18-21</strong></div>
                <span class="badge up">Hot</span>
              </div>
              <div class="ipo-item">
                <div><strong>SignalOne Cloud</strong><small>Software</small></div>
                <div><span>Deal size</span><strong>$540M</strong></div>
                <div><span>Price range</span><strong>$16-19</strong></div>
                <span class="badge neutral">Monitor</span>
              </div>
            </div>
          </section>

          <section class="card panel-block">
            <div class="panel-header">
              <span class="eyebrow">Valuation</span>
              <h3>Key metrics</h3>
            </div>
            <div class="metrics-stack">
              <div><span>Average GMP</span><strong>+11.4%</strong></div>
              <div><span>Underwriters</span><strong>9 active</strong></div>
              <div><span>Average oversubscription</span><strong>2.8x</strong></div>
              <div><span>Risk to reward</span><strong>Moderate</strong></div>
            </div>
          </section>
        </div>
      </div>
    </app-shell>
  `,
  styles: [
    `
      .panel-block { padding: 22px; }
      .panel-header { margin-bottom: 18px; }
      .panel-header h3 { margin:8px 0 0; font-size:1.3rem; }
      .ipo-list { display:grid; gap:14px; }
      .ipo-item { display:grid; grid-template-columns: 1.5fr 1fr 1fr auto; align-items:center; gap:12px; padding: 14px 12px; border-radius:12px; background: rgba(148,163,184,.04); }
      .ipo-item strong { display:block; }
      .ipo-item small, .ipo-item span { color: var(--muted); }
      .metrics-stack { display:grid; gap:14px; }
      .metrics-stack div { background: rgba(148,163,184,.04); border-radius:12px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; }
      .badge.neutral { background: rgba(96,165,250,.12); color: var(--accent); }
      .badge.up { background: rgba(52,211,153,.12); color: var(--primary); }
    `,
  ],
})
export class IpoComponent {}
