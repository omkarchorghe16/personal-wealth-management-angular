import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { WatchlistGroup, WatchlistItem, WatchlistMarket, WatchlistMetricKey } from '../../core/models/wealth.models';
import { FmpProfile, FmpProfilesService } from '../../core/services/fmp-profiles.service';
import { WatchlistImportMarket, WatchlistImportService } from '../../core/services/watchlist-import.service';
import { WatchlistPageResponse, WatchlistsService } from '../../core/services/watchlists.service';
import { ShellComponent } from '../../shared/components/shell/shell.component';

type WatchlistColumnKey = 'symbol' | 'name' | 'assetType' | 'price' | 'change' | 'trend' | 'sector' | 'score' | 'volume' | WatchlistMetricKey;

interface WatchlistColumn {
  key: WatchlistColumnKey;
  label: string;
  group: string;
}

const FAVORITE_WATCHLISTS_STORAGE_KEY = 'folio-pro.favorite-watchlists';
const FAVORITE_SYMBOLS_STORAGE_KEY = 'folio-pro.favorite-symbols';
const WATCHLIST_COLUMNS_STORAGE_KEY = 'folio-pro.watchlist-columns';
const FAVORITES_LIST_ID = '__favorites__';
const MAX_IMPORT_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-watchlists',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <app-shell>
      <div class="page-shell watchlists-page">
        <div class="page-header">
          <div>
            <h1>Watchlists</h1>
            <p>Monitor US and India assets from one page using the same watchlist workflow.</p>
          </div>
          <span class="sample-note">Prices and market metrics are not provided by the watchlist service.</span>
        </div>

        <section class="card watchlist-panel">
          <div class="toolbar">
            <div class="market-control" role="group" aria-label="Select watchlist market">
              <button type="button" [class.selected]="selectedMarket === 'US'"
                [attr.aria-pressed]="selectedMarket === 'US'" (click)="selectMarket('US')">USA watchlists</button>
              <button type="button" [class.selected]="selectedMarket === 'India'"
                [attr.aria-pressed]="selectedMarket === 'India'" (click)="selectMarket('India')">India watchlists</button>
            </div>
            <div class="actions">
              <input #fileInput class="file-input" type="file" accept=".csv,text/csv"
                aria-label="Choose watchlist CSV to import" [disabled]="isImporting" (change)="importCsv($event)">
              <button class="tool-button" type="button" [disabled]="isImporting" (click)="fileInput.click()">
                {{ isImporting ? 'Importing…' : 'Import CSV' }}
              </button>
              <button class="tool-button" type="button" (click)="exportCsv()">Export CSV</button>
              <button class="tool-button" type="button" [disabled]="isLoadingProfiles || isLoadingWatchlists"
                (click)="loadFmpProfiles()">
                {{ isLoadingProfiles ? 'Loading profiles…' : 'Load FMP profiles' }}
              </button>
              <button class="tool-button" type="button" [attr.aria-expanded]="columnsEditorOpen"
                aria-controls="columns-editor" (click)="openColumnEditor()">Edit columns</button>
            </div>
          </div>

          <div class="favorite-strip" aria-label="Favorite watchlists">
            <span class="favorite-label">Favorites</span>
            <button type="button" class="favorite-chip" *ngFor="let watchlist of favoriteWatchlists"
              [class.selected]="selectedWatchlistId === watchlist.id" (click)="selectFavoriteWatchlist(watchlist.id)">
              <span aria-hidden="true">★</span> {{ watchlist.name }}
            </button>
            <span class="favorite-empty" *ngIf="favoriteWatchlists.length === 0">Favorite a watchlist from the dropdown to pin it here.</span>
          </div>

          <div class="modal-backdrop" *ngIf="columnsEditorOpen" (click)="cancelColumnEditor()">
            <section class="columns-modal" id="columns-editor" role="dialog" aria-modal="true"
              aria-labelledby="columns-title" (click)="$event.stopPropagation()" (keydown.escape)="cancelColumnEditor()">
              <header class="modal-header">
                <div>
                  <span class="eyebrow">Table preferences</span>
                  <h2 id="columns-title">Edit columns</h2>
                </div>
                <button type="button" class="modal-close" aria-label="Close column editor" (click)="cancelColumnEditor()">×</button>
              </header>
              <p class="modal-description">Select the columns to show in your watchlist. Changes are applied after saving.</p>
              <div class="columns-editor">
                <ng-container *ngFor="let group of columnGroups">
                  <strong class="column-group-title">{{ group }}</strong>
                  <label class="column-option" *ngFor="let column of columnsForGroup(group)">
                    <input type="checkbox" [checked]="isDraftColumnVisible(column.key)"
                      (change)="toggleDraftColumn(column.key, $event)">
                    {{ column.label }}
                  </label>
                </ng-container>
              </div>
              <div class="column-order" *ngIf="draftColumnKeys.length">
                <strong class="column-group-title">Selected column order</strong>
                <div class="column-order-row" *ngFor="let key of draftColumnKeys; let index = index">
                  <span>{{ columnLabel(key) }}</span>
                  <div class="column-order-actions">
                    <button type="button" [disabled]="index === 0" (click)="moveDraftColumn(index, -1)"
                      [attr.aria-label]="'Move ' + columnLabel(key) + ' up'">↑</button>
                    <button type="button" [disabled]="index === draftColumnKeys.length - 1" (click)="moveDraftColumn(index, 1)"
                      [attr.aria-label]="'Move ' + columnLabel(key) + ' down'">↓</button>
                  </div>
                </div>
              </div>
              <p class="modal-error" *ngIf="columnEditorMessage" role="status">{{ columnEditorMessage }}</p>
              <footer class="modal-actions">
                <button type="button" class="tool-button" (click)="cancelColumnEditor()">Cancel</button>
                <button type="button" class="save-button" (click)="saveColumnPreferences()">Save columns</button>
              </footer>
            </section>
          </div>

          <div class="list-controls">
            <div class="list-select">
              <label id="watchlist-select-label">{{ selectedMarket }} watchlist</label>
              <div class="watchlist-dropdown" (click)="$event.stopPropagation()">
                <button id="watchlist-select" type="button" class="watchlist-select-button"
                  aria-labelledby="watchlist-select-label" [attr.aria-expanded]="watchlistDropdownOpen"
                  aria-haspopup="listbox" (click)="watchlistDropdownOpen = !watchlistDropdownOpen">
                <span>{{ selectedWatchlist.name }}</span><span class="dropdown-chevron" aria-hidden="true">⌄</span>
                </button>
                <div class="watchlist-menu" role="listbox" *ngIf="watchlistDropdownOpen">
                  <p class="watchlist-loading" *ngIf="isLoadingWatchlists" role="status">Loading watchlists…</p>
                  <button *ngIf="hasFavoriteSymbols" type="button" class="watchlist-option"
                    [class.active]="isFavoritesList" role="option" [attr.aria-selected]="isFavoritesList"
                    (click)="selectWatchlist(favoritesListId)">
                    <span class="option-name"><span class="favorite-star" aria-hidden="true">★</span> Favorites</span>
                  </button>
                  <div class="watchlist-option-row" *ngFor="let watchlist of watchlists">
                    <button type="button" class="watchlist-option" [class.active]="selectedWatchlistId === watchlist.id"
                      role="option" [attr.aria-selected]="selectedWatchlistId === watchlist.id"
                      (click)="selectWatchlist(watchlist.id)">
                      <span class="option-name">
                        <span class="favorite-star" *ngIf="isFavoriteWatchlist(watchlist)" aria-hidden="true">★</span>
                        {{ watchlist.name }}
                      </span>
                    </button>
                    <button type="button" class="dropdown-favorite-button"
                      [class.is-favorite]="isFavoriteWatchlist(watchlist)"
                      [attr.aria-pressed]="isFavoriteWatchlist(watchlist)"
                      [attr.aria-label]="isFavoriteWatchlist(watchlist) ? 'Remove ' + watchlist.name + ' from favorites' : 'Add ' + watchlist.name + ' to favorites'"
                       (click)="toggleFavoriteWatchlist(watchlist)">{{ isFavoriteWatchlist(watchlist) ? '★' : '☆' }}</button>
                  </div>
                  <button type="button" class="watchlist-option add-watchlist-option" role="option"
                    aria-selected="false" [disabled]="isLoadingWatchlists" (click)="openAddWatchlistDialog()">
                    <span class="option-name"><span aria-hidden="true">＋</span> Add watchlist</span>
                  </button>
                  <div class="watchlist-page-controls" *ngIf="watchlistTotalPages > 1" aria-label="Watchlist pages">
                    <button type="button" (click)="previousWatchlistPage()"
                      [disabled]="isLoadingWatchlists || watchlistPage === 0">Previous</button>
                    <span>Page {{ watchlistPage + 1 }} of {{ watchlistTotalPages }}</span>
                    <button type="button" (click)="nextWatchlistPage()"
                      [disabled]="isLoadingWatchlists || watchlistPage + 1 >= watchlistTotalPages">Next</button>
                  </div>
                </div>
              </div>
            </div>
            <button type="button" class="add-stocks-button" [disabled]="isFavoritesList"
              (click)="openAddStocksDialog()" aria-haspopup="dialog">
              <span aria-hidden="true">＋</span> Add stocks
            </button>
            <div class="list-summary">
              <strong>{{ selectedWatchlist.items.length }}</strong>
              <span>assets · {{ selectedWatchlist.currency }}</span>
            </div>
          </div>

          <div class="modal-backdrop" *ngIf="addStocksDialogOpen" (click)="closeAddStocksDialog()">
            <section class="columns-modal add-stocks-modal" role="dialog" aria-modal="true"
              aria-labelledby="add-stocks-title" (click)="$event.stopPropagation()" (keydown.escape)="closeAddStocksDialog()">
              <header class="modal-header">
                <div>
                  <span class="eyebrow">{{ selectedWatchlist.name }}</span>
                  <h2 id="add-stocks-title">Add stocks</h2>
                </div>
                <button type="button" class="modal-close" aria-label="Close add stocks dialog" (click)="closeAddStocksDialog()">×</button>
              </header>
              <p class="modal-description">Search by company name or ticker, then add multiple stocks before saving.</p>
              <form class="stock-entry" (submit)="addStockFromInput($event)">
                <label for="stock-search">Stock name or ticker symbol</label>
                <div class="stock-entry-row">
                  <input id="stock-search" name="stockSearch" type="text" autocomplete="off"
                    placeholder="e.g. Apple or AAPL" [value]="stockSearchText"
                    (input)="updateStockSearch($event)">
                  <button type="submit" class="save-button" [disabled]="!stockSearchText.trim()">Add</button>
                </div>
              </form>
              <div class="stock-suggestions" *ngIf="stockSuggestions.length">
                <span class="suggestion-label">Matching assets</span>
                <button type="button" class="suggestion-item" *ngFor="let suggestion of stockSuggestions"
                  (click)="stageStock(suggestion)">
                  <span><strong>{{ suggestion.symbol }}</strong><small>{{ suggestion.name }}</small></span>
                  <span class="suggestion-add">＋ Add</span>
                </button>
              </div>
              <p class="sample-warning">Manually entered symbols are saved with placeholder price and performance until market data is connected.</p>
              <div class="staged-heading"><strong>Stocks to add</strong><span>{{ stagedStocks.length }} selected</span></div>
              <div class="staged-list" *ngIf="stagedStocks.length; else noStagedStocks">
                <div class="staged-row" *ngFor="let stock of stagedStocks; let index = index">
                  <span><strong>{{ stock.symbol }}</strong><small>{{ stock.name }}</small></span>
                  <button type="button" class="remove-staged" [attr.aria-label]="'Remove ' + stock.symbol"
                    (click)="removeStagedStock(index)">Remove</button>
                </div>
              </div>
              <ng-template #noStagedStocks><p class="empty-staged">No stocks added yet.</p></ng-template>
              <p class="modal-error" *ngIf="addStocksMessage" role="status">{{ addStocksMessage }}</p>
              <footer class="modal-actions">
                <button type="button" class="tool-button" (click)="closeAddStocksDialog()">Cancel</button>
                <button type="button" class="save-button" [disabled]="stagedStocks.length === 0" (click)="saveStagedStocks()">
                  Save {{ stagedStocks.length }} {{ stagedStocks.length === 1 ? 'stock' : 'stocks' }}
                </button>
              </footer>
            </section>
          </div>

          <div class="modal-backdrop" *ngIf="addWatchlistDialogOpen" (click)="closeAddWatchlistDialog()">
            <section class="columns-modal create-watchlist-modal" role="dialog" aria-modal="true"
              aria-labelledby="create-watchlist-title" (click)="$event.stopPropagation()" (keydown.escape)="closeAddWatchlistDialog()">
              <header class="modal-header">
                <div>
                  <span class="eyebrow">{{ selectedMarket }} watchlists</span>
                  <h2 id="create-watchlist-title">Create watchlist</h2>
                </div>
                <button type="button" class="modal-close" aria-label="Close create watchlist dialog" (click)="closeAddWatchlistDialog()">×</button>
              </header>
              <p class="modal-description">Create a named list for this market. You can add stocks after saving.</p>
              <form class="stock-entry" (submit)="saveNewWatchlist()">
                <label for="new-watchlist-name">Watchlist name</label>
                <input id="new-watchlist-name" name="watchlistName" type="text" maxlength="40"
                  placeholder="e.g. Long-term ideas" [value]="newWatchlistName"
                  (input)="updateWatchlistName($event)">
              </form>
              <p class="modal-error" *ngIf="newWatchlistMessage" role="status">{{ newWatchlistMessage }}</p>
              <footer class="modal-actions">
                <button type="button" class="tool-button" (click)="closeAddWatchlistDialog()">Cancel</button>
                <button type="button" class="save-button" [disabled]="!newWatchlistName.trim()"
                  (click)="saveNewWatchlist()">Save watchlist</button>
              </footer>
            </section>
          </div>

          <p class="status-message" role="status" aria-live="polite" *ngIf="statusMessage">{{ statusMessage }}</p>

          <div class="table-wrap">
            <table>
              <thead>
                <tr><th *ngFor="let column of visibleColumns">{{ column.label }}</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of paginatedItems">
                  <td *ngFor="let column of visibleColumns" [ngSwitch]="column.key">
                    <span *ngSwitchCase="'symbol'" class="symbol-cell">
                      <strong>{{ item.symbol }}</strong>
                      <button type="button" class="star-symbol-button"
                        [class.is-favorite]="isFavoriteSymbol(item)"
                        [attr.aria-pressed]="isFavoriteSymbol(item)"
                        [attr.aria-label]="isFavoriteSymbol(item) ? 'Remove ' + item.symbol + ' from favorites' : 'Add ' + item.symbol + ' to favorites'"
                        (click)="toggleFavoriteSymbol(item)">{{ isFavoriteSymbol(item) ? '★' : '☆' }}</button>
                    </span>
                    <span *ngSwitchCase="'price'">{{ item.price === undefined ? '—' : (item.price | currency:selectedWatchlist.currency:'symbol':'1.2-2') }}</span>
                    <span *ngSwitchCase="'change'" [ngClass]="item.change === undefined ? '' : item.change >= 0 ? 'text-success' : 'text-danger'">
                      {{ item.change === undefined ? '—' : (item.change > 0 ? '+' : '') + item.change + '%' }}
                    </span>
                    <span *ngSwitchCase="'trend'" class="badge"
                      [ngClass]="item.trend === 'Bullish' ? 'up' : item.trend === 'Bearish' ? 'down' : 'neutral'">{{ item.trend ?? '—' }}</span>
                    <span *ngSwitchDefault>{{ getColumnValue(item, column.key) }}</span>
                  </td>
                </tr>
                <tr *ngIf="paginatedItems.length === 0">
                  <td [attr.colspan]="visibleColumns.length" class="empty-state">
                    {{ isLoadingWatchlists ? 'Loading watchlist items…' : 'No assets in this watchlist.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination" aria-label="Watchlist pagination">
            <span aria-live="polite">Showing {{ startIndex + 1 }}–{{ endIndex }} of {{ selectedWatchlist.items.length }}</span>
            <div class="pagination-actions">
              <button type="button" (click)="previousPage()" [disabled]="currentPage === 1" aria-label="Previous page">Previous</button>
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <button type="button" (click)="nextPage()" [disabled]="currentPage === totalPages" aria-label="Next page">Next</button>
            </div>
          </div>
        </section>
      </div>
    </app-shell>
  `,
})
export class WatchlistsComponent {
  readonly pageSize = 15;
  readonly availableColumns: WatchlistColumn[] = [
    { key: 'symbol', label: 'Symbol', group: 'Overview' },
    { key: 'name', label: 'Asset name', group: 'Overview' },
    { key: 'assetType', label: 'Asset type', group: 'Overview' },
    { key: 'price', label: 'Price', group: 'Market data' },
    { key: 'change', label: 'Change %', group: 'Market data' },
    { key: 'trend', label: 'Trend', group: 'Technical' },
    { key: 'sector', label: 'Sector / industry', group: 'Overview' },
    { key: 'score', label: 'Quality score', group: 'Overview' },
    { key: 'volume', label: 'Volume', group: 'Market data' },
    { key: 'open', label: 'Open', group: 'Market data' },
    { key: 'previousClose', label: 'Previous close', group: 'Market data' },
    { key: 'dayHigh', label: 'Day high', group: 'Market data' },
    { key: 'dayLow', label: 'Day low', group: 'Market data' },
    { key: 'marketCap', label: 'Market capitalization', group: 'Market data' },
    { key: 'changeAmount', label: 'Price change', group: 'Market data' },
    { key: 'averageVolume', label: 'Average volume', group: 'Market data' },
    { key: 'relativeVolume', label: 'Relative volume', group: 'Market data' },
    { key: 'peRatio', label: 'P/E ratio (TTM)', group: 'Fundamentals' },
    { key: 'forwardPE', label: 'Forward P/E', group: 'Fundamentals' },
    { key: 'eps', label: 'EPS (TTM)', group: 'Fundamentals' },
    { key: 'pegRatio', label: 'PEG ratio', group: 'Fundamentals' },
    { key: 'priceToBook', label: 'Price / book', group: 'Fundamentals' },
    { key: 'priceToSales', label: 'Price / sales', group: 'Fundamentals' },
    { key: 'dividendYield', label: 'Dividend yield', group: 'Fundamentals' },
    { key: 'roe', label: 'Return on equity', group: 'Fundamentals' },
    { key: 'roa', label: 'Return on assets', group: 'Fundamentals' },
    { key: 'grossMargin', label: 'Gross margin', group: 'Fundamentals' },
    { key: 'operatingMargin', label: 'Operating margin', group: 'Fundamentals' },
    { key: 'profitMargin', label: 'Profit margin', group: 'Fundamentals' },
    { key: 'debtToEquity', label: 'Debt / equity', group: 'Fundamentals' },
    { key: 'revenueGrowth', label: 'Revenue growth', group: 'Fundamentals' },
    { key: 'earningsGrowth', label: 'Earnings growth', group: 'Fundamentals' },
    { key: 'freeCashFlow', label: 'Free cash flow', group: 'Fundamentals' },
    { key: 'analystTarget', label: 'Analyst target', group: 'Fundamentals' },
    { key: 'week52High', label: '52-week high', group: 'Technical' },
    { key: 'week52Low', label: '52-week low', group: 'Technical' },
    { key: 'movingAverage50', label: '50-day moving average', group: 'Technical' },
    { key: 'movingAverage200', label: '200-day moving average', group: 'Technical' },
    { key: 'rsi14', label: 'RSI (14)', group: 'Technical' },
    { key: 'macd', label: 'MACD', group: 'Technical' },
    { key: 'macdSignal', label: 'MACD signal', group: 'Technical' },
    { key: 'beta', label: 'Beta (5Y monthly)', group: 'Risk' },
    { key: 'shortFloat', label: 'Short float', group: 'Risk' },
    { key: 'nextEarnings', label: 'Next earnings date', group: 'Events' },
    { key: 'currency', label: 'Currency', group: 'Profile' },
    { key: 'exchange', label: 'Exchange', group: 'Profile' },
    { key: 'country', label: 'Country', group: 'Profile' },
    { key: 'industry', label: 'Industry', group: 'Profile' },
    { key: 'description', label: 'Company description', group: 'Profile' },
    { key: 'updatedAt', label: 'Profile updated', group: 'Profile' },
    { key: 'profileId', label: 'Profile ID', group: 'Profile' },
  ];
  readonly columnGroups = [...new Set(this.availableColumns.map((column) => column.group))];
  visibleColumnKeys: WatchlistColumnKey[] = ['symbol', 'name', 'assetType', 'price', 'change', 'trend'];
  draftColumnKeys: WatchlistColumnKey[] = [];
  watchlists: WatchlistGroup[] = [];
  private favoriteWatchlistKeys = new Set<string>();
  private favoriteSymbolsByMarket: Record<WatchlistMarket, Set<string>> = { US: new Set(), India: new Set() };
  selectedMarket: WatchlistMarket = 'US';
  selectedWatchlistId = '';
  watchlistDropdownOpen = false;
  currentPage = 1;
  columnsEditorOpen = false;
  addStocksDialogOpen = false;
  stockSearchText = '';
  stagedStocks: WatchlistItem[] = [];
  addStocksMessage = '';
  addWatchlistDialogOpen = false;
  newWatchlistName = '';
  newWatchlistMessage = '';
  columnEditorMessage = '';
  statusMessage = '';
  isImporting = false;
  isLoadingProfiles = false;
  isLoadingWatchlists = false;
  watchlistPage = 0;
  watchlistTotalPages = 0;
  private watchlistRequestId = 0;
  private readonly watchlistPageSize = 15;
  readonly favoritesListId = FAVORITES_LIST_ID;

  constructor(
    private readonly watchlistImportService: WatchlistImportService,
    private readonly watchlistsService: WatchlistsService,
    private readonly fmpProfilesService: FmpProfilesService,
  ) {
    this.loadFavorites();
    this.loadColumnPreferences();
    this.loadWatchlists(this.selectedMarket);
  }

  get selectedWatchlist(): WatchlistGroup {
    if (this.isFavoritesList) {
      const favoriteSymbols = this.favoriteSymbolsByMarket[this.selectedMarket];
      return {
        id: FAVORITES_LIST_ID,
        name: 'Favorites',
        market: this.selectedMarket,
        currency: this.selectedMarket === 'US' ? 'USD' : 'INR',
        items: this.watchlists.flatMap((watchlist) => watchlist.items)
          .filter((item, index, items) => favoriteSymbols.has(item.symbol)
            && items.findIndex((candidate) => candidate.symbol === item.symbol) === index),
      };
    }
    return this.watchlists.find((watchlist) => watchlist.id === this.selectedWatchlistId)
      ?? this.watchlists[0]
      ?? {
        id: '',
        name: this.isLoadingWatchlists ? 'Loading watchlists…' : 'No watchlists',
        market: this.selectedMarket,
        currency: this.selectedMarket === 'US' ? 'USD' : 'INR',
        items: [],
      };
  }

  get favoriteWatchlists(): WatchlistGroup[] {
    return this.watchlists.filter((watchlist) => this.isFavoriteWatchlist(watchlist));
  }

  get otherWatchlists(): WatchlistGroup[] {
    return this.watchlists.filter((watchlist) => !this.isFavoriteWatchlist(watchlist));
  }

  get hasFavoriteSymbols(): boolean {
    return this.favoriteSymbolsByMarket[this.selectedMarket].size > 0;
  }

  get isFavoritesList(): boolean {
    return this.selectedWatchlistId === FAVORITES_LIST_ID;
  }

  get visibleColumns(): WatchlistColumn[] {
    return this.visibleColumnKeys
      .map((key) => this.availableColumns.find((column) => column.key === key))
      .filter((column): column is WatchlistColumn => column !== undefined);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.selectedWatchlist.items.length / this.pageSize));
  }

  get startIndex(): number {
    return this.selectedWatchlist.items.length ? (this.currentPage - 1) * this.pageSize : 0;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.selectedWatchlist.items.length);
  }

  get paginatedItems(): WatchlistItem[] {
    return this.selectedWatchlist.items.slice(this.startIndex, this.endIndex);
  }

  get stockSuggestions(): WatchlistItem[] {
    const query = this.stockSearchText.trim().toLowerCase();
    if (query.length < 2) {
      return [];
    }
    return this.watchlists.flatMap((watchlist) => watchlist.items)
      .filter((item, index, items) => {
        const matches = item.symbol.toLowerCase().includes(query) || item.name.toLowerCase().includes(query);
        const unique = items.findIndex((candidate) => candidate.symbol === item.symbol) === index;
        const alreadyAdded = this.selectedWatchlist.items.some((current) => current.symbol === item.symbol)
          || this.stagedStocks.some((staged) => staged.symbol === item.symbol);
        return matches && unique && !alreadyAdded;
      })
      .slice(0, 6);
  }

  selectMarket(market: WatchlistMarket): void {
    if (market !== this.selectedMarket) {
      this.selectedMarket = market;
      this.watchlistPage = 0;
      this.loadWatchlists(market, 0);
      this.statusMessage = '';
    }
  }

  selectWatchlist(id: string): void {
    this.selectedWatchlistId = id;
    this.currentPage = 1;
    this.watchlistDropdownOpen = false;
    this.statusMessage = '';
  }

  selectFavoriteWatchlist(id: string): void {
    this.selectedWatchlistId = id;
    this.currentPage = 1;
    this.statusMessage = '';
  }

  isFavoriteWatchlist(watchlist: WatchlistGroup): boolean {
    return this.favoriteWatchlistKeys.has(this.watchlistKey(watchlist));
  }

  toggleFavoriteWatchlist(watchlist: WatchlistGroup): void {
    const key = this.watchlistKey(watchlist);
    if (this.favoriteWatchlistKeys.has(key)) {
      this.favoriteWatchlistKeys.delete(key);
      this.statusMessage = `${watchlist.name} removed from favorites.`;
    } else {
      this.favoriteWatchlistKeys.add(key);
      this.statusMessage = `${watchlist.name} added to favorites.`;
    }
    this.persistFavorites();
  }

  openAddStocksDialog(): void {
    if (this.isFavoritesList) {
      this.statusMessage = 'Select a watchlist before adding stocks.';
      return;
    }
    this.stockSearchText = '';
    this.stagedStocks = [];
    this.addStocksMessage = '';
    this.addStocksDialogOpen = true;
  }

  closeAddStocksDialog(): void {
    this.addStocksDialogOpen = false;
    this.addStocksMessage = '';
  }

  updateStockSearch(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.stockSearchText = event.target.value;
      this.addStocksMessage = '';
    }
  }

  addStockFromInput(event: Event): void {
    event.preventDefault();
    const query = this.stockSearchText.trim();
    if (!query) {
      return;
    }
    const match = this.watchlists.flatMap((watchlist) => watchlist.items)
      .find((item) => item.symbol.toLowerCase() === query.toLowerCase()
        || item.name.toLowerCase() === query.toLowerCase());
    if (match) {
      this.stageStock(match);
      return;
    }
    const symbol = query.toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z0-9.-]{1,15}$/.test(symbol)) {
      this.addStocksMessage = 'Enter a ticker symbol or choose a matching asset from the suggestions.';
      return;
    }
    const duplicate = this.selectedWatchlist.items.some((item) => item.symbol === symbol)
      || this.stagedStocks.some((item) => item.symbol === symbol);
    if (duplicate) {
      this.addStocksMessage = `${symbol} is already in this watchlist or the pending list.`;
      return;
    }
    this.stageStock({
      symbol,
      name: symbol,
      price: 0,
      change: 0,
      trend: 'Neutral',
      assetType: 'Stock',
      sector: '—',
      volume: '—',
    });
  }

  stageStock(item: WatchlistItem): void {
    const duplicate = this.selectedWatchlist.items.some((current) => current.symbol === item.symbol)
      || this.stagedStocks.some((current) => current.symbol === item.symbol);
    if (duplicate) {
      this.addStocksMessage = `${item.symbol} is already in this watchlist or the pending list.`;
      return;
    }
    this.stagedStocks = [...this.stagedStocks, { ...item }];
    this.stockSearchText = '';
    this.addStocksMessage = '';
  }

  removeStagedStock(index: number): void {
    this.stagedStocks = this.stagedStocks.filter((_, itemIndex) => itemIndex !== index);
  }

  openAddWatchlistDialog(): void {
    this.watchlistDropdownOpen = false;
    this.newWatchlistName = '';
    this.newWatchlistMessage = '';
    this.addWatchlistDialogOpen = true;
  }

  closeAddWatchlistDialog(): void {
    this.addWatchlistDialogOpen = false;
    this.newWatchlistMessage = '';
  }

  updateWatchlistName(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.newWatchlistName = event.target.value;
      this.newWatchlistMessage = '';
    }
  }

  saveNewWatchlist(): void {
    const name = this.newWatchlistName.trim();
    if (!name) {
      this.newWatchlistMessage = 'Enter a name for the watchlist.';
      return;
    }
    if (this.watchlists.some((watchlist) => watchlist.name.toLowerCase() === name.toLowerCase())) {
      this.newWatchlistMessage = 'A watchlist with this name already exists for the selected market.';
      return;
    }
    const newWatchlist: WatchlistGroup = {
      id: `custom-${Date.now()}`,
      name,
      market: this.selectedMarket,
      currency: this.selectedMarket === 'US' ? 'USD' : 'INR',
      items: [],
    };
    this.watchlists = [...this.watchlists, newWatchlist];
    this.selectedWatchlistId = newWatchlist.id;
    this.currentPage = 1;
    this.addWatchlistDialogOpen = false;
    this.newWatchlistMessage = '';
    this.statusMessage = `${name} added in this session. This backend currently only supports loading and importing watchlists.`;
  }

  saveStagedStocks(): void {
    if (this.isFavoritesList || this.stagedStocks.length === 0) {
      return;
    }
    const updatedWatchlist: WatchlistGroup = {
      ...this.selectedWatchlist,
      items: [...this.selectedWatchlist.items, ...this.stagedStocks],
    };
    const updatedWatchlists = this.watchlists.map((watchlist) =>
      watchlist.id === updatedWatchlist.id ? updatedWatchlist : watchlist,
    );
    this.watchlists = updatedWatchlists;
    const addedCount = this.stagedStocks.length;
    this.currentPage = Math.ceil(updatedWatchlist.items.length / this.pageSize);
    this.stagedStocks = [];
    this.addStocksDialogOpen = false;
    this.statusMessage = `${addedCount} ${addedCount === 1 ? 'stock' : 'stocks'} added to ${updatedWatchlist.name} for this session only.`;
  }

  columnLabel(key: WatchlistColumnKey): string {
    return this.availableColumns.find((column) => column.key === key)?.label ?? key;
  }

  isFavoriteSymbol(item: WatchlistItem): boolean {
    return this.favoriteSymbolsByMarket[this.selectedMarket].has(item.symbol);
  }

  toggleFavoriteSymbol(item: WatchlistItem): void {
    const favorites = this.favoriteSymbolsByMarket[this.selectedMarket];
    if (favorites.has(item.symbol)) {
      favorites.delete(item.symbol);
      this.statusMessage = `${item.symbol} removed from favorites.`;
    } else {
      favorites.add(item.symbol);
      this.statusMessage = `${item.symbol} added to favorites.`;
    }
    if (this.isFavoritesList && favorites.size === 0) {
      this.selectedWatchlistId = this.watchlists[0]?.id ?? '';
      this.currentPage = 1;
    }
    this.persistFavorites();
  }

  columnsForGroup(group: string): WatchlistColumn[] {
    return this.availableColumns.filter((column) => column.group === group);
  }

  openColumnEditor(): void {
    this.draftColumnKeys = [...this.visibleColumnKeys];
    this.columnEditorMessage = '';
    this.columnsEditorOpen = true;
  }

  isDraftColumnVisible(key: WatchlistColumnKey): boolean {
    return this.draftColumnKeys.includes(key);
  }

  toggleDraftColumn(key: WatchlistColumnKey, event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    if (event.target.checked) {
      if (!this.draftColumnKeys.includes(key)) {
        this.draftColumnKeys = [...this.draftColumnKeys, key];
      }
      this.columnEditorMessage = '';
      return;
    }
    if (this.draftColumnKeys.length === 1) {
      event.target.checked = true;
      this.columnEditorMessage = 'Select at least one column.';
      return;
    }
    this.draftColumnKeys = this.draftColumnKeys.filter((draftKey) => draftKey !== key);
    this.columnEditorMessage = '';
  }

  moveDraftColumn(index: number, direction: -1 | 1): void {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.draftColumnKeys.length) {
      return;
    }
    const reordered = [...this.draftColumnKeys];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    this.draftColumnKeys = reordered;
  }

  saveColumnPreferences(): void {
    if (!this.draftColumnKeys.length) {
      this.columnEditorMessage = 'Select at least one column before saving.';
      return;
    }
    this.visibleColumnKeys = [...this.draftColumnKeys];
    localStorage.setItem(WATCHLIST_COLUMNS_STORAGE_KEY, JSON.stringify(this.visibleColumnKeys));
    this.columnsEditorOpen = false;
    this.columnEditorMessage = '';
    this.statusMessage = `${this.visibleColumnKeys.length} columns applied to the watchlist.`;
  }

  cancelColumnEditor(): void {
    this.columnsEditorOpen = false;
    this.columnEditorMessage = '';
  }

  getColumnValue(item: WatchlistItem, key: WatchlistColumnKey): string | number {
    switch (key) {
      case 'symbol': return item.symbol;
      case 'name': return item.name;
      case 'assetType': return item.assetType ?? '—';
      case 'price': return item.price ?? '—';
      case 'change': return item.change ?? '—';
      case 'trend': return item.trend ?? '—';
      case 'sector': return item.sector ?? '—';
      case 'score': return item.score ?? '—';
      case 'volume': return item.volume ?? '—';
      case 'changeAmount':
      case 'currency':
      case 'exchange':
      case 'country':
      case 'industry':
      case 'description':
      case 'updatedAt':
      case 'profileId':
      case 'open':
      case 'previousClose':
      case 'dayHigh':
      case 'dayLow':
      case 'marketCap':
      case 'averageVolume':
      case 'relativeVolume':
      case 'peRatio':
      case 'forwardPE':
      case 'eps':
      case 'pegRatio':
      case 'priceToBook':
      case 'priceToSales':
      case 'dividendYield':
      case 'roe':
      case 'roa':
      case 'grossMargin':
      case 'operatingMargin':
      case 'profitMargin':
      case 'debtToEquity':
      case 'revenueGrowth':
      case 'earningsGrowth':
      case 'freeCashFlow':
      case 'analystTarget':
      case 'week52High':
      case 'week52Low':
      case 'movingAverage50':
      case 'movingAverage200':
      case 'rsi14':
      case 'macd':
      case 'macdSignal':
      case 'beta':
      case 'shortFloat':
      case 'nextEarnings':
        return item.metrics?.[key] ?? this.profileMetric(item, key) ?? '—';
    }
  }

  previousPage(): void {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage(): void {
    this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
  }

  previousWatchlistPage(): void {
    if (this.watchlistPage > 0) {
      this.loadWatchlists(this.selectedMarket, this.watchlistPage - 1);
    }
  }

  nextWatchlistPage(): void {
    if (this.watchlistPage + 1 < this.watchlistTotalPages) {
      this.loadWatchlists(this.selectedMarket, this.watchlistPage + 1);
    }
  }

  loadFmpProfiles(): void {
    if (this.selectedMarket !== 'US') {
      this.statusMessage = 'FMP Basic profiles are available only for US-exchange symbols.';
      return;
    }
    const watchlist = this.selectedWatchlist;
    const symbols = [...new Set(watchlist.items
      .map((item) => item.symbol.trim().toUpperCase())
      .filter((symbol) => symbol && !/(\.NS|\.BO)$/i.test(symbol)))];
    if (!symbols.length) {
      this.statusMessage = 'The selected watchlist has no supported US symbols to look up.';
      return;
    }

    const selectedWatchlistId = this.selectedWatchlistId;
    const selectedMarket = this.selectedMarket;
    this.isLoadingProfiles = true;
    this.statusMessage = `Loading FMP profiles for ${symbols.length} symbols…`;
    this.fmpProfilesService.getProfiles(symbols).subscribe({
      next: (result) => {
        try {
          const profiles = this.parseFmpProfiles(result);
          if (selectedMarket !== this.selectedMarket || selectedWatchlistId !== this.selectedWatchlistId) {
            this.statusMessage = 'Profiles loaded, but the selected watchlist changed before the response arrived. Select the original watchlist and load profiles again.';
            return;
          }
          const profilesBySymbol = new Map(profiles.map((profile) => [profile.symbol.trim().toUpperCase(), profile]));
          const isFavoritesSelection = selectedWatchlistId === this.favoritesListId;
          const matchedItemCount = this.watchlists
            .filter((list) => isFavoritesSelection ? list.market === 'US' : list.id === selectedWatchlistId)
            .flatMap((list) => list.items)
            .filter((item) => profilesBySymbol.has(item.symbol.trim().toUpperCase())).length;
          const matchedSymbols = [...profilesBySymbol.keys()].filter((symbol) =>
            this.watchlists
              .filter((list) => isFavoritesSelection ? list.market === 'US' : list.id === selectedWatchlistId)
              .some((list) => list.items.some((item) => item.symbol.trim().toUpperCase() === symbol)));
          this.watchlists = this.watchlists.map((list) => (selectedWatchlistId === this.favoritesListId
            ? list.market === 'US'
            : list.id === selectedWatchlistId)
            ? {
              ...list,
              items: list.items.map((item) => {
                const profile = profilesBySymbol.get(item.symbol.trim().toUpperCase());
                return profile ? this.applyFmpProfile(item, profile) : item;
              }),
            }
            : list);
          if (matchedItemCount > 0) {
            const profileColumns: WatchlistColumnKey[] = [
              'name', 'price', 'change', 'sector', 'volume', 'marketCap', 'changeAmount',
              'currency', 'exchange', 'country', 'industry', 'description', 'updatedAt',
            ];
            this.visibleColumnKeys = [
              ...this.visibleColumnKeys,
              ...profileColumns.filter((key) => !this.visibleColumnKeys.includes(key)),
            ];
          }
          const returnedSymbols = new Set(profilesBySymbol.keys());
          const missingSymbols = symbols.filter((symbol) => !returnedSymbols.has(symbol));
          const displayedProfileFields = [
            'companyName', 'price', 'changePercentage', 'marketCap', 'currency', 'exchange',
            'country', 'sector', 'industry', 'volume', 'description', 'updatedAt',
          ].filter((field) => profiles.some((profile) => {
            const value = profile[field as keyof FmpProfile];
            return value !== undefined && value !== null && value !== '';
          }));
          console.info('[FMP Profiles] Watchlist mapping complete', {
            selectedWatchlist: this.selectedWatchlist.name,
            requestedProfileCount: symbols.length,
            receivedProfileCount: profiles.length,
            matchedRowCount: matchedItemCount,
            matchedSymbols,
            requestedWithoutProfiles: missingSymbols,
            profileFieldsWithValues: displayedProfileFields,
            visibleColumns: this.visibleColumnKeys,
          });
          this.statusMessage = `Received ${profiles.length} of ${symbols.length} requested profiles; updated ${matchedItemCount} matching watchlist rows.`
            + (missingSymbols.length ? ` No profile returned for: ${missingSymbols.join(', ')}.` : '');
          if (profiles.length > 0 && matchedItemCount === 0) {
            this.statusMessage += ' Returned profile symbols did not match items in the selected watchlist.';
            console.warn('[FMP Profiles] No returned profile symbols matched items in the selected watchlist.', {
              requestedSymbols: symbols,
              returnedSymbols: [...returnedSymbols],
            });
          } else if (matchedItemCount > 0 && displayedProfileFields.length === 0) {
            this.statusMessage += ' Profiles matched symbols, but the response has no values for the supported display fields.';
            console.warn('[FMP Profiles] Profiles matched rows but supported display fields are empty.', {
              returnedSymbols: [...returnedSymbols],
            });
          }
        } catch (error) {
          console.error('[FMP Profiles] Invalid response or profile data', error);
          this.statusMessage = error instanceof Error ? error.message : 'The profile service returned invalid data.';
        } finally {
          this.isLoadingProfiles = false;
        }
      },
      error: (error: unknown) => {
        console.error('[FMP Profiles] Unable to load profiles', error);
        this.statusMessage = this.fmpProfileErrorMessage(error);
        this.isLoadingProfiles = false;
      },
    });
  }

  private parseFmpProfiles(result: unknown): FmpProfile[] {
    if (!Array.isArray(result)) {
      throw new Error('The profile service returned an unexpected response. Expected an array of profiles.');
    }
    return result.map((entry, index) => {
      if (typeof entry !== 'object' || entry === null || !('symbol' in entry) || typeof entry.symbol !== 'string') {
        throw new Error(`The profile service returned an invalid profile at position ${index + 1}.`);
      }
      return entry as FmpProfile;
    });
  }

  private applyFmpProfile(item: WatchlistItem, profile: FmpProfile): WatchlistItem {
    const rawData = this.parseRawProfilePayload(profile.rawPayload, profile.symbol);
    const profileData = this.flattenProfileData({ ...rawData, ...profile });
    const metricAliases: Partial<Record<WatchlistMetricKey, string[]>> = {
      marketCap: ['marketcap', 'mktcap'],
      changeAmount: ['change'],
      currency: ['currency'],
      exchange: ['exchange', 'exchangeshortname'],
      country: ['country'],
      industry: ['industry'],
      description: ['description'],
      updatedAt: ['updatedat'],
      profileId: ['id'],
      averageVolume: ['averagevolume', 'volavg'],
      beta: ['beta'],
    };
    const metrics: Partial<Record<WatchlistMetricKey, string | number>> = { ...item.metrics };
    for (const [metric, aliases] of Object.entries(metricAliases) as [WatchlistMetricKey, string[]][]) {
      const match = Object.entries(profileData).find(([key]) => aliases.includes(this.normalizeProfileKey(key)));
      if (match) {
        metrics[metric] = match[1];
      }
    }
    const price = this.profileNumber(profile.price ?? rawData['price']);
    const changePercentage = this.profileNumber(profile.changePercentage ?? rawData['changesPercentage'] ?? rawData['changePercentage']);
    const companyName = this.profileString(profile.companyName ?? rawData['companyName']);
    const sector = this.profileString(profile.sector ?? rawData['sector']);
    const volume = this.profileNumber(profile.volume ?? rawData['volume']);
    return {
      ...item,
      symbol: profile.symbol.toUpperCase(),
      name: companyName ?? item.name,
      price: price ?? item.price,
      change: changePercentage ?? item.change,
      sector: sector ?? item.sector,
      volume: volume === undefined ? item.volume : String(volume),
      metrics,
      profileData,
    };
  }

  private parseRawProfilePayload(rawPayload: unknown, symbol: string): Record<string, unknown> {
    if (typeof rawPayload === 'string') {
      try {
        const parsed: unknown = JSON.parse(rawPayload);
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
          ? parsed as Record<string, unknown>
          : {};
      } catch (error) {
        console.warn(`[FMP Profiles] Could not parse rawPayload for ${symbol}`, error);
        return {};
      }
    }
    return typeof rawPayload === 'object' && rawPayload !== null && !Array.isArray(rawPayload)
      ? rawPayload as Record<string, unknown>
      : {};
  }

  private flattenProfileData(value: Record<string, unknown>, prefix = ''): Record<string, string | number> {
    const data: Record<string, string | number> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (key === 'rawPayload' || entry === null || entry === undefined) {
        continue;
      }
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof entry === 'string' || typeof entry === 'number') {
        data[path] = entry;
      } else if (typeof entry === 'object' && !Array.isArray(entry)) {
        Object.assign(data, this.flattenProfileData(entry as Record<string, unknown>, path));
      }
    }
    return data;
  }

  private normalizeProfileKey(key: string): string {
    return key.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() ?? '';
  }

  private profileMetric(item: WatchlistItem, key: WatchlistMetricKey): string | number | undefined {
    const aliases: Partial<Record<WatchlistMetricKey, string[]>> = {
      marketCap: ['mktcap'],
      averageVolume: ['volavg'],
      analystTarget: ['analysttargetprice'],
      nextEarnings: ['earningsannouncement'],
    };
    const acceptedKeys = [this.normalizeProfileKey(key), ...(aliases[key] ?? [])];
    const entry = Object.entries(item.profileData ?? {}).find(([profileKey]) =>
      acceptedKeys.includes(this.normalizeProfileKey(profileKey)));
    return entry?.[1];
  }

  private profileNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  }

  private profileString(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() ? value : undefined;
  }

  private fmpProfileErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return error instanceof Error ? error.message : 'Unable to load FMP profiles.';
    }
    switch (error.status) {
      case 0: return 'Could not reach the FMP profile service. Check the backend on port 8082.';
      case 400: return 'The profile request contains an invalid or unsupported symbol. Only US-exchange symbols are supported.';
      case 404: return 'The profile service did not find a profile for one or more requested symbols.';
      case 429: return 'The FMP daily request quota has been exhausted. Try again after the quota resets.';
      case 502: return 'The profile backend could not retrieve data from FMP. Try again later.';
      case 503: return 'The FMP profile service is not configured on the backend.';
      default: return `Unable to load FMP profiles (HTTP ${error.status}).`;
    }
  }

  exportCsv(): void {
    const records = [
      [this.selectedWatchlist.name],
      ...this.selectedWatchlist.items.map((item) => [item.symbol]),
    ];
    const csv = records.map((record) => record.map((value) => this.csvEscape(value)).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${this.selectedMarket.toLowerCase()}-${this.selectedWatchlist.id}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    this.statusMessage = `${this.selectedWatchlist.items.length} assets exported as CSV.`;
  }

  importCsv(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const input = event.target;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > MAX_IMPORT_FILE_SIZE_BYTES) {
      this.statusMessage = 'CSV files must be 5 MB or smaller.';
      input.value = '';
      return;
    }
    const market: WatchlistImportMarket = this.selectedMarket === 'US' ? 'USA' : 'India';
    this.isImporting = true;
    this.statusMessage = `Uploading ${file.name} to ${market} watchlists…`;
    this.watchlistImportService.importWatchlists(file, market).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = event.total ? Math.round((event.loaded / event.total) * 100) : undefined;
          this.statusMessage = percent === undefined
            ? `Uploading ${file.name} to ${market} watchlists…`
            : `Uploading ${file.name}: ${percent}%`;
          return;
        }
        if (event instanceof HttpResponse) {
          const response = event.body;
          if (!response) {
            this.statusMessage = 'The server returned an empty import response. Check the backend logs.';
            console.error('[Watchlist CSV Import] Server returned an empty response body', {
              status: event.status,
              url: event.url,
            });
          } else {
            const names = response.watchlistNames.length ? ` Watchlists: ${response.watchlistNames.join(', ')}.` : '';
            this.statusMessage = `Imported ${response.watchlistsCreated} watchlists and ${response.itemsCreated} symbols into ${market}.${names}`;
            this.loadWatchlists(this.selectedMarket, this.watchlistPage, true);
          }
          this.isImporting = false;
          input.value = '';
        }
      },
      error: (error: unknown) => {
        this.statusMessage = this.importErrorMessage(error);
        console.error('[Watchlist CSV Import] UI import failed', error);
        this.isImporting = false;
        input.value = '';
      },
      complete: () => {
        if (this.isImporting) {
          this.statusMessage = 'The upload ended without a server response. Check the browser console and backend logs.';
          console.error('[Watchlist CSV Import] Request completed without a response event');
          this.isImporting = false;
          input.value = '';
        }
      },
    });
  }

  private importErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return error instanceof Error && error.name === 'TimeoutError'
        ? 'The server did not respond within 120 seconds. Check that the backend is running and inspect its logs.'
        : error instanceof Error ? error.message : 'Unable to import this CSV file.';
    }
    if (error.status === 0) {
      return 'Unable to reach the watchlist service. Check that the backend is running and try again.';
    }
    if (error.status === 413) {
      return 'The CSV file is larger than the 5 MB limit.';
    }
    const payload: unknown = error.error;
    if (typeof payload === 'string' && payload.trim()) {
      return payload;
    }
    if (typeof payload === 'object' && payload !== null) {
      const errorPayload = payload as Record<string, unknown>;
      for (const key of ['message', 'error', 'detail', 'title']) {
        const message = errorPayload[key];
        if (typeof message === 'string' && message.trim()) {
          return message;
        }
      }
    }
    if (error.status === 400) {
      return 'The CSV could not be imported. Check the watchlist names, symbols, and CSV format.';
    }
    return `Unable to import this CSV file (HTTP ${error.status}).`;
  }

  private loadWatchlists(market: WatchlistMarket, page = 0, preserveStatusMessage = false): void {
    const requestId = ++this.watchlistRequestId;
    this.isLoadingWatchlists = true;
    this.watchlistPage = page;
    this.watchlists = [];
    this.selectedWatchlistId = '';
    this.watchlistTotalPages = 0;
    this.currentPage = 1;
    if (!preserveStatusMessage) {
      this.statusMessage = '';
    }

    this.watchlistsService.getWatchlists(page, this.watchlistPageSize, market).subscribe({
      next: (response) => {
        if (requestId !== this.watchlistRequestId) {
          return;
        }
        this.applyWatchlistPage(response, market);
      },
      error: (error: unknown) => {
        if (requestId !== this.watchlistRequestId) {
          return;
        }
        this.watchlists = [];
        this.selectedWatchlistId = '';
        this.isLoadingWatchlists = false;
        console.error('[Watchlists] Failed to load watchlists', error);
        this.statusMessage = error instanceof HttpErrorResponse && error.status === 0
          ? 'Unable to reach the watchlist service. Check that the backend is running.'
          : error instanceof HttpErrorResponse
            ? `Unable to load watchlists (HTTP ${error.status}).`
            : 'Unable to load watchlists. Please try again.';
      },
    });
  }

  private applyWatchlistPage(response: WatchlistPageResponse, market: WatchlistMarket): void {
    const watchlists: WatchlistGroup[] = response.content.map((watchlist) => ({
      id: String(watchlist.id),
      name: watchlist.name,
      market: watchlist.market,
      currency: watchlist.currency,
      items: watchlist.items.map((item) => ({
        symbol: item.symbol,
        name: item.name,
      })),
    }));
    const apiFavoriteSymbols = response.content.flatMap((watchlist) =>
      watchlist.items.filter((item) => item.isFavorite).map((item) => item.symbol));
    this.favoriteSymbolsByMarket[market] = new Set([
      ...this.favoriteSymbolsByMarket[market],
      ...apiFavoriteSymbols,
    ]);
    this.watchlists = watchlists;
    this.watchlistPage = response.page;
    this.watchlistTotalPages = response.totalPages;
    this.selectedWatchlistId = watchlists[0]?.id ?? '';
    this.isLoadingWatchlists = false;
    this.currentPage = 1;
  }

  private watchlistKey(watchlist: WatchlistGroup): string {
    return `${watchlist.market}:${watchlist.id}`;
  }

  private loadFavorites(): void {
    const favoriteWatchlists = this.readStoredStringArray(FAVORITE_WATCHLISTS_STORAGE_KEY);
    this.favoriteWatchlistKeys = new Set(favoriteWatchlists);
    const storedSymbols = this.readStoredRecord(FAVORITE_SYMBOLS_STORAGE_KEY);
    this.favoriteSymbolsByMarket = {
      US: new Set(storedSymbols.US ?? []),
      India: new Set(storedSymbols.India ?? []),
    };
  }

  private loadColumnPreferences(): void {
    const storedColumns = this.readStoredStringArray(WATCHLIST_COLUMNS_STORAGE_KEY);
    const validKeys = new Set(this.availableColumns.map((column) => column.key));
    const validStoredColumns = storedColumns.filter((key): key is WatchlistColumnKey => validKeys.has(key as WatchlistColumnKey));
    if (validStoredColumns.length) {
      this.visibleColumnKeys = validStoredColumns;
    }
  }

  private readStoredStringArray(key: string): string[] {
    const value = localStorage.getItem(key);
    if (!value) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) && parsed.every((entry) => typeof entry === 'string') ? parsed : [];
    } catch (error) {
      if (error instanceof SyntaxError) {
        return [];
      }
      throw error;
    }
  }

  private readStoredRecord(key: string): Partial<Record<WatchlistMarket, string[]>> {
    const value = localStorage.getItem(key);
    if (!value) {
      return {};
    }
    try {
      const parsed: unknown = JSON.parse(value);
      if (typeof parsed !== 'object' || parsed === null) {
        return {};
      }
      const record = parsed as Record<string, unknown>;
      return {
        US: Array.isArray(record['US']) && record['US'].every((item) => typeof item === 'string') ? record['US'] as string[] : [],
        India: Array.isArray(record['India']) && record['India'].every((item) => typeof item === 'string') ? record['India'] as string[] : [],
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {};
      }
      throw error;
    }
  }

  private persistFavorites(): void {
    localStorage.setItem(FAVORITE_WATCHLISTS_STORAGE_KEY, JSON.stringify([...this.favoriteWatchlistKeys]));
    localStorage.setItem(FAVORITE_SYMBOLS_STORAGE_KEY, JSON.stringify({
      US: [...this.favoriteSymbolsByMarket.US],
      India: [...this.favoriteSymbolsByMarket.India],
    }));
  }

  private csvEscape(value: string): string {
    return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  }
}
