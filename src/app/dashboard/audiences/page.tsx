'use client';

import { Users, Target, UserPlus, Filter } from 'lucide-react';

export default function AudiencesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-dashboard-accent/10">
            <Users size={24} className="text-dashboard-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Audiences</h1>
            <p className="text-gray-400">
              Create and manage custom audiences for targeted advertising
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="card p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-dashboard-accent/20 to-emerald-600/20 flex items-center justify-center">
            <Users size={40} className="text-dashboard-accent" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Audience Management Coming Soon
          </h2>
          <p className="text-gray-400 mb-6">
            We're building powerful audience tools to help you reach the right people. 
            Create custom audiences, lookalikes, and manage your targeting strategies all in one place.
          </p>
          
          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <UserPlus size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Custom Audiences</h3>
              <p className="text-xs text-gray-400">
                Build audiences from your customer data
              </p>
            </div>

            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <Target size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Lookalike Audiences</h3>
              <p className="text-xs text-gray-400">
                Find similar people to your best customers
              </p>
            </div>

            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <Filter size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Advanced Targeting</h3>
              <p className="text-xs text-gray-400">
                Precise demographic and interest targeting
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



