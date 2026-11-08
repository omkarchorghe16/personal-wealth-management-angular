import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="login-page">
      <section class="brand-panel" aria-label="About Folio Pro">
        <a class="brand" routerLink="/login" aria-label="Folio Pro home">
          <span class="brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m4 15 5-5 4 4 7-8M14 6h6v6" /></svg></span>
          <span>Folio <b>Pro</b></span>
        </a>
        <div class="brand-copy">
          <h1>Every investment. One<br class="desktop-break"> terminal.</h1>
          <ul class="feature-list">
            <li><span class="feature-icon"><svg viewBox="0 0 24 24"><path d="M4 19V5m0 14h16M7 14l4-4 3 2 5-6"/></svg></span>Stocks, ETFs, crypto, funds, options and IPOs</li>
            <li><span class="feature-icon"><svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/></svg></span>Real estate, gold and bonds beside your market portfolio</li>
            <li><span class="feature-icon"><svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg></span>Screeners, alerts, fundamental and technical analysis</li>
          </ul>
        </div>
        <span class="prototype-note">Prototype · sample data</span>
      </section>

      <section class="form-panel" aria-label="Sign in">
        <form class="login-form" (submit)="signIn($event)">
          <h2>Welcome back</h2>
          <p>Sign in to your investment dashboard.</p>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" autocomplete="email">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="••••••••" autocomplete="current-password">
          <button class="sign-in" type="submit">Continue without signing in</button>
          <button class="demo-button" type="button" (click)="demoSignIn()">Use demo account</button>
          <p class="create-account">New here? <a routerLink="/register">Create an account</a></p>
          <p class="demo-notice" *ngIf="notice" role="status">{{ notice }}</p>
        </form>
      </section>
    </main>
  `,
  styles: [`
    :host { display:block; min-height:100vh; }
    .login-page { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; background:#090c12; color:#e7ebf4; }
    .brand-panel { position:relative; min-height:100vh; padding:48px 7.2%; display:flex; flex-direction:column; border-right:1px solid #293142; background:radial-gradient(ellipse at 82% 100%,rgba(0,177,150,.12),transparent 38%),linear-gradient(145deg,#172238,#101723 70%); }
    .brand { display:flex; align-items:center; gap:9px; font-size:18px; font-weight:700; letter-spacing:-.4px; }
    .brand b { color:#4b8cff; }
    .brand-icon { display:grid; place-items:center; width:36px; height:36px; border-radius:7px; background:#4d8cff; }
    .brand-icon svg,.feature-icon svg { width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round; }
    .brand-icon svg { color:white; }
    .brand-copy { margin:auto 0; transform:translateY(-8px); }
    h1 { margin:0 0 25px; font-size:clamp(2rem,3vw,2.4rem); line-height:1.18; letter-spacing:-1.1px; }
    .feature-list { display:grid; gap:23px; margin:0; padding:0; list-style:none; color:#91a0b9; font-size:14px; }
    .feature-list li { display:flex; align-items:center; gap:13px; }
    .feature-icon { display:grid; place-items:center; flex:0 0 18px; color:#4b8cff; }
    .prototype-note { color:#8694ac; font-size:12px; }
    .form-panel { display:grid; place-items:center; padding:40px 8%; }
    .login-form { width:min(100%,384px); }
    .login-form h2 { margin:0 0 6px; font-size:24px; letter-spacing:-.5px; }
    .login-form > p:not(.create-account):not(.demo-notice) { margin:0 0 27px; color:#8d9ab0; font-size:14px; }
    label { display:block; margin:0 0 6px; color:#94a1b7; font-size:12px; }
    input { width:100%; height:37px; margin-bottom:17px; padding:0 12px; border:1px solid #293448; border-radius:6px; outline:none; background:#0a0d13; color:#e7ebf4; font-size:14px; }
    input:focus { border-color:#4b8cff; box-shadow:0 0 0 3px #4b8cff25; }
    input::placeholder { color:#8190a9; }
    button { width:100%; height:37px; border-radius:6px; font-size:14px; font-weight:600; cursor:pointer; }
    .sign-in { border:0; background:#4b87f5; color:white; }
    .sign-in:hover { background:#3977e9; }
    .demo-button { margin-top:16px; border:1px solid #293448; background:transparent; color:#e7ebf4; font-weight:500; }
    .demo-button:hover { background:#141a25; }
    .create-account { margin:25px 0 0; text-align:center; color:#8d9ab0; font-size:14px; }
    .create-account a { color:#4b8cff; }
    .demo-notice { margin-top:14px; text-align:center; color:#87d9a8; font-size:12px; }
    @media(max-width:760px) { .login-page{grid-template-columns:1fr}.brand-panel{min-height:auto;padding:28px 7% 24px;border-right:0;border-bottom:1px solid #293142}.brand-copy{margin:54px 0 30px;transform:none}h1{font-size:30px}.desktop-break{display:none}.feature-list{gap:15px}.feature-list li{align-items:flex-start;line-height:1.5}.prototype-note{display:none}.form-panel{padding:42px 7% 56px} }
  `],
})
export class LoginComponent {
  notice = '';

  signIn(event: Event): void {
    event.preventDefault();
    window.location.assign('/dashboard');
  }

  demoSignIn(): void {
    // Prototype-only navigation; no authentication API is called.
    window.location.assign('/dashboard');
  }
}
