// Meta Ads Types
export interface MetaCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  objective: string;
  daily_budget?: number;
  lifetime_budget?: number;
  created_time: string;
  updated_time: string;
  insights?: CampaignInsights;
  adsets?: MetaAdSet[];
}

export interface MetaAdSet {
  id: string;
  campaign_id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  daily_budget?: number;
  lifetime_budget?: number;
  targeting?: AdSetTargeting;
  optimization_goal: string;
  billing_event: string;
  bid_amount?: number;
  created_time: string;
  insights?: AdSetInsights;
  ads?: MetaAd[];
}

export interface MetaAd {
  id: string;
  adset_id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  creative?: AdCreative;
  created_time: string;
  insights?: AdInsights;
  preview_url?: string;
}

export interface AdCreative {
  id: string;
  name: string;
  title?: string;
  body?: string;
  image_url?: string;
  video_url?: string;
  call_to_action_type?: string;
  link_url?: string;
  thumbnail_url?: string;
}

export interface AdSetTargeting {
  age_min?: number;
  age_max?: number;
  genders?: number[];
  geo_locations?: {
    countries?: string[];
    cities?: { key: string; name: string }[];
  };
  interests?: { id: string; name: string }[];
  behaviors?: { id: string; name: string }[];
  custom_audiences?: { id: string; name: string }[];
}

// Insights Types
export interface CampaignInsights {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  reach: number;
  frequency: number;
  conversions?: number;
  conversion_value?: number;
  roas?: number;
  date_start: string;
  date_stop: string;
}

export interface AdSetInsights extends CampaignInsights {
  cost_per_result?: number;
  result_rate?: number;
}

export interface AdInsights extends AdSetInsights {
  video_views?: number;
  video_p25_watched?: number;
  video_p50_watched?: number;
  video_p75_watched?: number;
  video_p100_watched?: number;
}

// Meta Recommendations Types
export interface MetaRecommendation {
  id: string;
  recommendation_type: RecommendationType;
  title: string;
  description: string;
  impact: RecommendationImpact;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  entity_type: 'CAMPAIGN' | 'ADSET' | 'AD';
  entity_id: string;
  entity_name: string;
  suggested_action: SuggestedAction;
  applied: boolean;
  dismissed: boolean;
  created_time: string;
  expires_at?: string;
}

export type RecommendationType = 
  | 'BUDGET_INCREASE'
  | 'BUDGET_DECREASE'
  | 'CREATIVE_FATIGUE'
  | 'AUDIENCE_EXPANSION'
  | 'BID_ADJUSTMENT'
  | 'CREATIVE_UPDATE'
  | 'TARGETING_OPTIMIZATION'
  | 'SCHEDULE_OPTIMIZATION'
  | 'PLACEMENT_OPTIMIZATION';

export interface RecommendationImpact {
  metric: string;
  current_value: number;
  projected_value: number;
  change_percentage: number;
}

export interface SuggestedAction {
  action_type: string;
  field?: string;
  current_value?: any;
  suggested_value?: any;
  details?: Record<string, any>;
}

// Dashboard State Types
export interface DashboardFilters {
  platform: 'all' | 'meta' | 'google';
  dateRange: {
    start: Date;
    end: Date;
    preset?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'custom';
  };
  status?: ('ACTIVE' | 'PAUSED')[];
  search?: string;
}

export interface DashboardMetrics {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCTR: number;
  averageCPC: number;
  averageROAS: number;
  spendChange: number;
  impressionsChange: number;
  clicksChange: number;
  conversionsChange: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Connected Account Types
export interface ConnectedAccount {
  id: string;
  user_id: string;
  platform: 'meta' | 'google';
  account_id: string;
  account_name: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  selected_ad_accounts?: string[];
  created_at: string;
  updated_at: string;
}

// Update Request Types
export interface CampaignUpdateRequest {
  campaign_id: string;
  updates: {
    name?: string;
    status?: 'ACTIVE' | 'PAUSED';
    daily_budget?: number;
    lifetime_budget?: number;
  };
}

export interface AdSetUpdateRequest {
  adset_id: string;
  updates: {
    name?: string;
    status?: 'ACTIVE' | 'PAUSED';
    daily_budget?: number;
    bid_amount?: number;
    targeting?: Partial<AdSetTargeting>;
  };
}

export interface AdUpdateRequest {
  ad_id: string;
  updates: {
    name?: string;
    status?: 'ACTIVE' | 'PAUSED';
  };
}

export interface ApplyRecommendationRequest {
  recommendation_id: string;
  entity_type: 'CAMPAIGN' | 'ADSET' | 'AD';
  entity_id: string;
  action: SuggestedAction;
}
