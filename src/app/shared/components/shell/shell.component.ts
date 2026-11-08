import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="shell-layout">
      <header class="topbar">
        <a class="brand" routerLink="/dashboard"><span class="brand-mark">↗</span><span>Folio <b>Pro</b></span></a>
        <nav class="primary-nav" aria-label="Main navigation">
          <a routerLink="/dashboard" routerLinkActive="active">Ideas dashboard</a>
          <a routerLink="/portfolio" routerLinkActive="active">Portfolio</a>
          <a routerLink="/stocks" routerLinkActive="active">Stock screener</a>
          <a routerLink="/ipo" routerLinkActive="active">IPO</a>
          <a routerLink="/crypto" routerLinkActive="active">Crypto</a>
          <a routerLink="/watchlists" routerLinkActive="active">Watchlists</a>
        </nav>
        <div class="header-tools"><label class="search"><span>⌕</span><input aria-label="Search stocks" placeholder="Search a company, sector or brand"></label><button class="icon-btn" aria-label="Notifications">♧</button><a class="avatar" routerLink="/profile" aria-label="Profile">A</a></div>
      </header>
      <div class="workspace" [class.workspace-wide-rail]="wideRail">
        <main class="main-panel"><ng-content></ng-content></main>
        <aside class="tool-rail" aria-label="Tracking tools">
          <a routerLink="/dashboard">⌂<small>Ideas</small></a><a routerLink="/watchlists">☆<small>Watchlist</small></a><a routerLink="/portfolio">◷<small>Portfolio</small></a><a routerLink="/stocks">☷<small>Screener</small></a><a routerLink="/settings">⚙<small>Settings</small></a>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    :host{display:block;min-height:100vh;background:#202023;color:#dedee6}
    .shell-layout{min-height:100vh;background:#202023}
    .topbar{height:54px;display:flex;align-items:center;gap:32px;padding:0 22px;background:#1e1e20;border-bottom:1px solid #36363a;position:sticky;top:0;z-index:5}
    .brand{display:flex;align-items:center;gap:8px;white-space:nowrap;font-weight:700;letter-spacing:3px;font-size:13px}.brand b{color:#4b8cff;letter-spacing:0}.brand-mark{display:grid;place-items:center;width:22px;height:22px;border-radius:6px;background:#ffca28;color:#151515;font-size:18px;font-weight:800;letter-spacing:0}
    .primary-nav{display:flex;align-items:center;gap:22px;margin-left:auto}.primary-nav a{font-size:12px;color:#a6a6af;white-space:nowrap}.primary-nav a.active,.primary-nav a:hover{color:#f3ce68}
    .header-tools{display:flex;align-items:center;gap:11px}.search{height:34px;width:min(270px,25vw);display:flex;align-items:center;gap:8px;padding:0 10px;border:1px solid #3b3b40;border-radius:20px;background:#29292c;color:#c5c5ce}.search input{width:100%;border:0;outline:0;background:transparent;color:#eee;font-size:11px}.search span{font-size:19px}.icon-btn,.avatar{width:30px;height:30px;border:0;border-radius:50%;display:grid;place-items:center;background:#33343a;color:#f0c94f}.avatar{background:#ffbf20;color:#2a260e;font-weight:700}
    .workspace{display:grid;grid-template-columns:minmax(0,1fr) 52px;min-height:calc(100vh - 54px)}.workspace-wide-rail{grid-template-columns:minmax(0,1fr) 62px}.main-panel{min-width:0;padding:24px clamp(18px,4vw,70px)}.tool-rail{position:sticky;top:54px;height:calc(100vh - 54px);display:flex;flex-direction:column;align-items:center;gap:15px;padding:25px 5px;background:#1e1e20;border-left:1px solid #36363a}.tool-rail a{display:grid;justify-items:center;gap:3px;color:#a4a4ab;font-size:17px}.tool-rail small{font-size:9px}
    @media(max-width:900px){.topbar{gap:12px;padding:0 14px}.primary-nav{gap:12px}.primary-nav a{font-size:11px}.search{width:34px}.search input{display:none}.main-panel{padding:18px}.workspace{grid-template-columns:minmax(0,1fr) 42px}.workspace-wide-rail{grid-template-columns:minmax(0,1fr) 52px}}
    @media(max-width:620px){.topbar{height:auto;min-height:54px;flex-wrap:wrap;padding:10px 12px}.primary-nav{order:3;overflow:auto;width:100%;margin:0;padding:4px 0}.header-tools{margin-left:auto}.workspace{min-height:calc(100vh - 95px)}.tool-rail{top:95px;height:calc(100vh - 95px)}}
  `],
})
export class ShellComponent {
  @Input() wideRail = false;
}
