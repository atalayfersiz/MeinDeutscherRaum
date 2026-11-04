"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { 
  BookMarked, 
  Clock, 
  Briefcase, 
  PenTool, 
  Sparkles, 
  ArrowRight, 
  Check, 
  HelpCircle,
  FileText,
  Volume2
} from "lucide-react";

type TopicId = "modalverben" | "zeitangaben" | "tagebuch" | "beruf" | "verben_prep";

export function ThemenHub() {
  const { lang, t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<TopicId>("modalverben");

  // State for Modalverben interactive selector
  const [activeModal, setActiveModal] = useState<string>("können");

  const modalData: Record<string, { meaningEn: string; meaningTr: string; ich: string; du: string; er: string; wir: string; ihr: string; sie: string; example: string }> = {
    müssen: {
      meaningEn: "must / to have to",
      meaningTr: "zorunda olmak",
      ich: "muss", du: "musst", er: "muss", wir: "müssen", ihr: "müsst", sie: "müssen",
      example: "Ich muss am Montag um 6 Uhr aufstehen."
    },
    können: {
      meaningEn: "can / to be able to",
      meaningTr: "-ebilmek, yeteneği olmak",
      ich: "kann", du: "kannst", er: "kann", wir: "können", ihr: "könnt", sie: "können",
      example: "Er kann viel besser schwimmen als du!"
    },
    dürfen: {
      meaningEn: "may / to be allowed to",
      meaningTr: "izni olmak",
      ich: "darf", du: "darfst", er: "darf", wir: "dürfen", ihr: "dürft", sie: "dürfen",
      example: "Darf ich meinen Hund ins Amt mitnehmen?"
    },
    wollen: {
      meaningEn: "to want / intend to",
      meaningTr: "istemek, niyeti olmak",
      ich: "will", du: "willst", er: "will", wir: "wollen", ihr: "wollt", sie: "wollen",
      example: "Wo wollt ihr diesen Sommer Urlaub machen?"
    },
    sollen: {
      meaningEn: "should / to be supposed to",
      meaningTr: "tavsiye edilmek, -meli",
      ich: "soll", du: "sollst", er: "soll", wir: "sollen", ihr: "sollt", sie: "sollen",
      example: "Der Arzt sagt, ich soll nicht arbeiten und mich ausruhen."
    },
    möchten: {
      meaningEn: "would like to",
      meaningTr: "istemek (kibarca)",
      ich: "möchte", du: "möchtest", er: "möchte", wir: "möchten", ihr: "möchtet", sie: "möchten",
      example: "Ich möchte bitte meine Aufenthaltserlaubnis verlängern."
    }
  };

  const topicsList = [
    {
      id: "modalverben" as TopicId,
      titleTr: "Modal Fiiller (Modalverben)",
      titleEn: "Modal Verbs (Modalverben)",
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      descTr: "müssen, können, dürfen, wollen, sollen, möchten & Cümle Düzeni",
      descEn: "müssen, können, dürfen, wollen, sollen, möchten & Word Order"
    },
    {
      id: "zeitangaben" as TopicId,
      titleTr: "Zaman Belirteçleri (im, am, um)",
      titleEn: "Time Expressions (im, am, um)",
      icon: <Clock className="w-4 h-4 text-blue-500" />,
      descTr: "Saatler, günler, aylar, mevsimler ve 'in der Nacht'",
      descEn: "Clock times, days, months, seasons & temporal rules"
    },
    {
      id: "tagebuch" as TopicId,
      titleTr: "Kişisel Notlar & Berlin Yaşamı",
      titleEn: "Personal Notes & Life in Berlin",
      icon: <PenTool className="w-4 h-4 text-emerald-500" />,
      descTr: "David Lynch, Skizzen, Berlin'de Gürültü, Hobi & Günlük Yaşam",
      descEn: "David Lynch, Sketching, Noise in Berlin, Hobbies & Routine"
    },
    {
      id: "beruf" as TopicId,
      titleTr: "İş, Başvuru & Yabancılar Dairesi",
      titleEn: "Career, Job & Ausländeramt",
      icon: <Briefcase className="w-4 h-4 text-purple-500" />,
      descTr: "Bewerbung, Aufenthaltserlaubnis, Kündigung & Sözleşme",
      descEn: "Application, Residence permit, Notice & Contracts"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E7E4DD] dark:border-[#22211E]">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            {t("Ders Notlarından Tematik Bölümler", "Thematic Modules from Scanned Notes & Curriculum")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
            {t("Konu Odaklı Öğrenme Alanı", "Curated Thematic Topics")}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-3xl leading-relaxed">
            {t(
              "Taranmış ders kağıtlarınızdaki, el yazısı defterinizdeki ve günlük yaşamınızdaki temalar için özel olarak hazırlanmış modüller. Her bölüm o konunun kurallarını, kelimelerini ve örnek cümlelerini bir araya getirir.",
              "Dedicated study spaces tailored to your scanned worksheets, handwritten notebook reflections, and practical everyday German."
            )}
          </p>
        </div>
      </div>

      {/* Topics Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {topicsList.map((tItem) => {
          const isActive = selectedTopic === tItem.id;
          return (
            <button
              key={tItem.id}
              onClick={() => setSelectedTopic(tItem.id)}
              className={`p-4 text-left border transition-all ${
                isActive
                  ? "bg-neutral-900 text-white dark:bg-[#20201D] dark:text-white border-neutral-900 dark:border-neutral-100 shadow-md ring-1 ring-neutral-900 dark:ring-neutral-100"
                  : "bg-white dark:bg-[#1A1A18] text-neutral-800 dark:text-neutral-200 border-[#DDD8CE] dark:border-[#2C2B27] hover:border-neutral-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {tItem.icon}
                <span className="font-bold text-sm font-sans tracking-tight">
                  {lang === "en" ? tItem.titleEn : tItem.titleTr}
                </span>
              </div>
              <div
                className={`text-[11px] font-mono mt-2 line-clamp-2 ${
                  isActive ? "text-neutral-300 dark:text-neutral-400" : "text-neutral-500"
                }`}
              >
                {lang === "en" ? tItem.descEn : tItem.descTr}
              </div>
            </button>
          );
        })}
      </div>

      {/* TOPIC 1: MODALVERBEN */}
      {selectedTopic === "modalverben" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Rule Card */}
          <div className="p-6 bg-[#FAF9F5] dark:bg-[#181816] border border-[#DDD8CE] dark:border-[#2C2B27] space-y-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              {t("Cümle Matematiği Kuralı", "Sentence Order Rule")}
            </span>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-sans">
              {t("Modal Fiil Pozisyon 2'de, Asıl Fiil (Infinitiv) En Sonda!", "Modal Verb in Position 2, Main Verb (Infinitive) at the End!")}
            </h3>
            
            <div className="p-3 bg-neutral-900 text-neutral-100 font-mono text-xs rounded-none border border-neutral-700">
              [Subjekt] + <strong className="text-amber-400">[MODALVERB (Pos 2)]</strong> + [...] + <strong className="text-blue-400">[INFINITIV (Satzende)]</strong>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              {t(
                "Modal fiil özneye göre çekimlenir (muss, kann, darf, will). Cümledeki ikinci fiil ise hiçbir çekim almadan mastar (Infinitiv) halinde cümlenin en sonuna gider.",
                "The modal verb is conjugated to the subject (muss, kann, darf, will). The second verb stays in raw infinitive form at the very end of the clause."
              )}
            </p>
          </div>

          {/* Interactive Modal Verb Conjugator */}
          <div className="border border-[#DDD8CE] dark:border-[#2C2B27] bg-white dark:bg-[#1A1A18] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0ECE4] dark:border-[#262521]">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                {t("Modal Fiil Seç & Çekimini İncele", "Select Modal Verb to Inspect Conjugation")}
              </div>
              <div className="flex flex-wrap gap-1 font-mono text-xs">
                {Object.keys(modalData).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveModal(m)}
                    className={`px-3 py-1 border transition-all ${
                      activeModal === m
                        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                        : "bg-[#FAF9F5] dark:bg-[#20201D] text-neutral-700 dark:text-neutral-300 border-[#DDD8CE] dark:border-[#33322D]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Conjugation Grid */}
            {activeModal && modalData[activeModal] && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                    {activeModal}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    {lang === "en" ? modalData[activeModal].meaningEn : modalData[activeModal].meaningTr}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
                  <div className="p-3 bg-[#FAF9F5] dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                    <div className="text-[10px] text-neutral-400">ich</div>
                    <div className="text-base font-bold text-amber-600 dark:text-amber-400 mt-1">
                      {modalData[activeModal].ich}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                    <div className="text-[10px] text-neutral-400">du</div>
                    <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {modalData[activeModal].du}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                    <div className="text-[10px] text-neutral-400">er / sie / es</div>
                    <div className="text-base font-bold text-amber-600 dark:text-amber-400 mt-1">
                      {modalData[activeModal].er}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                    <div className="text-[10px] text-neutral-400">wir</div>
                    <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {modalData[activeModal].wir}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                    <div className="text-[10px] text-neutral-400">ihr</div>
                    <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {modalData[activeModal].ihr}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#2C2B27]">
                    <div className="text-[10px] text-neutral-400">sie / Sie</div>
                    <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {modalData[activeModal].sie}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F5] dark:bg-[#20201D] border-l-4 border-amber-600 text-xs italic text-neutral-800 dark:text-neutral-200 font-sans">
                  "{modalData[activeModal].example}"
                </div>
              </div>
            )}
          </div>

          {/* Authentic Real Scanned Dialogues */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-[#DDD8CE] dark:border-[#2C2B27] bg-white dark:bg-[#1A1A18] space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                {t("Ders Kağıdından Diyalog (Worksheet Scan)", "Authentic Dialogue from Scan")}
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Auf dem Ausländeramt
              </h4>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                <strong>Herr Guzman:</strong> "Ich <em>möchte</em> meine Aufenthaltserlaubnis <em>verlängern</em>."<br/>
                <strong>Portier:</strong> "Sie <em>müssen</em> in den dritten Stock in Zimmer 325 <em>gehen</em>."<br/>
                <strong>Herr Guzman:</strong> "<em>Darf</em> ich meinen Hund ins Haus <em>mitnehmen</em>?"<br/>
                <strong>Portier:</strong> "Nein, Hunde <em>dürfen</em> hier nicht <em>hereinkommen</em>."
              </p>
            </div>

            <div className="p-5 border border-[#DDD8CE] dark:border-[#2C2B27] bg-white dark:bg-[#1A1A18] space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                {t("Ev & Aile Diyaloğu", "Family & Home Routine")}
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Am Sonntag & Arbeitsteilung
              </h4>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                <strong>Mutter:</strong> "Es gibt viel Arbeit. Frank, du <em>musst</em> heute <em>einkaufen</em>!"<br/>
                <strong>Kinder:</strong> "Wir <em>müssen</em> putzen und Papa <em>muss</em> nur einkaufen? Das ist nicht fair!"<br/>
                <strong>Mutter:</strong> "Annika, du <em>darfst</em> jetzt nicht Computer <em>spielen</em>. Du <em>musst</em> Hausaufgaben <em>machen</em>."
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TOPIC 2: ZEITANGABEN (im, am, um) */}
      {selectedTopic === "zeitangaben" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Pyramid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* IM */}
            <div className="p-6 border-2 border-blue-400 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-900/40">
                <span className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-400">im</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  in + dem
                </span>
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
                Jahre, Jahreszeiten, Monate
              </h4>
              <ul className="text-xs font-mono space-y-1.5 text-neutral-700 dark:text-neutral-300">
                <li>• <strong>im Jahr 2026</strong> (2026 yılında)</li>
                <li>• <strong>im Sommer / im Winter</strong> (yazın / kışın)</li>
                <li>• <strong>im Juli / im Oktober</strong> (Temmuz'da)</li>
              </ul>
            </div>

            {/* AM */}
            <div className="p-6 border-2 border-amber-400 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-900/40">
                <span className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400">am</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  an + dem
                </span>
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
                Wochentage, Daten, Tageszeiten
              </h4>
              <ul className="text-xs font-mono space-y-1.5 text-neutral-700 dark:text-neutral-300">
                <li>• <strong>am Dienstag / am Montag</strong> (Salı günü)</li>
                <li>• <strong>am Wochenende</strong> (hafta sonunda)</li>
                <li>• <strong>am Vormittag / am Abend</strong> (öğleden önce)</li>
                <li>• <strong>am 15. Mai</strong> (15 Mayıs'ta)</li>
              </ul>
            </div>

            {/* UM */}
            <div className="p-6 border-2 border-emerald-400 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-900/40">
                <span className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">um</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Exakt
                </span>
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
                Exakte Uhrzeiten & Mitternacht
              </h4>
              <ul className="text-xs font-mono space-y-1.5 text-neutral-700 dark:text-neutral-300">
                <li>• <strong>um 9 Uhr</strong> (saat 9'da)</li>
                <li>• <strong>um 14:30 Uhr</strong> (saat 14:30'da)</li>
                <li>• <strong>um Mitternacht</strong> (gece yarısında)</li>
              </ul>
            </div>

          </div>

          {/* Exception Alert: in der Nacht */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 font-sans space-y-1">
            <strong>⚠️ İstisna (Exception):</strong> Günün vakitlerinde (am Morgen, am Vormittag, am Nachmittag, am Abend) 'am' kullanılırken, sadece <strong>"in der Nacht"</strong> (geceleyin / at night) denir çünkü <em>die Nacht</em> feminin bir isimdir ve Dativ halinde <em>in der</em> alır!
          </div>

        </div>
      )}

      {/* TOPIC 3: TAGEBUCH & PERSÖNLICHE NOTIZEN */}
      {selectedTopic === "tagebuch" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="p-6 bg-white dark:bg-[#1A1A18] border border-[#DDD8CE] dark:border-[#2C2B27] space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              {t("El Yazısı Defterinizden Orijinal Parça (Scan 2147)", "Original Transcribed Passage from Your Notebook")}
            </span>
            <blockquote className="text-base sm:text-lg font-serif italic text-neutral-900 dark:text-neutral-100 leading-relaxed border-l-4 border-neutral-900 dark:border-neutral-100 pl-4 py-1">
              "Ich lese nicht gern Texte ohne Bilder, weil ich denke, dass es langweilig ist. Deshalb schaue ich gerne Videos oder Filme. Zum Beispiel liebe ich Filme von David Lynch. Sie interessieren mich sehr! Außerdem glaube ich, dass ich gut genug skizzieren kann, um meine Ideen auszudrücken. Aber ich will mich noch verbessern, um meine Ideen mit verschiedenen Medien zu vermitteln."
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-[#DDD8CE] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#181816] space-y-2">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
                Lärm & Wohnen in Berlin
              </h4>
              <ul className="text-xs text-neutral-700 dark:text-neutral-300 space-y-2 font-sans">
                <li>• <em>"Spazieren gehen im Park interessiert mich sehr."</em></li>
                <li>• <em>"Laute Stimmen und Lärm stören mich, weil ich ein Lichtschläfer bin."</em></li>
                <li>• <em>"Mich nervt der Verkehrslärm in Berlin und die Lautstärke der Sirenen."</em></li>
                <li>• <em>"Ich will nie meine Wohnung saugen und ich bügele überhaupt nicht gern!"</em></li>
              </ul>
            </div>

            <div className="p-5 border border-[#DDD8CE] dark:border-[#2C2B27] bg-[#FAF9F5] dark:bg-[#181816] space-y-2">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
                Hobbys & Freizeit
              </h4>
              <ul className="text-xs text-neutral-700 dark:text-neutral-300 space-y-2 font-sans">
                <li>• <em>"Ich mag es, mit meinen Freunden Schach zu spielen und frischen Fisch zu kochen."</em></li>
                <li>• <em>"Ich kann gut und schnell skizzieren."</em></li>
                <li>• <em>"Ich muss manchmal mehr Gemüse essen für meine Gesundheit."</em></li>
                <li>• <em>"Regelmäßig joggen und Sport treiben entspannt mich."</em></li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* TOPIC 4: BERUF & BEHÖRDE */}
      {selectedTopic === "beruf" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
            {[
              { word: "die Bewerbung", en: "application", tr: "iş başvurusu", ex: "Ich habe meine Bewerbung heute abgeschickt." },
              { word: "das Vorstellungsgespräch", en: "job interview", tr: "iş mülakatı", ex: "Er hatte gestern ein erfolgreiches Vorstellungsgespräch." },
              { word: "die Aufenthaltserlaubnis", en: "residence permit", tr: "oturum izni", ex: "Meine Aufenthaltserlaubnis ist für zwei Jahre gültig." },
              { word: "die Kündigung", en: "termination / notice", tr: "istifa / işten çıkarma", ex: "Er hat die Kündigung fristgerecht eingereicht." },
              { word: "die Bestätigung", en: "confirmation", tr: "onay, teyit belgesi", ex: "Ich warte noch auf die schriftliche Bestätigung." },
              { word: "die Bedingung", en: "condition, term", tr: "şart, koşul", ex: "Zu welchen Bedingungen wird der Vertrag verlängert?" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-[#1A1A18] border border-[#DDD8CE] dark:border-[#2C2B27] space-y-1">
                <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-mono">
                  {item.word}
                </div>
                <div className="text-neutral-500 text-[11px]">
                  {lang === "en" ? item.en : item.tr}
                </div>
                <div className="text-xs italic text-neutral-700 dark:text-neutral-300 pt-2 border-t border-[#F0ECE4] dark:border-[#262521] font-sans">
                  "{item.ex}"
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
