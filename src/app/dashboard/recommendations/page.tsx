'use client';

import { useState, useEffect } from 'react';
import { useAdsStore } from '@/lib/store';
import { mockRecommendations } from '@/lib/mock-data';
import RecommendationsPanel from '@/components/RecommendationsPanel';
import { Lightbulb, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';

type FilterType = 'all' | 'pending' | 'applied' | 'dismissed';
type PriorityFilter = 'all' | 'HIGH' | 'MEDIUM' | 'LOW';

export default function RecommendationsPage() {
  const {
    recommendations,
    setRecommendations,
    applyRecommendation,
    dismissRecommendation,
    setLoading,
    isLoading,
  } = useAdsStore();

  const [filter, setFilter] = useState<FilterType>('pending');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  // Load mock data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 500);
  }, [setRecommendations, setLoading]);

  // Filter recommendations
  const filteredRecommendations = recommendations.filter((rec) => {
    // Status filter
    if (filter === 'pending' && (rec.applied || rec.dismissed)) return false;
    if (filter === 'applied' && !rec.applied) return false;
    if (filter === 'dismissed' && !rec.dismissed) return false;

    // Priority filter
    if (priorityFilter !== 'all' && rec.priority !== priorityFilter) return false;

    return true;
  });

  // Counts
  const pendingCount = recommendations.filter((r) => !r.applied && !r.dismissed).length;
  const appliedCount = recommendations.filter((r) => r.applied).length;
  const dismissedCount = recommendations.filter((r) => r.dismissed).length;

  // Handle apply
  const handleApply = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    applyRecommendation(id);
  };

  // Handle dismiss
  const handleDismiss = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    dismissRecommendation(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-dashboard-warning/10">
            <Lightbulb size={24} className="text-dashboard-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Recommendations</h1>
            <p className="text-gray-400">
              Optimize your campaigns with AI-powered suggestions from Meta
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('pending')}
          className={`card p-4 text-left transition-all ${
            filter === 'pending' ? 'border-dashboard-warning' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-dashboard-warning/10">
              <Clock size={20} className="text-dashboard-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('applied')}
          className={`card p-4 text-left transition-all ${
            filter === 'applied' ? 'border-dashboard-success' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-dashboard-success/10">
              <CheckCircle size={20} className="text-dashboard-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{appliedCount}</p>
              <p className="text-sm text-gray-400">Applied</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('dismissed')}
          className={`card p-4 text-left transition-all ${
            filter === 'dismissed' ? 'border-gray-500' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-500/10">
              <XCircle size={20} className="text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{dismissedCount}</p>
              <p className="text-sm text-gray-400">Dismissed</p>
            </div>
          </div>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">Priority:</span>
          <div className="flex items-center gap-1 p-1 bg-dashboard-bg border border-dashboard-border rounded-lg">
            {(['all', 'HIGH', 'MEDIUM', 'LOW'] as PriorityFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  priorityFilter === p
                    ? p === 'HIGH'
                      ? 'bg-dashboard-danger/20 text-dashboard-danger'
                      : p === 'MEDIUM'
                      ? 'bg-dashboard-warning/20 text-dashboard-warning'
                      : p === 'LOW'
                      ? 'bg-dashboard-accent/20 text-dashboard-accent'
                      : 'bg-dashboard-card text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-400">
          {filteredRecommendations.length} recommendation
          {filteredRecommendations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Recommendations List */}
      {filter === 'pending' ? (
        <RecommendationsPanel
          recommendations={filteredRecommendations}
          onApply={handleApply}
          onDismiss={handleDismiss}
        />
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dashboard-border flex items-center justify-center">
                {filter === 'applied' ? (
                  <CheckCircle size={32} className="text-gray-500" />
                ) : (
                  <XCircle size={32} className="text-gray-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No {filter} recommendations
              </h3>
              <p className="text-sm text-gray-400">
                {filter === 'applied'
                  ? "You haven't applied any recommendations yet"
                  : "You haven't dismissed any recommendations yet"}
              </p>
            </div>
          ) : (
            filteredRecommendations.map((rec) => (
              <div
                key={rec.id}
                className={`card p-5 ${
                  rec.applied
                    ? 'border-dashboard-success/30 bg-dashboard-success/5'
                    : 'border-gray-500/30 bg-gray-500/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      rec.applied
                        ? 'bg-dashboard-success/10'
                        : 'bg-gray-500/10'
                    }`}
                  >
                    {rec.applied ? (
                      <CheckCircle size={20} className="text-dashboard-success" />
                    ) : (
                      <XCircle size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          rec.applied
                            ? 'bg-dashboard-success/20 text-dashboard-success'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {rec.applied ? 'Applied' : 'Dismissed'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {rec.entity_type} • {rec.entity_name}
                      </span>
                    </div>
                    <h3 className="text-white font-medium mb-1">{rec.title}</h3>
                    <p className="text-sm text-gray-400">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
