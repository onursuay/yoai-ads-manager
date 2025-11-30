'use client';

import { useState } from 'react';
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Palette,
  Check,
  X,
  ChevronRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import type { MetaRecommendation } from '@/types/meta-ads';
import { getRecommendationTypeInfo, formatCurrency, formatPercentage } from '@/lib/utils';

interface RecommendationsPanelProps {
  recommendations: MetaRecommendation[];
  onApply: (id: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
  compact?: boolean;
}

export default function RecommendationsPanel({
  recommendations,
  onApply,
  onDismiss,
  compact = false,
}: RecommendationsPanelProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'apply' | 'dismiss' | null>(null);

  const activeRecommendations = recommendations.filter(
    (r) => !r.applied && !r.dismissed
  );

  const handleApply = async (id: string) => {
    setLoadingId(id);
    setActionType('apply');
    try {
      await onApply(id);
    } finally {
      setLoadingId(null);
      setActionType(null);
    }
  };

  const handleDismiss = async (id: string) => {
    setLoadingId(id);
    setActionType('dismiss');
    try {
      await onDismiss(id);
    } finally {
      setLoadingId(null);
      setActionType(null);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <AlertTriangle size={14} className="text-dashboard-danger" />;
      case 'MEDIUM':
        return <Lightbulb size={14} className="text-dashboard-warning" />;
      default:
        return <Sparkles size={14} className="text-dashboard-accent" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CREATIVE_FATIGUE':
        return <Palette size={18} className="text-orange-400" />;
      case 'BUDGET_INCREASE':
        return <TrendingUp size={18} className="text-green-400" />;
      case 'BUDGET_DECREASE':
        return <TrendingDown size={18} className="text-yellow-400" />;
      case 'AUDIENCE_EXPANSION':
        return <Users size={18} className="text-blue-400" />;
      default:
        return <Lightbulb size={18} className="text-purple-400" />;
    }
  };

  if (activeRecommendations.length === 0) {
    return (
      <div className="card p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-dashboard-success/10 flex items-center justify-center">
          <Check size={24} className="text-dashboard-success" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">All Caught Up!</h3>
        <p className="text-sm text-gray-400">
          No pending recommendations. Your campaigns are optimized.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-dashboard-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-dashboard-warning" />
            <h3 className="font-semibold text-white">Recommendations</h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-dashboard-danger/20 text-dashboard-danger rounded-full">
              {activeRecommendations.length} new
            </span>
          </div>
          <button className="text-sm text-dashboard-accent hover:underline flex items-center gap-1">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="divide-y divide-dashboard-border">
          {activeRecommendations.slice(0, 3).map((rec) => (
            <div
              key={rec.id}
              className={`p-4 hover:bg-dashboard-hover transition-colors ${
                rec.priority === 'HIGH'
                  ? 'border-l-2 border-l-dashboard-danger'
                  : rec.priority === 'MEDIUM'
                  ? 'border-l-2 border-l-dashboard-warning'
                  : 'border-l-2 border-l-dashboard-accent'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-dashboard-bg">
                  {getTypeIcon(rec.recommendation_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getPriorityIcon(rec.priority)}
                    <h4 className="text-sm font-medium text-white truncate">
                      {rec.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {rec.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{rec.entity_name}</span>
                    {rec.impact && (
                      <span className="text-xs text-dashboard-success">
                        +{rec.impact.change_percentage.toFixed(0)}% {rec.impact.metric}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDismiss(rec.id)}
                    disabled={loadingId === rec.id}
                    className="p-2 rounded-lg bg-dashboard-bg border border-dashboard-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-50"
                  >
                    {loadingId === rec.id && actionType === 'dismiss' ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <X size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => handleApply(rec.id)}
                    disabled={loadingId === rec.id}
                    className="px-3 py-2 rounded-lg bg-dashboard-accent/10 border border-dashboard-accent/30 text-dashboard-accent text-xs font-medium hover:bg-dashboard-accent/20 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {loadingId === rec.id && actionType === 'apply' ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={14} />
                        Apply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full Panel View
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-dashboard-warning/10">
            <Lightbulb size={20} className="text-dashboard-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
            <p className="text-sm text-gray-400">
              {activeRecommendations.length} suggestions to improve performance
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {activeRecommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            onApply={handleApply}
            onDismiss={handleDismiss}
            isLoading={loadingId === rec.id}
            actionType={loadingId === rec.id ? actionType : null}
          />
        ))}
      </div>
    </div>
  );
}

// Individual Recommendation Card
interface RecommendationCardProps {
  recommendation: MetaRecommendation;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
  isLoading: boolean;
  actionType: 'apply' | 'dismiss' | null;
}

function RecommendationCard({
  recommendation: rec,
  onApply,
  onDismiss,
  isLoading,
  actionType,
}: RecommendationCardProps) {
  const typeInfo = getRecommendationTypeInfo(rec.recommendation_type);

  return (
    <div
      className={`card p-5 ${
        rec.priority === 'HIGH'
          ? 'border-l-4 border-l-dashboard-danger'
          : rec.priority === 'MEDIUM'
          ? 'border-l-4 border-l-dashboard-warning'
          : 'border-l-4 border-l-dashboard-accent'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-3 rounded-xl bg-dashboard-bg border border-dashboard-border">
          <span className="text-2xl">{typeInfo.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                rec.priority === 'HIGH'
                  ? 'bg-dashboard-danger/20 text-dashboard-danger'
                  : rec.priority === 'MEDIUM'
                  ? 'bg-dashboard-warning/20 text-dashboard-warning'
                  : 'bg-dashboard-accent/20 text-dashboard-accent'
              }`}
            >
              {rec.priority}
            </span>
            <span className={`text-xs font-medium ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">{rec.title}</h3>
          <p className="text-sm text-gray-400 mb-4">{rec.description}</p>

          {/* Impact Projection */}
          {rec.impact && (
            <div className="flex items-center gap-4 p-3 bg-dashboard-bg rounded-xl mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current {rec.impact.metric}</p>
                <p className="text-lg font-semibold text-white">
                  {rec.impact.metric === 'Conversions' || rec.impact.metric === 'Reach'
                    ? rec.impact.current_value.toLocaleString()
                    : rec.impact.metric === 'CTR' || rec.impact.metric === 'Video Completion Rate'
                    ? `${rec.impact.current_value.toFixed(2)}%`
                    : rec.impact.current_value.toFixed(2)}
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dashboard-success/10">
                  <TrendingUp size={16} className="text-dashboard-success" />
                  <span className="text-sm font-semibold text-dashboard-success">
                    +{rec.impact.change_percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Projected</p>
                <p className="text-lg font-semibold text-dashboard-success">
                  {rec.impact.metric === 'Conversions' || rec.impact.metric === 'Reach'
                    ? rec.impact.projected_value.toLocaleString()
                    : rec.impact.metric === 'CTR' || rec.impact.metric === 'Video Completion Rate'
                    ? `${rec.impact.projected_value.toFixed(2)}%`
                    : rec.impact.projected_value.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Suggested Action Details */}
          {rec.suggested_action.current_value !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-dashboard-bg/50 rounded-xl mb-4 border border-dashed border-dashboard-border">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Current</p>
                <p className="text-sm font-medium text-gray-300">
                  {typeof rec.suggested_action.current_value === 'number'
                    ? rec.suggested_action.field === 'daily_budget'
                      ? formatCurrency(rec.suggested_action.current_value)
                      : rec.suggested_action.current_value
                    : JSON.stringify(rec.suggested_action.current_value)}
                </p>
              </div>
              <ChevronRight size={20} className="text-gray-500" />
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-500">Suggested</p>
                <p className="text-sm font-semibold text-dashboard-accent">
                  {typeof rec.suggested_action.suggested_value === 'number'
                    ? rec.suggested_action.field === 'daily_budget'
                      ? formatCurrency(rec.suggested_action.suggested_value)
                      : rec.suggested_action.suggested_value
                    : JSON.stringify(rec.suggested_action.suggested_value)}
                </p>
              </div>
            </div>
          )}

          {/* Entity Info */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-0.5 bg-dashboard-border rounded">
              {rec.entity_type}
            </span>
            <span>{rec.entity_name}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onApply(rec.id)}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-dashboard-accent to-emerald-600 text-dashboard-bg font-semibold text-sm hover:shadow-lg hover:shadow-dashboard-accent/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && actionType === 'apply' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Apply Now
          </button>
          <button
            onClick={() => onDismiss(rec.id)}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-dashboard-bg border border-dashboard-border text-gray-400 text-sm hover:text-white hover:border-gray-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && actionType === 'dismiss' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <X size={16} />
            )}
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
