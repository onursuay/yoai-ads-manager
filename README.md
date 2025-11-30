# YOAİ - AI-Powered Ads Manager

Meta ve Google reklamlarınızı tek bir dashboard'dan yönetin. AI destekli önerilerle kampanyalarınızı optimize edin.

![YOAİ Dashboard](https://via.placeholder.com/800x400?text=YOAİ+Dashboard)

## ✨ Özellikler

### 📊 Dashboard
- Tüm kampanyaları tek ekranda görün
- Gerçek zamanlı metrikler (Spend, ROAS, CTR, CPC)
- Kampanya → Ad Set → Ad hiyerarşik görünüm

### 🤖 AI Önerileri (Meta Recommendations)
- **Creative Fatigue**: Görsel yorgunluğu tespiti
- **Budget Optimization**: Bütçe artırma/azaltma önerileri
- **Audience Expansion**: Hedef kitle genişletme
- **Performance Alerts**: Performans uyarıları
- **Tek tıkla uygulama**: Önerileri anında Meta'ya yansıtın

### ✏️ Reklam Yönetimi
- Kampanya/AdSet/Ad durumunu değiştir (Active/Paused)
- Bütçe güncelleme
- Inline düzenleme
- Bulk işlemler

### 🔄 Eş Zamanlı Senkronizasyon
- Meta Ads Manager ile gerçek zamanlı senkronizasyon
- n8n webhook entegrasyonu
- Otomatik veri güncelleme

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- n8n instance (cloud veya self-hosted)
- Meta Developer Account
- Meta Business Manager

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/yoai-ads-manager.git
cd yoai-ads-manager
npm install
```

### 2. Environment Değişkenlerini Ayarlayın

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
# n8n Webhook URL
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n.com/webhook

# Meta App
NEXT_PUBLIC_META_APP_ID=your-app-id

# Supabase (opsiyonel)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. n8n Workflow'larını Import Edin

1. n8n'e gidin
2. **Settings** → **Import from file**
3. `n8n-workflows/` klasöründeki JSON dosyalarını import edin:
   - `01-get-campaigns.json`
   - `02-get-recommendations.json`
   - `03-update-campaign.json`
   - `04-apply-recommendation.json`
   - `05-sync-all-data.json`

### 4. Meta App Yapılandırması

#### Gerekli İzinler
Meta Developer Console'da şu izinleri talep edin:

| İzin | Açıklama |
|------|----------|
| `ads_read` | Reklamları okuma |
| `ads_management` | Reklamları düzenleme |
| `read_insights` | Performans metrikleri |
| `business_management` | İş hesabı yönetimi |

#### Business Verification
`ads_management` için işletme doğrulaması gerekir:
1. Meta Business Suite → Settings → Business Info
2. Start Verification
3. Gerekli belgeleri yükleyin (vergi levhası, ticaret sicil)

### 5. Uygulamayı Başlatın

```bash
npm run dev
```

http://localhost:3000 adresinde açılacaktır.

---

## 📁 Proje Yapısı

```
yoai-ads-manager/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Ana dashboard
│   │   │   ├── layout.tsx        # Dashboard layout
│   │   │   └── recommendations/
│   │   │       └── page.tsx      # Öneriler sayfası
│   │   ├── globals.css           # Global stiller
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Ana sayfa (redirect)
│   ├── components/
│   │   ├── Sidebar.tsx           # Sol menü
│   │   ├── Header.tsx            # Üst bar
│   │   ├── MetricCards.tsx       # Metrik kartları
│   │   ├── CampaignTree.tsx      # Kampanya listesi
│   │   ├── RecommendationsPanel.tsx # Öneriler paneli
│   │   ├── EditModals.tsx        # Düzenleme modalları
│   │   └── PlatformSwitcher.tsx  # Meta/Google seçici
│   ├── lib/
│   │   ├── api.ts                # n8n API çağrıları
│   │   ├── store.ts              # Zustand state
│   │   ├── mock-data.ts          # Demo verileri
│   │   └── utils.ts              # Yardımcı fonksiyonlar
│   └── types/
│       └── meta-ads.ts           # TypeScript tipleri
├── n8n-workflows/                # n8n workflow JSON'ları
├── public/
├── .env.example
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🔧 n8n Workflow'ları

### 1. Get Campaigns (`/meta/campaigns`)
Tüm kampanyaları Meta'dan çeker.

**Request:**
```json
{
  "ad_account_id": "123456789",
  "access_token": "EAAxxxx..."
}
```

### 2. Get Recommendations (`/meta/recommendations`)
Creative fatigue ve performans önerilerini analiz eder.

### 3. Update Campaign (`/meta/campaign/update`)
Kampanya bilgilerini günceller.

**Request:**
```json
{
  "campaign_id": "123456789",
  "updates": {
    "status": "PAUSED",
    "daily_budget": 500
  },
  "access_token": "EAAxxxx..."
}
```

### 4. Apply Recommendation (`/meta/recommendation/apply`)
AI önerisini Meta'ya uygular.

### 5. Sync All Data (`/meta/sync-all`)
Tüm kampanya, ad set, ad ve insight verilerini tek seferde çeker.

---

## 🎨 Özelleştirme

### Renk Teması
`tailwind.config.js` dosyasında renkleri değiştirebilirsiniz:

```js
colors: {
  dashboard: {
    bg: '#0A0E14',
    card: '#12181F',
    accent: '#00D4AA',
    // ...
  }
}
```

### Yeni Öneri Tipi Ekleme
`src/lib/utils.ts` dosyasında `getRecommendationTypeInfo` fonksiyonunu güncelleyin.

---

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📋 Yapılacaklar

- [ ] Google Ads entegrasyonu
- [ ] Supabase ile kullanıcı yönetimi
- [ ] Çoklu reklam hesabı desteği
- [ ] Raporlama ve dışa aktarma
- [ ] Otomatik kural oluşturma
- [ ] Slack/Email bildirimleri

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Email: support@yodigital.com

---

**YO Digital** tarafından ❤️ ile geliştirildi.
