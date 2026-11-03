"use client";

import React, { useState, useMemo } from "react";
import { TextNote, ExerciseItem, VocabularyItem } from "@/types";
import { useLanguage } from "@/lib/language-context";
import { 
  BookOpen, 
  Dumbbell, 
  Check, 
  X, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  HelpCircle,
  Eye,
  FileText
} from "lucide-react";

interface FocusReaderAndPracticeProps {
  notes: TextNote[];
  exercises: ExerciseItem[];
  vocabulary: VocabularyItem[];
  onOpenGraphNode?: (nodeId: string) => void;
}

export function FocusReaderAndPractice({
  notes,
  exercises,
  vocabulary,
  onOpenGraphNode
}: FocusReaderAndPracticeProps) {
  const { lang, t } = useLanguage();
  const [subTab, setSubTab] = useState<"reader" | "practice">("reader");
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || "");
  const [selectedWordInfo, setSelectedWordInfo] = useState<{
    word: string;
    lemma?: string;
    vocabMatch?: VocabularyItem;
  } | null>(null);

  // Practice Sandbox State
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [userWordsOrder, setUserWordsOrder] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const activeNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) || notes[0],
    [notes, selectedNoteId]
  );

  const activeExercise = exercises[activeExerciseIndex] || exercises[0];

  // Initialize Sentence Builder words when exercise changes
  const availableWords = useMemo(() => {
    if (!activeExercise || activeExercise.type !== "sentence_builder" || !activeExercise.words)
      return [];
    return [...activeExercise.words].sort(() => Math.random() - 0.5);
  }, [activeExercise]);

  const handleWordClick = (rawWord: string) => {
    const clean = rawWord.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'„“]/g, "").trim();
    if (!clean || clean.length < 2) return;

    // Search dictionary for match
    const match = vocabulary.find(
      (v) =>
        v.german.toLowerCase() === clean.toLowerCase() ||
        (v.plural && v.plural.toLowerCase() === clean.toLowerCase())
    );

    setSelectedWordInfo({
      word: clean,
      vocabMatch: match
    });
  };

  // Practice Submission
  const handleSubmitCloze = (selectedOpt: string) => {
    if (isAnswerSubmitted) return;
    setUserAnswer(selectedOpt);
    const correct = selectedOpt.trim() === activeExercise.correctAnswer?.trim();
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    if (correct) setScore((prev) => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    else setScore((prev) => ({ ...prev, total: prev.total + 1 }));
  };

  const handleAddSentenceWord = (word: string) => {
    if (isAnswerSubmitted) return;
    setUserWordsOrder((prev) => [...prev, word]);
  };

  const handleRemoveSentenceWord = (index: number) => {
    if (isAnswerSubmitted) return;
    setUserWordsOrder((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckSentence = () => {
    if (isAnswerSubmitted) return;
    const currentStr = userWordsOrder.join(" ");
    const correctStr = activeExercise.correctOrder?.join(" ");
    const correct = currentStr === correctStr;
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    if (correct) setScore((prev) => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    else setScore((prev) => ({ ...prev, total: prev.total + 1 }));
  };

  const handleNextExercise = () => {
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setUserAnswer("");
    setUserWordsOrder([]);
    if (activeExerciseIndex < exercises.length - 1) {
      setActiveExerciseIndex((prev) => prev + 1);
    } else {
      setActiveExerciseIndex(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Bar: Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4DD] dark:border-[#22211E]">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            {t("Bağlamda Okuma & İnteraktif Egzersiz", "Contextual Reader & Interactive Practice")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
            {subTab === "reader"
              ? t("Focus Reader (Odak Okuma Modu)", "Focus Reader Mode")
              : t("Practice Sandbox (Alıştırma Motoru)", "Practice Sandbox Engine")}
          </h1>
        </div>

        {/* SubTab Toggle */}
        <div className="flex border border-[#DDD8CE] dark:border-[#33322D] bg-white dark:bg-[#1A1A18] text-xs font-mono p-1">
          <button
            onClick={() => setSubTab("reader")}
            className={`flex items-center gap-2 px-3 py-1.5 transition-colors ${
              subTab === "reader"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t("Focus Reader", "Focus Reader")}</span>
          </button>
          <button
            onClick={() => setSubTab("practice")}
            className={`flex items-center gap-2 px-3 py-1.5 transition-colors ${
              subTab === "practice"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>{t("Egzersiz Sandbox", "Practice Sandbox")} ({exercises.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: Focus Reader */}
      {subTab === "reader" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Note Selector & Text View */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Note Picker Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
              <span className="text-neutral-500 whitespace-nowrap mr-1">{t("Not Seç:", "Doc:")}</span>
              {notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setSelectedWordInfo(null);
                  }}
                  className={`px-3 py-1.5 border transition-all whitespace-nowrap ${
                    selectedNoteId === note.id
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 font-medium"
                      : "bg-white dark:bg-[#1A1A18] text-neutral-700 dark:text-neutral-300 border-[#DDD8CE] dark:border-[#2C2B27] hover:border-neutral-400"
                  }`}
                >
                  {note.title}
                </button>
              ))}
            </div>

            {/* Reading Container: Dieter Rams Radical Typography */}
            {activeNote ? (
              <div className="bg-[#FCFBF9] dark:bg-[#181816] border border-[#DDD8CE] dark:border-[#2C2B27] p-8 sm:p-12 shadow-sm">
                
                {/* Note Meta */}
                <div className="mb-8 pb-4 border-b border-[#EAE6DD] dark:border-[#262521] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      {activeNote.category} • {activeNote.level}
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans mt-0.5">
                      {activeNote.title}
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {activeNote.updated}
                  </span>
                </div>

                {/* Interactive Clickable Text Content */}
                <div className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 text-base leading-loose font-sans">
                  {activeNote.content.split("\n\n").map((paragraph, pIdx) => {
                    // Check if paragraph is markdown heading
                    if (paragraph.startsWith("#")) {
                      const cleanHead = paragraph.replace(/^#+\s*/, "");
                      return (
                        <h3 key={pIdx} className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-6 mb-3">
                          {cleanHead}
                        </h3>
                      );
                    }

                    // Words rendered as clickable tokens
                    const words = paragraph.split(/\s+/);
                    return (
                      <p key={pIdx} className="mb-4">
                        {words.map((w, wIdx) => (
                          <span
                            key={wIdx}
                            onClick={() => handleWordClick(w)}
                            className="cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-900 dark:hover:text-amber-200 px-0.5 rounded transition-colors inline-block"
                          >
                            {w}{" "}
                          </span>
                        ))}
                      </p>
                    );
                  })}
                </div>

                <div className="mt-8 pt-4 border-t border-[#EAE6DD] dark:border-[#262521] text-xs font-mono text-neutral-400">
                  💡 {t("Metindeki herhangi bir kelimeye tıklayarak anlamını ve gramer kalıbını inceleyin.", "Click on any word in the text to inspect its dictionary entry and grammar patterns.")}
                </div>

              </div>
            ) : null}

          </div>

          {/* Word Inspector Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 bg-[#FAF9F5] dark:bg-[#181816] border border-[#DDD8CE] dark:border-[#2C2B27] p-6 space-y-6">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 pb-3 border-b border-[#E7E4DD] dark:border-[#2B2A26] flex items-center justify-between">
                <span>{t("Kelime & Gramer Müfettişi", "Word & Grammar Inspector")}</span>
                <Eye className="w-3.5 h-3.5 text-neutral-400" />
              </div>

              {selectedWordInfo ? (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      {t("Seçilen Sözcük", "Selected Token")}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
                      {selectedWordInfo.word}
                    </h3>
                  </div>

                  {selectedWordInfo.vocabMatch ? (
                    <div className="space-y-3 bg-white dark:bg-[#20201D] p-4 border border-[#E7E4DD] dark:border-[#2C2B27]">
                      
                      <div className="flex items-center gap-2">
                        {selectedWordInfo.vocabMatch.article && (
                          <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 border border-blue-200">
                            {selectedWordInfo.vocabMatch.article}
                          </span>
                        )}
                        <span className="text-xs font-mono uppercase text-neutral-500">
                          {selectedWordInfo.vocabMatch.type}
                        </span>
                        {selectedWordInfo.vocabMatch.level && (
                          <span className="text-xs font-mono text-neutral-400">
                            {selectedWordInfo.vocabMatch.level}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {lang === "tr"
                            ? selectedWordInfo.vocabMatch.meaningTr
                            : selectedWordInfo.vocabMatch.meaningEn}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {lang === "tr"
                            ? selectedWordInfo.vocabMatch.meaningEn
                            : selectedWordInfo.vocabMatch.meaningTr}
                        </div>
                      </div>

                      {selectedWordInfo.vocabMatch.preposition && (
                        <div className="pt-2 border-t border-[#F0ECE4] dark:border-[#2B2A26] font-mono text-xs text-amber-800 dark:text-amber-300">
                          <strong>Kalıp:</strong> + {selectedWordInfo.vocabMatch.preposition} (
                          {selectedWordInfo.vocabMatch.governedCase})
                        </div>
                      )}

                      {selectedWordInfo.vocabMatch.example && (
                        <div className="text-xs italic text-neutral-700 dark:text-neutral-300 bg-[#FAF9F5] dark:bg-[#181816] p-2 border-l-2 border-neutral-800 dark:border-neutral-200">
                          "{selectedWordInfo.vocabMatch.example}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-white dark:bg-[#20201D] border border-[#E7E4DD] dark:border-[#2C2B27] space-y-2">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {t(
                          `"${selectedWordInfo.word}" sözcüğü yerel indeksinde kayıtlı değil. Yerel parser'ı güncellemek için Sync butonunu kullanabilir veya Gemini AI ile yeni not ekleyebilirsiniz.`,
                          `Word "${selectedWordInfo.word}" is not yet indexed in local database. Run Sync or add a note via AI Ingest.`
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border border-neutral-300 dark:border-neutral-700 mx-auto flex items-center justify-center font-mono text-xs text-neutral-400">
                    ¶
                  </div>
                  <div className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                    {t(
                      "Okuma metninde merak ettiğiniz herhangi bir kelimenin üzerine dokunarak gramer ve sözlük analizini açın.",
                      "Click any word in the reading material to analyze its meaning and syntax."
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: Practice Sandbox */}
      {subTab === "practice" && (
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Progress & Header */}
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pb-2 border-b border-[#E7E4DD] dark:border-[#22211E]">
            <span>
              {t("Egzersiz:", "Exercise:")} {activeExerciseIndex + 1} / {exercises.length}
            </span>
            <span>
              {t("Başarı:", "Score:")} {score.correct} / {score.total}
            </span>
          </div>

          {activeExercise && (
            <div className="bg-white dark:bg-[#1A1A18] border border-[#DDD8CE] dark:border-[#2C2B27] p-8 space-y-6 shadow-sm">
              
              {/* Exercise Type & Category */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 border border-neutral-300 dark:border-neutral-700">
                  {activeExercise.type === "cloze" ? "Lückentext (Boşluk Doldurma)" : "Satzbau (Cümle Kurma)"}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {activeExercise.level} • {activeExercise.category}
                </span>
              </div>

              {/* Prompt Instruction */}
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                  {lang === "tr" ? activeExercise.promptTr : activeExercise.promptEn}
                </h3>
                {activeExercise.targetMeaningTr && (
                  <div className="text-xs text-neutral-500 mt-1 italic">
                    Hedef: {lang === "tr" ? activeExercise.targetMeaningTr : activeExercise.targetMeaningEn}
                  </div>
                )}
              </div>

              {/* TYPE 1: CLOZE (Fill in the blank) */}
              {activeExercise.type === "cloze" && activeExercise.sentenceParts && (
                <div className="space-y-6">
                  <div className="p-4 bg-[#FAF9F5] dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27] text-base font-medium text-neutral-900 dark:text-neutral-100 leading-relaxed font-sans">
                    {activeExercise.sentenceParts[0]}
                    <span className="inline-block px-3 py-0.5 mx-1.5 border-b-2 border-neutral-900 dark:border-neutral-100 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {userAnswer || "______"}
                    </span>
                    {activeExercise.sentenceParts[1]}
                    {activeExercise.sentenceParts[2] && activeExercise.sentenceParts[2]}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-3">
                    {activeExercise.options?.map((opt) => {
                      const isSelected = userAnswer === opt;
                      let btnStyle = "bg-[#FAF9F5] dark:bg-[#20201D] border-[#DDD8CE] dark:border-[#33322D] text-neutral-800 dark:text-neutral-200 hover:border-neutral-900";

                      if (isAnswerSubmitted) {
                        if (opt === activeExercise.correctAnswer) {
                          btnStyle = "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                        } else if (isSelected && !isCorrect) {
                          btnStyle = "bg-red-50 dark:bg-red-950/50 border-red-500 text-red-900 dark:text-red-200 line-through";
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleSubmitCloze(opt)}
                          className={`p-3 border font-mono text-xs transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TYPE 2: SENTENCE BUILDER (Satzbau) */}
              {activeExercise.type === "sentence_builder" && (
                <div className="space-y-6">
                  
                  {/* Construction Area */}
                  <div className="min-h-[64px] p-4 bg-[#FAF9F5] dark:bg-[#20201D] border-2 border-dashed border-[#DDD8CE] dark:border-[#33322D] flex flex-wrap items-center gap-2">
                    {userWordsOrder.length === 0 ? (
                      <span className="text-xs font-mono text-neutral-400">
                        {t("Aşağıdaki kelimeleri sırasıyla buraya ekleyin...", "Click words below in correct order...")}
                      </span>
                    ) : (
                      userWordsOrder.map((w, idx) => (
                        <span
                          key={idx}
                          onClick={() => handleRemoveSentenceWord(idx)}
                          className="cursor-pointer px-3 py-1.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-mono text-xs font-medium hover:bg-red-600 transition-colors shadow-sm"
                          title={t("Kaldırmak için tıkla", "Click to remove")}
                        >
                          {w} ✕
                        </span>
                      ))
                    )}
                  </div>

                  {/* Available Word Chips */}
                  <div className="flex flex-wrap gap-2">
                    {availableWords.map((word, wIdx) => {
                      const isUsed = userWordsOrder.filter((w) => w === word).length >= availableWords.filter((w) => w === word).length;
                      return (
                        <button
                          key={wIdx}
                          disabled={isUsed || isAnswerSubmitted}
                          onClick={() => handleAddSentenceWord(word)}
                          className={`px-3 py-1.5 border font-mono text-xs transition-all ${
                            isUsed
                              ? "opacity-30 border-dashed border-neutral-300 dark:border-neutral-700 pointer-events-none"
                              : "bg-white dark:bg-[#20201D] border-[#DDD8CE] dark:border-[#33322D] hover:border-neutral-900 dark:hover:border-neutral-100"
                          }`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>

                  {!isAnswerSubmitted && (
                    <button
                      onClick={handleCheckSentence}
                      disabled={userWordsOrder.length === 0}
                      className="w-full py-2.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-mono text-xs font-bold disabled:opacity-40"
                    >
                      {t("Cümleyi Kontrol Et", "Check Sentence Order")}
                    </button>
                  )}
                </div>
              )}

              {/* Feedback and Explanation */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 border animate-in fade-in duration-200 space-y-2 ${
                    isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100"
                      : "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {isCorrect ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>{t("Doğru!", "Correct!")}</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-red-600" />
                        <span>{t("Yanlış!", "Incorrect!")}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed">
                    {lang === "tr" ? activeExercise.explanationTr : activeExercise.explanationEn}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={handleNextExercise}
                      className="px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-mono font-bold"
                    >
                      {t("Sonraki Soru →", "Next Question →")}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
