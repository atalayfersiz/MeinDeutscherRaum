# MeinDeutscherRaum (MDR)
> **Kişisel Almanca Belleği & Zihin Haritası**
> *"Weniger, aber besser"* — Dieter Rams / Bauhaus Felsefesiyle Tasarlanmış Dil Öğrenim Ekosistemi

---

## 🏛️ 1. Temel Vizyon & Tasarım Sistemi
MeinDeutscherRaum, klasik dil öğrenme uygulamalarının dikkat dağıtıcı oyunlaştırma (gamification) öğelerini tamamen bir kenara bırakır:
- **Radikal Minimalizm:** Sıcak monokrom / off-white arka plan (`#FAF9F5`), derin antrasit tipografi ve hafif karanlık mod (`#111110`).
- **Görsel Gramer Vurguları:** Göz yormayan, işlevsel renk sinyalleri:
  - **der** (Mavi / Cobalt)
  - **die** (Kırmızı / Crimson)
  - **das** (Yeşil / Emerald)
  - **Plural** (Mor / Amethyst)
- **Çift Dil Desteği (TR / EN):** Sağ üst köşedeki `TR | EN` anahtarıyla hem arayüzü hem de kelime ve gramer açıklamalarını anında Türkçe veya İngilizceye çevirebilirsiniz.

---

## 🔄 2. Veri Mimarisi & Drive Senkronizasyonu (Local-First)

```
/data
├── /raw                  <-- Telefondan Drive ile gelen taranmış notlar, ses dökümleri, Gemini metinleri
│   └── gemini_notes_bewerbung.txt
├── /notes                <-- Detaylı çalışılan Markdown ders notları (A1-B2)
│   ├── 01_verben_mit_praepositionen.md
│   ├── 02_konnektoren_system.md
│   └── 03_alltag_und_b1_texte.md
├── /exercises            <-- İnteraktif boşluk doldurma ve cümle kurma alıştırmaları
│   └── exercises.json
└── /generated            <-- Parser'ın derlediği birleşik veri tabanı
    └── db.json
```

### Senkronizasyon Akışı:
1. **Mobilde (Google Drive):** Telefonunuzda derste çektiğiniz bir fotoğrafı, ses kaydı dökümünü veya Gemini'deki bir Almanca sohbet çıktısını bilgisayarınızla eşzamanlı olan `/data/raw` klasörüne atın.
2. **Uygulamada:**
   - Web arayüzünde üstteki **"Sync"** butonuna basın veya
   - Terminalde `npm run sync-data` komutunu çalıştırın.
3. **Parser Script (`scripts/sync-data.mjs`):** Markdown dosyalarını ve ham notları otomatik olarak tarar, fiil-edat kalıplarını, artikelleri ve bağlaçları çıkararak `db.json` ve zihin haritasına dönüştürür.
4. **Gemini AI Entegrasyonu:** Dilerseniz arayüzdeki ✨ (Yapay Zeka Not Ekle) ikonuna tıklayarak doğrudan metin yapıştırabilir, `POST /api/ai-parse` üzerinden otomatik indeksleme yapabilirsiniz.

---

## 🧩 3. Temel Modüller

### A. Dinamik Zihin Haritası (Knowledge Graph)
- Fiiller (`warten`), kök türevleri (`erwarten`, `abwarten`), aldıkları edatlar (`auf`) ve yönettikleri haller (`Akkusativ`) arasındaki organik ağ.
- Dokunmatik yakınlaştırma (pinch-to-zoom), sürükleme ve arama.
- Düğüme tıklandığında açılan minimalist Rams kartında zaman çekimleri, örnek cümleler ve bağlı kavramlar listelenir.

### B. Bağlaçlar Matrisi (Konnektoren Hub)
Almanca cümle kurmanın can damarı olan fiil pozisyonu kuralları 4 temel grupta organize edilmiştir:
1. **Pozisyon 0 (ADUSO):** `aber`, `denn`, `und`, `sondern`, `oder` (Cümle yapısını bozmaz).
2. **Nebensatz (Fiil Sonda):** `weil`, `dass`, `obwohl`, `wenn`, `damit` (Çekimli fiil cümlenin sonuna gider).
3. **Pozisyon 1 (Adverbiale):** `deshalb`, `trotzdem`, `sonst`, `außerdem` (Fiil hemen bağlaçtan sonra gelir).
4. **Zweiteilige Konnektoren:** `nicht nur ... sondern auch`, `entweder ... oder`, `zwar ... aber`.

### C. Akıllı Kelimeler & Aralıklı Tekrar (SRS / SM-2)
- SüperMemo-2 (SM-2) algoritmasıyla çalışan bağlamsal kelime kartları.
- Kolaylık derecesi (Again, Hard, Good, Easy) puanlamasına göre sonraki tekrar gününü (1 gün, 2 gün, 4 gün, 7+ gün) otomatik hesaplar ve yerel depolamada saklar.
- Filtrelenebilir tüm kelime tablosu.

### D. Focus Reader & Egzersiz Sandbox'ı
- **Focus Reader:** Kitap bölümlerini ve ders notlarını yüksek okunabilirlikle okuyun. Bilmediğiniz bir kelimeye dokunduğunuz anda yandaki müfettiş paneli anlamını, artikelini ve gramer kalıbını gösterir.
- **Practice Sandbox:**
  - *Lückentext:* Edat ve artikel boşluklarını doldurma.
  - *Satzbau:* Kelime çiplerini doğru dizilime (özellikle Nebensatz vs. Pozisyon 1 kurallarına göre) tıklayarak dizme motoru. Anında kural açıklaması verir.

---

## 🚀 4. Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükleme
npm install

# Yerel notları derleme ve veritabanını senkronize etme
npm run sync-data

# Geliştirme sunucusunu başlatma
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışmaya başlayacaktır.
