import { Injectable } from '@angular/core';
import {
  CryptoAsset,
  CountryPortfolio,
  Holding,
  MetricCardModel,
  PortfolioOverview,
  PortfolioSummary,
  StockAsset,
  WatchlistGroup,
  WatchlistItem,
  WatchlistMetricKey,
  WatchlistMarket,
} from '../models/wealth.models';

@Injectable({ providedIn: 'root' })
export class WealthService {
  // Prototype data only; replace these values with backend-backed service methods after API contracts are defined.
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
      { title: 'Total net worth', value: '$1.28M', change: 'USD equivalent', tone: 'neutral', detail: 'US + India · sample values' },
      { title: 'Total profit', value: '+$216.4K', change: '+20.3%', tone: 'up', detail: 'all-time unrealized · sample' },
      { title: "Today's profit", value: '+$18.45K', change: '+1.46%', tone: 'up', detail: 'across portfolios · sample' },
      { title: 'Monthly return', value: '+12.8%', change: 'This month', tone: 'up', detail: 'sample performance only' },
    ];
  }

  getCountryPortfolios(): CountryPortfolio[] {
    return [
      {
        country: 'United States',
        currency: 'USD',
        totalValue: '$1,284,600',
        allocations: [
          { name: 'Stocks', percent: 24 },
          { name: 'Mutual funds', percent: 10 },
          { name: 'ETFs', percent: 14 },
          { name: 'Residential property', percent: 10 },
          { name: 'Commercial property', percent: 7 },
          { name: 'Land', percent: 4 },
          { name: 'REITs', percent: 6 },
          { name: 'Bonds / fixed income', percent: 9 },
          { name: 'Cash', percent: 7 },
          { name: 'Crypto', percent: 5 },
          { name: 'Gold / commodities', percent: 4 },
        ],
      },
      {
        country: 'India',
        currency: 'INR',
        totalValue: '₹84,60,000',
        allocations: [
          { name: 'Stocks', percent: 20 },
          { name: 'Mutual funds', percent: 18 },
          { name: 'ETFs', percent: 5 },
          { name: 'Residential property', percent: 14 },
          { name: 'Commercial property', percent: 8 },
          { name: 'Land', percent: 10 },
          { name: 'REITs', percent: 4 },
          { name: 'Bonds / fixed income', percent: 8 },
          { name: 'Cash / fixed deposits', percent: 5 },
          { name: 'Crypto', percent: 2 },
          { name: 'Gold / commodities', percent: 6 },
        ],
      },
    ];
  }

  getPortfolioOverviews(): PortfolioOverview[] {
    return [
      { name: 'Core investment account', country: 'United States', type: 'Stocks & ETFs', value: '$642,800', profit: '+$84,200', tone: 'up' },
      { name: 'Property portfolio', country: 'United States', type: 'Real estate & land', value: '$418,000', profit: '+$62,500', tone: 'up' },
      { name: 'Long-term funds', country: 'India', type: 'Mutual funds', value: '₹32,40,000', profit: '+₹4,82,000', tone: 'up' },
      { name: 'India property & equity', country: 'India', type: 'Property & stocks', value: '₹52,20,000', profit: '+₹6,30,000', tone: 'up' },
    ];
  }

  getTopStocks(): StockAsset[] {
    return [
      { symbol: 'AAPL', name: 'Apple', price: 214.22, change: 2.91, sector: 'Technology', score: 82, volume: '42.3M' },
      { symbol: 'MSFT', name: 'Microsoft', price: 426.18, change: 1.87, sector: 'Technology', score: 89, volume: '21.8M' },
      { symbol: 'NVDA', name: 'NVIDIA', price: 127.46, change: 4.2, sector: 'AI', score: 91, volume: '58.1M' },
      { symbol: 'AMZN', name: 'Amazon', price: 183.35, change: 1.13, sector: 'Consumer', score: 78, volume: '31.4M' },
      { symbol: 'TSLA', name: 'Tesla', price: 248.70, change: -2.35, sector: 'Automotive', score: 72, volume: '76.2M' },
      { symbol: 'META', name: 'Meta Platforms', price: 538.90, change: -1.20, sector: 'Technology', score: 85, volume: '14.7M' },
    ];
  }

  getTopGainers(): StockAsset[] {
    return this.getTopStocks().filter((stock) => stock.change > 0).sort((a, b) => b.change - a.change).slice(0, 3);
  }

  getTopLosers(): StockAsset[] {
    return this.getTopStocks().filter((stock) => stock.change < 0).sort((a, b) => a.change - b.change).slice(0, 3);
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

  getWatchlists(market: WatchlistMarket): WatchlistGroup[] {
    const watchlists: WatchlistGroup[] = [
      {
        id: 'growth',
        name: 'Growth picks',
        market: 'US',
        currency: 'USD',
        items: [
          { symbol: 'NVDA', name: 'NVIDIA', price: 127.46, change: 4.2, trend: 'Bullish', assetType: 'Stock', sector: 'Technology', score: 91, volume: '58.1M' },
          { symbol: 'MSFT', name: 'Microsoft', price: 426.18, change: 1.87, trend: 'Bullish', assetType: 'Stock', sector: 'Technology', score: 89, volume: '21.8M' },
          { symbol: 'AMZN', name: 'Amazon', price: 183.35, change: 1.13, trend: 'Bullish', assetType: 'Stock', sector: 'Consumer', score: 78, volume: '31.4M' },
          { symbol: 'TSLA', name: 'Tesla', price: 248.70, change: -2.35, trend: 'Neutral', assetType: 'Stock', sector: 'Automotive', score: 72, volume: '76.2M' },
          { symbol: 'META', name: 'Meta Platforms', price: 538.90, change: -1.20, trend: 'Neutral', assetType: 'Stock', sector: 'Technology', score: 85, volume: '14.7M' },
          { symbol: 'AAPL', name: 'Apple', price: 214.22, change: 2.91, trend: 'Bullish', assetType: 'Stock', sector: 'Technology', score: 82, volume: '42.3M' },
          { symbol: 'AMD', name: 'Advanced Micro Devices', price: 164.21, change: 1.54, trend: 'Bullish', assetType: 'Stock', sector: 'Semiconductors', score: 79, volume: '28.4M' },
          { symbol: 'NFLX', name: 'Netflix', price: 642.77, change: 0.82, trend: 'Neutral', assetType: 'Stock', sector: 'Entertainment', score: 83, volume: '3.2M' },
          { symbol: 'COST', name: 'Costco', price: 881.20, change: -0.46, trend: 'Neutral', assetType: 'Stock', sector: 'Consumer', score: 88, volume: '1.8M' },
          { symbol: 'CRM', name: 'Salesforce', price: 272.65, change: 1.08, trend: 'Bullish', assetType: 'Stock', sector: 'Technology', score: 80, volume: '5.1M' },
          { symbol: 'AVGO', name: 'Broadcom', price: 168.30, change: 2.02, trend: 'Bullish', assetType: 'Stock', sector: 'Semiconductors', score: 87, volume: '19.6M' },
          { symbol: 'ORCL', name: 'Oracle', price: 139.44, change: -0.74, trend: 'Neutral', assetType: 'Stock', sector: 'Technology', score: 81, volume: '6.5M' },
        ],
      },
      {
        id: 'digital-assets',
        name: 'Digital assets',
        market: 'US',
        currency: 'USD',
        items: [
          { symbol: 'BTC', name: 'Bitcoin', price: 67342.5, change: 3.8, trend: 'Bullish', assetType: 'Crypto', sector: 'Digital assets', score: 88, volume: '$32.4B' },
          { symbol: 'ETH', name: 'Ethereum', price: 3528.1, change: 2.4, trend: 'Bullish', assetType: 'Crypto', sector: 'Digital assets', score: 84, volume: '$17.9B' },
          { symbol: 'SOL', name: 'Solana', price: 154.4, change: 5.7, trend: 'Bullish', assetType: 'Crypto', sector: 'Digital assets', score: 81, volume: '$4.3B' },
          { symbol: 'ADA', name: 'Cardano', price: 0.72, change: -1.1, trend: 'Neutral', assetType: 'Crypto', sector: 'Digital assets', score: 68, volume: '$1.1B' },
          { symbol: 'XRP', name: 'XRP', price: 0.61, change: 0.9, trend: 'Neutral', assetType: 'Crypto', sector: 'Digital assets', score: 71, volume: '$1.8B' },
          { symbol: 'LINK', name: 'Chainlink', price: 17.2, change: -0.8, trend: 'Neutral', assetType: 'Crypto', sector: 'Digital assets', score: 75, volume: '$0.4B' },
        ],
      },
      {
        id: 'income',
        name: 'Income & ETFs',
        market: 'US',
        currency: 'USD',
        items: [
          { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', price: 492.18, change: 0.62, trend: 'Bullish', assetType: 'ETF', sector: 'Large cap', score: 90, volume: '4.1M' },
          { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', price: 78.42, change: 0.31, trend: 'Neutral', assetType: 'ETF', sector: 'Dividend', score: 86, volume: '2.7M' },
          { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', price: 72.65, change: -0.12, trend: 'Neutral', assetType: 'ETF', sector: 'Fixed income', score: 78, volume: '5.2M' },
          { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', price: 254.8, change: 0.55, trend: 'Bullish', assetType: 'ETF', sector: 'Broad market', score: 89, volume: '3.1M' },
          { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 478.9, change: 1.24, trend: 'Bullish', assetType: 'ETF', sector: 'Technology', score: 87, volume: '31.2M' },
          { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', price: 91.25, change: -0.38, trend: 'Neutral', assetType: 'ETF', sector: 'Real estate', score: 74, volume: '3.4M' },
        ],
      },
      {
        id: 'india-equities',
        name: 'India equities',
        market: 'India',
        currency: 'INR',
        items: [
          { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2940.5, change: 1.18, trend: 'Bullish', assetType: 'Stock', sector: 'Energy', score: 85, volume: '4.2M' },
          { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3890.2, change: 0.72, trend: 'Bullish', assetType: 'Stock', sector: 'IT', score: 89, volume: '1.8M' },
          { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1684.4, change: -0.42, trend: 'Neutral', assetType: 'Stock', sector: 'Banking', score: 82, volume: '8.7M' },
          { symbol: 'INFY', name: 'Infosys', price: 1472.8, change: 1.36, trend: 'Bullish', assetType: 'Stock', sector: 'IT', score: 84, volume: '5.3M' },
          { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1128.6, change: 0.55, trend: 'Neutral', assetType: 'Stock', sector: 'Banking', score: 86, volume: '6.4M' },
          { symbol: 'ITC', name: 'ITC Limited', price: 438.15, change: -0.18, trend: 'Neutral', assetType: 'Stock', sector: 'Consumer goods', score: 78, volume: '9.1M' },
          { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1422.3, change: 1.04, trend: 'Bullish', assetType: 'Stock', sector: 'Telecom', score: 83, volume: '2.6M' },
        ],
      },
      {
        id: 'india-funds',
        name: 'India mutual funds & ETFs',
        market: 'India',
        currency: 'INR',
        items: [
          { symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty 50', price: 248.6, change: 0.64, trend: 'Bullish', assetType: 'ETF', sector: 'Index', score: 82, volume: '1.2M' },
          { symbol: 'JUNIORBEES', name: 'Nippon India ETF Nifty Next 50', price: 642.3, change: 0.38, trend: 'Neutral', assetType: 'ETF', sector: 'Index', score: 79, volume: '0.4M' },
          { symbol: 'GOLDBEES', name: 'Nippon India ETF Gold BeES', price: 62.45, change: 0.92, trend: 'Bullish', assetType: 'ETF', sector: 'Gold', score: 76, volume: '2.8M' },
          { symbol: 'HDFCMID150', name: 'HDFC Nifty Midcap 150 ETF', price: 186.2, change: -0.31, trend: 'Neutral', assetType: 'ETF', sector: 'Mid cap', score: 75, volume: '0.3M' },
          { symbol: 'SBIN', name: 'State Bank of India', price: 824.3, change: 0.86, trend: 'Bullish', assetType: 'Stock', sector: 'Banking', score: 81, volume: '7.9M' },
          { symbol: 'LT', name: 'Larsen & Toubro', price: 3580.7, change: -0.27, trend: 'Neutral', assetType: 'Stock', sector: 'Industrials', score: 84, volume: '1.1M' },
        ],
      },
    ];
    return watchlists
      .filter((watchlist) => watchlist.market === market)
      .map((watchlist) => ({
        ...watchlist,
        items: watchlist.items.map((item, index) => this.withSampleMetrics(item, index, watchlist.currency)),
      }));
  }

  private withSampleMetrics(item: WatchlistItem, index: number, currency: 'USD' | 'INR'): WatchlistItem {
    const price = item.price;
    const offset = index + 1;
    const metrics: Record<WatchlistMetricKey, string | number> = {
      open: price * (1 - item.change / 1000),
      previousClose: price / (1 + item.change / 100),
      dayHigh: price * 1.015,
      dayLow: price * 0.985,
      marketCap: currency === 'USD' ? `$${(price * (140 + offset * 19)).toLocaleString('en-US', { maximumFractionDigits: 0 })}M` : `₹${(price * (16 + offset * 3)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}Cr`,
      averageVolume: item.volume ?? `${(1 + offset * 0.37).toFixed(1)}M`,
      relativeVolume: `${(0.8 + offset * 0.13).toFixed(2)}x`,
      peRatio: (18 + offset * 2.7).toFixed(1),
      forwardPE: (16 + offset * 2.3).toFixed(1),
      eps: (price / (18 + offset * 2.7)).toFixed(2),
      pegRatio: (0.8 + offset * 0.09).toFixed(2),
      priceToBook: (2.1 + offset * 0.42).toFixed(1),
      priceToSales: (3.4 + offset * 0.61).toFixed(1),
      dividendYield: `${(0.4 + (offset % 5) * 0.35).toFixed(2)}%`,
      roe: `${(10 + (offset % 8) * 2.4).toFixed(1)}%`,
      roa: `${(5 + (offset % 7) * 1.3).toFixed(1)}%`,
      grossMargin: `${(28 + (offset % 9) * 4.2).toFixed(1)}%`,
      operatingMargin: `${(10 + (offset % 7) * 3.1).toFixed(1)}%`,
      profitMargin: `${(7 + (offset % 8) * 2.5).toFixed(1)}%`,
      debtToEquity: (0.2 + (offset % 6) * 0.17).toFixed(2),
      revenueGrowth: `${(4 + (offset % 8) * 3.1).toFixed(1)}%`,
      earningsGrowth: `${(3 + (offset % 9) * 3.8).toFixed(1)}%`,
      freeCashFlow: currency === 'USD' ? `$${(price * offset * 0.31).toFixed(0)}M` : `₹${(price * offset * 0.04).toFixed(0)}Cr`,
      analystTarget: (price * (1.05 + offset * 0.008)).toFixed(2),
      week52High: (price * 1.32).toFixed(2),
      week52Low: (price * 0.68).toFixed(2),
      movingAverage50: (price * (0.97 + offset * 0.004)).toFixed(2),
      movingAverage200: (price * (0.89 + offset * 0.006)).toFixed(2),
      rsi14: (38 + (offset * 7) % 45).toFixed(1),
      macd: ((item.change / 100) * price).toFixed(3),
      macdSignal: ((item.change / 120) * price).toFixed(3),
      beta: (0.72 + (offset % 9) * 0.16).toFixed(2),
      shortFloat: `${(0.8 + (offset % 8) * 0.7).toFixed(1)}%`,
      nextEarnings: `2026-${String(7 + (offset % 6)).padStart(2, '0')}-${String(5 + (offset * 3) % 22).padStart(2, '0')}`,
    };
    return { ...item, metrics: { ...metrics, ...item.metrics } };
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
