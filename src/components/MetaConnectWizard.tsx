'use client';

import { useState } from 'react';
import { X, Check, ChevronRight, Facebook, Instagram, Building2, CreditCard } from 'lucide-react';
import type { 
  MetaPage, 
  MetaBusiness, 
  MetaInstagramAccount, 
  MetaAdAccount,
  MetaConnectionPayload 
} from '@/types/meta-integration';

interface MetaConnectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (payload: MetaConnectionPayload) => void;
}

export default function MetaConnectWizard({ isOpen, onClose, onComplete }: MetaConnectWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 2 state
  const [pagesAccessMode, setPagesAccessMode] = useState<'all' | 'selected'>('all');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [businessAccessMode, setBusinessAccessMode] = useState<'all' | 'selected'>('all');
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
  const [instagramAccessMode, setInstagramAccessMode] = useState<'all' | 'selected'>('all');
  const [selectedInstagram, setSelectedInstagram] = useState<string[]>([]);

  // Step 3 state
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>('');

  // Mock data
  const mockPages: MetaPage[] = [
    { id: '1', name: 'YO Digital Marketing' },
    { id: '2', name: 'E-Commerce Store' },
    { id: '3', name: 'Local Business' },
  ];

  const mockBusinesses: MetaBusiness[] = [
    { id: '1', name: 'YO Digital Business' },
    { id: '2', name: 'Partner Business' },
  ];

  const mockInstagram: MetaInstagramAccount[] = [
    { id: '1', username: '@yodigital' },
    { id: '2', username: '@ecommerce_store' },
  ];

  const mockAdAccounts: MetaAdAccount[] = [
    { id: '1', name: 'YO Digital Ads', accountId: 'act_123456789' },
    { id: '2', name: 'E-Commerce Ads', accountId: 'act_987654321' },
  ];

  const handleMetaOAuth = () => {
    setLoading(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const payload: MetaConnectionPayload = {
      pagesAccessMode,
      selectedPageIds: pagesAccessMode === 'selected' ? selectedPages : [],
      businessAccessMode,
      selectedBusinessIds: businessAccessMode === 'selected' ? selectedBusinesses : [],
      instagramAccessMode,
      selectedInstagramIds: instagramAccessMode === 'selected' ? selectedInstagram : [],
      selectedAdAccountId: selectedAdAccount,
    };
    onComplete(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dashboard-border">
          <div>
            <h2 className="text-2xl font-bold text-dashboard-text">Meta Hesabını Bağla</h2>
            <p className="text-sm text-dashboard-textSecondary mt-1">
              Adım {step} / 4
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-dashboard-textSecondary hover:text-dashboard-text hover:bg-dashboard-cardHover transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-dashboard-border">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    s < step
                      ? 'bg-dashboard-accent text-dashboard-bg'
                      : s === step
                      ? 'bg-dashboard-accent text-dashboard-bg'
                      : 'bg-dashboard-cardHover text-dashboard-textMuted'
                  }`}
                >
                  {s < step ? <Check size={16} /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-colors ${
                      s < step ? 'bg-dashboard-accent' : 'bg-dashboard-cardHover'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {step === 1 && (
            <Step1OAuth onAuth={handleMetaOAuth} loading={loading} />
          )}
          {step === 2 && (
            <Step2Permissions
              pages={mockPages}
              businesses={mockBusinesses}
              instagram={mockInstagram}
              pagesAccessMode={pagesAccessMode}
              setPagesAccessMode={setPagesAccessMode}
              selectedPages={selectedPages}
              setSelectedPages={setSelectedPages}
              businessAccessMode={businessAccessMode}
              setBusinessAccessMode={setBusinessAccessMode}
              selectedBusinesses={selectedBusinesses}
              setSelectedBusinesses={setSelectedBusinesses}
              instagramAccessMode={instagramAccessMode}
              setInstagramAccessMode={setInstagramAccessMode}
              selectedInstagram={selectedInstagram}
              setSelectedInstagram={setSelectedInstagram}
            />
          )}
          {step === 3 && (
            <Step3AdAccount
              adAccounts={mockAdAccounts}
              selectedAdAccount={selectedAdAccount}
              setSelectedAdAccount={setSelectedAdAccount}
            />
          )}
          {step === 4 && (
            <Step4Summary
              pagesAccessMode={pagesAccessMode}
              selectedPages={selectedPages}
              pages={mockPages}
              businessAccessMode={businessAccessMode}
              selectedBusinesses={selectedBusinesses}
              businesses={mockBusinesses}
              instagramAccessMode={instagramAccessMode}
              selectedInstagram={selectedInstagram}
              instagram={mockInstagram}
              selectedAdAccount={selectedAdAccount}
              adAccounts={mockAdAccounts}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-dashboard-border">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="btn-secondary"
            disabled={loading}
          >
            {step === 1 ? 'İptal' : 'Geri'}
          </button>
          <button
            onClick={step === 4 ? handleComplete : handleNext}
            className="btn-primary"
            disabled={loading || (step === 3 && !selectedAdAccount)}
          >
            {step === 4 ? 'Tamamla' : 'İleri'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 1: OAuth
function Step1OAuth({ onAuth, loading }: { onAuth: () => void; loading: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6">
        <Facebook size={40} className="text-white" />
      </div>
      <h3 className="text-2xl font-bold text-dashboard-text mb-3">
        Meta ile Bağlan
      </h3>
      <p className="text-dashboard-textSecondary mb-8 max-w-md">
        Facebook ve Instagram reklamlarınızı yönetmek için Meta hesabınıza bağlanın.
      </p>
      <button
        onClick={onAuth}
        disabled={loading}
        className="btn-primary flex items-center gap-2 px-8 py-3 text-lg"
      >
        {loading ? (
          <>
            <div className="spinner w-5 h-5 border-2" />
            <span>Bağlanıyor...</span>
          </>
        ) : (
          <>
            <Facebook size={20} />
            <span>Meta ile Devam Et</span>
          </>
        )}
      </button>
    </div>
  );
}

// Step 2: Permissions
interface Step2PermissionsProps {
  pages: MetaPage[];
  businesses: MetaBusiness[];
  instagram: MetaInstagramAccount[];
  pagesAccessMode: 'all' | 'selected';
  setPagesAccessMode: (mode: 'all' | 'selected') => void;
  selectedPages: string[];
  setSelectedPages: (pages: string[]) => void;
  businessAccessMode: 'all' | 'selected';
  setBusinessAccessMode: (mode: 'all' | 'selected') => void;
  selectedBusinesses: string[];
  setSelectedBusinesses: (businesses: string[]) => void;
  instagramAccessMode: 'all' | 'selected';
  setInstagramAccessMode: (mode: 'all' | 'selected') => void;
  selectedInstagram: string[];
  setSelectedInstagram: (instagram: string[]) => void;
}

function Step2Permissions({
  pages,
  businesses,
  instagram,
  pagesAccessMode,
  setPagesAccessMode,
  selectedPages,
  setSelectedPages,
  businessAccessMode,
  setBusinessAccessMode,
  selectedBusinesses,
  setSelectedBusinesses,
  instagramAccessMode,
  setInstagramAccessMode,
  selectedInstagram,
  setSelectedInstagram,
}: Step2PermissionsProps) {
  const togglePage = (id: string) => {
    setSelectedPages(
      selectedPages.includes(id)
        ? selectedPages.filter((p) => p !== id)
        : [...selectedPages, id]
    );
  };

  const toggleBusiness = (id: string) => {
    setSelectedBusinesses(
      selectedBusinesses.includes(id)
        ? selectedBusinesses.filter((b) => b !== id)
        : [...selectedBusinesses, id]
    );
  };

  const toggleInstagram = (id: string) => {
    setSelectedInstagram(
      selectedInstagram.includes(id)
        ? selectedInstagram.filter((i) => i !== id)
        : [...selectedInstagram, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-dashboard-text mb-2">
          İzinleri Yapılandır
        </h3>
        <p className="text-sm text-dashboard-textSecondary">
          Hangi hesaplara erişmek istediğinizi seçin
        </p>
      </div>

      {/* Facebook Pages */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Facebook size={20} className="text-blue-500" />
          <h4 className="font-semibold text-dashboard-text">Facebook Sayfaları</h4>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPagesAccessMode('all')}
            className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
              pagesAccessMode === 'all'
                ? 'bg-dashboard-accent/10 border-dashboard-accent text-dashboard-accent'
                : 'border-dashboard-border text-dashboard-textSecondary hover:border-dashboard-accent'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setPagesAccessMode('selected')}
            className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
              pagesAccessMode === 'selected'
                ? 'bg-dashboard-accent/10 border-dashboard-accent text-dashboard-accent'
                : 'border-dashboard-border text-dashboard-textSecondary hover:border-dashboard-accent'
            }`}
          >
            Seçili
          </button>
        </div>
        {pagesAccessMode === 'selected' && (
          <div className="space-y-2 pt-2">
            {pages.map((page) => (
              <label
                key={page.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-dashboard-bg hover:bg-dashboard-cardHover transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPages.includes(page.id)}
                  onChange={() => togglePage(page.id)}
                  className="w-4 h-4 accent-dashboard-accent"
                />
                <span className="text-sm text-dashboard-text">{page.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Businesses */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-green-500" />
          <h4 className="font-semibold text-dashboard-text">İşletmeler</h4>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setBusinessAccessMode('all')}
            className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
              businessAccessMode === 'all'
                ? 'bg-dashboard-accent/10 border-dashboard-accent text-dashboard-accent'
                : 'border-dashboard-border text-dashboard-textSecondary hover:border-dashboard-accent'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setBusinessAccessMode('selected')}
            className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
              businessAccessMode === 'selected'
                ? 'bg-dashboard-accent/10 border-dashboard-accent text-dashboard-accent'
                : 'border-dashboard-border text-dashboard-textSecondary hover:border-dashboard-accent'
            }`}
          >
            Seçili
          </button>
        </div>
        {businessAccessMode === 'selected' && (
          <div className="space-y-2 pt-2">
            {businesses.map((business) => (
              <label
                key={business.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-dashboard-bg hover:bg-dashboard-cardHover transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBusinesses.includes(business.id)}
                  onChange={() => toggleBusiness(business.id)}
                  className="w-4 h-4 accent-dashboard-accent"
                />
                <span className="text-sm text-dashboard-text">{business.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Instagram */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Instagram size={20} className="text-pink-500" />
          <h4 className="font-semibold text-dashboard-text">Instagram Hesapları</h4>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setInstagramAccessMode('all')}
            className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
              instagramAccessMode === 'all'
                ? 'bg-dashboard-accent/10 border-dashboard-accent text-dashboard-accent'
                : 'border-dashboard-border text-dashboard-textSecondary hover:border-dashboard-accent'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setInstagramAccessMode('selected')}
            className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
              instagramAccessMode === 'selected'
                ? 'bg-dashboard-accent/10 border-dashboard-accent text-dashboard-accent'
                : 'border-dashboard-border text-dashboard-textSecondary hover:border-dashboard-accent'
            }`}
          >
            Seçili
          </button>
        </div>
        {instagramAccessMode === 'selected' && (
          <div className="space-y-2 pt-2">
            {instagram.map((account) => (
              <label
                key={account.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-dashboard-bg hover:bg-dashboard-cardHover transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedInstagram.includes(account.id)}
                  onChange={() => toggleInstagram(account.id)}
                  className="w-4 h-4 accent-dashboard-accent"
                />
                <span className="text-sm text-dashboard-text">{account.username}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Step 3: Ad Account Selection
interface Step3AdAccountProps {
  adAccounts: MetaAdAccount[];
  selectedAdAccount: string;
  setSelectedAdAccount: (id: string) => void;
}

function Step3AdAccount({
  adAccounts,
  selectedAdAccount,
  setSelectedAdAccount,
}: Step3AdAccountProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-dashboard-text mb-2">
          Reklam Hesabı Seçin
        </h3>
        <p className="text-sm text-dashboard-textSecondary">
          Yönetmek istediğiniz reklam hesabını seçin
        </p>
      </div>

      <div className="space-y-3">
        {adAccounts.map((account) => (
          <button
            key={account.id}
            onClick={() => setSelectedAdAccount(account.id)}
            className={`w-full p-4 rounded-lg border transition-all text-left ${
              selectedAdAccount === account.id
                ? 'bg-dashboard-accent/10 border-dashboard-accent'
                : 'border-dashboard-border hover:border-dashboard-accent'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedAdAccount === account.id
                  ? 'bg-dashboard-accent text-dashboard-bg'
                  : 'bg-dashboard-cardHover text-dashboard-textSecondary'
              }`}>
                <CreditCard size={20} />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  selectedAdAccount === account.id
                    ? 'text-dashboard-accent'
                    : 'text-dashboard-text'
                }`}>
                  {account.name}
                </h4>
                <p className="text-sm text-dashboard-textMuted">{account.accountId}</p>
              </div>
              {selectedAdAccount === account.id && (
                <Check size={20} className="text-dashboard-accent" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 4: Summary
interface Step4SummaryProps {
  pagesAccessMode: 'all' | 'selected';
  selectedPages: string[];
  pages: MetaPage[];
  businessAccessMode: 'all' | 'selected';
  selectedBusinesses: string[];
  businesses: MetaBusiness[];
  instagramAccessMode: 'all' | 'selected';
  selectedInstagram: string[];
  instagram: MetaInstagramAccount[];
  selectedAdAccount: string;
  adAccounts: MetaAdAccount[];
}

function Step4Summary({
  pagesAccessMode,
  selectedPages,
  pages,
  businessAccessMode,
  selectedBusinesses,
  businesses,
  instagramAccessMode,
  selectedInstagram,
  instagram,
  selectedAdAccount,
  adAccounts,
}: Step4SummaryProps) {
  const selectedAdAccountData = adAccounts.find((a) => a.id === selectedAdAccount);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-dashboard-text mb-2">
          Bağlantı Özeti
        </h3>
        <p className="text-sm text-dashboard-textSecondary">
          Ayarlarınızı kontrol edin ve onaylayın
        </p>
      </div>

      <div className="space-y-4">
        {/* Pages */}
        <div className="card p-4">
          <h4 className="font-semibold text-dashboard-text mb-2">Facebook Sayfaları</h4>
          <p className="text-sm text-dashboard-textSecondary">
            {pagesAccessMode === 'all'
              ? `Tüm sayfalar (${pages.length})`
              : `${selectedPages.length} sayfa seçildi`}
          </p>
          {pagesAccessMode === 'selected' && selectedPages.length > 0 && (
            <ul className="mt-2 space-y-1">
              {selectedPages.map((id) => {
                const page = pages.find((p) => p.id === id);
                return (
                  <li key={id} className="text-sm text-dashboard-textMuted flex items-center gap-2">
                    <ChevronRight size={14} />
                    {page?.name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Businesses */}
        <div className="card p-4">
          <h4 className="font-semibold text-dashboard-text mb-2">İşletmeler</h4>
          <p className="text-sm text-dashboard-textSecondary">
            {businessAccessMode === 'all'
              ? `Tüm işletmeler (${businesses.length})`
              : `${selectedBusinesses.length} işletme seçildi`}
          </p>
          {businessAccessMode === 'selected' && selectedBusinesses.length > 0 && (
            <ul className="mt-2 space-y-1">
              {selectedBusinesses.map((id) => {
                const business = businesses.find((b) => b.id === id);
                return (
                  <li key={id} className="text-sm text-dashboard-textMuted flex items-center gap-2">
                    <ChevronRight size={14} />
                    {business?.name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Instagram */}
        <div className="card p-4">
          <h4 className="font-semibold text-dashboard-text mb-2">Instagram Hesapları</h4>
          <p className="text-sm text-dashboard-textSecondary">
            {instagramAccessMode === 'all'
              ? `Tüm hesaplar (${instagram.length})`
              : `${selectedInstagram.length} hesap seçildi`}
          </p>
          {instagramAccessMode === 'selected' && selectedInstagram.length > 0 && (
            <ul className="mt-2 space-y-1">
              {selectedInstagram.map((id) => {
                const account = instagram.find((i) => i.id === id);
                return (
                  <li key={id} className="text-sm text-dashboard-textMuted flex items-center gap-2">
                    <ChevronRight size={14} />
                    {account?.username}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Ad Account */}
        <div className="card p-4">
          <h4 className="font-semibold text-dashboard-text mb-2">Reklam Hesabı</h4>
          <div className="flex items-center gap-3 mt-2">
            <CreditCard size={20} className="text-dashboard-accent" />
            <div>
              <p className="text-sm text-dashboard-text font-medium">
                {selectedAdAccountData?.name}
              </p>
              <p className="text-xs text-dashboard-textMuted">
                {selectedAdAccountData?.accountId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

