import { VocabularyItem } from "@/types";

export interface SrsProgress {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string;
  lastReviewedDate: string;
}

const STORAGE_KEY = "mdr_srs_data";

export function loadSrsData(): Record<string, SrsProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSrsData(data: Record<string, SrsProgress>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save SRS data", err);
  }
}

/**
 * SuperMemo 2 (SM-2) simplified algorithm
 * Grade:
 * 1: Again (Tekrar)
 * 2: Hard (Zor)
 * 3: Good (İyi)
 * 4: Easy (Kolay)
 */
export function calculateNextReview(
  current: SrsProgress | undefined,
  grade: 1 | 2 | 3 | 4
): SrsProgress {
  let repetitions = current?.repetitions || 0;
  let intervalDays = current?.intervalDays || 0;
  let easeFactor = current?.easeFactor || 2.5;

  if (grade < 2) {
    // Reset streak on fail
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = grade === 4 ? 4 : 2;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
      if (grade === 2) intervalDays = Math.max(1, Math.round(intervalDays * 0.8));
      if (grade === 4) intervalDays = Math.round(intervalDays * 1.3);
    }
    repetitions += 1;
  }

  // Adjust ease factor: EF' = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  // Map 1-4 scale to SM2 2-5 scale
  const smGrade = grade + 1; // 2, 3, 4, 5
  easeFactor = easeFactor + (0.1 - (5 - smGrade) * (0.08 + (5 - smGrade) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const now = new Date();
  const nextDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    repetitions,
    intervalDays,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    lastReviewedDate: now.toISOString(),
    nextReviewDate: nextDate.toISOString()
  };
}

export function isItemDue(itemProgress?: SrsProgress): boolean {
  if (!itemProgress || !itemProgress.nextReviewDate) return true;
  return new Date(itemProgress.nextReviewDate).getTime() <= Date.now();
}
