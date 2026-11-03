"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { 
  Scale, 
  ArrowRight, 
  HelpCircle, 
  Compass, 
  Layers, 
  Sparkles, 
  Check, 
  ArrowLeftRight,
  MoveRight,
  MapPin
} from "lucide-react";

type KasusTab = "wechsel" | "articles" | "prepositions" | "verbs";

export function KasusHub() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<KasusTab>("wechsel");
  const [selectedWechselPrep, setSelectedWechselPrep] = useState<string>("auf");
  const [articleType, setArticleType] = useState<"bestimmt" | "unbestimmt" | "negativ" | "pronomen">("bestimmt");

  // 9 Wechselpräpositionen
  const wechselPreps = [
    { prep: "an", label: "bitişiğinde / kenarında", de: "am Rand / Kontakt vertikal", akkEx: "Ich hänge das Bild an die Wand.", datEx: "Das Bild hängt an der Wand." },
    { prep: "auf", label: "üzerinde (temaslı)", de: "Kontakt horizontal", akkEx: "Ich lege das Buch auf den Tisch.", datEx: "Das Buch liegt auf dem Tisch." },
    { prep: "hinter", label: "arkasında", de: "Rückseite", akkEx: "Er stellt das Fahrrad hinter das Haus.", datEx: "Das Fahrrad steht hinter dem Haus." },
    { prep: "in", label: "içinde", de: "im Raum / 3D", akkEx: "Sie geht in die moderne Bibliothek.", datEx: "Sie lernt in der modernen Bibliothek." },
    { prep: "neben", label: "yanında", de: "seitlich", akkEx: "Setz dich neben meinen Bruder!", datEx: "Er sitzt neben meinem Bruder." },
    { prep: "über", label: "üzerinde (temassız) / hakkında", de: "oberhalb ohne Kontakt", akkEx: "Er hängt die Lampe über den Tisch.", datEx: "Die Lampe hängt über dem Tisch." },
    { prep: "unter", label: "altında", de: "unterhalb", akkEx: "Die Katze läuft unter das weiße Sofa.", datEx: "Die Katze schläft unter dem weißen Sofa." },
    { prep: "vor", label: "önünde", de: "Vorderseite", akkEx: "Der Bus fährt vor das alte Rathaus.", datEx: "Der Bus hält vor dem alten Rathaus." },
    { prep: "zwischen", label: "arasında (iki şeyin)", de: "zwei Punkte", akkEx: "Er stellt den Stuhl zwischen die Schränke.", datEx: "Der Stuhl steht zwischen den Schränken." },
  ];

  const currentWechsel = wechselPreps.find((p) => p.prep === selectedWechselPrep) || wechselPreps[1];

  // Feste Präpositionen
  const akkusativOnlyPreps = [
    { prep: "bis", meaningTr: "-e kadar", meaningEn: "until, up to", ex: "Der Zug fährt nur bis den nächsten Bahnhof." },
    { prep: "durch", meaningTr: "içinden, vasıtasıyla", meaningEn: "through, across", ex: "Wir spazieren durch den grünen Park." },
    { prep: "für", meaningTr: "için", meaningEn: "for", ex: "Das Geschenk ist für meinen besten Freund." },
    { prep: "gegen", meaningTr: "karşı, sularında (zaman)", meaningEn: "against, around (time)", ex: "Das Auto prallte gegen den Baum." },
    { prep: "ohne", meaningTr: "-sız, -siz (olmadan)", meaningEn: "without", ex: "Ohne einen warmen Mantel gehe ich nicht raus." },
    { prep: "um", meaningTr: "etrafında, -de (saat)", meaningEn: "around, at (time)", ex: "Die Kinder laufen um den großen Tisch." },
  ];

  const dativOnlyPreps = [
    { prep: "aus", meaningTr: "-den (içinden, köken)", meaningEn: "out of, from", ex: "Er kommt aus der Schweiz." },
    { prep: "bei", meaningTr: "yanında, nezdinde, esnasında", meaningEn: "at, with, near", ex: "Ich wohne zurzeit bei meinen Eltern." },
    { prep: "mit", meaningTr: "ile, birlikte", meaningEn: "with, by (means of)", ex: "Wir fahren mit dem schnellen Zug." },
    { prep: "nach", meaningTr: "-e doğru (şehir/ülke), sonra", meaningEn: "to, after", ex: "Nach dem deutschen Unterricht trinken wir Kaffee." },
    { prep: "seit", meaningTr: "-den beri", meaningEn: "since, for (time)", ex: "Er lernt seit einem halben Jahr Deutsch." },
    { prep: "von", meaningTr: "-den (tarafından, kaynağı)", meaningEn: "from, of", ex: "Das ist ein Geschenk von meiner Schwester." },
    { prep: "zu", meaningTr: "-e doğru (kişiye/kuruma)", meaningEn: "to", ex: "Morgen gehe ich zum (zu + dem) Arzt." },
    { prep: "gegenüber", meaningTr: "karşısında", meaningEn: "opposite to", ex: "Die Apotheke liegt gegenüber dem Bahnhof." },
  ];

  // Dativ-only verbs
  const dativVerbs = [
    { verb: "helfen", meaningTr: "yardım etmek", meaningEn: "to help", ex: "Kannst du mir bitte kurz helfen?" },
    { verb: "danken", meaningTr: "teşekkür etmek", meaningEn: "to thank", ex: "Ich danke Ihnen herzlich für die Einladung." },
    { verb: "gefallen", meaningTr: "hoşuna gitmek, beğenmek", meaningEn: "to please / appeal to", ex: "Die neue Wohnung gefällt mir sehr gut." },
    { verb: "gehören", meaningTr: "ait olmak", meaningEn: "to belong to", ex: "Das rote Buch gehört dem Lehrer." },
    { verb: "gratulieren", meaningTr: "tebrik etmek", meaningEn: "to congratulate", ex: "Wir gratulieren dir zum Geburtstag!" },
    { verb: "passen", meaningTr: "uymak (zaman, beden)", meaningEn: "to fit / suit", ex: "Der Termin am Montag passt mir perfekt." },
    { verb: "schmecken", meaningTr: "tadı güzel gelmek / beğenmek", meaningEn: "to taste good to", ex: "Wie schmeckt dir der traditionelle Kuchen?" },
    { verb: "antworten", meaningTr: "cevap vermek", meaningEn: "to reply to", ex: "Er hat meiner Nachricht noch nicht geantwortet." },
    { verb: "fehlen", meaningTr: "özlenmek, eksik olmak", meaningEn: "to be missing / missed by", ex: "Meine Familie fehlt mir hier in Berlin." },
    { verb: "vertrauen", meaningTr: "güvenmek", meaningEn: "to trust", ex: "Ich vertraue meinem Arzt vollkommen." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E7E4DD] dark:border-[#22211E]">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            {t("İsim Halleri & Edat Sistematiği", "German Cases & Preposition Architecture")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
            {t("Dativ & Akkusativ Laboratuvarı", "Dativ & Akkusativ Hub")}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-3xl leading-relaxed">
            {t(
              "Almanca'da isim halleri cümlenin anlam omurgasıdır. Akkusativ nesneyi veya yönelme/hareketi (Wohin?) hedeflerken, Dativ dolaylı tümleci veya durağan konumu (Wo?) belirler.",
              "Cases form the core spine of German syntax. Akkusativ marks direct objects and directional motion (Wohin?), whereas Dativ marks indirect recipients and stationary location (Wo?)."
            )}
          </p>
        </div>

        {/* Quick Question Cards */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="p-2.5 border border-blue-300 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20">
            <div className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-bold">Akkusativ</div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Wen? Was? Wohin?</div>
          </div>
          <div className="p-2.5 border border-purple-300 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20">
            <div className="text-[10px] text-purple-700 dark:text-purple-300 uppercase font-bold">Dativ</div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Wem? Wo? Wann?</div>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex border border-[#DDD8CE] dark:border-[#33322D] bg-white dark:bg-[#1A1A18] text-xs font-mono p-1 overflow-x-auto no-scrollbar">
        {[
          { id: "wechsel", labelTr: "Wechselpräpositionen (Wo? vs. Wohin?)", labelEn: "Dual Prepositions (Wo? vs. Wohin?)" },
          { id: "articles", labelTr: "Artikel & Zamir Matrisi", labelEn: "Articles & Pronouns Matrix" },
          { id: "prepositions", labelTr: "Sadece Akk / Sadece Dativ Edatları", labelEn: "Fixed Akk / Dativ Prepositions" },
          { id: "verbs", labelTr: "Dativ Alan & Çift Nesneli Fiiller", labelEn: "Dativ Verbs & Double Objects" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as KasusTab)}
            className={`px-3 py-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            }`}
          >
            {lang === "tr" ? tab.labelTr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* TAB 1: WECHSELPRÄPOSITIONEN (Wo? vs. Wohin?) */}
      {activeTab === "wechsel" && (
        <div className="space-y-6">
          
          {/* Explanation Banner */}
          <div className="p-4 bg-[#FAF9F5] dark:bg-[#181816] border border-[#DDD8CE] dark:border-[#2C2B27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                {t("Temel Kural: Hareket vs. Konum", "Core Rule: Motion vs. Location")}
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                9 İki Durumlu Edat (Wechselpräpositionen)
              </h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800">
                Wohin? ➔ Akkusativ
              </span>
              <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-800">
                Wo? ➔ Dativ
              </span>
            </div>
          </div>

          {/* 9 Edat Seçim Çipleri */}
          <div className="flex flex-wrap gap-2">
            {wechselPreps.map((p) => (
              <button
                key={p.prep}
                onClick={() => setSelectedWechselPrep(p.prep)}
                className={`px-4 py-2 border font-mono text-sm transition-all ${
                  selectedWechselPrep === p.prep
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 font-bold shadow-sm"
                    : "bg-white dark:bg-[#1A1A18] text-neutral-700 dark:text-neutral-300 border-[#DDD8CE] dark:border-[#2C2B27] hover:border-neutral-500"
                }`}
              >
                {p.prep}
              </button>
            ))}
          </div>

          {/* Live Dual Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* WOHIN? -> AKKUSATIV */}
            <div className="p-6 border-2 border-blue-300 dark:border-blue-900/70 bg-blue-50/20 dark:bg-blue-950/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-blue-200 dark:border-blue-900/40">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-mono text-xs font-bold uppercase">
                  <MoveRight className="w-4 h-4" />
                  <span>Wohin? (Akkusativ)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  {t("Hareket / Yönelme", "Motion / Destination")}
                </span>
              </div>

              <div>
                <div className="text-[11px] font-mono text-neutral-500 uppercase mb-1">
                  {t("Kalıp", "Pattern")}
                </div>
                <div className="font-mono text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {currentWechsel.prep} + Akkusativ (den / die / das / die)
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-[#20201D] border-l-4 border-blue-600 space-y-1">
                <div className="text-xs text-neutral-400 font-mono uppercase">{t("Örnek", "Example")}</div>
                <blockquote className="text-base font-semibold text-neutral-900 dark:text-neutral-100 italic">
                  "{currentWechsel.akkEx}"
                </blockquote>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {t(
                  `Özne nesneyi bir yere doğru hareket ettirir veya bir hedefe yönelir (legen, stellen, setzen, hängen).`,
                  `Subject moves an object towards a new target or direction (legen, stellen, setzen, hängen).`
                )}
              </p>
            </div>

            {/* WO? -> DATIV */}
            <div className="p-6 border-2 border-purple-300 dark:border-purple-900/70 bg-purple-50/20 dark:bg-purple-950/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-200 dark:border-purple-900/40">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-mono text-xs font-bold uppercase">
                  <MapPin className="w-4 h-4" />
                  <span>Wo? (Dativ)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  {t("Sabit Konum / Durum", "Static Location / State")}
                </span>
              </div>

              <div>
                <div className="text-[11px] font-mono text-neutral-500 uppercase mb-1">
                  {t("Kalıp", "Pattern")}
                </div>
                <div className="font-mono text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {currentWechsel.prep} + Dativ (dem / der / dem / den + n)
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-[#20201D] border-l-4 border-purple-600 space-y-1">
                <div className="text-xs text-neutral-400 font-mono uppercase">{t("Örnek", "Example")}</div>
                <blockquote className="text-base font-semibold text-neutral-900 dark:text-neutral-100 italic">
                  "{currentWechsel.datEx}"
                </blockquote>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {t(
                  `Özne veya nesne zaten o konumda bulunmaktadır; durum sabittir (liegen, stehen, sitzen, sein).`,
                  `Subject or object is already residing at that location; position is static (liegen, stehen, sitzen, sein).`
                )}
              </p>
            </div>

          </div>

          {/* Paired Verbs Matrix (legen vs liegen, stellen vs stehen) */}
          <div className="border border-[#DDD8CE] dark:border-[#2C2B27] bg-white dark:bg-[#1A1A18] p-5 space-y-4">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
              {t("Kritik Fiil Çiftleri (Akkusativ Hareketi vs. Dativ Durumu)", "Paired Verbs (Akkusativ Motion vs. Dativ State)")}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 border border-[#E7E4DD] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#20201D]">
                <div className="font-bold text-blue-600">legen (Akk)</div>
                <div className="text-[11px] text-neutral-500">yatay koymak</div>
                <div className="mt-2 pt-2 border-t border-[#EAE6DD] dark:border-[#2C2B27] font-bold text-purple-600">
                  liegen (Dat)
                </div>
                <div className="text-[11px] text-neutral-500">yatay durmak</div>
              </div>

              <div className="p-3 border border-[#E7E4DD] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#20201D]">
                <div className="font-bold text-blue-600">stellen (Akk)</div>
                <div className="text-[11px] text-neutral-500">dik koymak</div>
                <div className="mt-2 pt-2 border-t border-[#EAE6DD] dark:border-[#2C2B27] font-bold text-purple-600">
                  stehen (Dat)
                </div>
                <div className="text-[11px] text-neutral-500">ayakta/dik durmak</div>
              </div>

              <div className="p-3 border border-[#E7E4DD] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#20201D]">
                <div className="font-bold text-blue-600">setzen (Akk)</div>
                <div className="text-[11px] text-neutral-500">oturtmak</div>
                <div className="mt-2 pt-2 border-t border-[#EAE6DD] dark:border-[#2C2B27] font-bold text-purple-600">
                  sitzen (Dat)
                </div>
                <div className="text-[11px] text-neutral-500">oturuyor olmak</div>
              </div>

              <div className="p-3 border border-[#E7E4DD] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#20201D]">
                <div className="font-bold text-blue-600">hängen (Akk)</div>
                <div className="text-[11px] text-neutral-500">asmak (eylem)</div>
                <div className="mt-2 pt-2 border-t border-[#EAE6DD] dark:border-[#2C2B27] font-bold text-purple-600">
                  hängen (Dat)
                </div>
                <div className="text-[11px] text-neutral-500">asılı durmak</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ARTIKEL & ZAMİR MATRİSİ */}
      {activeTab === "articles" && (
        <div className="space-y-6">
          
          {/* Sub-selector */}
          <div className="flex border border-[#DDD8CE] dark:border-[#33322D] bg-white dark:bg-[#1A1A18] text-xs font-mono p-1">
            {[
              { id: "bestimmt", label: "Belirli Artikel (der/die/das)" },
              { id: "unbestimmt", label: "Belirsiz Artikel (ein/eine)" },
              { id: "negativ", label: "Olumsuz Artikel (kein/keine)" },
              { id: "pronomen", label: "Kişi Zamirleri (Pronomen)" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setArticleType(s.id as any)}
                className={`flex-1 py-1.5 transition-colors whitespace-nowrap px-2 ${
                  articleType === s.id
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="border border-[#DDD8CE] dark:border-[#2C2B27] bg-white dark:bg-[#1A1A18] overflow-x-auto shadow-sm">
            
            {articleType === "bestimmt" && (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#DDD8CE] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#20201D] text-neutral-500">
                    <th className="p-3">Kasus (Hal)</th>
                    <th className="p-3 text-blue-600 font-bold">Maskulin (der)</th>
                    <th className="p-3 text-red-600 font-bold">Feminin (die)</th>
                    <th className="p-3 text-emerald-600 font-bold">Neutral (das)</th>
                    <th className="p-3 text-purple-600 font-bold">Plural (die)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE4] dark:divide-[#242320]">
                  <tr>
                    <td className="p-3 font-semibold text-neutral-500">Nominativ (Wer? Was?)</td>
                    <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">der Mann</td>
                    <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">die Frau</td>
                    <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">das Kind</td>
                    <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">die Kinder</td>
                  </tr>
                  <tr className="bg-blue-50/30 dark:bg-blue-950/20">
                    <td className="p-3 font-semibold text-blue-700 dark:text-blue-300">Akkusativ (Wen? Was?)</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">den Mann (➔ -en)</td>
                    <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">die Frau</td>
                    <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">das Kind</td>
                    <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">die Kinder</td>
                  </tr>
                  <tr className="bg-purple-50/30 dark:bg-purple-950/20">
                    <td className="p-3 font-semibold text-purple-700 dark:text-purple-300">Dativ (Wem? Wo?)</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">dem Mann (➔ -em)</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">der Frau (➔ -er)</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">dem Kind (➔ -em)</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">den Kindern (➔ -en + n)</td>
                  </tr>
                </tbody>
              </table>
            )}

            {articleType === "unbestimmt" && (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#DDD8CE] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#20201D] text-neutral-500">
                    <th className="p-3">Kasus (Hal)</th>
                    <th className="p-3 text-blue-600 font-bold">Maskulin</th>
                    <th className="p-3 text-red-600 font-bold">Feminin</th>
                    <th className="p-3 text-emerald-600 font-bold">Neutral</th>
                    <th className="p-3 text-purple-600 font-bold">Plural</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE4] dark:divide-[#242320]">
                  <tr>
                    <td className="p-3 font-semibold text-neutral-500">Nominativ</td>
                    <td className="p-3 font-bold">ein Tisch</td>
                    <td className="p-3 font-bold">eine Lampe</td>
                    <td className="p-3 font-bold">ein Buch</td>
                    <td className="p-3 text-neutral-400">— (Bücher)</td>
                  </tr>
                  <tr className="bg-blue-50/30 dark:bg-blue-950/20">
                    <td className="p-3 font-semibold text-blue-700 dark:text-blue-300">Akkusativ</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">einen Tisch</td>
                    <td className="p-3 font-bold">eine Lampe</td>
                    <td className="p-3 font-bold">ein Buch</td>
                    <td className="p-3 text-neutral-400">— (Bücher)</td>
                  </tr>
                  <tr className="bg-purple-50/30 dark:bg-purple-950/20">
                    <td className="p-3 font-semibold text-purple-700 dark:text-purple-300">Dativ</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">einem Tisch</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">einer Lampe</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">einem Buch</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">— Büchern (+n)</td>
                  </tr>
                </tbody>
              </table>
            )}

            {articleType === "negativ" && (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#DDD8CE] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#20201D] text-neutral-500">
                    <th className="p-3">Kasus (Hal)</th>
                    <th className="p-3 text-blue-600 font-bold">Maskulin</th>
                    <th className="p-3 text-red-600 font-bold">Feminin</th>
                    <th className="p-3 text-emerald-600 font-bold">Neutral</th>
                    <th className="p-3 text-purple-600 font-bold">Plural</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE4] dark:divide-[#242320]">
                  <tr>
                    <td className="p-3 font-semibold text-neutral-500">Nominativ</td>
                    <td className="p-3 font-bold">kein Fehler</td>
                    <td className="p-3 font-bold">keine Zeit</td>
                    <td className="p-3 font-bold">kein Geld</td>
                    <td className="p-3 font-bold">keine Probleme</td>
                  </tr>
                  <tr className="bg-blue-50/30 dark:bg-blue-950/20">
                    <td className="p-3 font-semibold text-blue-700 dark:text-blue-300">Akkusativ</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">keinen Fehler</td>
                    <td className="p-3 font-bold">keine Zeit</td>
                    <td className="p-3 font-bold">kein Geld</td>
                    <td className="p-3 font-bold">keine Probleme</td>
                  </tr>
                  <tr className="bg-purple-50/30 dark:bg-purple-950/20">
                    <td className="p-3 font-semibold text-purple-700 dark:text-purple-300">Dativ</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">keinem Fehler</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">keiner Zeit</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">keinem Geld</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">keinen Problemen (+n)</td>
                  </tr>
                </tbody>
              </table>
            )}

            {articleType === "pronomen" && (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#DDD8CE] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#20201D] text-neutral-500">
                    <th className="p-3">Nominativ (Özne)</th>
                    <th className="p-3 text-blue-600 font-bold">Akkusativ (-i hali)</th>
                    <th className="p-3 text-purple-600 font-bold">Dativ (-e/-de hali)</th>
                    <th className="p-3 text-neutral-500">Türkçe Anlam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE4] dark:divide-[#242320]">
                  <tr>
                    <td className="p-3 font-bold">ich</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">mich</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">mir</td>
                    <td className="p-3 text-neutral-500">ben / beni / bana</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">du</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">dich</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">dir</td>
                    <td className="p-3 text-neutral-500">sen / seni / sana</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">er</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">ihn</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">ihm</td>
                    <td className="p-3 text-neutral-500">o (erkek) / onu / ona</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">sie</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">sie</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">ihr</td>
                    <td className="p-3 text-neutral-500">o (kadın) / onu / ona</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">es</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">es</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">ihm</td>
                    <td className="p-3 text-neutral-500">o (nötr) / onu / ona</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">wir</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">uns</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">uns</td>
                    <td className="p-3 text-neutral-500">biz / bizi / bize</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">ihr</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">euch</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">euch</td>
                    <td className="p-3 text-neutral-500">siz / sizi / size</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">sie / Sie</td>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-300">sie / Sie</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300">ihnen / Ihnen</td>
                    <td className="p-3 text-neutral-500">onlar / Siz (nezaket)</td>
                  </tr>
                </tbody>
              </table>
            )}

          </div>

          {/* Golden Rules Box */}
          <div className="p-4 bg-[#FAF9F5] dark:bg-[#181816] border border-[#DDD8CE] dark:border-[#2C2B27] space-y-2 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 font-sans">
            <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t("Altın Kurallar (Akılda Tutma İpuçları)", "Golden Rules (Memory Shortcuts)")}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
              <li><strong>Akkusativ:</strong> Sadece Maskulin (der ➔ den, ein ➔ einen) değişir. Feminin, Neutral ve Plural Nominativ ile tamamen aynı kalır!</li>
              <li><strong>Dativ:</strong> Tümü değişir! Maskulin ve Neutral ortak sonluk alır (➔ -em: dem, einem). Feminin (➔ -er: der, einer) olur. Plural ise (➔ -en: den) olur ve ismin sonuna bir de fazladan <strong>+n</strong> eklenir!</li>
            </ul>
          </div>

        </div>
      )}

      {/* TAB 3: FESTE PRÄPOSITIONEN (Sadece Akk / Sadece Dat) */}
      {activeTab === "prepositions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* AKKUSATIV EDATLARI (FUDOG) */}
          <div className="border border-blue-300 dark:border-blue-900/60 bg-blue-50/10 dark:bg-blue-950/10 p-5 space-y-4">
            <div className="pb-3 border-b border-blue-200 dark:border-blue-900/40">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">
                  DOGFU / FUDOG Kuralı
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  Nur Akkusativ
                </span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans mt-1">
                Sadece Akkusativ Alan Edatlar
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Bu edatlardan sonra gelen isim her zaman ve koşulsuz olarak Akkusativ olur.
              </p>
            </div>

            <div className="space-y-2">
              {akkusativOnlyPreps.map((p) => (
                <div key={p.prep} className="p-3 bg-white dark:bg-[#1A1A18] border border-[#DDD8CE] dark:border-[#2C2B27]">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-sm text-blue-700 dark:text-blue-400">
                      {p.prep}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {lang === "tr" ? p.meaningTr : p.meaningEn}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-700 dark:text-neutral-300 italic mt-1 font-sans">
                    "{p.ex}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DATIV EDATLARI (aus, bei, mit, nach, seit, von, zu) */}
          <div className="border border-purple-300 dark:border-purple-900/60 bg-purple-50/10 dark:bg-purple-950/10 p-5 space-y-4">
            <div className="pb-3 border-b border-purple-200 dark:border-purple-900/40">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">
                  Tekerleme: aus-bei-mit-nach-seit-von-zu
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  Nur Dativ
                </span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans mt-1">
                Sadece Dativ Alan Edatlar
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Bu edatlardan sonra gelen isim her zaman ve koşulsuz olarak Dativ olur.
              </p>
            </div>

            <div className="space-y-2">
              {dativOnlyPreps.map((p) => (
                <div key={p.prep} className="p-3 bg-white dark:bg-[#1A1A18] border border-[#DDD8CE] dark:border-[#2C2B27]">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-sm text-purple-700 dark:text-purple-400">
                      {p.prep}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {lang === "tr" ? p.meaningTr : p.meaningEn}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-700 dark:text-neutral-300 italic mt-1 font-sans">
                    "{p.ex}"
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: VERBS (Dativ Verbs & Double Object Rule) */}
      {activeTab === "verbs" && (
        <div className="space-y-6">
          
          {/* Double Object Rule Banner */}
          <div className="p-6 bg-white dark:bg-[#1A1A18] border-2 border-neutral-900 dark:border-neutral-100 space-y-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              {t("Kritik Formül: Çift Nesneli Cümleler", "Critical Rule: Verbs with Two Objects")}
            </span>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 font-sans">
              {t("Kime Dativ (Canlı), Neyi Akkusativ (Cansız)!", "Whom in Dativ (Person), What in Akkusativ (Thing)!")}
            </h3>
            <div className="p-3 bg-[#FAF9F5] dark:bg-[#20201D] font-mono text-xs text-neutral-800 dark:text-neutral-200 border border-[#EAE6DD] dark:border-[#33322D]">
              Subjekt + Verb + <strong className="text-purple-600">[Dativ (Kime?)]</strong> + <strong className="text-blue-600">[Akkusativ (Neyi?)]</strong>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Örnek: <em>"Der Vater schenkt <strong>dem Sohn (Dativ)</strong> <strong>ein neues Fahrrad (Akkusativ)</strong>."</em> (Baba oğluna yeni bir bisiklet hediye ediyor.)
              <br />
              Fiiller: <em>geben, schenken, zeigen, schicken, bringen, empfehlen, erklären, leihen...</em>
            </p>
          </div>

          {/* Dativ-only Verbs Grid */}
          <div className="border border-[#DDD8CE] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#181816] p-6 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                {t("Özel Liste", "Exclusive List")}
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-sans mt-0.5">
                {t("Sadece Dativ Alan En Önemli 10 Fiil", "Top 10 Verbs that ONLY take Dativ")}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dativVerbs.map((item) => (
                <div key={item.verb} className="p-3 bg-white dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27] space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-sm text-purple-700 dark:text-purple-300">
                      {item.verb} + Dat
                    </span>
                    <span className="text-xs text-neutral-500">
                      {lang === "tr" ? item.meaningTr : item.meaningEn}
                    </span>
                  </div>
                  <div className="text-xs italic text-neutral-700 dark:text-neutral-300 pt-1 font-sans">
                    "{item.ex}"
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
