"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { AppDatabase } from "@/types";
import { 
  X, 
  RefreshCw, 
  FolderSync, 
  Sparkles, 
  HardDrive, 
  CheckCircle2, 
  FileText,
  AlertCircle 
} from "lucide-react";

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata?: AppDatabase["metadata"];
  onSync: () => Promise<void>;
  isSyncing: boolean;
}

export function SyncModal({
  isOpen,
  onClose,
  metadata,
  onSync,
  isSyncing
}: SyncModalProps) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"status" | "ai_ingest">("status");
  const [rawText, setRawText] = useState("");
  const [filename, setFilename] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseMessage, setParseMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAiParse = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    setParseMessage(null);
    try {
      const res = await fetch("/api/ai-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText,
          filename: filename.trim() || `gemini_note_${Date.now()}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setParseMessage(
          lang === "tr"
            ? `Not başarıyla kaydedildi: ${data.savedFile}. Veritabanı yenileniyor...`
            : `Note saved successfully: ${data.savedFile}. Updating database...`
        );
        setRawText("");
        setFilename("");
        // Trigger sync automatically
        await onSync();
      } else {
        setParseMessage(data.error || "Hata oluştu.");
      }
    } catch (err: any) {
      setParseMessage(err.message || "Failed to parse note");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#FAF9F5] dark:bg-[#181816] border border-[#DDD8CE] dark:border-[#2C2B27] shadow-2xl p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E4DD] dark:border-[#2B2A26]">
          <div className="flex items-center gap-2">
            <FolderSync className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
            <h2 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-sans">
              {t("Veri Senkronizasyonu & Not Ayrıştırma", "Data Synchronization & AI Note Ingest")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border border-[#DDD8CE] dark:border-[#33322D] bg-white dark:bg-[#1A1A18] text-xs font-mono p-1">
          <button
            onClick={() => setActiveTab("status")}
            className={`flex-1 py-1.5 transition-colors ${
              activeTab === "status"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            {t("Yerel Senkronizasyon Durumu", "Sync Status & Drive")}
          </button>
          <button
            onClick={() => setActiveTab("ai_ingest")}
            className={`flex-1 py-1.5 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "ai_ingest"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{t("Gemini / Not Ekle", "AI Parser & Ingest")}</span>
          </button>
        </div>

        {/* TAB 1: Status */}
        {activeTab === "status" && (
          <div className="space-y-4 text-xs font-mono">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-3 bg-white dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                <div className="text-[10px] text-neutral-400 uppercase">{t("Kelimeler", "Vocabulary")}</div>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {metadata?.totalVocabulary || 0}
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                <div className="text-[10px] text-neutral-400 uppercase">{t("Bağlaçlar", "Connectors")}</div>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {metadata?.totalConnectors || 0}
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                <div className="text-[10px] text-neutral-400 uppercase">{t("Notlar / Metinler", "Notes")}</div>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {metadata?.totalNotes || 0}
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                <div className="text-[10px] text-neutral-400 uppercase">{t("Graf Düğümleri", "Graph Nodes")}</div>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {metadata?.totalGraphNodes || 0}
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                <div className="text-[10px] text-neutral-400 uppercase">{t("Graf Bağları", "Graph Edges")}</div>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {metadata?.totalGraphEdges || 0}
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                <div className="text-[10px] text-neutral-400 uppercase">{t("Alıştırmalar", "Exercises")}</div>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {metadata?.totalExercises || 0}
                </div>
              </div>
            </div>

            {/* Architecture Explanation */}
            <div className="p-4 bg-white dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27] space-y-2 leading-relaxed text-neutral-700 dark:text-neutral-300">
              <div className="font-bold flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100">
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                <span>{t("Local-First & Drive Senkronizasyon Mantığı", "Local-First & Drive Sync Pipeline")}</span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                {t(
                  "Telefondan Google Drive klasörünüze attığınız fotoğraflar, ses kayıtları ve Gemini notları bilgisayarınızdaki `/data/raw` veya `/data/notes` klasörüne düşer.",
                  "Photos, voice transcripts, and Gemini outputs dropped into your Google Drive folder mirror to `/data/raw` or `/data/notes` on your machine."
                )}
              </p>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                {t(
                  "Aşağıdaki 'Şimdi Senkronize Et' butonuna bastığınızda veya terminalde 'npm run sync-data' komutunu çalıştırdığınızda tüm içerik taranıp belleğe işlenir.",
                  "Click 'Sync Now' below or run 'npm run sync-data' to re-index all Markdown and raw notes instantly."
                )}
              </p>
              {metadata?.lastSynced && (
                <div className="pt-2 text-[10px] text-neutral-400 border-t border-[#F0ECE4] dark:border-[#2B2A26]">
                  {t("Son Senkronizasyon:", "Last Synchronized:")}{" "}
                  {new Date(metadata.lastSynced).toLocaleString()}
                </div>
              )}
            </div>

            {/* Sync Action Button */}
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="w-full py-2.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>
                {isSyncing ? t("Senkronize Ediliyor...", "Syncing...") : t("Şimdi Senkronize Et", "Sync Now")}
              </span>
            </button>
          </div>
        )}

        {/* TAB 2: AI Ingest */}
        {activeTab === "ai_ingest" && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                {t("Not Başlığı / Dosya Adı", "Note Title / Filename")}
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="z.B. b1_gespraeche_beruf.txt"
                className="w-full px-3 py-2 bg-white dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#33322D] outline-none font-mono text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                {t("Ham Ders Notu, Gemini Çıktısı veya OCR Metni", "Raw Study Note, Gemini Output or OCR Text")}
              </label>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={t(
                  "Buraya Gemini sohbetinden kopyaladığınız kelimeleri, fiil çekimlerini veya taranmış not metnini yapıştırın...",
                  "Paste vocabulary, verbs with prepositions, or raw notes copied from Gemini here..."
                )}
                className="w-full p-3 bg-white dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#33322D] outline-none font-mono text-neutral-900 dark:text-neutral-100 text-xs leading-relaxed"
              />
            </div>

            {parseMessage && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>{parseMessage}</span>
              </div>
            )}

            <button
              onClick={handleAiParse}
              disabled={isParsing || !rawText.trim()}
              className="w-full py-2.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-mono font-bold flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isParsing ? "animate-spin" : ""}`} />
              <span>
                {isParsing
                  ? t("Ayrıştırılıyor ve İndeksleniyor...", "Parsing & Indexing...")
                  : t("Ayrıştır & /data/raw Klasörüne Ekle", "Parse & Save to /data/raw")}
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
