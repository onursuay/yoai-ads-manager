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
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-10 rounded-full" style={{
            backgroundColor: 
              title === 'Total Spend' ? '#10B981' :
              title === 'Impressions' ? '#3B82F6' :
              title === 'Clicks' ? '#8B5CF6' :
              '#10B981'
          }} />
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {prefix}{value}{suffix}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        {isPositive ? (
          <TrendingUp size={14} className="text-green-600" />
        ) : isNeutral ? (
          <Minus size={14} className="text-gray-400" />
        ) : (
          <TrendingDown size={14} className="text-red-600" />
        )}
        <span className={`font-medium ${
          isPositive ? 'text-green-600' : isNeutral ? 'text-gray-400' : 'text-red-600'
        }`}>
          {isPositive ? '+' : ''}{change.toFixed(1)}%
        </span>
        <span className="text-gray-500">vs last period</span>
      </div>
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
        icon={<DollarSign size={20} className="text-green-600" />}
      />
      <MetricCard
        title="Impressions"
        value={formatNumber(metrics.totalImpressions)}
        change={metrics.impressionsChange}
        icon={<Eye size={20} className="text-blue-600" />}
      />
      <MetricCard
        title="Clicks"
        value={formatNumber(metrics.totalClicks)}
        change={metrics.clicksChange}
        icon={<MousePointer size={20} className="text-purple-600" />}
      />
      <MetricCard
        title="Conversions"
        value={formatNumber(metrics.totalConversions)}
        change={metrics.conversionsChange}
        icon={<ShoppingCart size={20} className="text-green-600" />}
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
    <div className="flex items-center gap-6 px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">CTR:</span>
        <span className="text-sm font-semibold text-gray-900">{ctr.toFixed(2)}%</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">CPC:</span>
        <span className="text-sm font-semibold text-gray-900">{formatCurrency(cpc)}</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">ROAS:</span>
        <span className="text-sm font-semibold text-green-600">{roas.toFixed(2)}x</span>
      </div>
    </div>
  );
}
