# IQ Test Pro Elite - Teknik Dökümantasyon

Bu döküman, yapay zeka asistanlarının projeyi hızlıca anlayıp geliştirmeye devam edebilmesi için hazırlanmıştır.

## 🚀 Proje Özeti

IQ Test Pro Elite, modern web teknolojileriyle hazırlanmış, oyunlaştırma (gamification) unsurları içeren bir zeka ölçme uygulamasıdır. Kullanıcılara yaş gruplarına özel testler sunar, ilerlemelerini takip eder ve rozetlerle ödüllendirir.

## 🛠 Teknoloji Yığını

- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Build Tool:** Vite
- **Depolama:** Tarayıcı Yerel Depolama (LocalStorage)
- **Tasarım:** Glassmorphism, Responsive UI (Outfit fontu)

## 📂 Dosya Yapısı

- `index.html`: Ana giriş noktası ve UI ekranları (Welcome, Test, Results, Badges).
- `index.css`: Tüm bileşenlerin modern ve premium stilleri.
- `app.js`: Uygulama mantığı, soru bankası, puanlama algoritması, XP ve Seviye sistemi.
- `history.html`: Detaylı analiz paneli ve test geçmişi.

## 🧠 Temel Özellikler & Mantık

### 1. Test Sistemi

- **Modlar:** `kids` (5-12 yaş) ve `adults` (13+ yaş).
- **Soru Sayısı:** Her test rastgele seçilen **15 sorudan** oluşur.
- **Kategoriler:** Mantık, Matematik, Görsel, Sözel.

### 2. Puanlama & IQ Algoritması

- **Base IQ:** 50
- **Doğruluk Puanı:** `Doğru Sayısı * 6.5` (Max 97.5)
- **Hız Bonusu:** `max(0, 20 - (Toplam Saniye / 240) * 15)`
- **Toplam IQ:** `Base + Doğruluk + Hız`. En yüksek teorik IQ ~165-170 civarındadır.

### 3. Oyunlaştırma (XP & Seviye)

- **XP Hesaplama:** `(IQ * 2.5) + (Doğru Sayısı * 70)`
- **Level Atlama:** Her 1000 XP bir seviyeye eşittir.
- **Streak:** Arka arkaya her gün test çözüldüğünde artan ateş ikonu sayacı.

### 4. Veri Yapısı (LocalStorage)

- `iq_elite_history`: Test geçmişi (IQ, Rütbe, Tarih, Kategori başarısı).
- `user_xp`: Toplam deneyim puanı.
- `user_level`: Mevcut seviye.
- `user_streak`: Günlük seri sayısı.
- `last_test_date`: Son çözülen testin tarihi.
- `earned_badges`: Kazanılan rozet ID'leri.

## 🎖 Rozetler (Badges)

- `speed_demon`: 3 saniyeden kısa sürede soru çöz.
- `perfect_score`: 15/15 yap.
- `math_genius`: Matematik kategorisinde %100 başarı.
- `logic_master`: Mantık kategorisinde %100 başarı.
- `daily_hero`: Günlük görevi tamamla.

## 📋 Geliştirme Notları

- Yeni sorular eklenirken `questionsDB` objesine uygun kategori ve zorlukta eklenmelidir.
- UI güncellemelerinde `index.css` içindeki CSS değişkenleri (`--primary`, `--surface` vb.) kullanılmalıdır.
- Vite ile yerel ağda çalıştırmak için `npx vite --host` komutu kullanılır.
