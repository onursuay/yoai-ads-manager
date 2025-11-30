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
        return <AlertTriangle size={14} className="text-red-600" />;
      case 'MEDIUM':
        return <Lightbulb size={14} className="text-yellow-600" />;
      default:
        return <Sparkles size={14} className="text-green-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CREATIVE_FATIGUE':
        return <Palette size={18} className="text-orange-500" />;
      case 'BUDGET_INCREASE':
        return <TrendingUp size={18} className="text-green-500" />;
      case 'BUDGET_DECREASE':
        return <TrendingDown size={18} className="text-yellow-500" />;
      case 'AUDIENCE_EXPANSION':
        return <Users size={18} className="text-blue-500" />;
      default:
        return <Lightbulb size={18} className="text-purple-500" />;
    }
  };

  if (activeRecommendations.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
          <Check size={24} className="text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
        <p className="text-sm text-gray-600">
          No pending recommendations. Your campaigns are optimized.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-yellow-600" />
            <h3 className="font-semibold text-gray-900">Recommendations</h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
              {activeRecommendations.length} new
            </span>
          </div>
          <button className="text-sm text-green-600 hover:underline flex items-center gap-1">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {activeRecommendations.slice(0, 3).map((rec) => (
            <div
              key={rec.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                rec.priority === 'HIGH'
                  ? 'border-l-2 border-l-red-500'
                  : rec.priority === 'MEDIUM'
                  ? 'border-l-2 border-l-yellow-500'
                  : 'border-l-2 border-l-green-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-50">
                  {getTypeIcon(rec.recommendation_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getPriorityIcon(rec.priority)}
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {rec.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {rec.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{rec.entity_name}</span>
                    {rec.impact && (
                      <span className="text-xs text-green-600">
                        +{rec.impact.change_percentage.toFixed(0)}% {rec.impact.metric}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDismiss(rec.id)}
                    disabled={loadingId === rec.id}
                    className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors disabled:opacity-50"
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
                    className="px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1"
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
          <div className="p-2 rounded-lg bg-yellow-100">
            <Lightbulb size={20} className="text-yellow-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
            <p className="text-sm text-gray-600">
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
      className={`bg-white border rounded-lg shadow-sm p-5 ${
        rec.priority === 'HIGH'
          ? 'border-l-4 border-l-red-500'
          : rec.priority === 'MEDIUM'
          ? 'border-l-4 border-l-yellow-500'
          : 'border-l-4 border-l-green-500'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <span className="text-2xl">{typeInfo.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                rec.priority === 'HIGH'
                  ? 'bg-red-100 text-red-600'
                  : rec.priority === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              {rec.priority}
            </span>
            <span className={`text-xs font-medium ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">{rec.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{rec.description}</p>

          {/* Impact Projection */}
          {rec.impact && (
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current {rec.impact.metric}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {rec.impact.metric === 'Conversions' || rec.impact.metric === 'Reach'
                    ? rec.impact.current_value.toLocaleString()
                    : rec.impact.metric === 'CTR' || rec.impact.metric === 'Video Completion Rate'
                    ? `${rec.impact.current_value.toFixed(2)}%`
                    : rec.impact.current_value.toFixed(2)}
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-600">
                    +{rec.impact.change_percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Projected</p>
                <p className="text-lg font-semibold text-green-600">
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
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4 border border-dashed border-gray-300">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Current</p>
                <p className="text-sm font-medium text-gray-700">
                  {typeof rec.suggested_action.current_value === 'number'
                    ? rec.suggested_action.field === 'daily_budget'
                      ? formatCurrency(rec.suggested_action.current_value)
                      : rec.suggested_action.current_value
                    : JSON.stringify(rec.suggested_action.current_value)}
                </p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-500">Suggested</p>
                <p className="text-sm font-semibold text-green-600">
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
            <span className="px-2 py-0.5 bg-gray-100 rounded">
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
            className="px-4 py-2.5 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
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
            className="px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-sm hover:text-gray-900 hover:border-gray-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
