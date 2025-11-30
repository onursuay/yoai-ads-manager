import type {
  MetaCampaign,
  MetaAdSet,
  MetaAd,
  MetaRecommendation,
  CampaignUpdateRequest,
  AdSetUpdateRequest,
  AdUpdateRequest,
  ApplyRecommendationRequest,
  ApiResponse,
} from '@/types/meta-ads';

// n8n Webhook Base URL - .env'den alınacak
const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook';

// API Helper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${N8N_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: data.message || 'Request failed',
        },
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

// ==================== CAMPAIGNS ====================

export async function fetchCampaigns(
  adAccountId: string,
  accessToken: string
): Promise<ApiResponse<MetaCampaign[]>> {
  return fetchApi<MetaCampaign[]>('/meta/campaigns', {
    method: 'POST',
    body: JSON.stringify({ ad_account_id: adAccountId, access_token: accessToken }),
  });
}

export async function updateCampaign(
  request: CampaignUpdateRequest,
  accessToken: string
): Promise<ApiResponse<MetaCampaign>> {
  return fetchApi<MetaCampaign>('/meta/campaign/update', {
    method: 'POST',
    body: JSON.stringify({ ...request, access_token: accessToken }),
  });
}

export async function createCampaign(
  adAccountId: string,
  campaignData: Partial<MetaCampaign>,
  accessToken: string
): Promise<ApiResponse<MetaCampaign>> {
  return fetchApi<MetaCampaign>('/meta/campaign/create', {
    method: 'POST',
    body: JSON.stringify({
      ad_account_id: adAccountId,
      campaign: campaignData,
      access_token: accessToken,
    }),
  });
}

// ==================== AD SETS ====================

export async function fetchAdSets(
  campaignId: string,
  accessToken: string
): Promise<ApiResponse<MetaAdSet[]>> {
  return fetchApi<MetaAdSet[]>('/meta/adsets', {
    method: 'POST',
    body: JSON.stringify({ campaign_id: campaignId, access_token: accessToken }),
  });
}

export async function fetchAllAdSets(
  adAccountId: string,
  accessToken: string
): Promise<ApiResponse<MetaAdSet[]>> {
  return fetchApi<MetaAdSet[]>('/meta/adsets/all', {
    method: 'POST',
    body: JSON.stringify({ ad_account_id: adAccountId, access_token: accessToken }),
  });
}

export async function updateAdSet(
  request: AdSetUpdateRequest,
  accessToken: string
): Promise<ApiResponse<MetaAdSet>> {
  return fetchApi<MetaAdSet>('/meta/adset/update', {
    method: 'POST',
    body: JSON.stringify({ ...request, access_token: accessToken }),
  });
}

// ==================== ADS ====================

export async function fetchAds(
  adSetId: string,
  accessToken: string
): Promise<ApiResponse<MetaAd[]>> {
  return fetchApi<MetaAd[]>('/meta/ads', {
    method: 'POST',
    body: JSON.stringify({ adset_id: adSetId, access_token: accessToken }),
  });
}

export async function fetchAllAds(
  adAccountId: string,
  accessToken: string
): Promise<ApiResponse<MetaAd[]>> {
  return fetchApi<MetaAd[]>('/meta/ads/all', {
    method: 'POST',
    body: JSON.stringify({ ad_account_id: adAccountId, access_token: accessToken }),
  });
}

export async function updateAd(
  request: AdUpdateRequest,
  accessToken: string
): Promise<ApiResponse<MetaAd>> {
  return fetchApi<MetaAd>('/meta/ad/update', {
    method: 'POST',
    body: JSON.stringify({ ...request, access_token: accessToken }),
  });
}

// ==================== INSIGHTS ====================

export async function fetchCampaignInsights(
  campaignId: string,
  dateRange: { start: string; end: string },
  accessToken: string
): Promise<ApiResponse<any>> {
  return fetchApi('/meta/insights/campaign', {
    method: 'POST',
    body: JSON.stringify({
      campaign_id: campaignId,
      date_start: dateRange.start,
      date_stop: dateRange.end,
      access_token: accessToken,
    }),
  });
}

export async function fetchAccountInsights(
  adAccountId: string,
  dateRange: { start: string; end: string },
  accessToken: string
): Promise<ApiResponse<any>> {
  return fetchApi('/meta/insights/account', {
    method: 'POST',
    body: JSON.stringify({
      ad_account_id: adAccountId,
      date_start: dateRange.start,
      date_stop: dateRange.end,
      access_token: accessToken,
    }),
  });
}

// ==================== RECOMMENDATIONS ====================

export async function fetchRecommendations(
  adAccountId: string,
  accessToken: string
): Promise<ApiResponse<MetaRecommendation[]>> {
  return fetchApi<MetaRecommendation[]>('/meta/recommendations', {
    method: 'POST',
    body: JSON.stringify({ ad_account_id: adAccountId, access_token: accessToken }),
  });
}

export async function applyRecommendation(
  request: ApplyRecommendationRequest,
  accessToken: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return fetchApi('/meta/recommendation/apply', {
    method: 'POST',
    body: JSON.stringify({ ...request, access_token: accessToken }),
  });
}

export async function dismissRecommendation(
  recommendationId: string,
  accessToken: string
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchApi('/meta/recommendation/dismiss', {
    method: 'POST',
    body: JSON.stringify({ recommendation_id: recommendationId, access_token: accessToken }),
  });
}

// ==================== CREATIVE FATIGUE ====================

export async function checkCreativeFatigue(
  adAccountId: string,
  accessToken: string
): Promise<ApiResponse<{
  fatigued_ads: Array<{
    ad_id: string;
    ad_name: string;
    fatigue_score: number;
    frequency: number;
    performance_drop: number;
    recommendation: string;
  }>;
}>> {
  return fetchApi('/meta/creative-fatigue', {
    method: 'POST',
    body: JSON.stringify({ ad_account_id: adAccountId, access_token: accessToken }),
  });
}

// ==================== SYNC ALL ====================

export async function syncAllData(
  adAccountId: string,
  accessToken: string
): Promise<ApiResponse<{
  campaigns: MetaCampaign[];
  adsets: MetaAdSet[];
  ads: MetaAd[];
  recommendations: MetaRecommendation[];
  insights: any;
}>> {
  return fetchApi('/meta/sync-all', {
    method: 'POST',
    body: JSON.stringify({ ad_account_id: adAccountId, access_token: accessToken }),
  });
}

// ==================== BULK OPERATIONS ====================

export async function bulkUpdateStatus(
  entityType: 'campaign' | 'adset' | 'ad',
  entityIds: string[],
  status: 'ACTIVE' | 'PAUSED',
  accessToken: string
): Promise<ApiResponse<{ updated: string[]; failed: string[] }>> {
  return fetchApi('/meta/bulk/status', {
    method: 'POST',
    body: JSON.stringify({
      entity_type: entityType,
      entity_ids: entityIds,
      status,
      access_token: accessToken,
    }),
  });
}
