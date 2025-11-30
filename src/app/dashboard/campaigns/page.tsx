'use client';

import { useState, useEffect } from 'react';
import { useAdsStore } from '@/lib/store';
import {
  mockCampaigns,
  mockAdSets,
  mockAds,
  buildCampaignTree,
} from '@/lib/mock-data';
import CampaignTree from '@/components/CampaignTree';
import { CampaignEditModal, AdSetEditModal, AdEditModal } from '@/components/EditModals';
import type { MetaCampaign, MetaAdSet, MetaAd } from '@/types/meta-ads';
import { Megaphone, Filter, Search, SlidersHorizontal } from 'lucide-react';

type StatusFilter = 'all' | 'ACTIVE' | 'PAUSED';

export default function CampaignsPage() {
  const {
    campaigns,
    setCampaigns,
    setAdSets,
    setAds,
    recommendations,
    expandedCampaigns,
    expandedAdSets,
    toggleCampaignExpand,
    toggleAdSetExpand,
    isLoading,
    setLoading,
  } = useAdsStore();

  // Modal states
  const [editingCampaign, setEditingCampaign] = useState<MetaCampaign | null>(null);
  const [editingAdSet, setEditingAdSet] = useState<MetaAdSet | null>(null);
  const [editingAd, setEditingAd] = useState<MetaAd | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load mock data on mount
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setAdSets(mockAdSets);
      setAds(mockAds);
      setLoading(false);
    }, 500);
  }, [setCampaigns, setAdSets, setAds, setLoading]);

  // Build campaign tree
  const campaignTree = buildCampaignTree();

  // Filter campaigns
  const filteredCampaigns = campaignTree.filter((campaign) => {
    // Status filter
    if (statusFilter !== 'all' && campaign.status !== statusFilter) return false;
    
    // Search filter
    if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get recommendation counts per entity
  const recommendationCounts: Record<string, number> = {};
  recommendations
    .filter((r) => !r.applied && !r.dismissed)
    .forEach((r) => {
      recommendationCounts[r.entity_id] = (recommendationCounts[r.entity_id] || 0) + 1;
    });

  // Handle toggle status
  const handleToggleStatus = async (
    type: 'campaign' | 'adset' | 'ad',
    id: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    console.log(`Updating ${type} ${id} status to ${newStatus}`);
    
    if (type === 'campaign') {
      setCampaigns(
        campaigns.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    }
  };

  // Handle save campaign
  const handleSaveCampaign = async (updates: Partial<MetaCampaign>) => {
    if (!editingCampaign) return;
    console.log('Saving campaign updates:', updates);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCampaigns(
      campaigns.map((c) =>
        c.id === editingCampaign.id ? { ...c, ...updates } : c
      )
    );
  };

  // Handle save adset
  const handleSaveAdSet = async (updates: Partial<MetaAdSet>) => {
    if (!editingAdSet) return;
    console.log('Saving adset updates:', updates);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Handle save ad
  const handleSaveAd = async (updates: Partial<MetaAd>) => {
    if (!editingAd) return;
    console.log('Saving ad updates:', updates);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Counts
  const activeCount = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const pausedCount = campaigns.filter((c) => c.status === 'PAUSED').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-dashboard-accent/10">
            <Megaphone size={24} className="text-dashboard-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Campaigns</h1>
            <p className="text-gray-400">
              Manage and optimize your advertising campaigns
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-dashboard-accent/10">
              <Megaphone size={20} className="text-dashboard-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{campaigns.length}</p>
              <p className="text-sm text-gray-400">Total Campaigns</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-dashboard-success/10">
              <div className="w-3 h-3 rounded-full bg-dashboard-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-500/10">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pausedCount}</p>
              <p className="text-sm text-gray-400">Paused</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-dashboard-bg border border-dashboard-border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-dashboard-accent transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Status:</span>
            <div className="flex items-center gap-1 p-1 bg-dashboard-bg border border-dashboard-border rounded-lg">
              {(['all', 'ACTIVE', 'PAUSED'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    statusFilter === status
                      ? status === 'ACTIVE'
                        ? 'bg-dashboard-success/20 text-dashboard-success'
                        : status === 'PAUSED'
                        ? 'bg-gray-500/20 text-gray-300'
                        : 'bg-dashboard-card text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'ACTIVE' ? 'Active' : 'Paused'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {filteredCampaigns.length} Campaign{filteredCampaigns.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dashboard-border flex items-center justify-center">
              <Megaphone size={32} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No campaigns found
            </h3>
            <p className="text-sm text-gray-400">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Create your first campaign to get started'}
            </p>
          </div>
        ) : (
          <CampaignTree
            campaigns={filteredCampaigns}
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
        )}
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



