"use client";

import React, { useState, useMemo } from "react";
import { ConnectorItem, ConnectorGroup } from "@/types";
import { useLanguage } from "@/lib/language-context";
import { 
  Search, 
  ChevronRight, 
  Bookmark, 
  Sparkles, 
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  CircleDot,
  Compass,
  LayoutGrid,
  Check
} from "lucide-react";

interface KonnektorenHubProps {
  connectors: ConnectorItem[];
}

export function KonnektorenHub({ connectors }: KonnektorenHubProps) {
  const { lang, t } = useLanguage();
  const [viewMode, setViewMode] = useState<"compass" | "matrix">("compass");
  const [selectedGroup, setSelectedGroup] = useState<ConnectorGroup | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null);

  // Sol (Position 1), Orta (Position 0 - ADUSO), Sağ (Nebensatz) lists
  const leftConnectors = useMemo(
    () => connectors.filter((c) => c.group === "position_1"),
    [connectors]
  );
  const centerConnectors = useMemo(
    () => connectors.filter((c) => c.group === "position_0"),
    [connectors]
  );
  const rightConnectors = useMemo(
    () => connectors.filter((c) => c.group === "nebensatz"),
    [connectors]
  );
  const twoPartConnectors = useMemo(
    () => connectors.filter((c) => c.group === "zweiteilig"),
    [connectors]
  );

  const groups: { id: ConnectorGroup | "all"; labelTr: string; labelEn: string; formula: string; posDesc: string }[] = [
    {
      id: "all",
      labelTr: "Tüm Bağlaçlar",
      labelEn: "All Connectors",
      formula: "Überblick aller Satzstrukturen",
      posDesc: "Tüm kategoriler"
    },
    {
      id: "position_1",
      labelTr: "Sol: Fiili Başa Çekenler (Pos 1)",
      labelEn: "Left: Verb to 2nd Pos (Pos 1)",
      formula: "[Konnektor] + VERB + Subjekt + ...",
      posDesc: "deshalb, trotzdem, sonst, außerdem"
    },
    {
      id: "position_0",
      labelTr: "Orta: Değiştirmeyenler (ADUSO)",
      labelEn: "Center: Untouched (ADUSO)",
      formula: "[Konnektor] + Subjekt + Verb + ...",
      posDesc: "aber, denn, und, sondern, oder"
    },
    {
      id: "nebensatz",
      labelTr: "Sağ: Fiili Sona Atanlar (Nebensatz)",
      labelEn: "Right: Verb to End (Nebensatz)",
      formula: "..., [Konnektor] + Subjekt + ... + VERB (Ende)",
      posDesc: "weil, dass, obwohl, wenn, damit"
    },
    {
      id: "zweiteilig",
      labelTr: "İkili Bağlaçlar (Zweiteilig)",
      labelEn: "Two-Part Connectors",
      formula: "[Teil 1] ... [Teil 2]",
      posDesc: "nicht nur ... sondern auch, entweder ... oder"
    }
  ];

  const filteredConnectors = useMemo(() => {
    return connectors.filter((c) => {
      const matchesGroup = selectedGroup === "all" || c.group === selectedGroup;
      const matchesSearch =
        search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.meaningTr.toLowerCase().includes(search.toLowerCase()) ||
        c.meaningEn.toLowerCase().includes(search.toLowerCase()) ||
        c.example.toLowerCase().includes(search.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [connectors, selectedGroup, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Intro Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E7E4DD] dark:border-[#22211E]">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            {t("Kişisel Zihinsel Model & Almanca Cümle Matematiği", "Personal Mental Compass & German Sentence Mechanics")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
            {t("Bağlaçlar Pusulası (Sol • Orta • Sağ)", "Connectors Compass (Left • Center • Right)")}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-3xl leading-relaxed">
            {t(
              "Almanca bağlaçları fiilin konumuna göre 3 bölgeye ayırıyoruz: Soldakiler fiili hemen arkasına (2. pozisyona) çeker; Ortadakiler (ADUSO) fiilin yerini hiç bozmaz; Sağdakiler (Nebensatz) ise fiili cümlenin en sağına (sonuna) fırlatır.",
              "Our 3-zone mental model: LEFT connectors pull the verb immediately to position 2; CENTER connectors (ADUSO) leave verb position untouched; RIGHT connectors (Nebensatz) throw the verb to the far right (end of clause)."
            )}
          </p>
        </div>

        {/* View Mode Toggle (Pusula vs Tablo) */}
        <div className="flex items-center gap-2">
          <div className="flex border border-[#DDD8CE] dark:border-[#33322D] bg-white dark:bg-[#1A1A18] text-xs font-mono p-1">
            <button
              onClick={() => setViewMode("compass")}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                viewMode === "compass"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t("Zihinsel Pusula (Sol-Orta-Sağ)", "Mental Compass (Left-Center-Right)")}</span>
            </button>
            <button
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                viewMode === "matrix"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t("Klasik Matris Listesi", "Classic Matrix List")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: ZİHİNSEL PUSULA (SOL - ORTA - SAĞ) */}
      {viewMode === "compass" && (
        <div className="space-y-6">
          
          {/* 3-Zone Spatial Compass Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* COLUMN 1: SOL (Fiili Başa Çekenler - Pos 1) */}
            <div className="flex flex-col border-2 border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 p-5 space-y-4">
              <div className="pb-3 border-b border-amber-200 dark:border-amber-900/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("SOL (Links)", "LEFT (Links)")}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-900">
                    Pos 1 (Adverbial)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans mt-1">
                  {t("Fiili Başa Çekenler", "Verb Pulled to 2nd Pos")}
                </h3>
                <div className="mt-2 p-2 bg-amber-100/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] font-mono text-amber-900 dark:text-amber-200 font-semibold">
                  [Bağlaç] ⬅️ [VERB] + Subjekt + ...
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  {t(
                    "Bağlaç 1. pozisyondadır. Çekimli fiil hemen bağlaçtan sonra 2. pozisyona gelir; özne fiilden sonraya geçer.",
                    "Connector occupies position 1. Conjugated verb immediately takes position 2; subject flips to position 3."
                  )}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-2 flex-1">
                {leftConnectors.map((c) => {
                  const isSelected = selectedConnector?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConnector(c)}
                      className={`p-3 border cursor-pointer transition-all bg-white dark:bg-[#1A1A18] ${
                        isSelected
                          ? "border-amber-600 ring-2 ring-amber-500/20 shadow-sm"
                          : "border-[#DDD8CE] dark:border-[#2C2B27] hover:border-amber-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">{c.level}</span>
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {lang === "tr" ? c.meaningTr : c.meaningEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2: ORTA (Fiilin Yerini Değiştirmeyenler - ADUSO) */}
            <div className="flex flex-col border-2 border-blue-300 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/10 p-5 space-y-4">
              <div className="pb-3 border-b border-blue-200 dark:border-blue-900/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <CircleDot className="w-4 h-4" />
                    <span>{t("ORTA (Mitte)", "CENTER (Mitte)")}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-900">
                    Pos 0 (ADUSO)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans mt-1">
                  {t("Yerini Değiştirmeyenler", "Leaves Verb Untouched")}
                </h3>
                <div className="mt-2 p-2 bg-blue-100/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px] font-mono text-blue-900 dark:text-blue-200 font-semibold">
                  [Bağlaç] ⏺️ Subjekt + [VERB] + ...
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  {t(
                    "Pozisyon 0'dadır. Cümledeki standart 'Özne + Fiil' sıralamasını hiç bozmaz; nötr etkisiz elemandır.",
                    "Occupies position 0. Leaves standard 'Subject + Verb' order untouched like a neutral connector."
                  )}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-2 flex-1">
                {centerConnectors.map((c) => {
                  const isSelected = selectedConnector?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConnector(c)}
                      className={`p-3 border cursor-pointer transition-all bg-white dark:bg-[#1A1A18] ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                          : "border-[#DDD8CE] dark:border-[#2C2B27] hover:border-blue-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">{c.level}</span>
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {lang === "tr" ? c.meaningTr : c.meaningEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3: SAĞ (Fiili En Sona Atanlar - Nebensatz) */}
            <div className="flex flex-col border-2 border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 p-5 space-y-4">
              <div className="pb-3 border-b border-emerald-200 dark:border-emerald-900/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <ArrowRight className="w-4 h-4" />
                    <span>{t("SAĞ (Rechts)", "RIGHT (Rechts)")}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-900">
                    Nebensatz
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans mt-1">
                  {t("Fiili En Sona Atanlar", "Throws Verb to Very End")}
                </h3>
                <div className="mt-2 p-2 bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-[11px] font-mono text-emerald-900 dark:text-emerald-200 font-semibold">
                  ..., [Bağlaç] + Subjekt + ... ➡️ [VERB]
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  {t(
                    "Yan cümle (Nebensatz) başlatır. Çekimli fiil cümlenin en sağına (en sonuna) gider.",
                    "Subordinating clause (Nebensatz). The conjugated verb is banished to the far right (end of clause)."
                  )}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-2 flex-1">
                {rightConnectors.map((c) => {
                  const isSelected = selectedConnector?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConnector(c)}
                      className={`p-3 border cursor-pointer transition-all bg-white dark:bg-[#1A1A18] ${
                        isSelected
                          ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm"
                          : "border-[#DDD8CE] dark:border-[#2C2B27] hover:border-emerald-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">{c.level}</span>
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {lang === "tr" ? c.meaningTr : c.meaningEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Interactive Sentence Simulator: Live demonstration */}
          <div className="bg-[#FAF9F5] dark:bg-[#181816] border border-[#DDD8CE] dark:border-[#2C2B27] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
                  {t("Canlı Cümle Simülatörü: Fiil Nereye Gider?", "Live Simulator: Where Does the Verb Go?")}
                </h4>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {t("Yukarıdaki kutulardan bir bağlaca tıklayın", "Click any connector above to test")}
              </span>
            </div>

            {selectedConnector ? (
              <div className="space-y-4 pt-2 border-t border-[#EAE6DD] dark:border-[#262521] animate-in fade-in duration-150">
                
                {/* Visual Position Badge */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-50 px-3 py-1 bg-white dark:bg-[#20201D] border border-neutral-300 dark:border-neutral-700">
                    {selectedConnector.name}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    {lang === "tr" ? selectedConnector.meaningTr : selectedConnector.meaningEn}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                    {selectedConnector.group === "position_1" && t("SOL: Fiil 2. Sırada ⬅️", "LEFT: Verb Second ⬅️")}
                    {selectedConnector.group === "position_0" && t("ORTA: Fiil Değişmez ⏺️", "CENTER: Verb Untouched ⏺️")}
                    {selectedConnector.group === "nebensatz" && t("SAĞ: Fiil En Sonda ➡️", "RIGHT: Verb at the End ➡️")}
                  </span>
                </div>

                {/* Formulated Sentence Example */}
                <div className="p-4 bg-white dark:bg-[#20201D] border-l-4 border-neutral-900 dark:border-neutral-100 space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    {t("Örnek Cümle & Fiil Konumu", "Example Sentence & Verb Placement")}
                  </div>
                  <blockquote className="text-base font-medium text-neutral-900 dark:text-neutral-100 italic">
                    "{selectedConnector.example}"
                  </blockquote>
                  <div className="text-xs font-mono text-neutral-500 pt-1">
                    Formül: <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{selectedConnector.formula}</span>
                  </div>
                </div>

                {/* Grammatical Hint */}
                {(selectedConnector.notesTr || selectedConnector.notesEn) && (
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-[#232320] p-3 border border-[#E0DCD3] dark:border-[#33322D]">
                    💡 {lang === "tr" ? selectedConnector.notesTr : selectedConnector.notesEn}
                  </div>
                )}

              </div>
            ) : (
              <div className="py-6 text-center text-xs font-mono text-neutral-500">
                {t(
                  "Yukarıdaki SOL, ORTA veya SAĞ listesinden herhangi bir bağlaca tıklayarak fiilin nereye yerleştiğini ve cümle formülünü anında görün.",
                  "Click any connector in the LEFT, CENTER, or RIGHT columns to see live verb placement and formula."
                )}
              </div>
            )}
          </div>

          {/* Zweiteilige (İkili) Bağlaçlar Eki */}
          <div className="border border-[#DDD8CE] dark:border-[#2C2B27] bg-white dark:bg-[#1A1A18] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4] dark:border-[#262521]">
              <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
                {t("İkili Bağlaçlar (Zweiteilige Konnektoren)", "Two-Part Connectors")}
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900">
                [Teil 1] ... [Teil 2]
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {twoPartConnectors.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedConnector(c)}
                  className="p-3 border border-[#E7E4DD] dark:border-[#2C2B27] hover:border-purple-600 cursor-pointer transition-colors"
                >
                  <div className="font-mono font-bold text-xs text-purple-900 dark:text-purple-300">
                    {c.name}
                  </div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">
                    {lang === "tr" ? c.meaningTr : c.meaningEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: KLASİK MATRİS TABLOSU */}
      {viewMode === "matrix" && (
        <div className="space-y-6">
          
          {/* Search & Group Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Bağlaç veya örnek ara...", "Search connector or sentence...")}
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white dark:bg-[#1A1A18] border border-[#DDD8CE] dark:border-[#33322D] outline-none text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs font-mono no-scrollbar">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroup(g.id)}
                  className={`px-3 py-1.5 border whitespace-nowrap transition-colors ${
                    selectedGroup === g.id
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 font-bold"
                      : "bg-white dark:bg-[#1A1A18] text-neutral-600 dark:text-neutral-400 border-[#DDD8CE] dark:border-[#33322D]"
                  }`}
                >
                  {lang === "tr" ? g.labelTr : g.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Matrix List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnectors.map((c) => {
              const isSelected = selectedConnector?.id === c.id;
              
              let zoneLabel = t("ORTA", "CENTER");
              let zoneColor = "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300";
              if (c.group === "position_1") {
                zoneLabel = t("SOL (Pos 1)", "LEFT (Pos 1)");
                zoneColor = "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";
              } else if (c.group === "nebensatz") {
                zoneLabel = t("SAĞ (Nebensatz)", "RIGHT (Nebensatz)");
                zoneColor = "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300";
              } else if (c.group === "zweiteilig") {
                zoneLabel = t("İKİLİ", "TWO-PART");
                zoneColor = "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300";
              }

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedConnector(c)}
                  className={`p-4 border bg-white dark:bg-[#1A1A18] cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-neutral-900 dark:border-neutral-100 shadow-sm ring-1 ring-neutral-900 dark:ring-neutral-100"
                      : "border-[#DDD8CE] dark:border-[#2C2B27] hover:border-neutral-400"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-base text-neutral-900 dark:text-neutral-100">
                        {c.name}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border ${zoneColor}`}>
                        {zoneLabel}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-700 dark:text-neutral-300">
                      <span className="font-medium">
                        {lang === "tr" ? c.meaningTr : c.meaningEn}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-neutral-500 bg-[#FAF9F5] dark:bg-[#20201D] p-2 border border-[#EAE6DD] dark:border-[#2B2A27]">
                      {c.formula}
                    </div>
                  </div>

                  <blockquote className="mt-3 pt-2 border-t border-[#F0ECE4] dark:border-[#242320] text-xs italic text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    "{c.example}"
                  </blockquote>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
