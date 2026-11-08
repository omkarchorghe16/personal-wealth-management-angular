export interface MetricCardModel {
  title: string;
  value: string;
  change: string;
  tone: 'up' | 'down' | 'neutral';
  detail: string;
}

export interface StockAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  sector: string;
  score: number;
  volume: string;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: string;
  volume: string;
}

export interface Holding {
  symbol: string;
  company: string;
  quantity: number;
  avgCost: number;
  marketValue: number;
  change: number;
  allocation: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  trend: 'Bullish' | 'Neutral' | 'Bearish';
  assetType?: string;
  sector?: string;
  score?: number;
  volume?: string;
  metrics?: Partial<Record<WatchlistMetricKey, string | number>>;
}

export type WatchlistMetricKey =
  | 'open'
  | 'previousClose'
  | 'dayHigh'
  | 'dayLow'
  | 'marketCap'
  | 'averageVolume'
  | 'relativeVolume'
  | 'peRatio'
  | 'forwardPE'
  | 'eps'
  | 'pegRatio'
  | 'priceToBook'
  | 'priceToSales'
  | 'dividendYield'
  | 'roe'
  | 'roa'
  | 'grossMargin'
  | 'operatingMargin'
  | 'profitMargin'
  | 'debtToEquity'
  | 'revenueGrowth'
  | 'earningsGrowth'
  | 'freeCashFlow'
  | 'analystTarget'
  | 'week52High'
  | 'week52Low'
  | 'movingAverage50'
  | 'movingAverage200'
  | 'rsi14'
  | 'macd'
  | 'macdSignal'
  | 'beta'
  | 'shortFloat'
  | 'nextEarnings';

export interface PortfolioSummary {
  totalValue: number;
  dayChange: number;
  monthlyReturn: number;
  riskScore: number;
}

export interface AssetAllocation {
  name: string;
  percent: number;
}

export interface CountryPortfolio {
  country: string;
  currency: 'USD' | 'INR';
  totalValue: string;
  allocations: AssetAllocation[];
}

export interface PortfolioOverview {
  name: string;
  country: string;
  type: string;
  value: string;
  profit: string;
  tone: 'up' | 'down';
}

export interface WatchlistGroup {
  id: string;
  name: string;
  market: WatchlistMarket;
  currency: 'USD' | 'INR';
  items: WatchlistItem[];
}

export type WatchlistMarket = 'US' | 'India';
