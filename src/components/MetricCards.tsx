'use client';

import {
  DollarSign,
  Eye,
  MousePointer,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

function MetricCard({ title, value, change, icon, prefix, suffix }: MetricCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="card p-5 group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-dashboard-bg border border-dashboard-border group-hover:border-dashboard-accent/30 transition-colors">
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            isPositive
              ? 'bg-dashboard-success/10 text-dashboard-success'
              : isNeutral
              ? 'bg-gray-500/10 text-gray-400'
              : 'bg-dashboard-danger/10 text-dashboard-danger'
          }`}
        >
          {isPositive ? (
            <TrendingUp size={12} />
          ) : isNeutral ? (
            <Minus size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">
        {prefix}{value}{suffix}
      </p>
    </div>
  );
}

interface MetricCardsProps {
  metrics: {
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    averageCTR: number;
    averageCPC: number;
    averageROAS: number;
    spendChange: number;
    impressionsChange: number;
    clicksChange: number;
    conversionsChange: number;
  };
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Spend"
        value={formatCurrency(metrics.totalSpend)}
        change={metrics.spendChange}
        icon={<DollarSign size={20} className="text-dashboard-accent" />}
      />
      <MetricCard
        title="Impressions"
        value={formatNumber(metrics.totalImpressions)}
        change={metrics.impressionsChange}
        icon={<Eye size={20} className="text-blue-400" />}
      />
      <MetricCard
        title="Clicks"
        value={formatNumber(metrics.totalClicks)}
        change={metrics.clicksChange}
        icon={<MousePointer size={20} className="text-purple-400" />}
      />
      <MetricCard
        title="Conversions"
        value={formatNumber(metrics.totalConversions)}
        change={metrics.conversionsChange}
        icon={<ShoppingCart size={20} className="text-emerald-400" />}
      />
    </div>
  );
}

// Secondary Metrics Row
interface SecondaryMetricsProps {
  ctr: number;
  cpc: number;
  roas: number;
}

export function SecondaryMetrics({ ctr, cpc, roas }: SecondaryMetricsProps) {
  return (
    <div className="flex items-center gap-6 px-4 py-3 bg-dashboard-card border border-dashboard-border rounded-xl">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">CTR:</span>
        <span className="text-sm font-semibold text-white">{ctr.toFixed(2)}%</span>
      </div>
      <div className="w-px h-4 bg-dashboard-border" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">CPC:</span>
        <span className="text-sm font-semibold text-white">{formatCurrency(cpc)}</span>
      </div>
      <div className="w-px h-4 bg-dashboard-border" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">ROAS:</span>
        <span className="text-sm font-semibold text-dashboard-accent">{roas.toFixed(2)}x</span>
      </div>
    </div>
  );
}
