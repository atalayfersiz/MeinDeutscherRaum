"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { 
  Network, 
  GitBranch, 
  Layers, 
  BookOpen, 
  RefreshCw, 
  Sun, 
  Moon, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export type ActiveTab = "graph" | "connectors" | "vocab" | "reader";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onSync: () => Promise<void>;
  isSyncing: boolean;
  openSyncModal: () => void;
  lastSynced?: string;
}

export function Header({
  activeTab,
  setActiveTab,
  onSync,
  isSyncing,
  openSyncModal,
  lastSynced
}: HeaderProps) {
  const { lang, setLang, t } = useLanguage();
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navItems: { id: ActiveTab; labelTr: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: "graph",
      labelTr: "Zihin Haritası",
      labelEn: "Knowledge Graph",
      icon: <Network className="w-4 h-4" />
    },
    {
      id: "connectors",
      labelTr: "Bağlaçlar Matrisi",
      labelEn: "Connectors Hub",
      icon: <GitBranch className="w-4 h-4" />
    },
    {
      id: "vocab",
      labelTr: "Akıllı Kelimeler",
      labelEn: "Smart Vocab (SRS)",
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: "reader",
      labelTr: "Okuma & Pratik",
      labelEn: "Reader & Sandbox",
      icon: <BookOpen className="w-4 h-4" />
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 dark:bg-[#111110]/95 backdrop-blur-md border-b border-[#E7E4DD] dark:border-[#242320] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Identity: Bauhaus / Rams Minimalist */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-neutral-800 dark:border-neutral-200 flex items-center justify-center font-mono font-bold text-xs bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 shadow-sm">
              MDR
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 block">
                MeinDeutscherRaum
              </span>
              <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 block tracking-wider uppercase">
                {t("Kişisel Almanca Belleği", "Personal German Workspace")}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F2EFE8] dark:bg-[#1A1A18] p-1 border border-[#E2DDD3] dark:border-[#2A2926]">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                    active
                      ? "bg-white dark:bg-[#282724] text-neutral-950 dark:text-white shadow-sm border border-neutral-300 dark:border-neutral-700 font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{lang === "tr" ? item.labelTr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2">
            
            {/* Sync Button */}
            <button
              onClick={onSync}
              disabled={isSyncing}
              title={t("Drive/Yerel verileri tara ve güncelle", "Scan and sync local/drive notes")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[#D5D0C5] dark:border-[#383733] hover:border-neutral-800 dark:hover:border-neutral-200 text-xs font-mono text-neutral-800 dark:text-neutral-200 bg-white dark:bg-[#1A1A18] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
              <span className="hidden sm:inline">
                {isSyncing ? t("Senkronize Ediliyor...", "Syncing...") : t("Sync", "Sync")}
              </span>
            </button>

            {/* AI Note Ingest Shortcut */}
            <button
              onClick={openSyncModal}
              title={t("Not Ekle / Gemini Çıktısı Aktar", "Add Note / Gemini AI Import")}
              className="p-1.5 border border-[#D5D0C5] dark:border-[#383733] hover:border-neutral-800 dark:hover:border-neutral-200 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1A1A18]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </button>

            {/* Language Switcher (TR / EN) */}
            <div className="flex border border-[#D5D0C5] dark:border-[#383733] overflow-hidden text-xs font-mono bg-white dark:bg-[#1A1A18]">
              <button
                onClick={() => setLang("tr")}
                className={`px-2 py-1 transition-colors ${
                  lang === "tr"
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 transition-colors ${
                  lang === "en"
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                EN
              </button>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 border border-[#D5D0C5] dark:border-[#383733] hover:border-neutral-800 dark:hover:border-neutral-200 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1A1A18]"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto gap-1 pt-2 pb-1 border-t border-[#EAE7DF] dark:border-[#22211E] mt-2 no-scrollbar">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-xs border font-medium ${
                  active
                    ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold"
                    : "border-[#E2DDD3] dark:border-[#2A2926] bg-white dark:bg-[#1A1A18] text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {item.icon}
                <span>{lang === "tr" ? item.labelTr : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
