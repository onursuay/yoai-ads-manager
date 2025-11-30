'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, DollarSign, Users, Target, Calendar } from 'lucide-react';
import type { MetaCampaign, MetaAdSet, MetaAd } from '@/types/meta-ads';
import { formatCurrency } from '@/lib/utils';

// Generic Edit Modal
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

function EditModal({ isOpen, onClose, title, children, onSave, isSaving }: EditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dashboard-border">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dashboard-hover transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">{children}</div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-dashboard-border bg-dashboard-bg/50">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-dashboard-bg border border-dashboard-border text-gray-300 text-sm font-medium hover:bg-dashboard-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-dashboard-accent to-emerald-600 text-dashboard-bg font-semibold text-sm hover:shadow-lg hover:shadow-dashboard-accent/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Campaign Edit Modal
interface CampaignEditModalProps {
  campaign: MetaCampaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<MetaCampaign>) => Promise<void>;
}

export function CampaignEditModal({
  campaign,
  isOpen,
  onClose,
  onSave,
}: CampaignEditModalProps) {
  const [name, setName] = useState('');
  const [dailyBudget, setDailyBudget] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'PAUSED'>('ACTIVE');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setDailyBudget(campaign.daily_budget?.toString() || '');
      setStatus(campaign.status as 'ACTIVE' | 'PAUSED');
    }
  }, [campaign]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        name,
        daily_budget: dailyBudget ? parseFloat(dailyBudget) : undefined,
        status,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Campaign"
      onSave={handleSave}
      isSaving={isSaving}
    >
      <div className="space-y-5">
        {/* Campaign Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Enter campaign name"
          />
        </div>

        {/* Daily Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Daily Budget
          </label>
          <div className="relative">
            <DollarSign
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="number"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(e.target.value)}
              className="input-field pl-10"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Current spend: {campaign?.insights ? formatCurrency(campaign.insights.spend) : '$0.00'}
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setStatus('ACTIVE')}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                status === 'ACTIVE'
                  ? 'bg-dashboard-success/10 border-dashboard-success text-dashboard-success'
                  : 'bg-dashboard-bg border-dashboard-border text-gray-400 hover:border-gray-500'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatus('PAUSED')}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                status === 'PAUSED'
                  ? 'bg-dashboard-warning/10 border-dashboard-warning text-dashboard-warning'
                  : 'bg-dashboard-bg border-dashboard-border text-gray-400 hover:border-gray-500'
              }`}
            >
              Paused
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Campaign Info</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500">Objective:</span>
              <span className="ml-2 text-gray-300">{campaign?.objective || '-'}</span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 text-gray-300">
                {campaign?.created_time
                  ? new Date(campaign.created_time).toLocaleDateString()
                  : '-'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">ROAS:</span>
              <span className="ml-2 text-dashboard-accent">
                {campaign?.insights?.roas?.toFixed(2) || '0.00'}x
              </span>
            </div>
            <div>
              <span className="text-gray-500">Conversions:</span>
              <span className="ml-2 text-gray-300">
                {campaign?.insights?.conversions?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </EditModal>
  );
}

// AdSet Edit Modal
interface AdSetEditModalProps {
  adset: MetaAdSet | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<MetaAdSet>) => Promise<void>;
}

export function AdSetEditModal({
  adset,
  isOpen,
  onClose,
  onSave,
}: AdSetEditModalProps) {
  const [name, setName] = useState('');
  const [dailyBudget, setDailyBudget] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'PAUSED'>('ACTIVE');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (adset) {
      setName(adset.name);
      setDailyBudget(adset.daily_budget?.toString() || '');
      setBidAmount(adset.bid_amount?.toString() || '');
      setStatus(adset.status as 'ACTIVE' | 'PAUSED');
    }
  }, [adset]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        name,
        daily_budget: dailyBudget ? parseFloat(dailyBudget) : undefined,
        bid_amount: bidAmount ? parseFloat(bidAmount) : undefined,
        status,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Ad Set"
      onSave={handleSave}
      isSaving={isSaving}
    >
      <div className="space-y-5">
        {/* AdSet Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ad Set Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Enter ad set name"
          />
        </div>

        {/* Budget & Bid Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Daily Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Daily Budget
            </label>
            <div className="relative">
              <DollarSign
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                className="input-field pl-10"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Bid Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bid Amount
            </label>
            <div className="relative">
              <DollarSign
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="input-field pl-10"
                placeholder="Auto"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setStatus('ACTIVE')}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                status === 'ACTIVE'
                  ? 'bg-dashboard-success/10 border-dashboard-success text-dashboard-success'
                  : 'bg-dashboard-bg border-dashboard-border text-gray-400 hover:border-gray-500'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatus('PAUSED')}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                status === 'PAUSED'
                  ? 'bg-dashboard-warning/10 border-dashboard-warning text-dashboard-warning'
                  : 'bg-dashboard-bg border-dashboard-border text-gray-400 hover:border-gray-500'
              }`}
            >
              Paused
            </button>
          </div>
        </div>

        {/* Targeting Info */}
        {adset?.targeting && (
          <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-dashboard-accent" />
              <h4 className="text-sm font-medium text-gray-300">Targeting</h4>
            </div>
            <div className="space-y-2 text-xs">
              {adset.targeting.age_min && adset.targeting.age_max && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Age:</span>
                  <span className="text-gray-300">
                    {adset.targeting.age_min} - {adset.targeting.age_max}
                  </span>
                </div>
              )}
              {adset.targeting.geo_locations?.cities && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Locations:</span>
                  <span className="text-gray-300">
                    {adset.targeting.geo_locations.cities.map((c) => c.name).join(', ')}
                  </span>
                </div>
              )}
              {adset.targeting.interests && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Interests:</span>
                  <span className="text-gray-300">
                    {adset.targeting.interests.map((i) => i.name).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </EditModal>
  );
}

// Ad Edit Modal
interface AdEditModalProps {
  ad: MetaAd | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<MetaAd>) => Promise<void>;
}

export function AdEditModal({ ad, isOpen, onClose, onSave }: AdEditModalProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'PAUSED'>('ACTIVE');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (ad) {
      setName(ad.name);
      setStatus(ad.status as 'ACTIVE' | 'PAUSED');
    }
  }, [ad]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        name,
        status,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Ad"
      onSave={handleSave}
      isSaving={isSaving}
    >
      <div className="space-y-5">
        {/* Ad Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ad Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Enter ad name"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setStatus('ACTIVE')}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                status === 'ACTIVE'
                  ? 'bg-dashboard-success/10 border-dashboard-success text-dashboard-success'
                  : 'bg-dashboard-bg border-dashboard-border text-gray-400 hover:border-gray-500'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatus('PAUSED')}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                status === 'PAUSED'
                  ? 'bg-dashboard-warning/10 border-dashboard-warning text-dashboard-warning'
                  : 'bg-dashboard-bg border-dashboard-border text-gray-400 hover:border-gray-500'
              }`}
            >
              Paused
            </button>
          </div>
        </div>

        {/* Creative Preview */}
        {ad?.creative && (
          <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-dashboard-accent" />
              <h4 className="text-sm font-medium text-gray-300">Creative</h4>
            </div>
            <div className="space-y-2">
              {ad.creative.title && (
                <p className="text-sm font-medium text-white">{ad.creative.title}</p>
              )}
              {ad.creative.body && (
                <p className="text-xs text-gray-400">{ad.creative.body}</p>
              )}
              {ad.creative.call_to_action_type && (
                <span className="inline-block px-2 py-1 bg-dashboard-accent/10 text-dashboard-accent text-xs rounded">
                  {ad.creative.call_to_action_type.replace(/_/g, ' ')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Performance Info */}
        {ad?.insights && (
          <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Performance</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-white">
                  {formatCurrency(ad.insights.spend)}
                </p>
                <p className="text-xs text-gray-500">Spend</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {ad.insights.ctr.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500">CTR</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-dashboard-accent">
                  {ad.insights.roas?.toFixed(2) || '0.00'}x
                </p>
                <p className="text-xs text-gray-500">ROAS</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </EditModal>
  );
}
