import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import { StocksComponent } from './features/stocks/stocks.component';
import { IpoComponent } from './features/ipo/ipo.component';
import { CryptoComponent } from './features/crypto/crypto.component';
import { WatchlistsComponent } from './features/watchlists/watchlists.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from './features/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'stocks', component: StocksComponent },
  { path: 'ipo', component: IpoComponent },
  { path: 'crypto', component: CryptoComponent },
  { path: 'watchlists', component: WatchlistsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'login' },
];
