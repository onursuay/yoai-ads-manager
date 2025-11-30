import { create } from 'zustand';
import type { 
  MetaCampaign, 
  MetaAdSet, 
  MetaAd, 
  MetaRecommendation,
  DashboardFilters,
  DashboardMetrics,
  ConnectedAccount 
} from '@/types/meta-ads';

interface AdsStore {
  // Data
  campaigns: MetaCampaign[];
  adsets: MetaAdSet[];
  ads: MetaAd[];
  recommendations: MetaRecommendation[];
  connectedAccounts: ConnectedAccount[];
  
  // UI State
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  selectedCampaignId: string | null;
  selectedAdSetId: string | null;
  expandedCampaigns: Set<string>;
  expandedAdSets: Set<string>;
  
  // Filters
  filters: DashboardFilters;
  
  // Metrics
  metrics: DashboardMetrics | null;
  
  // Actions
  setCampaigns: (campaigns: MetaCampaign[]) => void;
  setAdSets: (adsets: MetaAdSet[]) => void;
  setAds: (ads: MetaAd[]) => void;
  setRecommendations: (recommendations: MetaRecommendation[]) => void;
  setConnectedAccounts: (accounts: ConnectedAccount[]) => void;
  
  setLoading: (loading: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setError: (error: string | null) => void;
  
  selectCampaign: (id: string | null) => void;
  selectAdSet: (id: string | null) => void;
  toggleCampaignExpand: (id: string) => void;
  toggleAdSetExpand: (id: string) => void;
  
  setFilters: (filters: Partial<DashboardFilters>) => void;
  setMetrics: (metrics: DashboardMetrics) => void;
  
  // Campaign Actions
  updateCampaignStatus: (id: string, status: 'ACTIVE' | 'PAUSED') => void;
  updateCampaignBudget: (id: string, budget: number) => void;
  
  // AdSet Actions
  updateAdSetStatus: (id: string, status: 'ACTIVE' | 'PAUSED') => void;
  updateAdSetBudget: (id: string, budget: number) => void;
  
  // Ad Actions
  updateAdStatus: (id: string, status: 'ACTIVE' | 'PAUSED') => void;
  
  // Recommendation Actions
  applyRecommendation: (id: string) => void;
  dismissRecommendation: (id: string) => void;
  
  // Sync
  syncAllData: () => Promise<void>;
}

const getDefaultFilters = (): DashboardFilters => ({
  platform: 'all',
  dateRange: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(),
    preset: 'last7days',
  },
  status: ['ACTIVE', 'PAUSED'],
  search: '',
});

export const useAdsStore = create<AdsStore>((set, get) => ({
  // Initial Data
  campaigns: [],
  adsets: [],
  ads: [],
  recommendations: [],
  connectedAccounts: [],
  
  // Initial UI State
  isLoading: false,
  isSyncing: false,
  error: null,
  selectedCampaignId: null,
  selectedAdSetId: null,
  expandedCampaigns: new Set(),
  expandedAdSets: new Set(),
  
  // Initial Filters
  filters: getDefaultFilters(),
  
  // Initial Metrics
  metrics: null,
  
  // Data Setters
  setCampaigns: (campaigns) => set({ campaigns }),
  setAdSets: (adsets) => set({ adsets }),
  setAds: (ads) => set({ ads }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setConnectedAccounts: (accounts) => set({ connectedAccounts: accounts }),
  
  // UI State Setters
  setLoading: (isLoading) => set({ isLoading }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  setError: (error) => set({ error }),
  
  selectCampaign: (selectedCampaignId) => set({ selectedCampaignId }),
  selectAdSet: (selectedAdSetId) => set({ selectedAdSetId }),
  
  toggleCampaignExpand: (id) => set((state) => {
    const newExpanded = new Set(state.expandedCampaigns);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    return { expandedCampaigns: newExpanded };
  }),
  
  toggleAdSetExpand: (id) => set((state) => {
    const newExpanded = new Set(state.expandedAdSets);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    return { expandedAdSets: newExpanded };
  }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  setMetrics: (metrics) => set({ metrics }),
  
  // Campaign Actions
  updateCampaignStatus: (id, status) => set((state) => ({
    campaigns: state.campaigns.map((c) =>
      c.id === id ? { ...c, status } : c
    )
  })),
  
  updateCampaignBudget: (id, budget) => set((state) => ({
    campaigns: state.campaigns.map((c) =>
      c.id === id ? { ...c, daily_budget: budget } : c
    )
  })),
  
  // AdSet Actions
  updateAdSetStatus: (id, status) => set((state) => ({
    adsets: state.adsets.map((a) =>
      a.id === id ? { ...a, status } : a
    )
  })),
  
  updateAdSetBudget: (id, budget) => set((state) => ({
    adsets: state.adsets.map((a) =>
      a.id === id ? { ...a, daily_budget: budget } : a
    )
  })),
  
  // Ad Actions
  updateAdStatus: (id, status) => set((state) => ({
    ads: state.ads.map((a) =>
      a.id === id ? { ...a, status } : a
    )
  })),
  
  // Recommendation Actions
  applyRecommendation: (id) => set((state) => ({
    recommendations: state.recommendations.map((r) =>
      r.id === id ? { ...r, applied: true } : r
    )
  })),
  
  dismissRecommendation: (id) => set((state) => ({
    recommendations: state.recommendations.map((r) =>
      r.id === id ? { ...r, dismissed: true } : r
    )
  })),
  
  // Sync All Data
  syncAllData: async () => {
    const { setLoading, setSyncing, setError } = get();
    
    try {
      setSyncing(true);
      setError(null);
      
      // Bu fonksiyon n8n webhook'larına istek atacak
      // Şimdilik mock data kullanıyoruz
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSyncing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sync failed');
      setSyncing(false);
    }
  },
}));

// Selectors
export const selectFilteredCampaigns = (state: AdsStore) => {
  const { campaigns, filters } = state;
  
  return campaigns.filter((campaign) => {
    // Platform filter
    if (filters.platform !== 'all') {
      // Şimdilik sadece meta var
      if (filters.platform !== 'meta') return false;
    }
    
    // Status filter
    if (filters.status && !filters.status.includes(campaign.status as 'ACTIVE' | 'PAUSED')) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!campaign.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });
};

export const selectActiveRecommendations = (state: AdsStore) => {
  return state.recommendations.filter((r) => !r.applied && !r.dismissed);
};

export const selectHighPriorityRecommendations = (state: AdsStore) => {
  return state.recommendations.filter(
    (r) => !r.applied && !r.dismissed && r.priority === 'HIGH'
  );
};
