"use client";

import React, { useState, useEffect, useMemo } from "react";
import { VocabularyItem, GermanGender } from "@/types";
import { useLanguage } from "@/lib/language-context";
import { 
  loadSrsData, 
  saveSrsData, 
  calculateNextReview, 
  isItemDue, 
  SrsProgress 
} from "@/lib/srs";
import { 
  Search, 
  RotateCcw, 
  Check, 
  Layers, 
  CheckCircle, 
  Flame, 
  Calendar,
  Volume2,
  ChevronDown
} from "lucide-react";

interface SmartVocabularyProps {
  vocabulary: VocabularyItem[];
}

export function SmartVocabulary({ vocabulary }: SmartVocabularyProps) {
  const { lang, t } = useLanguage();
  const [mode, setMode] = useState<"srs" | "list">("srs");
  const [srsState, setSrsState] = useState<Record<string, SrsProgress>>({});
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");

  // Load SRS progress from localStorage
  useEffect(() => {
    setSrsState(loadSrsData());
  }, []);

  // Merge vocabulary with SRS data
  const enrichedVocabulary = useMemo(() => {
    return vocabulary.map((item) => ({
      ...item,
      srs: srsState[item.id]
    }));
  }, [vocabulary, srsState]);

  // Due items for Spaced Repetition
  const dueItems = useMemo(() => {
    return enrichedVocabulary.filter((item) => isItemDue(item.srs));
  }, [enrichedVocabulary]);

  const activeCard = dueItems[activeCardIndex] || dueItems[0];

  // Handle Spaced Repetition rating (SM-2)
  const handleRate = (grade: 1 | 2 | 3 | 4) => {
    if (!activeCard) return;

    const newProgress = calculateNextReview(activeCard.srs, grade);
    const updated = {
      ...srsState,
      [activeCard.id]: newProgress
    };

    setSrsState(updated);
    saveSrsData(updated);

    setIsFlipped(false);
    if (activeCardIndex < dueItems.length - 1) {
      setActiveCardIndex((prev) => prev + 1);
    } else {
      setActiveCardIndex(0);
    }
  };

  // Filtered list for Table view
  const filteredList = useMemo(() => {
    return enrichedVocabulary.filter((item) => {
      const matchesSearch =
        search === "" ||
        item.german.toLowerCase().includes(search.toLowerCase()) ||
        item.meaningTr.toLowerCase().includes(search.toLowerCase()) ||
        item.meaningEn.toLowerCase().includes(search.toLowerCase()) ||
        (item.example && item.example.toLowerCase().includes(search.toLowerCase()));

      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesGender = selectedGender === "all" || item.article === selectedGender;

      return matchesSearch && matchesType && matchesGender;
    });
  }, [enrichedVocabulary, search, selectedType, selectedGender]);

  // Minimalist gender styling
  const getGenderBorder = (article?: GermanGender) => {
    if (article === "der") return "border-l-4 border-l-blue-600";
    if (article === "die") return "border-l-4 border-l-red-600";
    if (article === "das") return "border-l-4 border-l-emerald-600";
    if (article === "pl") return "border-l-4 border-l-purple-600";
    return "border-l-4 border-l-neutral-400";
  };

  const getGenderBadge = (article?: GermanGender) => {
    if (article === "der") return "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300";
    if (article === "die") return "text-red-700 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-300";
    if (article === "das") return "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300";
    if (article === "pl") return "text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300";
    return "text-neutral-600 bg-neutral-100 border-neutral-300";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E4DD] dark:border-[#22211E]">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            {t("Bağlamsal Bellek & Aralıklı Tekrar", "Contextual Memory & Spaced Repetition")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
            {t("Kelime ve Kalıp Dağarcığı (Wortschatz)", "Smart Vocabulary & Grammar (Wortschatz)")}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-xs font-mono text-neutral-500">
            <span>{t("Toplam Kelime:", "Total Vocabulary:")} <strong className="text-neutral-900 dark:text-neutral-100">{vocabulary.length}</strong></span>
            <span>•</span>
            <span className="text-amber-700 dark:text-amber-400">
              {t("Bugün Tekrar Edilecek:", "Due for Review Today:")} <strong>{dueItems.length}</strong>
            </span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex border border-[#DDD8CE] dark:border-[#33322D] bg-white dark:bg-[#1A1A18] text-xs font-mono p-1">
          <button
            onClick={() => setMode("srs")}
            className={`px-3 py-1.5 transition-colors ${
              mode === "srs"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            }`}
          >
            {t("SRS Tekrar Modu", "SRS Flashcards")} ({dueItems.length})
          </button>
          <button
            onClick={() => setMode("list")}
            className={`px-3 py-1.5 transition-colors ${
              mode === "list"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            }`}
          >
            {t("Tüm Liste & Arama", "All Vocabulary & Search")}
          </button>
        </div>
      </div>

      {/* MODE 1: Spaced Repetition (SRS) Flashcard Mode */}
      {mode === "srs" && (
        <div className="max-w-xl mx-auto py-4">
          {dueItems.length > 0 && activeCard ? (
            <div className="space-y-4">
              
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>
                  {t("Kart:", "Card:")} {activeCardIndex + 1} / {dueItems.length}
                </span>
                <span>
                  {activeCard.srs?.repetitions ? `${activeCard.srs.repetitions} ${t("kez tekrarlandı", "reps")}` : t("Yeni Kelime", "New Item")}
                </span>
              </div>

              {/* The Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative min-h-[320px] p-8 border bg-white dark:bg-[#1A1A18] cursor-pointer transition-all duration-200 flex flex-col justify-between ${getGenderBorder(
                  activeCard.article
                )} border-[#DDD8CE] dark:border-[#2C2B27] shadow-sm hover:shadow-md`}
              >
                {/* Card Front Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeCard.article && (
                      <span className={`text-xs font-mono px-2 py-0.5 border ${getGenderBadge(activeCard.article)}`}>
                        {activeCard.article}
                      </span>
                    )}
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5">
                      {activeCard.type}
                    </span>
                    {activeCard.level && (
                      <span className="text-[11px] font-mono text-neutral-400">
                        {activeCard.level}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-neutral-400">
                    {t("Çevirmek için dokun", "Click to flip")}
                  </span>
                </div>

                {/* Central Term */}
                <div className="my-6 text-center space-y-2">
                  <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
                    {activeCard.article ? `${activeCard.article} ` : ""}{activeCard.german}
                  </div>
                  {activeCard.plural && (
                    <div className="text-xs font-mono text-neutral-500">
                      Pl: die {activeCard.plural}
                    </div>
                  )}
                  {activeCard.preposition && (
                    <div className="inline-block mt-2 font-mono text-xs font-semibold px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                      + {activeCard.preposition} ({activeCard.governedCase || "Akk/Dat"})
                    </div>
                  )}
                </div>

                {/* Flipped Content / Back of Card */}
                {isFlipped ? (
                  <div className="space-y-4 pt-4 border-t border-[#F0ECE4] dark:border-[#2A2926] animate-in fade-in duration-150">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-0.5">
                        {t("Anlamı", "Meaning")}
                      </div>
                      <div className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        {lang === "tr" ? activeCard.meaningTr : activeCard.meaningEn}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {lang === "tr" ? activeCard.meaningEn : activeCard.meaningTr}
                      </div>
                    </div>

                    {activeCard.example && (
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-0.5">
                          {t("Örnek Kalıp", "Example Pattern")}
                        </div>
                        <div className="text-xs italic text-neutral-700 dark:text-neutral-300 bg-[#FAF9F5] dark:bg-[#20201D] p-2.5 border-l-2 border-neutral-900 dark:border-neutral-100">
                          "{activeCard.example}"
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-xs font-mono text-neutral-400 py-3">
                    [ ? ] {t("Cevabı ve kalıbı görmek için tıkla", "Click to reveal answer & pattern")}
                  </div>
                )}
              </div>

              {/* SM-2 Rating Buttons (Shown when flipped) */}
              {isFlipped ? (
                <div className="grid grid-cols-4 gap-2 pt-2 animate-in fade-in duration-200">
                  <button
                    onClick={() => handleRate(1)}
                    className="p-3 border border-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:border-red-900 text-red-900 dark:text-red-200 text-center transition-colors"
                  >
                    <div className="text-xs font-bold font-mono">{t("Tekrar", "Again")}</div>
                    <div className="text-[10px] text-red-600 dark:text-red-400">1 gün</div>
                  </button>
                  <button
                    onClick={() => handleRate(2)}
                    className="p-3 border border-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-center transition-colors"
                  >
                    <div className="text-xs font-bold font-mono">{t("Zor", "Hard")}</div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400">2 gün</div>
                  </button>
                  <button
                    onClick={() => handleRate(3)}
                    className="p-3 border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-center transition-colors"
                  >
                    <div className="text-xs font-bold font-mono">{t("İyi", "Good")}</div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400">4 gün</div>
                  </button>
                  <button
                    onClick={() => handleRate(4)}
                    className="p-3 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 text-center transition-colors"
                  >
                    <div className="text-xs font-bold font-mono">{t("Kolay", "Easy")}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">7+ gün</div>
                  </button>
                </div>
              ) : (
                <div className="text-center text-xs font-mono text-neutral-400 pt-2">
                  {t("Önce kartı çevirin, ardından hatırlama puanınızı seçin.", "Flip the card first, then rate your recall.")}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-16 p-8 border border-[#DDD8CE] dark:border-[#2C2B27] bg-white dark:bg-[#1A1A18] space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                {t("Bugünkü tekrarlar tamamlandı!", "All reviews done for today!")}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                {t(
                  "Tüm kelimelerinizi SM-2 aralıklı tekrar sırasına göre pratik yaptınız. Yeni kelimeler ekleyebilir veya tüm kelime listesini inceleyebilirsiniz.",
                  "You have completed all scheduled SM-2 spaced repetitions. You can add new notes or explore the full dictionary."
                )}
              </p>
              <button
                onClick={() => setMode("list")}
                className="px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-mono"
              >
                {t("Kelime Listesini Aç", "Browse Vocabulary List")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Full List & Filter View */}
      {mode === "list" && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#1A1A18] border border-[#DDD8CE] dark:border-[#2C2B27]">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Kelime veya anlam ara...", "Search German word or meaning...")}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-[#FAF9F5] dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#33322D] outline-none text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Part of Speech Filter */}
            <div className="flex items-center gap-1 text-xs font-mono">
              {["all", "verb", "substantiv", "adjektiv"].map((typ) => (
                <button
                  key={typ}
                  onClick={() => setSelectedType(typ)}
                  className={`px-2.5 py-1 border transition-colors ${
                    selectedType === typ
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900"
                      : "bg-[#FAF9F5] dark:bg-[#20201D] text-neutral-600 dark:text-neutral-400 border-[#DDD8CE] dark:border-[#33322D]"
                  }`}
                >
                  {typ === "all" ? t("Tümü", "All") : typ}
                </button>
              ))}
            </div>

            {/* Gender Filter (Der / Die / Das) */}
            <div className="flex items-center gap-1 text-xs font-mono">
              {[
                { id: "all", label: "Tüm Artikeller" },
                { id: "der", label: "der", color: "text-blue-600" },
                { id: "die", label: "die", color: "text-red-600" },
                { id: "das", label: "das", color: "text-emerald-600" }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGender(g.id)}
                  className={`px-2.5 py-1 border transition-colors ${
                    selectedGender === g.id
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900"
                      : "bg-[#FAF9F5] dark:bg-[#20201D] text-neutral-600 dark:text-neutral-400 border-[#DDD8CE] dark:border-[#33322D]"
                  }`}
                >
                  <span className={g.color}>{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="border border-[#DDD8CE] dark:border-[#2C2B27] bg-white dark:bg-[#1A1A18] overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DDD8CE] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#20201D] text-[11px] font-mono text-neutral-500 uppercase">
                  <th className="py-2.5 px-4 font-semibold">{t("Almanca", "German")}</th>
                  <th className="py-2.5 px-4 font-semibold">{t("Tür / Kalıp", "Type / Pattern")}</th>
                  <th className="py-2.5 px-4 font-semibold">{t("Türkçe Anlam", "Turkish Meaning")}</th>
                  <th className="py-2.5 px-4 font-semibold">{t("İngilizce Anlam", "English Meaning")}</th>
                  <th className="py-2.5 px-4 font-semibold">{t("Örnek Cümle", "Example Sentence")}</th>
                  <th className="py-2.5 px-4 font-semibold">{t("SRS Tekrar", "SRS Next")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE4] dark:divide-[#242320]">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF9F5] dark:hover:bg-[#20201D] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {item.article && (
                          <span className={`font-mono text-[10px] px-1.5 py-0.5 border ${getGenderBadge(item.article)}`}>
                            {item.article}
                          </span>
                        )}
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 font-sans">
                          {item.german}
                        </span>
                        {item.plural && (
                          <span className="text-[10px] font-mono text-neutral-400">
                            (pl. {item.plural})
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {item.preposition ? (
                        <span className="inline-block px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-[11px]">
                          + {item.preposition} ({item.governedCase})
                        </span>
                      ) : (
                        <span className="text-neutral-500 uppercase text-[10px]">{item.type}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200">
                      {item.meaningTr}
                    </td>

                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                      {item.meaningEn}
                    </td>

                    <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300 italic max-w-xs truncate">
                      {item.example ? `"${item.example}"` : "—"}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      {item.srs?.nextReviewDate ? (
                        <span className={isItemDue(item.srs) ? "text-amber-600 font-bold" : "text-neutral-500"}>
                          {new Date(item.srs.nextReviewDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-neutral-400">{t("Sırada", "Pending")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
