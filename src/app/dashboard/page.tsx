'use client';

import { useState, useEffect } from 'react';
import { useAdsStore } from '@/lib/store';
import {
  mockCampaigns,
  mockAdSets,
  mockAds,
  mockRecommendations,
  mockMetrics,
  buildCampaignTree,
} from '@/lib/mock-data';
import MetricCards, { SecondaryMetrics } from '@/components/MetricCards';
import RecommendationsPanel from '@/components/RecommendationsPanel';
import CampaignTree from '@/components/CampaignTree';
import PlatformSwitcher, { ConnectedAccounts } from '@/components/PlatformSwitcher';
import { CampaignEditModal, AdSetEditModal, AdEditModal } from '@/components/EditModals';
import type { MetaCampaign, MetaAdSet, MetaAd } from '@/types/meta-ads';
import { Zap, RefreshCw, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const {
    campaigns,
    setCampaigns,
    setAdSets,
    setAds,
    recommendations,
    setRecommendations,
    metrics,
    setMetrics,
    filters,
    setFilters,
    expandedCampaigns,
    expandedAdSets,
    toggleCampaignExpand,
    toggleAdSetExpand,
    applyRecommendation,
    dismissRecommendation,
    isLoading,
    setLoading,
  } = useAdsStore();

  // Modal states
  const [editingCampaign, setEditingCampaign] = useState<MetaCampaign | null>(null);
  const [editingAdSet, setEditingAdSet] = useState<MetaAdSet | null>(null);
  const [editingAd, setEditingAd] = useState<MetaAd | null>(null);

  // Load mock data on mount
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setAdSets(mockAdSets);
      setAds(mockAds);
      setRecommendations(mockRecommendations);
      setMetrics(mockMetrics);
      setLoading(false);
    }, 800);
  }, [setCampaigns, setAdSets, setAds, setRecommendations, setMetrics, setLoading]);

  // Build campaign tree with nested adsets and ads
  const campaignTree = buildCampaignTree();

  // Get recommendation counts per entity
  const recommendationCounts: Record<string, number> = {};
  recommendations
    .filter((r) => !r.applied && !r.dismissed)
    .forEach((r) => {
      recommendationCounts[r.entity_id] = (recommendationCounts[r.entity_id] || 0) + 1;
    });

  // Handle status toggle
  const handleToggleStatus = async (
    type: 'campaign' | 'adset' | 'ad',
    id: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    
    // Here you would call the n8n webhook to update Meta
    console.log(`Updating ${type} ${id} status to ${newStatus}`);
    
    // Optimistic update
    if (type === 'campaign') {
      setCampaigns(
        campaigns.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    }
  };

  // Handle apply recommendation
  const handleApplyRecommendation = async (id: string) => {
    // Find the recommendation
    const rec = recommendations.find((r) => r.id === id);
    if (!rec) return;

    // Here you would call the n8n webhook to apply the change to Meta
    console.log('Applying recommendation:', rec);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update local state
    applyRecommendation(id);
  };

  // Handle dismiss recommendation
  const handleDismissRecommendation = async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    dismissRecommendation(id);
  };

  // Handle campaign edit save
  const handleSaveCampaign = async (updates: Partial<MetaCampaign>) => {
    if (!editingCampaign) return;
    
    // Here you would call the n8n webhook
    console.log('Saving campaign updates:', updates);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Update local state
    setCampaigns(
      campaigns.map((c) =>
        c.id === editingCampaign.id ? { ...c, ...updates } : c
      )
    );
  };

  // Handle adset edit save
  const handleSaveAdSet = async (updates: Partial<MetaAdSet>) => {
    if (!editingAdSet) return;
    console.log('Saving adset updates:', updates);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Handle ad edit save
  const handleSaveAd = async (updates: Partial<MetaAd>) => {
    if (!editingAd) return;
    console.log('Saving ad updates:', updates);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const activeRecommendations = recommendations.filter(
    (r) => !r.applied && !r.dismissed
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400">Loading your ads data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-gray-400">
            Overview of your advertising performance across platforms
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ConnectedAccounts
            metaConnected={true}
            googleConnected={false}
            metaAccountName="YO Digital"
          />
          <PlatformSwitcher
            selected={filters.platform}
            onChange={(platform) => setFilters({ platform })}
          />
        </div>
      </div>

      {/* Quick Stats Banner */}
      {activeRecommendations.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-dashboard-warning/10 to-dashboard-accent/10 border border-dashboard-warning/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-dashboard-warning/20">
              <Zap size={20} className="text-dashboard-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {activeRecommendations.length} AI recommendations available
              </p>
              <p className="text-xs text-gray-400">
                Apply suggestions to improve your campaign performance
              </p>
            </div>
          </div>
          <a
            href="/dashboard/recommendations"
            className="flex items-center gap-2 text-sm font-medium text-dashboard-accent hover:underline"
          >
            View all <ArrowRight size={14} />
          </a>
        </div>
      )}

      {/* Metric Cards */}
      {metrics && <MetricCards metrics={metrics} />}

      {/* Secondary Metrics */}
      {metrics && (
        <SecondaryMetrics
          ctr={metrics.averageCTR}
          cpc={metrics.averageCPC}
          roas={metrics.averageROAS}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Campaigns Section - 2 columns */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Campaigns</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {campaigns.length} campaigns
              </span>
            </div>
          </div>
          <CampaignTree
            campaigns={campaignTree}
            onEditCampaign={setEditingCampaign}
            onEditAdSet={setEditingAdSet}
            onEditAd={setEditingAd}
            onToggleStatus={handleToggleStatus}
            expandedCampaigns={expandedCampaigns}
            expandedAdSets={expandedAdSets}
            onToggleCampaign={toggleCampaignExpand}
            onToggleAdSet={toggleAdSetExpand}
            recommendations={recommendationCounts}
          />
        </div>

        {/* Recommendations Section - 1 column */}
        <div className="xl:col-span-1">
          <RecommendationsPanel
            recommendations={recommendations}
            onApply={handleApplyRecommendation}
            onDismiss={handleDismissRecommendation}
            compact
          />
        </div>
      </div>

      {/* Edit Modals */}
      <CampaignEditModal
        campaign={editingCampaign}
        isOpen={!!editingCampaign}
        onClose={() => setEditingCampaign(null)}
        onSave={handleSaveCampaign}
      />
      <AdSetEditModal
        adset={editingAdSet}
        isOpen={!!editingAdSet}
        onClose={() => setEditingAdSet(null)}
        onSave={handleSaveAdSet}
      />
      <AdEditModal
        ad={editingAd}
        isOpen={!!editingAd}
        onClose={() => setEditingAd(null)}
        onSave={handleSaveAd}
      />
    </div>
  );
}
