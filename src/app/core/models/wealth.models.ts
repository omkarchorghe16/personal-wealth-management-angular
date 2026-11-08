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
}

export interface PortfolioSummary {
  totalValue: number;
  dayChange: number;
  monthlyReturn: number;
  riskScore: number;
}
