import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WatchlistGroup, WatchlistItem, WatchlistMarket } from '../../core/models/wealth.models';
import { WealthService } from '../../core/services/wealth.service';
import { ShellComponent } from '../../shared/components/shell/shell.component';

type WatchlistColumnKey = 'symbol' | 'name' | 'assetType' | 'price' | 'change' | 'trend' | 'sector' | 'score' | 'volume';

interface WatchlistColumn {
  key: WatchlistColumnKey;
  label: string;
}

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
            <p>Monitor US and India assets from one page using the same watchlist workflow.</p>
          </div>
          <span class="sample-note">Prototype · illustrative sample data</span>
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
                aria-label="Choose watchlist CSV to import" (change)="importCsv($event)">
              <button class="tool-button" type="button" (click)="fileInput.click()">Import CSV</button>
              <button class="tool-button" type="button" (click)="exportCsv()">Export CSV</button>
              <button class="tool-button" type="button" [attr.aria-expanded]="columnsEditorOpen"
                aria-controls="columns-editor" (click)="columnsEditorOpen = !columnsEditorOpen">Edit columns</button>
            </div>
          </div>

          <div class="columns-editor" id="columns-editor" *ngIf="columnsEditorOpen">
            <p>Choose the columns to display. At least one column must remain visible.</p>
            <label class="column-option" *ngFor="let column of availableColumns">
              <input type="checkbox" [checked]="isColumnVisible(column.key)"
                (change)="toggleColumn(column.key, $event)">
              {{ column.label }}
            </label>
          </div>

          <div class="list-controls">
            <div class="list-select">
              <label for="watchlist-select">{{ selectedMarket }} watchlist</label>
              <select id="watchlist-select" [value]="selectedWatchlistId" (change)="selectWatchlist($event)">
                <option *ngFor="let watchlist of watchlists" [value]="watchlist.id">{{ watchlist.name }}</option>
              </select>
            </div>
            <div class="list-summary">
              <strong>{{ selectedWatchlist.items.length }}</strong>
              <span>assets · {{ selectedWatchlist.currency }}</span>
            </div>
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
                    <strong *ngSwitchCase="'symbol'">{{ item.symbol }}</strong>
                    <span *ngSwitchCase="'price'">{{ item.price | currency:selectedWatchlist.currency:'symbol':'1.2-2' }}</span>
                    <span *ngSwitchCase="'change'" [ngClass]="item.change >= 0 ? 'text-success' : 'text-danger'">
                      {{ item.change > 0 ? '+' : '' }}{{ item.change }}%
                    </span>
                    <span *ngSwitchCase="'trend'" class="badge"
                      [ngClass]="item.trend === 'Bullish' ? 'up' : item.trend === 'Bearish' ? 'down' : 'neutral'">{{ item.trend }}</span>
                    <span *ngSwitchDefault>{{ getColumnValue(item, column.key) }}</span>
                  </td>
                </tr>
                <tr *ngIf="paginatedItems.length === 0">
                  <td [attr.colspan]="visibleColumns.length" class="empty-state">No assets in this watchlist.</td>
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
  styles: [`
    .watchlist-panel { padding:20px; }
    .sample-note { color:var(--muted); font-size:.75rem; }
    .toolbar,.actions,.market-control,.list-controls,.pagination,.pagination-actions { display:flex; align-items:center; }
    .toolbar { justify-content:space-between; gap:16px; margin-bottom:18px; }
    .market-control { gap:4px; padding:4px; border:1px solid var(--border); border-radius:8px; background:var(--panel-raised); }
    .market-control button,.tool-button { padding:9px 12px; border:1px solid transparent; border-radius:6px; background:transparent; color:var(--muted); font-size:.76rem; white-space:nowrap; }
    .market-control button.selected { background:#4b8cff24; color:#9dc0ff; }
    .actions { justify-content:flex-end; flex-wrap:wrap; gap:7px; }
    .tool-button { border-color:var(--border); color:var(--text); }
    .tool-button:hover,.pagination button:hover:not(:disabled) { background:#ffffff0b; }
    .file-input { display:none; }
    .columns-editor { display:flex; align-items:center; flex-wrap:wrap; gap:10px 18px; margin:0 0 18px; padding:14px; border:1px solid var(--border); border-radius:7px; background:var(--panel-raised); }
    .columns-editor p { flex-basis:100%; margin:0; color:var(--muted); font-size:.72rem; }
    .column-option { display:flex; align-items:center; gap:6px; color:var(--text); font-size:.74rem; cursor:pointer; }
    .column-option input { accent-color:var(--primary); }
    .list-controls { justify-content:space-between; gap:20px; margin-bottom:18px; }
    .list-select { display:grid; gap:7px; width:min(100%,320px); }
    .list-select label { color:var(--muted); font-size:.72rem; }
    select { width:100%; min-height:40px; padding:0 12px; border:1px solid var(--border); border-radius:6px; background:var(--panel-raised); color:var(--text); }
    select:focus-visible,button:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
    .list-summary { display:flex; align-items:baseline; gap:6px; color:var(--muted); font-size:.78rem; }
    .list-summary strong { color:var(--text); font-size:1.1rem; }
    .status-message { margin:0 0 12px; color:var(--accent); font-size:.76rem; }
    .pagination { justify-content:space-between; gap:16px; padding-top:16px; color:var(--muted); font-size:.76rem; }
    .pagination-actions { gap:12px; }
    .pagination button { padding:8px 11px; border:1px solid var(--border); border-radius:6px; background:var(--panel-raised); color:var(--text); font-size:.75rem; }
    .pagination button:disabled { cursor:not-allowed; opacity:.45; }
    .empty-state { padding:28px; color:var(--muted); text-align:center; }
    @media(max-width:850px) {
      .toolbar { align-items:flex-start; flex-direction:column; }
      .actions { justify-content:flex-start; }
    }
    @media(max-width:620px) {
      .watchlist-panel { padding:14px; }
      .market-control { width:100%; }
      .market-control button { flex:1; }
      .list-controls,.pagination { align-items:stretch; flex-direction:column; }
      .list-select { width:100%; }
      .pagination-actions { justify-content:space-between; }
    }
  `],
})
export class WatchlistsComponent {
  readonly pageSize = 5;
  readonly availableColumns: WatchlistColumn[] = [
    { key: 'symbol', label: 'Symbol' },
    { key: 'name', label: 'Asset name' },
    { key: 'assetType', label: 'Asset type' },
    { key: 'price', label: 'Price' },
    { key: 'change', label: 'Change %' },
    { key: 'trend', label: 'Trend' },
    { key: 'sector', label: 'Sector' },
    { key: 'score', label: 'Score' },
    { key: 'volume', label: 'Volume' },
  ];
  visibleColumnKeys: WatchlistColumnKey[] = ['symbol', 'name', 'assetType', 'price', 'change', 'trend'];
  watchlists: WatchlistGroup[] = [];
  private readonly watchlistsByMarket: Partial<Record<WatchlistMarket, WatchlistGroup[]>> = {};
  selectedMarket: WatchlistMarket = 'US';
  selectedWatchlistId = '';
  currentPage = 1;
  columnsEditorOpen = false;
  statusMessage = '';

  constructor(private readonly wealthService: WealthService) {
    this.loadWatchlists(this.selectedMarket);
  }

  get selectedWatchlist(): WatchlistGroup {
    return this.watchlists.find((watchlist) => watchlist.id === this.selectedWatchlistId) ?? this.watchlists[0];
  }

  get visibleColumns(): WatchlistColumn[] {
    return this.availableColumns.filter((column) => this.visibleColumnKeys.includes(column.key));
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

  selectMarket(market: WatchlistMarket): void {
    if (market !== this.selectedMarket) {
      this.selectedMarket = market;
      this.loadWatchlists(market);
      this.statusMessage = '';
    }
  }

  selectWatchlist(event: Event): void {
    if (event.target instanceof HTMLSelectElement) {
      this.selectedWatchlistId = event.target.value;
      this.currentPage = 1;
      this.statusMessage = '';
    }
  }

  isColumnVisible(key: WatchlistColumnKey): boolean {
    return this.visibleColumnKeys.includes(key);
  }

  toggleColumn(key: WatchlistColumnKey, event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const checked = event.target.checked;
    if (!checked && this.visibleColumnKeys.length === 1) {
      event.target.checked = true;
      this.statusMessage = 'At least one column must remain visible.';
      return;
    }
    this.visibleColumnKeys = checked
      ? [...this.visibleColumnKeys, key]
      : this.visibleColumnKeys.filter((visibleKey) => visibleKey !== key);
    this.statusMessage = '';
  }

  getColumnValue(item: WatchlistItem, key: WatchlistColumnKey): string | number {
    switch (key) {
      case 'symbol': return item.symbol;
      case 'name': return item.name;
      case 'assetType': return item.assetType ?? '—';
      case 'price': return item.price;
      case 'change': return item.change;
      case 'trend': return item.trend;
      case 'sector': return item.sector ?? '—';
      case 'score': return item.score ?? '—';
      case 'volume': return item.volume ?? '—';
    }
  }

  previousPage(): void {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage(): void {
    this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
  }

  exportCsv(): void {
    const headers = this.availableColumns.map((column) => column.key);
    const rows = this.selectedWatchlist.items.map((item) =>
      headers.map((header) => this.csvEscape(String(this.getColumnValue(item, header)))),
    );
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
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
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedItems = this.parseCsv(String(reader.result ?? ''));
        const updatedWatchlist = {
          ...this.selectedWatchlist,
          items: [...this.selectedWatchlist.items, ...importedItems],
        };
        this.watchlists = this.watchlists.map((watchlist) =>
          watchlist.id === updatedWatchlist.id ? updatedWatchlist : watchlist,
        );
        this.currentPage = Math.ceil(updatedWatchlist.items.length / this.pageSize);
        this.statusMessage = `${importedItems.length} assets imported into ${updatedWatchlist.name}.`;
      } catch (error) {
        this.statusMessage = error instanceof Error ? error.message : 'Unable to import this CSV file.';
      } finally {
        input.value = '';
      }
    };
    reader.onerror = () => {
      this.statusMessage = 'Unable to read this CSV file.';
      input.value = '';
    };
    reader.readAsText(file);
  }

  private loadWatchlists(market: WatchlistMarket): void {
    // Both markets share this loader; replace its service source with one parameterized backend call later.
    this.watchlistsByMarket[market] ??= this.wealthService.getWatchlists(market);
    this.watchlists = this.watchlistsByMarket[market] ?? [];
    this.selectedWatchlistId = this.watchlists[0]?.id ?? '';
    this.currentPage = 1;
  }

  private parseCsv(csv: string): WatchlistItem[] {
    const records = this.parseCsvRecords(csv);
    if (records.length < 2) {
      throw new Error('The CSV must include a header row and at least one asset.');
    }
    const headers = records[0].map((header) => header.trim().toLowerCase());
    for (const requiredHeader of ['symbol', 'name', 'price', 'change']) {
      if (!headers.includes(requiredHeader)) {
        throw new Error(`CSV is missing the required "${requiredHeader}" column.`);
      }
    }
    return records.slice(1).map((record, rowIndex) => {
      const values = new Map(headers.map((header, index) => [header, record[index]?.trim() ?? '']));
      const rowNumber = rowIndex + 2;
      const symbol = values.get('symbol') ?? '';
      const name = values.get('name') ?? '';
      const priceValue = values.get('price') ?? '';
      const changeValue = values.get('change') ?? '';
      const price = Number(priceValue);
      const change = Number(changeValue);
      if (!symbol || !name || !priceValue || !changeValue || !Number.isFinite(price) || !Number.isFinite(change)) {
        throw new Error(`CSV row ${rowNumber} needs a symbol, name, and valid price and change values.`);
      }
      const trendValue = values.get('trend');
      const trend: WatchlistItem['trend'] = trendValue === 'Bullish' || trendValue === 'Bearish' || trendValue === 'Neutral'
        ? trendValue
        : change > 0 ? 'Bullish' : change < 0 ? 'Bearish' : 'Neutral';
      const scoreValue = values.get('score');
      const score = scoreValue ? Number(scoreValue) : undefined;
      if (scoreValue && !Number.isFinite(score)) {
        throw new Error(`CSV row ${rowNumber} has an invalid score.`);
      }
      return {
        symbol,
        name,
        price,
        change,
        trend,
        assetType: values.get('assettype') || undefined,
        sector: values.get('sector') || undefined,
        score,
        volume: values.get('volume') || undefined,
      };
    });
  }

  private parseCsvRecords(csv: string): string[][] {
    const records: string[][] = [];
    let record: string[] = [];
    let value = '';
    let quoted = false;
    for (let index = 0; index < csv.length; index += 1) {
      const character = csv[index];
      if (character === '"') {
        if (quoted && csv[index + 1] === '"') {
          value += '"';
          index += 1;
        } else {
          quoted = !quoted;
        }
      } else if (character === ',' && !quoted) {
        record.push(value);
        value = '';
      } else if ((character === '\n' || character === '\r') && !quoted) {
        if (character === '\r' && csv[index + 1] === '\n') {
          index += 1;
        }
        record.push(value);
        if (record.some((field) => field.trim())) {
          records.push(record);
        }
        record = [];
        value = '';
      } else {
        value += character;
      }
    }
    if (quoted) {
      throw new Error('CSV contains an unclosed quoted field.');
    }
    record.push(value);
    if (record.some((field) => field.trim())) {
      records.push(record);
    }
    return records;
  }

  private csvEscape(value: string): string {
    return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  }
}
