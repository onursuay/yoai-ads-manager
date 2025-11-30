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
import { 
  Zap, 
  TrendingUp, 
  RotateCw, 
  Link as LinkIcon, 
  MessageSquare, 
  Calendar,
  BookOpen,
  Target,
  BarChart3,
  FileText,
  Lightbulb,
  Play,
  ExternalLink
} from 'lucide-react';

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
    isLoading,
    setLoading,
  } = useAdsStore();

  const [selectedPlatform, setSelectedPlatform] = useState<'meta' | 'google'>('meta');

  // Load mock data on mount
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setAdSets(mockAdSets);
      setAds(mockAds);
      setRecommendations(mockRecommendations);
      setMetrics(mockMetrics);
      setLoading(false);
    }, 800);
  }, [setCampaigns, setAdSets, setAds, setRecommendations, setMetrics, setLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-dashboard-textSecondary">Loading your ads data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Switcher */}
      <div className="flex items-center gap-2 p-1 bg-dashboard-card border border-dashboard-border rounded-lg w-fit">
        <button
          onClick={() => setSelectedPlatform('meta')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            selectedPlatform === 'meta'
              ? 'bg-dashboard-cardHover text-dashboard-text'
              : 'text-dashboard-textSecondary hover:text-dashboard-text'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
              fill="#0866FF"
            />
          </svg>
          <span>Meta Ads</span>
        </button>
        <button
          onClick={() => setSelectedPlatform('google')}
          disabled
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all opacity-50 cursor-not-allowed ${
            selectedPlatform === 'google'
              ? 'bg-dashboard-cardHover text-dashboard-text'
              : 'text-dashboard-textSecondary'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          </svg>
          <span>Google Ads</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-dashboard-warning/20 text-dashboard-warning rounded-full">SOON</span>
        </button>
      </div>

      {/* Hızlı Aksiyonlar */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-dashboard-text mb-1">Hızlı Aksiyonlar</h2>
          <p className="text-sm text-dashboard-textSecondary">Reklamlarınızı hızlıca yönetin ve optimize edin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            icon={<Zap size={24} />}
            iconBg="from-dashboard-purple to-purple-700"
            title="Hızlı Reklam"
            description="Dakikalar içinde yeni reklam oluşturun"
          />
          <QuickActionCard
            icon={<TrendingUp size={24} />}
            iconBg="from-dashboard-accent to-emerald-600"
            title="Gönderiyi Öne Çıkar"
            description="En iyi performans gösteren gönderiyi öne çıkarın"
          />
          <QuickActionCard
            icon={<RotateCw size={24} />}
            iconBg="from-dashboard-orange to-orange-600"
            title="En İyi Reklamı Tekrarla"
            description="Başarılı reklamları otomatik olarak tekrarlayın"
          />
          <QuickActionCard
            icon={<LinkIcon size={24} />}
            iconBg="from-yellow-500 to-yellow-600"
            title="Kırık Bağlantı Kontrolü"
            description="Reklamlarınızdaki kırık linkleri bulun"
          />
          <QuickActionCard
            icon={<MessageSquare size={24} />}
            iconBg="from-dashboard-blue to-blue-600"
            title="Yorumları Gör ve Yanıtla"
            description="Reklam yorumlarını tek yerden yönetin"
          />
          <QuickActionCard
            icon={<Calendar size={24} />}
            iconBg="from-dashboard-pink to-pink-600"
            title="Son 15 Günde"
            description="Son 15 günün performans raporunu görün"
          />
        </div>
      </div>

      {/* yoai 101 */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-dashboard-text mb-1">yoai 101</h2>
          <p className="text-sm text-dashboard-textSecondary">Reklamcılık hakkında bilmeniz gereken her şey</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          <EducationCard
            icon={<BookOpen size={32} />}
            iconColor="text-blue-400"
            title="Meta Business"
            description="Meta Business Manager kurulumu ve yönetimi"
          />
          <EducationCard
            icon={<Target size={32} />}
            iconColor="text-green-400"
            title="Google Ads"
            description="Google Ads kampanya stratejileri"
          />
          <EducationCard
            icon={<BarChart3 size={32} />}
            iconColor="text-purple-400"
            title="Reklamlar"
            description="Etkili reklam metinleri ve görselleri"
          />
          <EducationCard
            icon={<FileText size={32} />}
            iconColor="text-orange-400"
            title="Raporlar"
            description="Performans raporlarını okuma ve analiz"
          />
          <EducationCard
            icon={<Lightbulb size={32} />}
            iconColor="text-yellow-400"
            title="Strateji"
            description="Başarılı reklam stratejileri geliştirin"
          />
        </div>
      </div>
    </div>
  );
}

// Quick Action Card Component
interface QuickActionCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

function QuickActionCard({ icon, iconBg, title, description }: QuickActionCardProps) {
  return (
    <div className="card card-interactive p-5 group cursor-pointer">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-dashboard-text mb-1">{title}</h3>
      <p className="text-sm text-dashboard-textSecondary">{description}</p>
    </div>
  );
}

// Education Card Component
interface EducationCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
}

function EducationCard({ icon, iconColor, title, description }: EducationCardProps) {
  return (
    <div className="card card-interactive p-6 min-w-[280px] group cursor-pointer">
      <div className={`${iconColor} mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-dashboard-text mb-2">{title}</h3>
      <p className="text-sm text-dashboard-textSecondary mb-4">{description}</p>
      <button className="flex items-center gap-2 text-sm font-medium text-dashboard-accent hover:gap-3 transition-all">
        <span>Daha Fazla</span>
        <ExternalLink size={16} />
      </button>
    </div>
  );
}
