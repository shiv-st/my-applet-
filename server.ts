import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, execSync } from 'child_process';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { getFallbackIdeas, getFallbackTitles } from './src/server/creatorFallbacks.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

console.log(`[GameCreator AI] Server initialized. Gemini API key present: ${!!apiKey}`);

// Health & Status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!apiKey,
    model: 'gemini-3.8-flash',
    version: '1.0.0',
    app: 'GameCreator AI'
  });
});

// Helper for Gemini Text Generation with JSON prompt and 8s timeout race
async function callGemini(prompt: string, systemInstruction: string): Promise<string | null> {
  if (!ai) return null;
  try {
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 7000));
    const aiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: 'application/json',
      },
    }).then(res => (res.text ? res.text.trim() : null));

    const result = await Promise.race([aiPromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.warn('[Gemini Error, falling back to procedural engine]:', error);
    return null;
  }
}

// 1. Video Idea Generator
app.post('/api/generate-ideas', async (req: Request, res: Response) => {
  const { game = 'Minecraft', contentType = 'Challenges', audience = 'Teens & Young Adults', language = 'English', format = 'Long-form (16:9)', count = 3 } = req.body;

  const systemInstruction = `You are an elite YouTube gaming strategist who has consulted for top gaming channels (MrBeast Gaming, Dream, DanTDM, Mythpat, Techno, LazarBeam).
Provide high-retention, high-CTR gaming video ideas that respect creator pacing and YouTube algorithm mechanics. Return valid JSON only as an array of objects.`;

  const prompt = `Generate ${count} killer gaming video ideas for the game "${game}".
Content Type / Genre: "${contentType}"
Target Audience: "${audience}"
Language: "${language}"
Video Format: "${format}"

Return a JSON array where each object has:
- id: unique string e.g. "idea-1"
- title: catchy working title
- concept: 2-3 sentence clear summary of the video challenge or premise
- hook: the exact spoken opening line for the first 3-5 seconds that stops the scroll
- structure: array of 4 chronological timeline segments with timestamp labels (e.g. "0:00 - 1:15: Cold Open", etc.)
- targetAudience: specific viewer persona
- appealReason: psychological reason why viewers will click and stay (e.g. curiosity gap, high stakes, fear of missing out)
- difficulty: one of "Easy", "Medium", "Hard", "Epic"
- estimatedMinutes: number of estimated duration
- format: "${format}"`;

  const geminiResponse = await callGemini(prompt, systemInstruction);

  if (geminiResponse) {
    try {
      const parsed = JSON.parse(geminiResponse);
      const ideas = Array.isArray(parsed) ? parsed : (parsed.ideas || [parsed]);
      return res.json({
        success: true,
        isDemoMode: false,
        source: 'gemini-3.8-flash',
        ideas
      });
    } catch (e) {
      console.warn('Failed parsing Gemini ideas JSON, returning fallback');
    }
  }

  // Fallback
  const fallback = getFallbackIdeas(game, contentType, format, language);
  res.json({
    success: true,
    isDemoMode: !apiKey,
    source: apiKey ? 'procedural-fallback' : 'demo-mode',
    message: !apiKey ? 'Running in Demo Mode. Connect your Gemini API Key in Settings > Secrets for live real-time model synthesis.' : 'Fallback response applied.',
    ideas: fallback
  });
});

// 2. Title Generator
app.post('/api/generate-titles', async (req: Request, res: Response) => {
  const { game = 'Minecraft', concept = 'Surviving 100 Days', style = 'Challenge', count = 6 } = req.body;

  const systemInstruction = `You are a YouTube packaging and thumbnail/title specialist. You know that titles under 60 characters don't get truncated on mobile, power words trigger curiosity, and honesty preserves viewer trust. Return valid JSON array only.`;

  const prompt = `Generate ${count} original gaming video titles for:
Game: "${game}"
Concept: "${concept}"
Style Category: "${style}" (e.g. Curiosity-driven, Funny, Challenge-based, Educational, Competitive, Story-driven)

Return a JSON array of title objects with:
- id: unique string
- title: string (keep most under 58 characters for mobile YouTube viewports)
- style: "${style}"
- characterCount: number
- estimatedCTR: estimated score percentage (between 75 and 96)
- tagline: short note on why this title works (e.g. "Instant curiosity gap", "High-stakes quantifier")`;

  const geminiResponse = await callGemini(prompt, systemInstruction);

  if (geminiResponse) {
    try {
      const parsed = JSON.parse(geminiResponse);
      const titles = Array.isArray(parsed) ? parsed : (parsed.titles || [parsed]);
      return res.json({
        success: true,
        isDemoMode: false,
        source: 'gemini-3.8-flash',
        titles
      });
    } catch (e) {
      console.warn('Failed parsing Gemini titles JSON');
    }
  }

  const fallback = getFallbackTitles(game, concept, style);
  res.json({
    success: true,
    isDemoMode: !apiKey,
    source: apiKey ? 'procedural-fallback' : 'demo-mode',
    message: !apiKey ? 'Demo Mode: Pre-calibrated high CTR gaming titles loaded.' : undefined,
    titles: fallback
  });
});

// 3. Gaming Script Writer
app.post('/api/generate-script', async (req: Request, res: Response) => {
  const { game = 'Minecraft', concept = 'Secret base tour', scriptType = 'Gameplay Commentary', tone = 'Energetic', duration = '5 Minutes', audience = 'General Gaming', language = 'English' } = req.body;

  const systemInstruction = `You are an expert gaming scriptwriter and dialogue coach for YouTubers. You write engaging 2-column video scripts with clear VISUAL gameplay cues on the left, and exact SPOKEN audio lines on the right. Return valid JSON only.`;

  const prompt = `Write a complete YouTube gaming script for:
Game: "${game}"
Concept: "${concept}"
Script Type: "${scriptType}" (e.g. Gameplay Commentary, Funny Moments, Challenge Video, Tutorial, Game Update, Review, Livestream Intro)
Tone: "${tone}"
Target Duration: "${duration}"
Language: "${language}"

Return a JSON object with:
- title: suggested video title
- estimatedDuration: "${duration}"
- estimatedWordCount: number
- hookFormula: brief breakdown of the opening hook psychology
- sections: array of chronological scenes, where each scene has:
    - sectionName: string (e.g. "Cold Open / Hook (0:00-0:30)", "The First Challenge (0:30-2:00)", etc.)
    - visualCues: string describing gameplay screen action, zooms, text popups, memes, or B-roll
    - spokenDialogue: string of word-for-word voiceover or commentary
    - soundFx: suggested background music & sound effect cue (e.g. "Dramatic bass drop", "Lofi beat", "Vine boom")
- outroCta: the closing call to action that encourages genuine engagement without begging`;

  const geminiResponse = await callGemini(prompt, systemInstruction);

  if (geminiResponse) {
    try {
      const parsed = JSON.parse(geminiResponse);
      return res.json({
        success: true,
        isDemoMode: false,
        script: parsed
      });
    } catch (e) {
      console.warn('Failed parsing Gemini script JSON');
    }
  }

  // Fallback Script
  res.json({
    success: true,
    isDemoMode: !apiKey,
    script: {
      title: `I Attempted The Most Forbidden Strategy In ${game}`,
      estimatedDuration: duration,
      estimatedWordCount: 580,
      hookFormula: 'Immediate danger + visual proof of impossible odds within 4 seconds',
      sections: [
        {
          sectionName: 'Cold Open & Hook (0:00 - 0:45)',
          visualCues: `Fast cuts of player at 1 HP surrounded by chaos in ${game}. Red vignette effect pulses on screen. Quick freeze frame on the inventory screen.`,
          spokenDialogue: `Look at this. Right now, I am one single tap away from losing literally 50 hours of progress in ${game}. Everyone said this strategy was patched three updates ago. But today, we are going to find out if you can still pull it off... or if I just ruined everything.`,
          soundFx: 'Intense riser into sharp silence, then high-energy synth beat drops.'
        },
        {
          sectionName: 'The Rules & The Setup (0:45 - 2:00)',
          visualCues: `Camera transitions to third-person or clean gameplay walking. Pop-up graphic showing rule 1: "No Armor", rule 2: "Hardest Difficulty". Quick comedic zoom on character face.`,
          spokenDialogue: `Okay, to make this fair, I placed three strict restrictions on myself. First: zero top-tier shields. Second: if I take damage before the first checkpoint, I have to drop my best weapon. Let's see how long my luck holds.`,
          soundFx: 'Bouncy, rhythmic gaming background music.'
        },
        {
          sectionName: 'The Mid-Game Disaster (2:00 - 4:00)',
          visualCues: `Sudden unexpected enemy ambush or trap trigger. Gameplay shakes. Fast reaction cam cutout in the corner.`,
          spokenDialogue: `Wait, wait, wait! No way... did that just spawn behind me?! Run! RUN! Guys, this is NOT how the practice run went! If that hit connects, it is completely game over!`,
          soundFx: 'Meme alert sound, heartbeat thumping, muffled filter on game audio.'
        },
        {
          sectionName: 'The Final Clutch & Outro (4:00 - 5:00)',
          visualCues: `Epic slow-motion leap, final decisive shot or block placement. Victory screen or miraculous survival. End screen template opens.`,
          spokenDialogue: `WE ACTUALLY DID IT! Look at that health bar! Drop a comment right now telling me: what impossible challenge in ${game} should I attempt next? Hit subscribe if you survived the heart attack with me!`,
          soundFx: 'Triumphant victory fanfare leading into YouTube end-card music.'
        }
      ],
      outroCta: 'Comment your dream challenge idea and subscribe for next week’s 100-hour experiment.'
    }
  });
});

// 4. Shorts Assistant
app.post('/api/generate-shorts', async (req: Request, res: Response) => {
  const { game = 'Minecraft', topic = 'Insane Clutch', angle = 'Fast-Paced Myth', duration = '45 Seconds' } = req.body;

  const systemInstruction = `You are a specialist in vertical gaming short-form content (YouTube Shorts, TikTok, Reels). Pacing must be ultra-tight, 0-3 second hook must eliminate swipe-away rate, and on-screen caption styling cues are essential. Return JSON only.`;

  const prompt = `Generate a YouTube Shorts package for:
Game: "${game}"
Topic: "${topic}"
Style Angle: "${angle}"
Target Duration: "${duration}"

Return a JSON object with:
- shortTitle: catchy vertical title (with 2-3 hashtags)
- retentionHook: the spoken hook in 0-3s
- scenes: array of 4 chronological short beats with:
    - timestamp: e.g. "0:00 - 0:03", "0:03 - 0:15", "0:15 - 0:35", "0:35 - 0:45"
    - visualAction: exact gameplay action and edit cues (e.g. "Screen zoom 120%", "Red circle arrow")
    - voiceover: punchy spoken line
    - captionStyle: recommendation for on-screen text (e.g. "Yellow bold font with black stroke, pops on each word")
    - soundCue: sound effect / trending audio style
- recommendedHashtags: array of 6 optimized hashtags for YouTube Shorts
- description: complete ready-to-paste Shorts description
- longFormRepurposeIdea: how to turn this Short into a full 15-minute long-form video`;

  const geminiResponse = await callGemini(prompt, systemInstruction);

  if (geminiResponse) {
    try {
      const parsed = JSON.parse(geminiResponse);
      return res.json({ success: true, isDemoMode: false, shorts: parsed });
    } catch (e) {
      console.warn('Failed parsing Shorts JSON');
    }
  }

  // Fallback Shorts
  res.json({
    success: true,
    isDemoMode: !apiKey,
    shorts: {
      shortTitle: `DO NOT Do This In ${game}! #shorts #gaming`,
      retentionHook: `Stop scrolling if you play ${game}! You are losing 50% of your matches because of this one setting.`,
      scenes: [
        {
          timestamp: '0:00 - 0:03',
          visualAction: 'Extreme zoom-in on game menu setting with red animated arrow pointing at default option.',
          voiceover: 'Do NOT open your game until you change this single toggle!',
          captionStyle: 'Bebas bold text, Neon Yellow with thick black outline, word-by-word punch.',
          soundCue: 'Record scratch + bass impact sound.'
        },
        {
          timestamp: '0:03 - 0:18',
          visualAction: 'Side-by-side comparison screen showing slow default response vs instant optimized response.',
          voiceover: 'Most players leave this setting on default, which adds 30 milliseconds of input delay every time you look around.',
          captionStyle: 'Green text for "OPTIMIZED", Red text for "DEFAULT DELAY".',
          soundCue: 'Fast ticking clock sound.'
        },
        {
          timestamp: '0:18 - 0:35',
          visualAction: 'Live clutch highlight demonstrating how fast the player now snaps onto enemies.',
          voiceover: 'Turn off "Camera Smoothing", set this slider to 85, and your crosshair will snap like you have aimbot.',
          captionStyle: 'Highlighting key numbers "85" in Cyan.',
          soundCue: 'Satisfying high-tempo phonk or drum-and-bass beat.'
        },
        {
          timestamp: '0:35 - 0:45',
          visualAction: 'Smiley victory animation, arrow pointing down to Subscribe and Comments.',
          voiceover: 'Try it right now in your next match and tell me in the comments if you feel the difference! Double tap for part 2.',
          captionStyle: 'Pulsing purple "SUBSCRIBE FOR PART 2" callout.',
          soundCue: 'Victory ding sound effect.'
        }
      ],
      recommendedHashtags: ['#shorts', `#${game.toLowerCase().replace(/[^a-z0-9]/g, '')}`, '#gaming', '#gamingshorts', '#protips', '#gamer'],
      description: `The single biggest setting mistake in ${game}! Did you know about this? Let me know in the comments.\n\nSubscribe for daily gaming tips & tricks!\n\n#shorts #${game.toLowerCase().replace(/[^a-z0-9]/g, '')} #gaming`,
      longFormRepurposeIdea: `Expand into "10 Secret Settings Top ${game} Pros Don't Want You To Know" (12-minute video with comprehensive FPS & input lag benchmarks).`
    }
  });
});

// 5. Thumbnail Concept Studio
app.post('/api/generate-thumbnail-concept', async (req: Request, res: Response) => {
  const { game = 'Minecraft', title = 'I Survived 100 Days', concept = 'Hardcore survival' } = req.body;

  const systemInstruction = `You are a legendary YouTube thumbnail designer who has crafted packaging for millions of views. Provide 3 distinct visual compositions with lighting, color theory, focal points, and exact image generation prompts. Return JSON only.`;

  const prompt = `Generate 3 high-CTR thumbnail concepts for:
Game: "${game}"
Video Title: "${title}"
Concept: "${concept}"

Return a JSON object with:
- concepts: array of 3 concepts, each having:
    - name: catchy name (e.g. "The Extreme Expression Shock", "The Impossible Contrast", "The Myth Mystery")
    - focalPoint: main subject and its screen position (left, center, right)
    - emotionOrAction: facial expression or in-game character pose
    - background: environment setting and depth of field
    - colorPalette: primary colors (e.g. "Electric Cyan vs Hot Orange")
    - recommendedText: 2 to 4 punchy words (e.g. "IMPOSSIBLE?!", "DAY 100", "HE CHEATED?")
    - compositionTip: advice on rule of thirds, contrast, or mobile readability
    - aiImagePrompt: detailed ready-to-copy image generation prompt for Midjourney / Gemini Image Generation`;

  const geminiResponse = await callGemini(prompt, systemInstruction);

  if (geminiResponse) {
    try {
      const parsed = JSON.parse(geminiResponse);
      return res.json({ success: true, isDemoMode: false, data: parsed });
    } catch (e) {
      console.warn('Failed parsing Thumbnail concept JSON');
    }
  }

  // Fallback Concepts
  res.json({
    success: true,
    isDemoMode: !apiKey,
    data: {
      concepts: [
        {
          name: 'The High-Stakes Shock & Glow',
          focalPoint: 'Character face in right third, high-contrast weapon or threat in left third',
          emotionOrAction: 'Shocked gasping expression, bright rim-light highlighting silhouette',
          background: `Dark apocalyptic ${game} stormy arena with burning cyan particle embers`,
          colorPalette: 'Neon Electric Purple (#a855f7) & Hot Orange (#f97316)',
          recommendedText: '100 DAYS?!',
          compositionTip: 'Keep character face large enough to be clearly expressive at 100px width on a smartphone screen.',
          aiImagePrompt: `Cinematic YouTube gaming thumbnail style, dynamic ${game} hero character with expressive shocked face in foreground, glowing neon purple rim lighting, holding a mystical weapon, dark dramatic fiery storm in background, hyper-detailed, vibrant high contrast 3D render, 8k resolution, volumetric lighting --ar 16:9`
        },
        {
          name: 'The "Before vs After" Split',
          focalPoint: 'Vertical split screen: humble start on left vs god-mode titan on right',
          emotionOrAction: 'Left side: desperate struggling pose; Right side: glowing god-tier triumphant pose',
          background: 'Left: rustic wooden shelter; Right: gigantic obsidian neon fortress',
          colorPalette: 'Dull Grayscale vs Radiant Gold & Cyan',
          recommendedText: 'DAY 1 vs DAY 100',
          compositionTip: 'A sharp contrasting vertical divider line helps viewers immediately understand the progression story.',
          aiImagePrompt: `YouTube gaming thumbnail split composition, left side showing weak beginner character in ${game} holding wooden stick in rain, right side showing epic armored warrior radiating glowing cyan energy with massive fortress, dramatic contrast, unreal engine 5 render style, sharp focus, 16:9`
        },
        {
          name: 'The Forbidden Question Hook',
          focalPoint: 'Giant mysterious glowing vault or barrier in center with a red hazard stamp',
          emotionOrAction: 'Character pointing finger with wide curious eyes looking directly into camera',
          background: `Unexplored forbidden cavern in ${game} with deep purple fog`,
          colorPalette: 'Deep Midnight Black (#0f172a) & Radiant Red (#ef4444)',
          recommendedText: 'DON’T ENTER',
          compositionTip: 'Use a bright red or yellow outline around the mysterious object to draw the first eye fixation.',
          aiImagePrompt: `3D gaming thumbnail visual, mysterious sealed glowing gateway in ${game} world, surrounded by glowing warning symbols, dark deep cavern atmosphere, intense purple and red volumetric fog, character standing in shadow pointing towards it, 8k high quality render --ar 16:9`
        }
      ]
    }
  });
});

// 6. YouTube SEO Workspace
app.post('/api/generate-seo', async (req: Request, res: Response) => {
  const { game = 'Minecraft', title = 'I Survived 100 Days', concept = 'Challenge', targetKeywords = 'gameplay, tips, walkthrough' } = req.body;

  const systemInstruction = `You are a YouTube SEO algorithm architect. Generate high-intent descriptions, keyword tags staying strictly within the 500-character budget, pinned comments to drive watch time and comments, and a 10-point upload checklist. Return JSON only.`;

  const prompt = `Generate complete YouTube SEO metadata for:
Game: "${game}"
Title: "${title}"
Concept: "${concept}"
Keywords: "${targetKeywords}"

Return a JSON object with:
- description: well-structured description including:
    - 2-sentence hook with keywords naturally embedded
    - chapterTimestamps: list of 5-6 timestamps (e.g. "0:00 - The Beginning")
    - socialPlaceholders: formatted Twitter/Twitch/Discord links
    - disclaimer: creator disclaimer
- searchPhrases: array of 6 realistic high-volume search queries viewers type into YouTube
- tagList: array of 12-15 comma tags (ensure total combined characters stay around 350-450 chars, well below 500)
- pinnedCommentPrompt: 2 creative pinned comment options that ask questions to spark debate in comments
- checklist: array of 6 critical pre-upload verification items`;

  const geminiResponse = await callGemini(prompt, systemInstruction);

  if (geminiResponse) {
    try {
      const parsed = JSON.parse(geminiResponse);
      return res.json({ success: true, isDemoMode: false, seo: parsed });
    } catch (e) {
      console.warn('Failed parsing SEO JSON');
    }
  }

  // Fallback SEO
  res.json({
    success: true,
    isDemoMode: !apiKey,
    seo: {
      description: `In today's video, we are testing the ultimate limits of ${game}! Can we survive and complete the impossible challenge without making a single mistake? Watch until the end to see the day 100 finale!\n\nTIMESTAMPS:\n0:00 - The Impossible Challenge\n1:24 - Gathering Initial Gear\n4:10 - The Disaster Happens\n8:30 - Recovering Against All Odds\n12:45 - The Final Boss Confrontation\n15:20 - Final Verdict & World Download\n\nCONNECT WITH ME:\n🎮 Twitch: https://twitch.tv/yourchannel\n💬 Discord Community: https://discord.gg/yourserver\n🐦 Twitter/X: https://x.com/yourhandle\n\n#${game.replace(/\s+/g, '')} #Gaming #Walkthrough`,
      searchPhrases: [
        `${game} impossible challenge`,
        `${game} 100 days survival guide`,
        `how to beat ${game} hardcore`,
        `${game} secret tips and tricks`,
        `${game} pro player gameplay 2025`,
        `best settings for ${game}`
      ],
      tagList: [
        game.toLowerCase(),
        `${game.toLowerCase()} gameplay`,
        `${game.toLowerCase()} challenge`,
        `${game.toLowerCase()} hardcore`,
        `${game.toLowerCase()} 100 days`,
        `${game.toLowerCase()} guide`,
        `${game.toLowerCase()} tips and tricks`,
        `${game.toLowerCase()} secrets`,
        'gaming',
        'lets play',
        'funny moments'
      ],
      pinnedCommentPrompt: [
        `🏆 Pin this comment: "Question of the Day: If you had to survive 100 days in ${game} with ONLY ONE item, which one are you picking? Comment below!"`,
        `🔥 Pin this comment: "Drop a like if you thought I was completely dead at 8:30! What challenge should I take on in next week's video?"`
      ],
      checklist: [
        'Thumbnail clarity verified at 100px mobile preview size',
        'Title is under 60 characters to prevent mobile truncation',
        'Sound mix normalized: voiceover clearly audible over background music',
        'End screens and related video cards placed in the final 20 seconds',
        'Audio copyright check passed in YouTube Creator Studio',
        'Pinned engagement comment ready to paste right after upload'
      ]
    }
  });
});

// 7. AI Content Coach
app.post('/api/content-coach', async (req: Request, res: Response) => {
  const { channelName = 'My Gaming Channel', primaryGame = 'Minecraft', recentStats = {}, savedIdeasCount = 0, calendarCount = 0 } = req.body;

  const systemInstruction = `You are a world-class YouTube content strategist and analytics mentor. You provide realistic, honest, experiment-driven growth coaching for gaming creators. Never guarantee virality. Focus on packaging, pacing, retention, and consistency. Return JSON only.`;

  const prompt = `Provide tailored content strategy recommendations for:
Channel Name: "${channelName}"
Primary Game: "${primaryGame}"
Saved Ideas in Library: ${savedIdeasCount}
Scheduled Calendar Items: ${calendarCount}
Recent Estimated Performance Data: ${JSON.stringify(recentStats)}

Return a JSON object with:
- channelHealthSummary: 2-3 sentence overview of where the channel stands
- topRecommendedExperiments: array of 3 actionable experiments (title, why, how to measure)
- contentCalendarFeedback: analysis of their publishing cadence and gap warning
- formatBreakdown: recommendation on Long-form vs Shorts balance
- weeklyActionPlan: 5 step sprint for the coming week
- disclaimer: note reminding the creator that recommendations are strategic experiments, not guarantees of algorithmic success`;

  const geminiResponse = await callGemini(prompt, systemInstruction);

  if (geminiResponse) {
    try {
      const parsed = JSON.parse(geminiResponse);
      return res.json({ success: true, isDemoMode: false, coach: parsed });
    } catch (e) {
      console.warn('Failed parsing Coach JSON');
    }
  }

  // Fallback Coach
  res.json({
    success: true,
    isDemoMode: !apiKey,
    coach: {
      channelHealthSummary: `Your channel focuses on "${primaryGame}". With ${calendarCount} scheduled uploads and ${savedIdeasCount} ideas in your vault, your immediate priority is tightening thumbnail packaging to lift baseline CTR above 7%.`,
      topRecommendedExperiments: [
        {
          title: 'The "3-Word Thumbnail" Contrast Test',
          why: 'Most gaming thumbnails suffer from visual clutter. Reducing thumbnail text to 2-3 high-impact words increases mobile tap-through rates.',
          howToMeasure: 'Compare CTR over the first 48 hours against your 30-day channel average.'
        },
        {
          title: 'High-Retention Micro-Shorts Funnel',
          why: 'Publishing 2 Shorts per week derived directly from your long-form challenge videos exposes your channel to fresh non-subscribed viewers.',
          howToMeasure: 'Track subscriber conversion rate from the "Shorts" tab in YouTube Studio.'
        },
        {
          title: 'Curiosity Gap vs Descriptive Titles',
          why: 'Instead of "Playing ${primaryGame} Update 1.21", test "I Discovered The New ${primaryGame} Secret Nobody Is Talking About".',
          howToMeasure: 'Look for increased Impressions click-through rate in Browse Features.'
        }
      ],
      contentCalendarFeedback: calendarCount < 2 
        ? 'Warning: Content calendar has fewer than 2 scheduled uploads. Gaming algorithms reward predictable publishing cadence (e.g. Every Friday at 3 PM).'
        : 'Good scheduling momentum. Make sure to allow at least 48 hours between uploads for viewers to finish watching previous long-form videos.',
      formatBreakdown: 'Recommended Balance: 1 polished Long-form video (10-18 min) + 2 high-paced Shorts per week.',
      weeklyActionPlan: [
        'Monday: Pick your top idea from the AI Idea Generator and generate 5 title variations.',
        'Tuesday: Design your thumbnail in the Thumbnail Studio BEFORE writing the script.',
        'Wednesday: Script the first 3 minutes with high visual cues in the Gaming Script Writer.',
        'Thursday: Record gameplay and edit with fast pacing (cut all dead pauses > 1.5 seconds).',
        'Friday: Publish at peak gaming audience hours (3:00 PM - 6:00 PM local time).'
      ],
      disclaimer: 'Growth recommendations are strategic optimizations based on YouTube creator best practices, not guarantees of algorithmic impressions.'
    }
  });
});

// ==========================================
// GitHub Integration & Code Export Endpoints
// ==========================================

// Check GitHub connection and repository permissions
app.get('/api/github/status', async (req: Request, res: Response) => {
  const token = (process.env.GITHUB_TOKEN || '').trim();
  const username = (process.env.GITHUB_USERNAME || 'shiv-st').trim();
  const repo = (process.env.GITHUB_REPO || 'my-applet-').trim();

  if (!token) {
    return res.json({
      configured: false,
      message: 'No GitHub token configured yet.'
    });
  }

  try {
    // 1. Verify user authentication
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'GameCreator-AI-Export'
      }
    });

    if (!userRes.ok) {
      return res.json({
        configured: true,
        authenticated: false,
        status: userRes.status,
        message: 'GitHub token was rejected by GitHub. Check if token has expired or is invalid.'
      });
    }

    const userData = await userRes.json();

    // 2. Check repo access
    const repoRes = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'GameCreator-AI-Export'
      }
    });

    const repoData = repoRes.ok ? await repoRes.json() : null;

    // 3. Test if token has write (contents) permissions
    // Fine-grained PATs require "Contents: Read and write"
    const contentsCheck = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/.test-check`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'GameCreator-AI-Export'
      },
      body: JSON.stringify({
        message: 'test check',
        content: Buffer.from('test').toString('base64')
      })
    });

    const hasWriteAccess = contentsCheck.ok || (contentsCheck.status !== 403 && contentsCheck.status !== 401);
    const writeError = !contentsCheck.ok ? await contentsCheck.json().catch(() => ({})) : null;

    // Clean up test file if it was created
    if (contentsCheck.ok) {
      const createdData = await contentsCheck.json();
      if (createdData?.content?.sha) {
        await fetch(`https://api.github.com/repos/${username}/${repo}/contents/.test-check`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'GameCreator-AI-Export'
          },
          body: JSON.stringify({
            message: 'cleanup test check',
            sha: createdData.content.sha
          })
        }).catch(() => {});
      }
    }

    return res.json({
      configured: true,
      authenticated: true,
      username: userData.login,
      repo: repoData?.full_name || `${username}/${repo}`,
      repoUrl: repoData?.html_url || `https://github.com/${username}/${repo}`,
      hasWriteAccess,
      needsContentsPermission: !hasWriteAccess && (writeError?.message?.includes('Resource not accessible') || contentsCheck.status === 403),
      message: hasWriteAccess
        ? 'GitHub connection verified with Full Write Access!'
        : 'Token authenticated, but GitHub returned 403. Fine-grained PAT requires "Contents: Read and write" permission enabled in GitHub settings.'
    });
  } catch (error: any) {
    return res.status(500).json({
      configured: true,
      authenticated: false,
      error: error?.message || 'Failed to communicate with GitHub API'
    });
  }
});

// Push current repository commits to GitHub
app.post('/api/github/push', async (req: Request, res: Response) => {
  const customToken = req.body?.token?.trim();
  const token = customToken || (process.env.GITHUB_TOKEN || '').trim();
  const username = (req.body?.username || process.env.GITHUB_USERNAME || 'shiv-st').trim();
  const repo = (req.body?.repo || process.env.GITHUB_REPO || 'my-applet-').trim();

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'No GitHub token provided. Please enter your personal access token.'
    });
  }

  // Update .env if token was provided in body
  if (customToken) {
    process.env.GITHUB_TOKEN = customToken;
    try {
      const envContent = `GITHUB_TOKEN="${customToken}"\nGITHUB_USERNAME="${username}"\nGITHUB_REPO="${repo}"\n`;
      fs.writeFileSync(path.resolve(__dirname, '.env'), envContent, 'utf-8');
    } catch (e) {
      console.warn('Could not write .env:', e);
    }
  }

  try {
    const authRemoteUrl = `https://${encodeURIComponent(username)}:${encodeURIComponent(token)}@github.com/${username}/${repo}.git`;
    
    // Execute git push with credentials (using --force to initialize or update branch cleanly)
    const pushOutput = execSync(`git push -u "${authRemoteUrl}" main --force`, {
      cwd: __dirname,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    return res.json({
      success: true,
      message: 'Successfully pushed all code to your GitHub repository!',
      repoUrl: `https://github.com/${username}/${repo}`,
      output: pushOutput
    });
  } catch (err: any) {
    const stderr = err?.stderr?.toString() || err?.message || 'Git push failed';
    const is403 = stderr.includes('403') || stderr.includes('Permission to') || stderr.includes('denied');
    
    return res.status(400).json({
      success: false,
      isPermissionError: is403,
      message: is403
        ? 'GitHub denied write access (HTTP 403). For Fine-grained tokens, you must set "Contents" permission to "Read and write" in your GitHub token settings.'
        : `Git push error: ${stderr}`,
      details: stderr,
      repoUrl: `https://github.com/${username}/${repo}`
    });
  }
});

// Download full project codebase as a .tar.gz archive
app.get('/api/export/download', (req: Request, res: Response) => {
  try {
    const archivePath = '/tmp/gamecreator-applet-source.tar.gz';
    execSync(`tar --exclude='./node_modules' --exclude='./.git' --exclude='./dist' -czf "${archivePath}" .`, {
      cwd: __dirname
    });

    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', 'attachment; filename="gamecreator-ai-source.tar.gz"');
    
    const fileStream = fs.createReadStream(archivePath);
    fileStream.pipe(res);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to generate project archive',
      details: error?.message
    });
  }
});

// Production static file serving or Vite development middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[GameCreator AI] Vite middleware mounted in development mode');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`[GameCreator AI] Serving static production build from ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GameCreator AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[GameCreator AI] Failed to start server:', err);
  process.exit(1);
});
