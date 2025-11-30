'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  Edit2,
  MoreHorizontal,
  Trash2,
  Copy,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import type { MetaCampaign, MetaAdSet, MetaAd } from '@/types/meta-ads';
import { formatCurrency, formatNumber, getStatusColor, getObjectiveLabel } from '@/lib/utils';

interface CampaignTreeProps {
  campaigns: (MetaCampaign & { adsets: (MetaAdSet & { ads: MetaAd[] })[] })[];
  onEditCampaign: (campaign: MetaCampaign) => void;
  onEditAdSet: (adset: MetaAdSet) => void;
  onEditAd: (ad: MetaAd) => void;
  onToggleStatus: (type: 'campaign' | 'adset' | 'ad', id: string, currentStatus: string) => void;
  expandedCampaigns: Set<string>;
  expandedAdSets: Set<string>;
  onToggleCampaign: (id: string) => void;
  onToggleAdSet: (id: string) => void;
  recommendations?: Record<string, number>;
}

export default function CampaignTree({
  campaigns,
  onEditCampaign,
  onEditAdSet,
  onEditAd,
  onToggleStatus,
  expandedCampaigns,
  expandedAdSets,
  onToggleCampaign,
  onToggleAdSet,
  recommendations = {},
}: CampaignTreeProps) {
  return (
    <div className="card overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-dashboard-bg border-b border-dashboard-border text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <div className="col-span-4">Campaign / Ad Set / Ad</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-right">Budget</div>
        <div className="col-span-1 text-right">Spend</div>
        <div className="col-span-1 text-right">Impr.</div>
        <div className="col-span-1 text-right">Clicks</div>
        <div className="col-span-1 text-right">CTR</div>
        <div className="col-span-1 text-right">ROAS</div>
        <div className="col-span-1 text-center">Actions</div>
      </div>

      {/* Campaign Rows */}
      <div className="divide-y divide-dashboard-border">
        {campaigns.map((campaign) => (
          <CampaignRow
            key={campaign.id}
            campaign={campaign}
            isExpanded={expandedCampaigns.has(campaign.id)}
            onToggle={() => onToggleCampaign(campaign.id)}
            onEdit={() => onEditCampaign(campaign)}
            onToggleStatus={() =>
              onToggleStatus('campaign', campaign.id, campaign.status)
            }
            recommendationCount={recommendations[campaign.id]}
          >
            {/* AdSet Rows */}
            {campaign.adsets.map((adset) => (
              <AdSetRow
                key={adset.id}
                adset={adset}
                isExpanded={expandedAdSets.has(adset.id)}
                onToggle={() => onToggleAdSet(adset.id)}
                onEdit={() => onEditAdSet(adset)}
                onToggleStatus={() =>
                  onToggleStatus('adset', adset.id, adset.status)
                }
                recommendationCount={recommendations[adset.id]}
              >
                {/* Ad Rows */}
                {adset.ads?.map((ad) => (
                  <AdRow
                    key={ad.id}
                    ad={ad}
                    onEdit={() => onEditAd(ad)}
                    onToggleStatus={() =>
                      onToggleStatus('ad', ad.id, ad.status)
                    }
                    recommendationCount={recommendations[ad.id]}
                  />
                ))}
              </AdSetRow>
            ))}
          </CampaignRow>
        ))}
      </div>
    </div>
  );
}

// Campaign Row Component
interface CampaignRowProps {
  campaign: MetaCampaign;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  recommendationCount?: number;
  children: React.ReactNode;
}

function CampaignRow({
  campaign,
  isExpanded,
  onToggle,
  onEdit,
  onToggleStatus,
  recommendationCount,
  children,
}: CampaignRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const insights = campaign.insights;

  return (
    <div>
      {/* Campaign Row */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-dashboard-hover transition-colors group">
        {/* Name */}
        <div className="col-span-4 flex items-center gap-2">
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-dashboard-border transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white truncate">{campaign.name}</span>
              {recommendationCount && recommendationCount > 0 && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-dashboard-warning/20 text-dashboard-warning text-xs rounded-full">
                  <AlertTriangle size={10} />
                  {recommendationCount}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {getObjectiveLabel(campaign.objective)}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="col-span-1 flex justify-center">
          <StatusBadge status={campaign.status} />
        </div>

        {/* Budget */}
        <div className="col-span-1 text-right">
          <span className="text-sm text-gray-300">
            {campaign.daily_budget ? formatCurrency(campaign.daily_budget) : '-'}
          </span>
          <span className="text-xs text-gray-500 block">/day</span>
        </div>

        {/* Spend */}
        <div className="col-span-1 text-right text-sm text-white font-medium">
          {insights ? formatCurrency(insights.spend) : '-'}
        </div>

        {/* Impressions */}
        <div className="col-span-1 text-right text-sm text-gray-300">
          {insights ? formatNumber(insights.impressions) : '-'}
        </div>

        {/* Clicks */}
        <div className="col-span-1 text-right text-sm text-gray-300">
          {insights ? formatNumber(insights.clicks) : '-'}
        </div>

        {/* CTR */}
        <div className="col-span-1 text-right text-sm text-gray-300">
          {insights ? `${insights.ctr.toFixed(2)}%` : '-'}
        </div>

        {/* ROAS */}
        <div className="col-span-1 text-right">
          {insights?.roas ? (
            <span
              className={`text-sm font-semibold ${
                insights.roas >= 3
                  ? 'text-dashboard-success'
                  : insights.roas >= 1.5
                  ? 'text-dashboard-warning'
                  : 'text-dashboard-danger'
              }`}
            >
              {insights.roas.toFixed(2)}x
            </span>
          ) : (
            <span className="text-sm text-gray-500">-</span>
          )}
        </div>

        {/* Actions */}
        <div className="col-span-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onToggleStatus}
            className="p-1.5 rounded-lg hover:bg-dashboard-border transition-colors"
            title={campaign.status === 'ACTIVE' ? 'Pause' : 'Activate'}
          >
            {campaign.status === 'ACTIVE' ? (
              <Pause size={14} className="text-gray-400" />
            ) : (
              <Play size={14} className="text-gray-400" />
            )}
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-dashboard-border transition-colors"
            title="Edit"
          >
            <Edit2 size={14} className="text-gray-400" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-dashboard-border transition-colors"
            >
              <MoreHorizontal size={14} className="text-gray-400" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-40 bg-dashboard-card border border-dashboard-border rounded-lg shadow-xl z-50 py-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-dashboard-hover">
                    <Copy size={14} />
                    Duplicate
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-dashboard-hover">
                    <ExternalLink size={14} />
                    View in Meta
                  </button>
                  <div className="my-1 border-t border-dashboard-border" />
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-dashboard-danger hover:bg-dashboard-hover">
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Children (AdSets) */}
      {isExpanded && <div className="bg-dashboard-bg/30">{children}</div>}
    </div>
  );
}

// AdSet Row Component
interface AdSetRowProps {
  adset: MetaAdSet;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  recommendationCount?: number;
  children: React.ReactNode;
}

function AdSetRow({
  adset,
  isExpanded,
  onToggle,
  onEdit,
  onToggleStatus,
  recommendationCount,
  children,
}: AdSetRowProps) {
  const insights = adset.insights;

  return (
    <div>
      {/* AdSet Row */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2.5 items-center hover:bg-dashboard-hover/50 transition-colors group border-l-2 border-l-transparent hover:border-l-dashboard-accent/30">
        {/* Name */}
        <div className="col-span-4 flex items-center gap-2 pl-6">
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-dashboard-border transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={14} className="text-gray-500" />
            ) : (
              <ChevronRight size={14} className="text-gray-500" />
            )}
          </button>
          <div className="w-1 h-4 bg-dashboard-border rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-200 truncate">{adset.name}</span>
              {recommendationCount && recommendationCount > 0 && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-dashboard-warning/20 text-dashboard-warning text-xs rounded-full">
                  <AlertTriangle size={10} />
                  {recommendationCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="col-span-1 flex justify-center">
          <StatusBadge status={adset.status} size="sm" />
        </div>

        {/* Budget */}
        <div className="col-span-1 text-right text-sm text-gray-400">
          {adset.daily_budget ? formatCurrency(adset.daily_budget) : '-'}
        </div>

        {/* Spend */}
        <div className="col-span-1 text-right text-sm text-gray-300">
          {insights ? formatCurrency(insights.spend) : '-'}
        </div>

        {/* Impressions */}
        <div className="col-span-1 text-right text-sm text-gray-400">
          {insights ? formatNumber(insights.impressions) : '-'}
        </div>

        {/* Clicks */}
        <div className="col-span-1 text-right text-sm text-gray-400">
          {insights ? formatNumber(insights.clicks) : '-'}
        </div>

        {/* CTR */}
        <div className="col-span-1 text-right text-sm text-gray-400">
          {insights ? `${insights.ctr.toFixed(2)}%` : '-'}
        </div>

        {/* ROAS */}
        <div className="col-span-1 text-right text-sm text-gray-400">
          {insights?.roas ? `${insights.roas.toFixed(2)}x` : '-'}
        </div>

        {/* Actions */}
        <div className="col-span-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onToggleStatus}
            className="p-1 rounded hover:bg-dashboard-border transition-colors"
          >
            {adset.status === 'ACTIVE' ? (
              <Pause size={12} className="text-gray-500" />
            ) : (
              <Play size={12} className="text-gray-500" />
            )}
          </button>
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-dashboard-border transition-colors"
          >
            <Edit2 size={12} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Children (Ads) */}
      {isExpanded && <div>{children}</div>}
    </div>
  );
}

// Ad Row Component
interface AdRowProps {
  ad: MetaAd;
  onEdit: () => void;
  onToggleStatus: () => void;
  recommendationCount?: number;
}

function AdRow({ ad, onEdit, onToggleStatus, recommendationCount }: AdRowProps) {
  const insights = ad.insights;

  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-2 items-center hover:bg-dashboard-hover/30 transition-colors group border-l-2 border-l-transparent hover:border-l-dashboard-accent/20">
      {/* Name */}
      <div className="col-span-4 flex items-center gap-2 pl-14">
        <div className="w-1 h-3 bg-dashboard-border/50 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 truncate">{ad.name}</span>
            {recommendationCount && recommendationCount > 0 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-dashboard-danger/20 text-dashboard-danger text-xs rounded-full">
                <AlertTriangle size={10} />
                {recommendationCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="col-span-1 flex justify-center">
        <StatusBadge status={ad.status} size="xs" />
      </div>

      {/* Budget */}
      <div className="col-span-1 text-right text-xs text-gray-500">-</div>

      {/* Spend */}
      <div className="col-span-1 text-right text-xs text-gray-400">
        {insights ? formatCurrency(insights.spend) : '-'}
      </div>

      {/* Impressions */}
      <div className="col-span-1 text-right text-xs text-gray-500">
        {insights ? formatNumber(insights.impressions) : '-'}
      </div>

      {/* Clicks */}
      <div className="col-span-1 text-right text-xs text-gray-500">
        {insights ? formatNumber(insights.clicks) : '-'}
      </div>

      {/* CTR */}
      <div className="col-span-1 text-right text-xs text-gray-500">
        {insights ? `${insights.ctr.toFixed(2)}%` : '-'}
      </div>

      {/* ROAS */}
      <div className="col-span-1 text-right text-xs text-gray-500">
        {insights?.roas ? `${insights.roas.toFixed(2)}x` : '-'}
      </div>

      {/* Actions */}
      <div className="col-span-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onToggleStatus}
          className="p-1 rounded hover:bg-dashboard-border transition-colors"
        >
          {ad.status === 'ACTIVE' ? (
            <Pause size={10} className="text-gray-500" />
          ) : (
            <Play size={10} className="text-gray-500" />
          )}
        </button>
        <button
          onClick={onEdit}
          className="p-1 rounded hover:bg-dashboard-border transition-colors"
        >
          <Edit2 size={10} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({
  status,
  size = 'md',
}: {
  status: string;
  size?: 'xs' | 'sm' | 'md';
}) {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`${sizeClasses[size]} rounded-full font-medium ${getStatusColor(status)}`}>
      {status === 'ACTIVE' ? 'Active' : status === 'PAUSED' ? 'Paused' : status}
    </span>
  );
}
