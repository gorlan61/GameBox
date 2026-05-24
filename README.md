# 🎮 GameBox

<div align="center">

[![React Native](https://img.shields.io/badge/React%20Native-0.73+-61dafb?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-Latest-000020?style=for-the-badge&logo=expo)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=for-the-badge&logo=javascript)](https://www.javascript.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Sosyal oyun takip platformu. Oyunlarınızı keşfedin, puanlandırın ve diğer oyunculara bağlanın.**

</div>

---

## 📖 Genel Bakış

GameBox, oyun severler için tasarlanan modern bir mobil sosyal ağıdır. Gerçek zamanlı özellikleri, kapsamlı kayıt sistemi ve topluluk odaklı tasarımı ile oyunculara benzersiz bir deneyim sunmaktadır.

---

## 📑 İçindekiler

- [✨ Temel Özellikler](#-temel-özellikler)
- [🛠️ Teknoloji Yığını](#️-teknoloji-yığını)
- [🚀 Kurulum](#-kurulum)
- [📸 Ekran Görüntüleri](#-ekran-görüntüleri)
- [🔐 Güvenlik](#-güvenlik)
- [🤝 Katkı Sağlama](#-katkı-sağlama)
- [📜 Lisans](#-lisans)

---

## ✨ Temel Özellikler

| Özellik | Açıklama |
|---------|----------|
| **🔐 Supabase Auth** | E-posta/şifre tabanlı güvenli kimlik doğrulama ve oturum yönetimi |
| **⚡ Yüksek Performanslı Arama** | TextInput ve FlashList ile optimize edilmiş oyun arama motoru |
| **📝 Detaylı Loglama** | Oyunları puanlandırma (slider), tarih seçme, inceleme yazma ve etiketleme |
| **🔄 Realtime Feed** | Supabase Realtime API ile anında güncellenen sosyal akışı |
| **❤️ Like Sistemi** | Diğer oyuncuların günlüklerini beğenme ve etkileşim |
| **📚 Koleksiyon Yönetimi** | Kişisel oyun listeleri oluşturma ve yönetme |
| **👤 Gelişmiş Profil** | İstatistikler, ortalama puan, favori türler ve "Top 4" oyun gösterimi |
| **🌐 Profil Ziyareti** | Diğer oyuncuların profillerini görüntüleme ve keşfetme |

---

## 🛠️ Teknoloji Yığını

### Frontend
- **React Native** (v0.73+) - Çapraz platform mobil geliştirme
- **Expo** - Geliştirme ortamı ve deployment
- **Context API** - Durum yönetimi
- **FlashList** - Performanslı liste bileşeni
- **React Hooks** - Fonksiyonel bileşen mimarisi

### Backend & Veritabanı
- **Supabase** - Backend as a Service
  - **PostgreSQL** - Relational veritabanı
  - **Auth Service** - Kimlik doğrulama
  - **Realtime API** - Gerçek zamanlı sinkronizasyon
  - **REST API** - Veri erişimi

### Araçlar
- **Babel** - JavaScript transpiling
- **npm/Yarn** - Paket yönetimi
- **Git** - Versiyon kontrolü

---

## 🚀 Kurulum

### Ön Gereksinimler

- **Node.js** v16+ ([İndir](https://nodejs.org/))
- **npm** veya **yarn**
- **Supabase** hesabı ([https://supabase.com](https://supabase.com))

### Adım 1: Depoyu Klonlayın

```bash
git clone https://github.com/yourusername/GameBox.git
cd GameBox
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 3: Ortam Değişkenlerini Yapılandırın

Proje kök dizininde `.env` dosyası oluşturun:

```bash
touch .env
```

Supabase bilgilerinizi ekleyin:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Bilgilerinizi bulma:**
1. [Supabase Dashboard](https://app.supabase.com) açın
2. Proje → **Settings** → **API**
3. **Project URL** ve **anon key** değerlerini kopyalayın

### Adım 4: Geliştirme Sunucusunu Başlatın

```bash
npx expo start
```

### Adım 5: Uygulamayı Çalıştırın

**Expo Go ile (mobil):**
- [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) veya [iOS](https://apps.apple.com/us/app/expo-go/id982107779) Expo Go indirin
- QR kodunu tarayın

**Emülatörde:**
- `i` - iOS Simulator
- `a` - Android Emulator
- `w` - Web browser

## 📸 Ekran Görüntüleri

| Açıklama | Placeholder |
|----------|------------|
| **Ana Sayfa** | ![Placeholder](https://via.placeholder.com/300x600/FF6B6B/FFFFFF?text=Home) |
| **Oyun Arama** | ![Placeholder](https://via.placeholder.com/300x600/4ECDC4/FFFFFF?text=Search) |
| **Oyun Günlüğü** | ![Placeholder](https://via.placeholder.com/300x600/45B7D1/FFFFFF?text=Add+Log) |
| **Kullanıcı Profili** | ![Placeholder](https://via.placeholder.com/300x600/96CEB4/FFFFFF?text=Profile) |
| **Koleksiyonlar** | ![Placeholder](https://via.placeholder.com/300x600/FFEAA7/FFFFFF?text=Collections) |

---

## 🔐 Güvenlik

- **JWT Tabanlı Auth** - Supabase ile güvenli token yönetimi
- **Row Level Security (RLS)** - PostgreSQL RLS politikaları ile veri koruması
- **HTTPS** - Tüm ağ istekleri şifrelenmiş
- **Ortam Değişkenleri** - Hassas veriler `.env` dosyasında saklanır

### Best Practices

```bash
# .gitignore dosyasına ekleyin:
.env
.env.local
node_modules/
.expo/
```

---

## 🤝 Katkı Sağlama

Katkılar memnuniyetle karşılanır. Aşağıdaki adımları takip edin:

1. **Depoyu Fork'layın**
2. **Özellik dalı oluşturun** (`git checkout -b feature/amazing-feature`)
3. **Değişiklikleri commit'leyin** (`git commit -m 'Add feature'`)
4. **Dala push'layın** (`git push origin feature/amazing-feature`)
5. **Pull Request açın**

---

## 📜 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.

---

<div align="center">

**Happy Gaming! 🎮**

</div>
