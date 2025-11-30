'use client';

import Link from 'next/link';
import { 
  Plug, 
  Users, 
  Bell, 
  CreditCard, 
  Shield, 
  Palette,
  ChevronRight 
} from 'lucide-react';

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: 'Entegrasyonlar',
      description: 'Meta, Google ve diğer platformları bağlayın',
      icon: <Plug size={24} />,
      iconBg: 'from-dashboard-blue to-blue-600',
      href: '/dashboard/settings/integrations',
    },
    {
      title: 'Ekip Yönetimi',
      description: 'Kullanıcıları ekleyin ve yetkileri düzenleyin',
      icon: <Users size={24} />,
      iconBg: 'from-dashboard-purple to-purple-600',
      href: '/dashboard/settings/team',
    },
    {
      title: 'Bildirimler',
      description: 'E-posta ve push bildirim ayarları',
      icon: <Bell size={24} />,
      iconBg: 'from-dashboard-orange to-orange-600',
      href: '/dashboard/settings/notifications',
    },
    {
      title: 'Faturalandırma',
      description: 'Plan ve ödeme bilgilerinizi yönetin',
      icon: <CreditCard size={24} />,
      iconBg: 'from-dashboard-accent to-emerald-600',
      href: '/dashboard/settings/billing',
    },
    {
      title: 'Güvenlik',
      description: 'Şifre ve iki faktörlü doğrulama',
      icon: <Shield size={24} />,
      iconBg: 'from-dashboard-pink to-pink-600',
      href: '/dashboard/settings/security',
    },
    {
      title: 'Görünüm',
      description: 'Tema ve arayüz özelleştirmeleri',
      icon: <Palette size={24} />,
      iconBg: 'from-yellow-500 to-yellow-600',
      href: '/dashboard/settings/appearance',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dashboard-text mb-1">Ayarlar</h1>
        <p className="text-sm text-dashboard-textSecondary">
          Hesabınızı ve tercihlerinizi yönetin
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsCategories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="card card-interactive p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.iconBg} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <ChevronRight size={20} className="text-dashboard-textMuted group-hover:text-dashboard-accent transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-dashboard-text mb-1">
              {category.title}
            </h3>
            <p className="text-sm text-dashboard-textSecondary">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
