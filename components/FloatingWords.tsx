"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/lib/language-context";
import { Sparkles, Eye, X } from "lucide-react";

interface FloatingWordItem {
  id: string;
  german: string;
  article?: "der" | "die" | "das";
  meaningEn: string;
  meaningTr: string;
  category: "noun" | "verb" | "connector" | "note";
  left: number; // percentage 0 - 95
  duration: number; // seconds
  delay: number; // seconds
  size: "sm" | "md" | "lg";
  opacity: number;
}

const WORDS_DATABASE: Omit<FloatingWordItem, "left" | "duration" | "delay" | "size" | "opacity">[] = [
  // User's notes & scans
  { id: "fw-1", german: "skizzieren", meaningEn: "to sketch / outline", meaningTr: "taslak çizmek, karalamak", category: "note" },
  { id: "fw-2", german: "entspannend", meaningEn: "relaxing, restful", meaningTr: "rahatlatıcı, dinlendirici", category: "note" },
  { id: "fw-3", german: "der Lärm", article: "der", meaningEn: "noise, loud sound", meaningTr: "gürültü, patırtı", category: "noun" },
  { id: "fw-4", german: "die Überraschung", article: "die", meaningEn: "surprise", meaningTr: "sürpriz", category: "noun" },
  { id: "fw-5", german: "kündigen", meaningEn: "to cancel, resign", meaningTr: "istifa etmek, feshetmek", category: "note" },
  { id: "fw-6", german: "die Bestätigung", article: "die", meaningEn: "confirmation", meaningTr: "onay, teyit", category: "noun" },
  { id: "fw-7", german: "einfallen", meaningEn: "to come to mind", meaningTr: "akla gelmek", category: "verb" },
  { id: "fw-8", german: "die Bedingung", article: "die", meaningEn: "condition, term", meaningTr: "şart, koşul", category: "noun" },
  { id: "fw-9", german: "der Feierabend", article: "der", meaningEn: "quitting time / evening off", meaningTr: "iş çıkışı / mesai bitimi", category: "noun" },
  { id: "fw-10", german: "die Sehnsucht", article: "die", meaningEn: "deep longing / yearning", meaningTr: "hasret, derin özlem", category: "noun" },
  { id: "fw-11", german: "das Fernweh", article: "das", meaningEn: "wanderlust / craving for travel", meaningTr: "uzak diyarlara özlem", category: "noun" },
  { id: "fw-12", german: "die Herausforderung", article: "die", meaningEn: "challenge", meaningTr: "meydan okuma, zorluk", category: "noun" },
  { id: "fw-13", german: "warten auf + Akk", meaningEn: "to wait for (Akk)", meaningTr: "beklemek (Akk)", category: "verb" },
  { id: "fw-14", german: "sich freuen auf + Akk", meaningEn: "to look forward to", meaningTr: "dört gözle beklemek", category: "verb" },
  { id: "fw-15", german: "sich interessieren für + Akk", meaningEn: "to be interested in", meaningTr: "ilgilenmek", category: "verb" },
  { id: "fw-16", german: "teilnehmen an + Dat", meaningEn: "to participate in (Dat)", meaningTr: "katılmak (Dat)", category: "verb" },
  { id: "fw-17", german: "träumen von + Dat", meaningEn: "to dream of (Dat)", meaningTr: "hayalini kurmak (Dat)", category: "verb" },
  { id: "fw-18", german: "gehören zu + Dat", meaningEn: "to belong to (Dat)", meaningTr: "ait olmak (Dat)", category: "verb" },
  { id: "fw-19", german: "deshalb ⬅️", meaningEn: "therefore (verb 2nd)", meaningTr: "bu yüzden (fiil 2. sırada)", category: "connector" },
  { id: "fw-20", german: "trotzdem ⬅️", meaningEn: "nevertheless (verb 2nd)", meaningTr: "buna rağmen (fiil 2. sırada)", category: "connector" },
  { id: "fw-21", german: "weil ➡️", meaningEn: "because (verb at end)", meaningTr: "çünkü (fiil en sonda)", category: "connector" },
  { id: "fw-22", german: "obwohl ➡️", meaningEn: "although (verb at end)", meaningTr: "-e rağmen (fiil en sonda)", category: "connector" },
  { id: "fw-23", german: "denn ⏺️", meaningEn: "because (order untouched)", meaningTr: "çünkü (sıra değişmez)", category: "connector" },
  { id: "fw-24", german: "das Vorstellungsgespräch", article: "das", meaningEn: "job interview", meaningTr: "iş mülakatı", category: "noun" },
  { id: "fw-25", german: "die Gemütlichkeit", article: "die", meaningEn: "coziness / comfort", meaningTr: "rahatlık, samimi ortam", category: "noun" },
  { id: "fw-26", german: "der Unterschied", article: "der", meaningEn: "difference", meaningTr: "fark, ayrım", category: "noun" },
];

export function FloatingWords() {
  const { lang, t } = useLanguage();
  const [isEnabled, setIsEnabled] = useState(true);
  const [activeWord, setActiveWord] = useState<typeof WORDS_DATABASE[0] | null>(null);

  // Initialize randomized positioning
  const floatingItems: FloatingWordItem[] = useMemo(() => {
    return WORDS_DATABASE.map((item, idx) => {
      // Deterministic spread across screen widths
      const left = (idx * 13) % 92;
      const duration = 20 + (idx % 5) * 6; // 20s to 44s
      const delay = (idx * 1.7) % 18;
      const sizeIndex = idx % 3;
      const size: "sm" | "md" | "lg" = sizeIndex === 0 ? "sm" : sizeIndex === 1 ? "md" : "lg";
      const opacity = 0.2 + (idx % 4) * 0.08; // 0.20 to 0.44

      return {
        ...item,
        left,
        duration,
        delay,
        size,
        opacity,
      };
    });
  }, []);

  return (
    <>
      {/* Background Animated Floating Words Layer */}
      {isEnabled && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {floatingItems.map((item) => {
            let textColor = "text-neutral-400 dark:text-neutral-500";
            if (item.article === "der") textColor = "text-blue-500/50 dark:text-blue-400/50";
            if (item.article === "die") textColor = "text-red-500/50 dark:text-red-400/50";
            if (item.article === "das") textColor = "text-emerald-500/50 dark:text-emerald-400/50";
            if (item.category === "connector") textColor = "text-amber-500/50 dark:text-amber-400/50";

            return (
              <div
                key={item.id}
                onClick={() => setActiveWord(item)}
                style={{
                  left: `${item.left}%`,
                  animationDuration: `${item.duration}s`,
                  animationDelay: `${item.delay}s`,
                  opacity: item.opacity,
                }}
                className={`absolute bottom-[-100px] pointer-events-auto cursor-pointer font-mono font-medium tracking-tight hover:opacity-100 hover:scale-110 hover:z-20 transition-all duration-300 animate-float ${textColor} ${
                  item.size === "sm" ? "text-xs" : item.size === "md" ? "text-sm" : "text-base font-semibold"
                }`}
                title={lang === "en" ? item.meaningEn : item.meaningTr}
              >
                <span className="backdrop-blur-[1px] px-1 py-0.5 rounded">
                  {item.german}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Word Inspector Tooltip Popup (When clicked) */}
      {activeWord && (
        <div className="fixed bottom-14 right-4 sm:right-8 z-40 max-w-sm w-80 p-4 bg-white/95 dark:bg-[#1A1A18]/95 border border-[#DDD8CE] dark:border-[#33322D] shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between pb-2 border-b border-[#E7E4DD] dark:border-[#2C2B27]">
            <div className="flex items-center gap-2">
              {activeWord.article && (
                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 border ${
                    activeWord.article === "der"
                      ? "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40"
                      : activeWord.article === "die"
                      ? "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40"
                      : "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40"
                  }`}
                >
                  {activeWord.article}
                </span>
              )}
              <h4 className="font-bold text-base font-mono text-neutral-900 dark:text-neutral-100">
                {activeWord.german}
              </h4>
            </div>
            <button
              onClick={() => setActiveWord(null)}
              className="p-0.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2.5 space-y-1.5 font-sans text-xs">
            <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
              <span className="font-mono text-[10px] text-neutral-400 uppercase">EN:</span>
              <span className="font-medium">{activeWord.meaningEn}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <span className="font-mono text-[10px] text-neutral-400 uppercase">TR:</span>
              <span>{activeWord.meaningTr}</span>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Ambient Toggle in corner */}
      <div className="fixed bottom-3 right-4 z-30">
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono border transition-all ${
            isEnabled
              ? "bg-neutral-900/80 text-neutral-200 dark:bg-[#1A1A18]/80 dark:text-neutral-300 border-neutral-700 hover:border-neutral-500 shadow-sm"
              : "bg-neutral-200/60 dark:bg-neutral-900/60 text-neutral-500 border-neutral-300 dark:border-neutral-800 line-through"
          }`}
          title={t("Uçuşan kelimeleri aç/kapat", "Toggle ambient floating words")}
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{isEnabled ? t("Kelimeler: Açık", "Floating Words: On") : t("Kelimeler: Kapalı", "Floating Words: Off")}</span>
        </button>
      </div>
    </>
  );
}
