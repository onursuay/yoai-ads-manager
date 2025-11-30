import { type ClassValue, clsx } from 'clsx';

// Class Name Merger (Tailwind için)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Para Formatı
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Büyük Sayı Formatı (1.2K, 1.5M gibi)
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

// Yüzde Formatı
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

// Tarih Formatı
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'relative') {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 7) {
      return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }
    if (days > 0) {
      return `${days} gün önce`;
    }
    if (hours > 0) {
      return `${hours} saat önce`;
    }
    if (minutes > 0) {
      return `${minutes} dakika önce`;
    }
    return 'Az önce';
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Tarih Aralığı için ISO String
export function getDateRangeISO(preset: string): { start: string; end: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let start: Date;
  let end: Date = now;
  
  switch (preset) {
    case 'today':
      start = today;
      break;
    case 'yesterday':
      start = new Date(today);
      start.setDate(start.getDate() - 1);
      end = new Date(today);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'last7days':
      start = new Date(today);
      start.setDate(start.getDate() - 7);
      break;
    case 'last30days':
      start = new Date(today);
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
      start = new Date(today);
      start.setDate(start.getDate() - 7);
  }
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

// Status Rengi
export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'status-active';
    case 'PAUSED':
      return 'status-paused';
    case 'DELETED':
    case 'ARCHIVED':
      return 'status-deleted';
    default:
      return '';
  }
}

// Priority Rengi
export function getPriorityColor(priority: string): string {
  switch (priority.toUpperCase()) {
    case 'HIGH':
      return 'priority-high';
    case 'MEDIUM':
      return 'priority-medium';
    case 'LOW':
      return 'priority-low';
    default:
      return '';
  }
}

// Recommendation Type İkonu ve Rengi
export function getRecommendationTypeInfo(type: string): {
  icon: string;
  color: string;
  label: string;
} {
  switch (type) {
    case 'CREATIVE_FATIGUE':
      return { icon: '🎨', color: 'text-orange-400', label: 'Creative Fatigue' };
    case 'BUDGET_INCREASE':
      return { icon: '📈', color: 'text-green-400', label: 'Budget Increase' };
    case 'BUDGET_DECREASE':
      return { icon: '📉', color: 'text-yellow-400', label: 'Budget Decrease' };
    case 'AUDIENCE_EXPANSION':
      return { icon: '👥', color: 'text-blue-400', label: 'Audience Expansion' };
    case 'BID_ADJUSTMENT':
      return { icon: '💰', color: 'text-purple-400', label: 'Bid Adjustment' };
    case 'TARGETING_OPTIMIZATION':
      return { icon: '🎯', color: 'text-cyan-400', label: 'Targeting' };
    default:
      return { icon: '💡', color: 'text-gray-400', label: type };
  }
}

// Objective Çevirisi
export function getObjectiveLabel(objective: string): string {
  const labels: Record<string, string> = {
    CONVERSIONS: 'Conversions',
    BRAND_AWARENESS: 'Brand Awareness',
    REACH: 'Reach',
    TRAFFIC: 'Traffic',
    ENGAGEMENT: 'Engagement',
    APP_INSTALLS: 'App Installs',
    VIDEO_VIEWS: 'Video Views',
    LEAD_GENERATION: 'Lead Generation',
    MESSAGES: 'Messages',
    CATALOG_SALES: 'Catalog Sales',
    STORE_VISITS: 'Store Visits',
  };
  return labels[objective] || objective;
}

// Değişim Yüzdesi Badge'i
export function getChangeIndicator(change: number): {
  text: string;
  color: string;
  arrow: string;
} {
  if (change > 0) {
    return {
      text: `+${change.toFixed(1)}%`,
      color: 'text-green-400',
      arrow: '↑',
    };
  }
  if (change < 0) {
    return {
      text: `${change.toFixed(1)}%`,
      color: 'text-red-400',
      arrow: '↓',
    };
  }
  return {
    text: '0%',
    color: 'text-gray-400',
    arrow: '→',
  };
}

// Debounce Helper
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle Helper
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Copy to Clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Generate Random ID
export function generateId(prefix: string = ''): string {
  const random = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now().toString(36);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}
