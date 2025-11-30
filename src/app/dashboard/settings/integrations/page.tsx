'use client';

import { useState } from 'react';
import { Facebook, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import MetaConnectWizard from '@/components/MetaConnectWizard';
import type { MetaConnectionPayload } from '@/types/meta-integration';

export default function IntegrationsPage() {
  const [showMetaWizard, setShowMetaWizard] = useState(false);
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [metaConnection, setMetaConnection] = useState<MetaConnectionPayload | null>(null);

  const handleMetaConnect = (payload: MetaConnectionPayload) => {
    console.log('Meta Connection Payload:', payload);
    setMetaConnection(payload);
    setIsMetaConnected(true);
    // Here you would send the payload to your backend/n8n
  };

  const handleMetaDisconnect = () => {
    if (confirm('Meta bağlantısını kaldırmak istediğinizden emin misiniz?')) {
      setIsMetaConnected(false);
      setMetaConnection(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dashboard-text mb-1">Entegrasyonlar</h1>
        <p className="text-sm text-dashboard-textSecondary">
          Reklam platformlarınızı bağlayın ve yönetin
        </p>
      </div>

      {/* Meta Integration Card */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
            <Facebook size={32} className="text-white" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-dashboard-text mb-1">
                  Meta Business Suite
                </h3>
                <p className="text-sm text-dashboard-textSecondary">
                  Facebook ve Instagram reklamlarını yönetin
                </p>
              </div>
              {isMetaConnected && (
                <div className="flex items-center gap-2 px-3 py-1 bg-dashboard-accent/10 text-dashboard-accent rounded-full">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Bağlı</span>
                </div>
              )}
            </div>

            {/* Connection Details */}
            {isMetaConnected && metaConnection ? (
              <div className="space-y-3 mb-4">
                <div className="p-3 bg-dashboard-bg rounded-lg">
                  <p className="text-xs text-dashboard-textMuted mb-2">Bağlı Hesaplar:</p>
                  <div className="space-y-1">
                    <p className="text-sm text-dashboard-text">
                      • Facebook Sayfaları: {metaConnection.pagesAccessMode === 'all' ? 'Tümü' : `${metaConnection.selectedPageIds.length} sayfa`}
                    </p>
                    <p className="text-sm text-dashboard-text">
                      • İşletmeler: {metaConnection.businessAccessMode === 'all' ? 'Tümü' : `${metaConnection.selectedBusinessIds.length} işletme`}
                    </p>
                    <p className="text-sm text-dashboard-text">
                      • Instagram: {metaConnection.instagramAccessMode === 'all' ? 'Tümü' : `${metaConnection.selectedInstagramIds.length} hesap`}
                    </p>
                    <p className="text-sm text-dashboard-text">
                      • Reklam Hesabı: Seçildi
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-dashboard-warning/10 border border-dashboard-warning/30 rounded-lg mb-4">
                <AlertCircle size={20} className="text-dashboard-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-dashboard-text font-medium mb-1">
                    Meta hesabınızı bağlayın
                  </p>
                  <p className="text-xs text-dashboard-textSecondary">
                    Reklamlarınızı yönetmek için Meta Business hesabınıza bağlanmanız gerekiyor.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {!isMetaConnected ? (
                <button
                  onClick={() => setShowMetaWizard(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span>Meta ile Bağlan</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowMetaWizard(true)}
                    className="btn-secondary"
                  >
                    Ayarları Düzenle
                  </button>
                  <button
                    onClick={handleMetaDisconnect}
                    className="btn-danger flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    <span>Bağlantıyı Kaldır</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Google Ads Integration Card (Coming Soon) */}
      <div className="card p-6 opacity-60 cursor-not-allowed">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-dashboard-text mb-1">
                  Google Ads
                </h3>
                <p className="text-sm text-dashboard-textSecondary">
                  Google Ads kampanyalarınızı yönetin
                </p>
              </div>
              <span className="px-3 py-1 bg-dashboard-warning/20 text-dashboard-warning rounded-full text-sm font-medium">
                Yakında
              </span>
            </div>

            <p className="text-sm text-dashboard-textSecondary mb-4">
              Google Ads entegrasyonu üzerinde çalışıyoruz. Yakında sizlerle!
            </p>

            <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
              Google ile Bağlan
            </button>
          </div>
        </div>
      </div>

      {/* Meta Connect Wizard */}
      <MetaConnectWizard
        isOpen={showMetaWizard}
        onClose={() => setShowMetaWizard(false)}
        onComplete={handleMetaConnect}
      />
    </div>
  );
}

