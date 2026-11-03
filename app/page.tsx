"use client";

import React, { useState, useEffect } from "react";
import initialData from "@/data/generated/db.json";
import { AppDatabase } from "@/types";
import { Header, ActiveTab } from "@/components/Header";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import { KonnektorenHub } from "@/components/KonnektorenHub";
import { SmartVocabulary } from "@/components/SmartVocabulary";
import { FocusReaderAndPractice } from "@/components/FocusReaderAndPractice";
import { SyncModal } from "@/components/SyncModal";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const { lang, t } = useLanguage();
  const [data, setData] = useState<AppDatabase>(initialData as AppDatabase);
  const [activeTab, setActiveTab] = useState<ActiveTab>("graph");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Sync handler (supports both Node server and GitHub Pages static hosting)
  const handleSync = async () => {
    setIsSyncing(true);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    try {
      const res = await fetch(`${basePath}/api/sync`, { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setIsSyncing(false);
          return;
        }
      }
    } catch {
      // Static export fallback (GitHub Pages)
    }

    try {
      const fallbackRes = await fetch(`${basePath}/data/db.json?t=${Date.now()}`);
      if (fallbackRes.ok) {
        const freshData = await fallbackRes.json();
        setData(freshData);
      }
    } catch (err) {
      console.error("Static sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-[#111110] text-[#181715] dark:text-[#F2EFE9] transition-colors">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSync={handleSync}
        isSyncing={isSyncing}
        openSyncModal={() => setIsSyncModalOpen(true)}
        lastSynced={data.metadata?.lastSynced}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {activeTab === "graph" && (
          <div className="w-full">
            <KnowledgeGraph
              nodes={data.graph.nodes}
              edges={data.graph.edges}
            />
          </div>
        )}

        {activeTab === "connectors" && (
          <KonnektorenHub
            connectors={data.connectors}
          />
        )}

        {activeTab === "vocab" && (
          <SmartVocabulary
            vocabulary={data.vocabulary}
          />
        )}

        {activeTab === "reader" && (
          <FocusReaderAndPractice
            notes={data.notes}
            exercises={data.exercises}
            vocabulary={data.vocabulary}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#E7E4DD] dark:border-[#22211E] py-4 px-6 text-center text-xs font-mono text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MeinDeutscherRaum • Dieter Rams Radical Minimalism</span>
          <div className="flex items-center gap-3">
            <span>{data.metadata?.totalVocabulary} {t("kelime", "words")}</span>
            <span>•</span>
            <span>{data.metadata?.totalConnectors} {t("bağlaç", "connectors")}</span>
            <span>•</span>
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="underline hover:text-neutral-900 dark:hover:text-white"
            >
              {t("Senkronizasyon Durumu", "Sync Status")}
            </button>
          </div>
        </div>
      </footer>

      {/* Sync and AI Note Ingest Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        metadata={data.metadata}
        onSync={handleSync}
        isSyncing={isSyncing}
      />

    </div>
  );
}
