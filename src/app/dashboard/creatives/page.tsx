'use client';

import { Target, Image, Video, FileText } from 'lucide-react';

export default function CreativesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-dashboard-accent/10">
            <Target size={24} className="text-dashboard-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Creatives</h1>
            <p className="text-gray-400">
              Manage your ad creatives and media assets
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="card p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-dashboard-accent/20 to-emerald-600/20 flex items-center justify-center">
            <Target size={40} className="text-dashboard-accent" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Creative Management Coming Soon
          </h2>
          <p className="text-gray-400 mb-6">
            We're developing a comprehensive creative management system. 
            Upload, organize, and analyze your ad creatives with AI-powered insights and performance tracking.
          </p>
          
          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <Image size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Image Library</h3>
              <p className="text-xs text-gray-400">
                Organize and optimize your ad images
              </p>
            </div>

            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <Video size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Video Assets</h3>
              <p className="text-xs text-gray-400">
                Manage and test video ad performance
              </p>
            </div>

            <div className="p-4 bg-dashboard-bg rounded-xl border border-dashboard-border">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                <FileText size={20} className="text-dashboard-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Copy Testing</h3>
              <p className="text-xs text-gray-400">
                A/B test different ad copy variations
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



