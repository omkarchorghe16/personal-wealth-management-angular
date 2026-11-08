import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ShellComponent } from '../../shared/components/shell/shell.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <app-shell>
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h1>Profile</h1>
            <p>Review your preferences, financial goals, and investment identity.</p>
          </div>
          <div class="topbar-actions">
            <span class="chip">Verified</span>
          </div>
        </div>

        <div class="profile-grid">
          <section class="card panel-block">
            <div class="profile-card">
              <div class="avatar">AM</div>
              <div>
                <h3>Alex Morgan</h3>
                <p>Growth investor · Risk profile: Moderate</p>
              </div>
            </div>

            <div class="profile-fields">
              <div><span>Location</span><strong>New York, US</strong></div>
              <div><span>Email</span><strong>alex@wealthpilot.io</strong></div>
              <div><span>Investment focus</span><strong>Tech, AI, Healthcare</strong></div>
            </div>
          </section>

          <section class="card panel-block">
            <div class="panel-header">
              <span class="eyebrow">Goals</span>
              <h3>Strategy profile</h3>
            </div>
            <ul class="goal-list">
              <li>Retirement target: $2.4M by 2038</li>
              <li>Annual income target: $120K</li>
              <li>Risk target: 55/100</li>
              <li>Allocation bias: growth + income blend</li>
            </ul>
          </section>
        </div>
      </div>
    </app-shell>
  `,
  styles: [
    `
      .panel-block { padding: 22px; }
      .profile-card { display:flex; align-items:center; gap:16px; margin-bottom:22px; }
      .avatar { width: 70px; height: 70px; border-radius: 20px; display:grid; place-items:center; background: linear-gradient(135deg, #34d399, #2563eb); font-weight:800; }
      .profile-card h3 { margin:0 0 6px; }
      .profile-card p { margin:0; color:var(--muted); }
      .profile-fields { display:grid; gap:15px; }
      .profile-fields div { display:flex; justify-content:space-between; padding: 12px 14px; border-radius:12px; background: rgba(148,163,184,.04); }
      .profile-fields span { color: var(--muted); }
      .goal-list { margin:0; padding-left:18px; display:grid; gap:10px; color: var(--muted); }
    `,
  ],
})
export class ProfileComponent {}
