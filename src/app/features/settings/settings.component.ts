import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ShellComponent } from '../../shared/components/shell/shell.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <app-shell>
      <div class="page-shell">
        <div class="page-header">
          <div>
            <h1>Settings</h1>
            <p>Manage account security, preferences, integrations, and market alerts.</p>
          </div>
        </div>

        <div class="list-grid">
          <section class="card panel-block">
            <div class="panel-header">
              <span class="eyebrow">Security</span>
              <h3>Account controls</h3>
            </div>
            <ul class="setting-list">
              <li>Two-factor authentication enabled</li>
              <li>Session privacy: Standard</li>
              <li>API connections: 3 active</li>
            </ul>
          </section>

          <section class="card panel-block">
            <div class="panel-header">
              <span class="eyebrow">Notifications</span>
              <h3>Alerts</h3>
            </div>
            <ul class="setting-list">
              <li>Price threshold alerts active</li>
              <li>Daily portfolio summary enabled</li>
              <li>Market news digest every evening</li>
            </ul>
          </section>
        </div>
      </div>
    </app-shell>
  `,
  styles: [
    `
      .panel-block { padding: 22px; }
      .panel-header { margin-bottom:18px; }
      .panel-header h3 { margin:8px 0 0; font-size:1.3rem; }
      .setting-list { margin:0; padding-left:18px; display:grid; gap:10px; color: var(--muted); }
    `,
  ],
})
export class SettingsComponent {}
