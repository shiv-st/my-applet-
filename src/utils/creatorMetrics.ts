/**
 * Pure logic utilities for GameCreator AI
 * Title CTR scoring, YouTube tag validation, script read-time, and scheduling helpers.
 */

export interface TitleAnalysis {
  score: number; // 0-100
  charCount: number;
  isMobileTruncated: boolean; // Over 60 chars usually gets clipped on YouTube mobile app
  hasPowerWords: boolean;
  powerWordsDetected: string[];
  hasNumbers: boolean;
  hasCuriosityTrigger: boolean;
  rating: 'Poor' | 'Average' | 'Good' | 'High CTR Potential';
  feedback: string[];
}

const POWER_WORDS = [
  'insane', 'secret', 'banned', 'impossible', 'myth', 'revealed',
  'unlimited', 'world record', 'hacker', 'illegal', 'glitch', 'ruined',
  '100 days', 'hardcore', 'ultimate', 'truth', 'epic', 'destroy', 'trapped'
];

const CURIOSITY_PATTERNS = [
  /\bhow\b/i,
  /\bwhy\b/i,
  /\bwhat happens\b/i,
  /\bi tried\b/i,
  /\bdon't\b/i,
  /\bnever\b/i,
  /\b\?+/i,
  /\b!+/i,
  /\bvs\b/i
];

export function analyzeTitleCTR(title: string): TitleAnalysis {
  const cleanTitle = (title || '').trim();
  const charCount = cleanTitle.length;
  const isMobileTruncated = charCount > 60;
  
  if (charCount === 0) {
    return {
      score: 0,
      charCount: 0,
      isMobileTruncated: false,
      hasPowerWords: false,
      powerWordsDetected: [],
      hasNumbers: false,
      hasCuriosityTrigger: false,
      rating: 'Poor',
      feedback: ['Please enter a title to analyze.']
    };
  }

  const lower = cleanTitle.toLowerCase();
  const detectedPowerWords = POWER_WORDS.filter(w => lower.includes(w));
  const hasNumbers = /\d+/.test(cleanTitle);
  const hasCuriosity = CURIOSITY_PATTERNS.some(p => p.test(cleanTitle));

  let score = 50;
  const feedback: string[] = [];

  // Length optimization (sweet spot 35-58 characters)
  if (charCount >= 35 && charCount <= 58) {
    score += 20;
    feedback.push('Perfect length: 35-58 characters avoids mobile truncation while maximizing context.');
  } else if (charCount < 30) {
    score -= 10;
    feedback.push('A bit short: Consider adding specific stakes, game context, or outcome.');
  } else if (charCount > 60) {
    score -= 15;
    feedback.push('Warning: Over 60 characters. YouTube mobile app may truncate the ending words.');
  }

  // Power words
  if (detectedPowerWords.length > 0) {
    score += Math.min(detectedPowerWords.length * 10, 20);
    feedback.push(`Contains high-impact trigger words: "${detectedPowerWords.join(', ')}".`);
  } else {
    feedback.push('Add an emotional or high-stakes trigger word (e.g., Secret, Impossible, 100 Days).');
  }

  // Numbers & Quantifiers
  if (hasNumbers) {
    score += 10;
    feedback.push('Contains numbers/quantifiers which statistically improve click-through rates.');
  }

  // Curiosity or question
  if (hasCuriosity) {
    score += 10;
    feedback.push('Strong curiosity gap or hook detected.');
  }

  // Bracket/Parenthesis hook e.g. [Minecraft] or (Gone Wrong)
  if (/[\[\(].+?[\]\)]/.test(cleanTitle)) {
    score += 5;
    feedback.push('Brackets/parentheses highlight key context for scanning eyes.');
  }

  // Cap score between 10 and 99 (never promise 100% virality)
  score = Math.max(15, Math.min(98, score));

  let rating: TitleAnalysis['rating'] = 'Average';
  if (score >= 80) rating = 'High CTR Potential';
  else if (score >= 65) rating = 'Good';
  else if (score >= 45) rating = 'Average';
  else rating = 'Poor';

  return {
    score,
    charCount,
    isMobileTruncated,
    hasPowerWords: detectedPowerWords.length > 0,
    powerWordsDetected: detectedPowerWords,
    hasNumbers,
    hasCuriosityTrigger: hasCuriosity,
    rating,
    feedback
  };
}

/**
 * YouTube Tag Budget and Formatter
 * YouTube allows up to 500 characters total for all tags combined.
 */
export interface TagBudgetResult {
  validTags: string[];
  totalChars: number;
  remainingChars: number;
  exceededLimit: boolean;
  formattedCommaString: string;
}

export function calculateTagBudget(rawTags: string[] | string): TagBudgetResult {
  const tagList = Array.isArray(rawTags) 
    ? rawTags 
    : rawTags.split(',').map(t => t.trim());

  const cleaned = tagList
    .map(t => t.replace(/[#\n\r]/g, '').trim())
    .filter(t => t.length > 0);

  // In YouTube, tags are comma-separated
  const formattedCommaString = cleaned.join(', ');
  const totalChars = formattedCommaString.length;
  const remainingChars = 500 - totalChars;

  return {
    validTags: cleaned,
    totalChars,
    remainingChars: Math.max(0, remainingChars),
    exceededLimit: totalChars > 500,
    formattedCommaString
  };
}

/**
 * Calculate estimated video duration from script word count
 */
export type CreatorTone = 'energetic' | 'comedic' | 'analytical' | 'chill' | 'hype';

export function estimateScriptDuration(wordCount: number, tone: CreatorTone = 'energetic'): {
  wordsPerMinute: number;
  durationSeconds: number;
  formattedDuration: string;
} {
  const wpmMap: Record<CreatorTone, number> = {
    hype: 175,
    energetic: 160,
    comedic: 150,
    analytical: 125,
    chill: 110,
  };

  const wordsPerMinute = wpmMap[tone] || 150;
  const minutes = wordCount / wordsPerMinute;
  const durationSeconds = Math.round(minutes * 60);

  const m = Math.floor(durationSeconds / 60);
  const s = durationSeconds % 60;
  const formattedDuration = `${m}m ${s.toString().padStart(2, '0')}s`;

  return {
    wordsPerMinute,
    durationSeconds,
    formattedDuration
  };
}
