# 🎮 GameBox - Oyun Tutkunları İçin Sosyal Platform

<div align="center">

![GameBox Banner](https://via.placeholder.com/1200x400/FF6B6B/FFFFFF?text=GameBox+-+Your+Game+Companion)

**Oyunlarınızı keşfedin, takip edin ve diğer oyuncularla bağlantı kurun** 🌟

GameBox, oyun severler için tasarlanan bir mobil sosyal ağıdır. Oynadığınız oyunları puanlandırın, kapsamlı günlükler tutun ve gerçek zamanlı olarak topluluk içindeki başka oyunculara bağlanın.

[![React Native](https://img.shields.io/badge/React%20Native-0.73-61dafb?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-Latest-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=flat-square&logo=javascript)](https://www.javascript.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📑 İçindekiler

- [🎯 Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
- [🛠️ Teknoloji Yığını](#️-teknoloji-yığını)
- [🚀 Hızlı Başlangıç](#-hızlı-başlangıç)
- [📸 Ekran Görüntüleri](#-ekran-görüntüleri)
- [🔐 Güvenlik](#-güvenlik)
- [🗺️ Gelecek Yol Haritası](#️-gelecek-yol-haritası)
- [🤝 Katkı Sağlama](#-katkı-sağlama)
- [📜 Lisans](#-lisans)

---

## 🎯 Öne Çıkan Özellikler

| Özellik | Açıklama | İkon |
|---------|----------|------|
| **🔐 Güvenli Kimlik Doğrulama** | Supabase Auth ile e-posta/şifre tabanlı, uçtan uca şifreli giriş ve kayıt sistemi | ✅ |
| **⚡ Yüksek Performanslı Arama** | TextInput ve FlashList ile düşük gecikmeli, takılmayan oyun arama motoru | ⚡ |
| **📝 Detaylı Loglama Sistemi** | Oyunları puanlandırın (slider), tarih seçin, inceleme yazın ve etiketler ekleyin | 📊 |
| **🔄 Realtime Sosyal Feed** | Supabase Realtime mimarisi sayesinde, ağdaki oyun günlükleri anında akışta görünür | 🚀 |
| **❤️ Etkileşim (Like) Sistemi** | Feed'deki oyun günlüklerini beğenin ve diğer oyunculara katkıda bulunun | 💬 |
| **📚 Kişisel Koleksiyonlar** | "Favorilerim", "Oynayacağım", "2026 En İyileri" gibi özel listeleri yönetin | 🎁 |
| **👤 İleri Seviye Profil Vitrini** | İstatistik paneli, ortalama puan hesabı, "Top 4" favori oyun kartları ve ziyaret sistemi | 📈 |
| **🌐 Topluluk Keşfi** | Diğer oyunculara bakın, profillerini ziyaret edin ve ne oynadıklarını öğrenin | 🔍 |

---

## 🛠️ Teknoloji Yığını

### 🎨 Frontend
- **React Native** (v0.73+) - Çapraz platform mobil geliştirme
- **Expo** - Hızlı geliştirme ortamı ve OTA güncellemeler
- **Context API** - Durum yönetimi (Authentication, Global State)
- **React Hooks** - Fonksiyonel bileşen mimarisi
- **FlashList** - Optimize edilmiş liste performansı
- **CSS3** - Responsive tasarım ve stil yönetimi

### 🔧 Backend & Veritabanı
- **Supabase** - Açık kaynak Firebase alternatifi
  - **PostgreSQL** - Güçlü relational veritabanı
  - **Auth Service** - Entegre kimlik doğrulama
  - **Realtime API** - Gerçek zamanlı veri senkronizasyonu
  - **REST API** - RESTful veri erişimi

### 📦 Diğer Araçlar
- **Babel** - JavaScript transpiling
- **npm/Yarn** - Paket yönetimi
- **Git** - Versiyon kontrolü

---

## 🚀 Hızlı Başlangıç

### 📋 Ön Gereksinimler

Başlamadan önce, sisteminizde şunların yüklü olduğundan emin olun:

- **Node.js** (v16.0.0 veya üstü) - [İndir](https://nodejs.org/)
- **npm** veya **yarn** - Node.js ile birlikte gelir
- **Expo CLI** - Mobil geliştirme için
- **Supabase Hesabı** - [https://supabase.com](https://supabase.com)

### 💻 Adım 1: Depoyu Klonlayın

```bash
git clone https://github.com/yourusername/GameBox.git
cd GameBox
```

### 📦 Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

veya yarn kullanıyorsanız:

```bash
yarn install
```

### 🔑 Adım 3: Supabase Ayarlarını Yapılandırın

Proje kök klasöründe bir `.env` dosyası oluşturun:

```bash
touch .env
```

Aşağıdaki değişkenleri doldurun:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Supabase Bilgilerinizi Nerede Bulacaksınız:**
1. [Supabase Dashboard](https://app.supabase.com) açın
2. Projenize gidin → **Settings** → **API**
3. **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
4. **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 🎮 Adım 4: Geliştirme Sunucusunu Başlatın

```bash
npx expo start
```

Çıkta göreceksiniz:

```
Expo is ready.

Scan the QR code with Expo Go (Android) or Camera app (iOS):

[QR CODE WILL APPEAR HERE]
```

### 📱 Adım 5: Uygulamayı Açın

**Seçenek A: Expo Go (Mobil)**
- **Android:** [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) uygulamasını indirin
- **iOS:** [Expo Go](https://apps.apple.com/us/app/expo-go/id982107779) uygulamasını indirin
- QR kodunu tarayın

**Seçenek B: Emülatör (Bilgisayar)**
```bash
# Adım 4'ten sonra terminalde aşağıdakilerden birini yazın:
i   # iOS Simulator
a   # Android Emulator
w   # Web browser
```

### ✅ Başarılı!

Artık GameBox'ı yerel makinenizde çalıştırıyor olmalısınız! 🎉

---

## 📸 Ekran Görüntüleri

Uygulamanın farklı ekranlarını aşağıda görebilirsiniz:

| Ana Sayfa (Feed) | Arama | Oyun Günlüğü Ekleme |
|-----------------|--------|-------------------|
| ![Home Screen Placeholder](https://via.placeholder.com/300x600/FF6B6B/FFFFFF?text=Home+Feed) | ![Search Screen Placeholder](https://via.placeholder.com/300x600/4ECDC4/FFFFFF?text=Search+Games) | ![Add Log Placeholder](https://via.placeholder.com/300x600/45B7D1/FFFFFF?text=Add+Game+Log) |
| Realtime oyun günlükleri | Yüksek performanslı arama | Puanlama ve inceleme |

| Profil | Koleksiyonlar | Diğer Oyuncuların Profili |
|--------|---------------|--------------------------|
| ![Profile Placeholder](https://via.placeholder.com/300x600/96CEB4/FFFFFF?text=My+Profile) | ![Collections Placeholder](https://via.placeholder.com/300x600/FFEAA7/FFFFFF?text=Collections) | ![Other Profile Placeholder](https://via.placeholder.com/300x600/DDA0DD/FFFFFF?text=User+Profile) |
| İstatistikler ve "Top 4" | Kişisel oyun listeleri | Profil ziyareti |

---

## 🔐 Güvenlik

### 🛡️ Uygulama İçi Güvenlik Önlemleri

GameBox, oyuncu bilgilerinizi korumak için şu güvenlik önlemlerini alır:

| Güvenlik Katmanı | Açıklama |
|-----------------|----------|
| **Supabase Auth** | Endüstri standartı şifreleme ve oturum yönetimi |
| **JWT Tokens** | Güvenli kimlik doğrulama için JSON Web Token'ları |
| **Row Level Security (RLS)** | PostgreSQL RLS politikaları ile veri erişim kontrolü |
| **HTTPS Şifrelemesi** | Tüm ağ istekleri SSL/TLS üzerinde |
| **Ortam Değişkenleri** | API anahtarları `.env` dosyasında saklanır |

### 📋 Best Practices

- ⚠️ **Hiçbir zaman** API anahtarlarınızı GitHub'a commit etmeyin
- 📝 `.env` dosyasını `.gitignore` listesine ekleyin
- 🔄 Supabase dashboard'da kaynak erişimi düzenli olarak gözden geçirin

---

## 🗺️ Gelecek Yol Haritası

GameBox'ın gelecekteki sürümlerinde aşağıdaki harika özellikler planlanmaktadır:

### 📌 v2.0 Özellikleri

- **🎬 IGDB API Entegrasyonu**
  - 1M+ oyunun kapsamlı veritabanına erişim
  - Oyun kapakları, yayın tarihleri ve açıklamalar
  - Otomatik metaveri doldurma
  
- **💬 Gelişmiş Yorum Sistemi**
  - Günlüklere çok düzeyli yorum desteği
  - @mention etme ve reply özellikleri
  - Yorum bildirimleri

- **📊 İstatistik Panosu**
  - Aylık oyun oynama istatistikleri
  - Tür bazlı dağılım grafikleri
  - Zaman serisi analizi

- **🎯 Oyun Önerileri**
  - Makine öğrenmesi tabanlı tavsiyeler
  - Oyunculara göre trend analizi
  - Kişiselleştirilmiş feed sıralanması

- **🏆 Başarımlar ve Rozetler**
  - Kullanıcı katılımı teşvik etme
  - Gamification öğeleri
  - Sosyal paylaşım tetikleyicileri

- **🌍 Çok Dil Desteği**
  - i18n entegrasyonu
  - Türkçe, İngilizce, daha fazlası

---

## 🤝 Katkı Sağlama

Açık kaynak topluluğunun bir parçası olmak istiyorsanız, katkılarınız her zaman memnuniyetle karşılanır! 💪

### 🔀 Katkı Adımları

1. **Depoyu Fork'layın**
   ```bash
   # GitHub web arayüzü kullanarak fork oluşturun
   ```

2. **Özellik Dalı Oluşturun**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Değişikliklerinizi Commit'leyin**
   ```bash
   git commit -m '✨ Harika özellik eklendi: X'
   ```

4. **Dala Push'layın**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Pull Request Açın**
   - Değişiklikleri açık bir şekilde tanımlayın
   - Screenshots veya demos ekleyin (varsa)
   - Test adımlarını belirtin

### 📋 Koder Davranış Kuralları

Lütfen projemizde:
- ✅ Yapıcı ve saygılı iletişim kurulur
- ✅ Çeşitliliğe ve kapsayıcılığa değer verilir
- ❌ Taciz, ayrımcılık hiçbir şekilde tolere edilmez

---

## 📜 Lisans

Bu proje **MIT Lisansı** altında yayınlanmıştır. Daha fazla bilgi için [LICENSE](LICENSE) dosyasını inceleyin.

```
MIT License

Copyright (c) 2024 Tolga

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 İletişim & Destek

Sorularınız, hata bildirimleri veya önerileri varsa:

- 🐛 **Hata Raporu:** [Issues](https://github.com/yourusername/GameBox/issues) sayfasında bir issue açın
- 💡 **Özellik İsteği:** [Discussions](https://github.com/yourusername/GameBox/discussions) bölümünde konuşun
- 📧 **Doğrudan İletişim:** Proje sahibine ulaşın

---

<div align="center">

### ⭐ Eğer bu proje size yardımcı oldu, bize bir yıldız vermeyi unutmayın!

![GameBox Footer](https://via.placeholder.com/1200x100/000000/FFFFFF?text=Keep+Gaming+Keep+Coding+%E2%9C%A8)

**Happy Gaming! 🎮✨**

</div>
