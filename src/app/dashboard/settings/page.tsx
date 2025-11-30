'use client';

import { Settings, User, Bell, Key, CreditCard, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-dashboard-accent/10">
            <Settings size={24} className="text-dashboard-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">
              Manage your account, integrations, and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="card p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-dashboard-accent/20 to-emerald-600/20 flex items-center justify-center">
            <Settings size={40} className="text-dashboard-accent" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Settings Dashboard Coming Soon
          </h2>
          <p className="text-gray-400 mb-6">
            We're creating a comprehensive settings area where you can manage your account, 
            integrations, billing, and customize your experience.
          </p>
          
          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <User size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Account Settings</h3>
              <p className="text-xs text-gray-400">
                Update your profile and preferences
              </p>
            </div>

            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <Key size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">API Integrations</h3>
              <p className="text-xs text-gray-400">
                Manage connected platforms and APIs
              </p>
            </div>

            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <Bell size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Notifications</h3>
              <p className="text-xs text-gray-400">
                Configure alerts and email preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <CreditCard size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Billing & Plans</h3>
              <p className="text-xs text-gray-400">
                Manage subscription and payment methods
              </p>
            </div>

            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <Globe size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Language & Region</h3>
              <p className="text-xs text-gray-400">
                Set language, timezone, and currency
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-dashboard-warning/10 border border-dashboard-warning/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-dashboard-warning animate-pulse" />
            <span className="text-sm font-medium text-dashboard-warning">In Development</span>
          </div>
        </div>
      </div>
    </div>
  );
}



