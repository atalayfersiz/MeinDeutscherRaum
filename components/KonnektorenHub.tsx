"use client";

import React, { useState, useMemo } from "react";
import { ConnectorItem, ConnectorGroup } from "@/types";
import { useLanguage } from "@/lib/language-context";
import { Search, ChevronRight, Bookmark, Sparkles, HelpCircle } from "lucide-react";

interface KonnektorenHubProps {
  connectors: ConnectorItem[];
}

export function KonnektorenHub({ connectors }: KonnektorenHubProps) {
  const { lang, t } = useLanguage();
  const [selectedGroup, setSelectedGroup] = useState<ConnectorGroup | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null);

  const groups: { id: ConnectorGroup | "all"; labelTr: string; labelEn: string; formula: string; posDesc: string }[] = [
    {
      id: "all",
      labelTr: "Tüm Bağlaçlar",
      labelEn: "All Connectors",
      formula: "Überblick aller Satzstrukturen",
      posDesc: "4 temel bağlaç kategorisi"
    },
    {
      id: "position_0",
      labelTr: "Pozisyon 0 (ADUSO)",
      labelEn: "Position 0 (ADUSO)",
      formula: "[Konnektor] + Subjekt + Verb + ...",
      posDesc: "aber, denn, und, sondern, oder • Cümle sırası değişmez"
    },
    {
      id: "nebensatz",
      labelTr: "Nebensatz (Fiil Sonda)",
      labelEn: "Subordinate (Verb at End)",
      formula: "..., [Konnektor] + Subjekt + ... + VERB (Ende)",
      posDesc: "weil, dass, obwohl, wenn, damit • Fiil cümlenin sonuna gider"
    },
    {
      id: "position_1",
      labelTr: "Pozisyon 1 (Fiil Hemen Sonra)",
      labelEn: "Position 1 (Verb Follows)",
      formula: "[Konnektor] + VERB + Subjekt + ...",
      posDesc: "deshalb, trotzdem, sonst, außerdem • Fiil 2. pozisyondadır"
    },
    {
      id: "zweiteilig",
      labelTr: "İkili Bağlaçlar (Zweiteilig)",
      labelEn: "Two-Part Connectors",
      formula: "[Teil 1] ... [Teil 2]",
      posDesc: "nicht nur ... sondern auch, entweder ... oder, zwar ... aber"
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
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E7E4DD] dark:border-[#22211E]">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            {t("Almanca Cümle Matematiği", "German Sentence Mechanics")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
            {t("Bağlaçlar Matrisi (Konnektoren Hub)", "Connectors Matrix (Konnektoren Hub)")}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
            {t(
              "Almanca'da bağlaçlar cümlenin anlamından ziyade fiilin konumunu (Pozisyon 0, Pozisyon 1 veya Sonda) belirler. Aşağıdaki matris üzerinden yapısal kuralları ve gerçek ders örneklerini inceleyin.",
              "In German, connectors dictate where the conjugated verb goes (Position 0, Position 1, or at the End). Explore structural rules and verified real-life sentence patterns below."
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Bağlaç veya örnek ara...", "Search connector or sentence...")}
            className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white dark:bg-[#1A1A18] border border-[#DDD8CE] dark:border-[#33322D] focus:border-neutral-900 dark:focus:border-neutral-100 outline-none text-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      {/* Group Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {groups.map((g) => {
          const isActive = selectedGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`text-left p-3.5 border transition-all ${
                isActive
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-sm"
                  : "bg-white dark:bg-[#1A1A18] text-neutral-800 dark:text-neutral-200 border-[#DDD8CE] dark:border-[#2C2B27] hover:border-neutral-400"
              }`}
            >
              <div className="font-semibold text-xs tracking-tight">
                {lang === "tr" ? g.labelTr : g.labelEn}
              </div>
              <div
                className={`font-mono text-[10px] mt-1.5 line-clamp-1 ${
                  isActive ? "text-neutral-300 dark:text-neutral-700" : "text-neutral-500"
                }`}
              >
                {g.formula}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid & Interactive Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Connectors Table / Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 flex items-center justify-between">
            <span>
              {t("Listelenen Bağlaçlar", "Listed Connectors")} ({filteredConnectors.length})
            </span>
            <span className="text-[11px] text-neutral-400">
              {t("Detay için bir bağlaca tıklayın", "Click any connector for details")}
            </span>
          </div>

          <div className="space-y-2">
            {filteredConnectors.map((c) => {
              const isSelected = selectedConnector?.id === c.id;
              
              // Group badge color
              let groupBadge = "bg-neutral-100 text-neutral-800 border-neutral-300";
              if (c.group === "position_0") groupBadge = "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900";
              if (c.group === "nebensatz") groupBadge = "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";
              if (c.group === "position_1") groupBadge = "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900";
              if (c.group === "zweiteilig") groupBadge = "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900";

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedConnector(c)}
                  className={`p-4 border transition-all cursor-pointer bg-white dark:bg-[#1A1A18] ${
                    isSelected
                      ? "border-neutral-900 dark:border-neutral-100 shadow-sm ring-1 ring-neutral-900 dark:ring-neutral-100"
                      : "border-[#DDD8CE] dark:border-[#2C2B27] hover:border-neutral-400 dark:hover:border-neutral-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                          {c.name}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 border ${groupBadge}`}>
                          {lang === "tr" ? c.groupTitleTr : c.groupTitleEn}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {c.level}
                        </span>
                      </div>
                      
                      <div className="text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="font-medium">
                          {lang === "tr" ? c.meaningTr : c.meaningEn}
                        </span>
                        <span className="text-neutral-400 ml-2">
                          ({lang === "tr" ? c.meaningEn : c.meaningTr})
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        isSelected ? "rotate-90 text-neutral-900 dark:text-white" : ""
                      }`}
                    />
                  </div>

                  {/* Formula Preview */}
                  <div className="mt-2.5 pt-2 border-t border-[#F0ECE4] dark:border-[#242320] flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span className="truncate">{c.formula}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Connector Detail Inspector */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-[#FAF9F5] dark:bg-[#181816] border border-[#DDD8CE] dark:border-[#2C2B27] p-6 space-y-6">
            {selectedConnector ? (
              <>
                <div className="pb-4 border-b border-[#E7E4DD] dark:border-[#2B2A26]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    {lang === "tr" ? selectedConnector.groupTitleTr : selectedConnector.groupTitleEn}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-mono mt-1">
                    {selectedConnector.name}
                  </h3>
                  <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                    {lang === "tr" ? selectedConnector.meaningTr : selectedConnector.meaningEn}
                  </div>
                </div>

                {/* Sentence Structure Formula */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t("Cümle Dizilim Formülü", "Sentence Order Formula")}</span>
                  </div>
                  <div className="p-3 bg-neutral-900 text-neutral-100 font-mono text-xs rounded-none leading-relaxed border border-neutral-700">
                    {selectedConnector.formula}
                  </div>
                </div>

                {/* Grammar Logic Note */}
                {(selectedConnector.notesTr || selectedConnector.notesEn) && (
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t("Gramer Mantığı & İpucu", "Grammar Rule & Hint")}</span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#20201D] p-3 border border-[#E7E4DD] dark:border-[#2C2B27] leading-relaxed">
                      {lang === "tr" ? selectedConnector.notesTr : selectedConnector.notesEn}
                    </p>
                  </div>
                )}

                {/* Real Usage Example */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                    <span>{t("Ders Notlarından Örnek", "Authentic Example from Notes")}</span>
                  </div>
                  <blockquote className="p-4 bg-white dark:bg-[#20201D] border-l-2 border-neutral-900 dark:border-neutral-100 text-sm font-sans text-neutral-900 dark:text-neutral-100 leading-relaxed italic">
                    "{selectedConnector.example}"
                  </blockquote>
                </div>
              </>
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 border border-neutral-300 dark:border-neutral-700 mx-auto flex items-center justify-center font-mono text-xs text-neutral-400">
                  §
                </div>
                <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t("Bir bağlaç seçin", "Select a connector")}
                </div>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  {t(
                    "Cümle dizilim formülünü, gramer kurallarını ve ders notlarından gelen örnekleri görmek için soldaki listeden seçim yapın.",
                    "Select any connector on the left to see its sentence formula, rules, and notes examples."
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
