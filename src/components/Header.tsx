'use client';

import { useState } from 'react';
import {
  Search,
  Bell,
  RefreshCw,
  ChevronDown,
  Calendar,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { useAdsStore } from '@/lib/store';

const datePresets = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'last7days' },
  { label: 'Last 30 days', value: 'last30days' },
  { label: 'This month', value: 'thisMonth' },
  { label: 'Last month', value: 'lastMonth' },
];

export default function Header() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { filters, setFilters, isSyncing, syncAllData } = useAdsStore();

  const currentPreset = datePresets.find(
    (p) => p.value === filters.dateRange.preset
  );

  const handleDatePresetChange = (preset: string) => {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (preset) {
      case 'today':
        start = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'yesterday':
        start = new Date(now);
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case 'last7days':
        start = new Date(now);
        start.setDate(start.getDate() - 7);
        break;
      case 'last30days':
        start = new Date(now);
        start.setDate(start.getDate() - 30);
        break;
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      default:
        start = new Date(now);
        start.setDate(start.getDate() - 7);
    }

    setFilters({
      dateRange: { start, end, preset: preset as 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' },
    });
    setShowDatePicker(false);
  };

  return (
    <header className="h-16 bg-dashboard-card border-b border-dashboard-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-dashboard-textMuted"
          />
          <input
            type="text"
            placeholder="Search campaigns, ad sets, ads..."
            className="w-full pl-11 pr-4 py-2.5 bg-dashboard-bg border border-dashboard-border rounded-lg text-sm text-dashboard-text placeholder:text-dashboard-textMuted focus:outline-none focus:border-dashboard-accent focus:ring-2 focus:ring-dashboard-accent/20 transition-colors"
            value={filters.search || ''}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Date Range Picker */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-4 py-2.5 bg-dashboard-bg border border-dashboard-border rounded-lg text-sm text-dashboard-textSecondary hover:border-dashboard-accent transition-colors"
          >
            <Calendar size={16} />
            <span>{currentPreset?.label || 'Select dates'}</span>
            <ChevronDown size={16} />
          </button>

          {showDatePicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDatePicker(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-dashboard-card border border-dashboard-border rounded-lg shadow-xl z-50 py-2 animate-slide-down">
                {datePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleDatePresetChange(preset.value)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      filters.dateRange.preset === preset.value
                        ? 'text-dashboard-accent bg-dashboard-accent/10'
                        : 'text-dashboard-textSecondary hover:bg-dashboard-cardHover'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sync Button */}
        <button
          onClick={() => syncAllData()}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-dashboard-bg border border-dashboard-border rounded-lg text-sm text-dashboard-textSecondary hover:border-dashboard-accent transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
          <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-dashboard-bg border border-dashboard-border rounded-lg text-dashboard-textSecondary hover:text-dashboard-text hover:border-dashboard-accent transition-colors"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-dashboard-danger text-white text-xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 bg-dashboard-card border border-dashboard-border rounded-lg shadow-xl z-50 animate-slide-down">
                <div className="p-4 border-b border-dashboard-border">
                  <h3 className="font-semibold text-dashboard-text">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {/* Notification Items */}
                  <div className="p-3 hover:bg-dashboard-cardHover cursor-pointer border-l-2 border-dashboard-danger">
                    <p className="text-sm text-dashboard-text font-medium">
                      Creative Fatigue Detected
                    </p>
                    <p className="text-xs text-dashboard-textSecondary mt-1">
                      "Sonbahar Görsel 1" showing 45% performance drop
                    </p>
                    <p className="text-xs text-dashboard-textMuted mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 hover:bg-dashboard-cardHover cursor-pointer border-l-2 border-dashboard-success">
                    <p className="text-sm text-dashboard-text font-medium">
                      Budget Recommendation
                    </p>
                    <p className="text-xs text-dashboard-textSecondary mt-1">
                      Increase "Retargeting" budget for +30% conversions
                    </p>
                    <p className="text-xs text-dashboard-textMuted mt-1">5 hours ago</p>
                  </div>
                  <div className="p-3 hover:bg-dashboard-cardHover cursor-pointer border-l-2 border-dashboard-warning">
                    <p className="text-sm text-dashboard-text font-medium">
                      Audience Expansion
                    </p>
                    <p className="text-xs text-dashboard-textSecondary mt-1">
                      Add İzmir & Bursa to reach 93% more users
                    </p>
                    <p className="text-xs text-dashboard-textMuted mt-1">1 day ago</p>
                  </div>
                </div>
                <div className="p-3 border-t border-dashboard-border">
                  <button className="w-full text-center text-sm text-dashboard-accent hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-3 pr-4 py-1.5 bg-dashboard-bg border border-dashboard-border rounded-lg hover:border-dashboard-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dashboard-accent to-emerald-600 flex items-center justify-center">
              <User size={16} className="text-dashboard-bg" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-dashboard-text">YO Digital</p>
              <p className="text-xs text-dashboard-textMuted">Admin</p>
            </div>
            <ChevronDown size={16} className="text-dashboard-textSecondary" />
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-dashboard-card border border-dashboard-border rounded-lg shadow-xl z-50 py-2 animate-slide-down">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dashboard-textSecondary hover:bg-dashboard-cardHover transition-colors">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="my-1 border-t border-dashboard-border" />
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dashboard-danger hover:bg-dashboard-cardHover transition-colors">
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
