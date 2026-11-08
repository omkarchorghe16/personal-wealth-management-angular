import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthShellComponent } from '../auth-shell/auth-shell.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, AuthShellComponent],
  template: `
    <app-auth-shell>
      <div class="auth-content">
        <h1>Welcome back</h1>
        <p>Log in to manage your wealth, portfolio, and market opportunities.</p>

        <form class="auth-form">
          <label>
            <span>Email</span>
            <input type="email" value="alex@wealthpilot.io" placeholder="you@example.com" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value="password123" placeholder="Enter your password" />
          </label>

          <div class="form-row">
            <label class="check-row"><input type="checkbox" checked /> Remember me</label>
            <a routerLink="/dashboard">Forgot password?</a>
          </div>

          <button type="button" class="primary-btn" [routerLink]="['/dashboard']">Sign in</button>
        </form>

        <div class="auth-footer">
          Need an account? <a routerLink="/register">Create one</a>
        </div>
      </div>
    </app-auth-shell>
  `,
  styles: [
    `
      .auth-content { max-width: 440px; }
      h1 { margin: 0; font-size: 2.3rem; }
      p { color: var(--muted); margin: 12px 0 26px; }
      .auth-form { display:flex; flex-direction:column; gap:18px; }
      label { display:flex; flex-direction:column; gap:8px; font-weight:600; }
      input { border: 1px solid rgba(148,163,184,.18); border-radius: 12px; padding: 14px 16px; background: rgba(15,23,42,.76); color: var(--text); }
      .form-row { display:flex; justify-content:space-between; align-items:center; font-size:0.9rem; }
      .check-row { display:flex; align-items:center; gap:8px; color: var(--muted); flex-direction:row !important; }
      .primary-btn { border:none; border-radius:12px; background: linear-gradient(135deg, var(--primary), var(--accent)); color:#091521; font-weight:800; padding: 14px 18px; cursor:pointer; }
      .auth-footer { margin-top: 22px; color: var(--muted); }
      .auth-footer a { color: var(--primary); }
    `,
  ],
})
export class LoginComponent {}
