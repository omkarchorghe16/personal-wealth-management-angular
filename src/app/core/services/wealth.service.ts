import { Injectable } from '@angular/core';
import {
  CryptoAsset,
  Holding,
  MetricCardModel,
  PortfolioSummary,
  StockAsset,
  WatchlistItem,
} from '../models/wealth.models';

@Injectable({ providedIn: 'root' })
export class WealthService {
  getPortfolioSummary(): PortfolioSummary {
    return {
      totalValue: 1284600,
      dayChange: 18450,
      monthlyReturn: 12.8,
      riskScore: 67,
    };
  }

  getMetricCards(): MetricCardModel[] {
    return [
      { title: 'Net worth', value: '$1.28M', change: '+4.2%', tone: 'up', detail: 'vs last month' },
      { title: 'Portfolio yield', value: '8.7%', change: '+1.4%', tone: 'up', detail: 'annualized' },
      { title: 'Cash reserves', value: '$186.4K', change: '-0.8%', tone: 'down', detail: 'liquidity buffer' },
      { title: 'Dividends', value: '$14.3K', change: '+2.1%', tone: 'up', detail: 'YTD payout' },
    ];
  }

  getTopStocks(): StockAsset[] {
    return [
      { symbol: 'AAPL', name: 'Apple', price: 214.22, change: 2.91, sector: 'Technology', score: 82, volume: '42.3M' },
      { symbol: 'MSFT', name: 'Microsoft', price: 426.18, change: 1.87, sector: 'Technology', score: 89, volume: '21.8M' },
      { symbol: 'NVDA', name: 'NVIDIA', price: 127.46, change: 4.2, sector: 'AI', score: 91, volume: '58.1M' },
      { symbol: 'AMZN', name: 'Amazon', price: 183.35, change: 1.13, sector: 'Consumer', score: 78, volume: '31.4M' },
    ];
  }

  getPortfolioHoldings(): Holding[] {
    return [
      { symbol: 'AAPL', company: 'Apple', quantity: 180, avgCost: 186.5, marketValue: 38560, change: 12.5, allocation: 26 },
      { symbol: 'MSFT', company: 'Microsoft', quantity: 120, avgCost: 392.2, marketValue: 51142, change: 9.8, allocation: 21 },
      { symbol: 'NVDA', company: 'NVIDIA', quantity: 275, avgCost: 104.8, marketValue: 35043, change: 17.1, allocation: 18 },
      { symbol: 'VOO', company: 'Vanguard S&P 500', quantity: 460, avgCost: 420.3, marketValue: 193260, change: 6.4, allocation: 35 },
    ];
  }

  getWatchlist(): WatchlistItem[] {
    return [
      { symbol: 'TSLA', name: 'Tesla', price: 248.7, change: 3.4, trend: 'Bullish' },
      { symbol: 'META', name: 'Meta', price: 538.9, change: -1.2, trend: 'Neutral' },
      { symbol: 'BTC', name: 'Bitcoin', price: 67640, change: 2.1, trend: 'Bullish' },
      { symbol: 'ETH', name: 'Ethereum', price: 3542, change: -0.7, trend: 'Neutral' },
    ];
  }

  getCryptoAssets(): CryptoAsset[] {
    return [
      { symbol: 'BTC', name: 'Bitcoin', price: 67342.5, change: 3.8, marketCap: '$1.32T', volume: '$32.4B' },
      { symbol: 'ETH', name: 'Ethereum', price: 3528.1, change: 2.4, marketCap: '$424B', volume: '$17.9B' },
      { symbol: 'SOL', name: 'Solana', price: 154.4, change: 5.7, marketCap: '$70.8B', volume: '$4.3B' },
      { symbol: 'ADA', name: 'Cardano', price: 0.72, change: -1.1, marketCap: '$25.6B', volume: '$1.1B' },
    ];
  }
}
