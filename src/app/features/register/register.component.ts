import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthShellComponent } from '../../shared/components/auth-shell/auth-shell.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, AuthShellComponent],
  template: `
    <app-auth-shell>
      <div class="auth-content">
        <h1>Create account</h1>
        <p>Set up your wealth strategy and personalize your investment workspace.</p>

        <form class="auth-form">
          <label>
            <span>Full name</span>
            <input type="text" value="Alex Morgan" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" value="alex@wealthpilot.io" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value="password123" />
          </label>
          <button type="button" class="primary-btn" [routerLink]="['/dashboard']">Create account</button>
        </form>

        <div class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
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
      input { border:1px solid rgba(148,163,184,.18); border-radius:12px; padding:14px 16px; background: rgba(15,23,42,.76); color: var(--text); }
      .primary-btn { border:none; border-radius:12px; background: linear-gradient(135deg, var(--primary), var(--accent)); color:#091521; font-weight:800; padding:14px 18px; cursor:pointer; }
      .auth-footer { margin-top: 22px; color: var(--muted); }
      .auth-footer a { color: var(--primary); }
    `,
  ],
})
export class RegisterComponent {}
