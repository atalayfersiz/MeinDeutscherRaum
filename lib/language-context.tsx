"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language } from "@/types";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (tr: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (tr, en) => en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to English ('en') as requested
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("mdr_lang") as Language;
    if (saved === "tr" || saved === "en") {
      setLangState(saved);
    } else {
      setLangState("en");
      localStorage.setItem("mdr_lang", "en");
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("mdr_lang", newLang);
  };

  // When lang is "en", return en; when "tr", return tr
  const t = (tr: string, en: string) => (lang === "en" ? en : tr);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
