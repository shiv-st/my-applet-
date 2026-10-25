// server.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

// src/server/creatorFallbacks.ts
function getFallbackIdeas(game, contentType, format, language = "English") {
  const g = game.trim() || "Minecraft";
  const isShort = format.toLowerCase().includes("short");
  if (isShort) {
    return [
      {
        id: "idea-" + Date.now() + "-1",
        title: `The 1 ${g} Secret 99% Of Players Never Realize`,
        concept: `Fast-paced 45-second mythbuster showing a game mechanic that feels like a glitch but is actually built-in.`,
        hook: `"Stop scrolling! If you play ${g}, you have been doing this completely wrong your entire life."`,
        structure: [
          "0-3s: Dramatic game fail / controversial statement",
          "3-15s: Proof of why the common method wastes time",
          "15-35s: Step-by-step secret execution with zoom-in cues",
          '35-45s: Mind-blown reaction + "Subscribe for more pro tips"'
        ],
        targetAudience: "Curious casual & competitive players wanting quick edge",
        appealReason: "High curiosity gap and immediate practical value within 30 seconds",
        difficulty: "Easy",
        estimatedMinutes: 1,
        format: "Short-form (9:16)"
      },
      {
        id: "idea-" + Date.now() + "-2",
        title: `I Bet You Can't Guess What Happens Next in ${g}`,
        concept: `Suspense-driven clutch or unpredictable physics moment with an unexpected comedic ending.`,
        hook: `"Watch my health bar... I am 1 hit from losing 40 hours of progress."`,
        structure: [
          "0-4s: Intense slow-mo clutch scenario with heartbeat audio",
          "4-20s: Rapid dodging and impossible maneuvers",
          "20-35s: The twist (funny glitch or accidental clutch save)",
          "35-50s: Funny audio meme outro"
        ],
        targetAudience: "Action & comedy gaming fans",
        appealReason: "High retention trigger through suspense and unexpected punchline",
        difficulty: "Medium",
        estimatedMinutes: 1,
        format: "Short-form (9:16)"
      },
      {
        id: "idea-" + Date.now() + "-3",
        title: `${g} But Every Death Upgrades The Enemy`,
        concept: `A micro-challenge showing 3 rapid progression stages where each mistake makes the game exponentially harder.`,
        hook: `"Rule 1: If I die in ${g}, I have to spawn 10x more enemies."`,
        structure: [
          "0-3s: Visual setup of the chaotic handicap rules",
          "3-18s: Stage 1 easy run turning into accidental disaster",
          "18-40s: Stage 2 overwhelming boss battle survival",
          "40-55s: The final clutch escape with cliffhanger"
        ],
        targetAudience: "Challenge and hardcore gaming viewers",
        appealReason: "Escalating stakes keep viewers watching until the final second",
        difficulty: "Medium",
        estimatedMinutes: 1,
        format: "Short-form (9:16)"
      }
    ];
  }
  return [
    {
      id: "idea-" + Date.now() + "-1",
      title: `I Spent 100 Hours In ${g}'s Most Feared Dimension`,
      concept: `High-stakes survival challenge where the creator enters the hardest zone with strict custom rules and cinematic editing.`,
      hook: `"Most players avoid this area completely. But for the next 100 hours, I am not allowed to leave until I collect every impossible item."`,
      structure: [
        "0:00 - 1:15: Cold open with high-energy preview of the day 99 catastrophe",
        "1:15 - 5:30: The Preparation Phase (crafting, base build, tactical limits)",
        "5:30 - 12:00: The Mid-game crisis: losing primary weapons & clutch recovery",
        "12:00 - 18:30: The final boss encounter and cinematic resolution"
      ],
      targetAudience: "Long-form immersion lovers, teenagers, and challenge enthusiasts",
      appealReason: "Narrative storytelling with high stakes, visual progression, and emotional peaks",
      difficulty: "Epic",
      estimatedMinutes: 18,
      format: "Long-form (16:9)"
    },
    {
      id: "idea-" + Date.now() + "-2",
      title: `We Tested 10 ${g} Myths So You Don't Have To`,
      concept: `Fast-paced collaborative experiment video busting community rumors, patch note secrets, and viral TikTok hacks.`,
      hook: `"The internet claims this new ${g} trick gives you infinite XP. Today we are testing if it's real, or if it will corrupt our world."`,
      structure: [
        '0:00 - 0:45: Rapid montage of all 10 myths with a "Busted or Confirmed" stamp',
        "0:45 - 4:00: Myths 1-3 (Beginner & funny glitches)",
        "4:00 - 9:30: Myths 4-7 (High-value tactical & combat tricks)",
        "9:30 - 14:00: The Legendary Myth 10 (High budget experiment with unexpected results)"
      ],
      targetAudience: "Broad gaming community, casual to dedicated players",
      appealReason: "Satisfies deep gamer curiosity with high information density and fast pacing",
      difficulty: "Medium",
      estimatedMinutes: 14,
      format: "Long-form (16:9)"
    },
    {
      id: "idea-" + Date.now() + "-3",
      title: `I Trapped 50 Players In A Custom ${g} Escape Room`,
      concept: `Social experiment and tournament where community members compete through custom puzzles and lethal obstacle rooms.`,
      hook: `"50 players entered this mega labyrinth. Only ONE will make it through the 5 trial chambers to win the grand prize."`,
      structure: [
        "0:00 - 1:30: Introduction of the death maze and funny player interviews",
        "1:30 - 6:00: Chamber 1 & 2 eliminations and surprise alliances",
        "6:00 - 11:30: The traitor puzzle (betrayals and dramatic clutch plays)",
        "11:30 - 16:00: Sudden-death 1v1 finale and post-game awards"
      ],
      targetAudience: "Fans of MrBeast-style gaming spectacles and competitive chaos",
      appealReason: "High drama, participant personalities, and relatable competition",
      difficulty: "Hard",
      estimatedMinutes: 16,
      format: "Long-form (16:9)"
    }
  ];
}
function getFallbackTitles(game, concept, style) {
  const g = game || "Gaming";
  const c = concept || "Impossible Challenge";
  const styleMap = {
    "curiosity": [
      `The Secret In ${g} Nobody Was Supposed To Find`,
      `I Broke ${g} And Found This Hidden Mechanic...`,
      `Why Everyone Is Suddenly Playing ${g} Like This`,
      `I Tried The Most Illegal Strategy In ${g}`,
      `What Happens If You Push ${g} To Its Absolute Limit?`
    ],
    "challenge": [
      `I Survived 100 Days In Hardcore ${g}`,
      `Can You Beat ${g} With Only 1 HP?`,
      `I Played ${g} But Every Mistake Costs $10`,
      `Beating ${g}'s Hardest Mode Without Taking Damage`,
      `I Spent 24 Hours Trapped In ${g}'s Most Dangerous Zone`
    ],
    "funny": [
      `When Noobs Try Pro Strategies In ${g}`,
      `How We Accidentally Ruined A Whole ${g} Server`,
      `The Most Chaotic 15 Minutes In ${g} History`,
      `I Pretended To Be A Total Beginner In ${g}`,
      `10 Types Of Players You Always Meet In ${g}`
    ],
    "educational": [
      `10 ${g} Habits You MUST Break In 2025`,
      `The Ultimate Guide To Mastering ${g} (From Zero To Pro)`,
      `How Top 0.1% Players Actually Play ${g}`,
      `5 Game-Changing ${g} Settings You Need To Turn On NOW`,
      `The Complete Combat Breakdown for ${g}`
    ],
    "competitive": [
      `How I Reached The Highest Rank In ${g} Solo`,
      `1v5 Clutch In ${g} That Shocked The Entire Lobby`,
      `Pro vs Hacker in ${g} (Who Actually Wins?)`,
      `I Entered A $10,000 ${g} Tournament As An Underdog`,
      `The Most Intense Ranked Match Of My Life In ${g}`
    ],
    "story": [
      `The Rise and Tragic Fall of ${g}'s Greatest Empire`,
      `I Investigated ${g}'s Oldest Unsolved Mystery`,
      `The Day The ${g} Community Joined Forces`,
      `My 3-Year Journey Building The Impossible In ${g}`,
      `How One Player Secretly Controlled All Of ${g}`
    ]
  };
  const titles = styleMap[style.toLowerCase()] || styleMap["challenge"];
  return titles.map((title, idx) => ({
    id: `title-${Date.now()}-${idx}`,
    title,
    style: style.toUpperCase(),
    characterCount: title.length,
    estimatedCTR: 82 + idx * 3 % 15,
    tagline: idx === 0 ? "Highest retention probability" : "Great A/B test candidate"
  }));
}

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json({ limit: "10mb" }));
var apiKey = process.env.GEMINI_API_KEY;
var ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
}) : null;
console.log(`[GameCreator AI] Server initialized. Gemini API key present: ${!!apiKey}`);
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!apiKey,
    model: "gemini-3.8-flash",
    version: "1.0.0",
    app: "GameCreator AI"
  });
});
async function callGemini(prompt, systemInstruction) {
  if (!ai) return null;
  try {
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 7e3));
    const aiPromise = ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: "application/json"
      }
    }).then((res) => res.text ? res.text.trim() : null);
    const result = await Promise.race([aiPromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.warn("[Gemini Error, falling back to procedural engine]:", error);
    return null;
  }
}
app.post("/api/generate-ideas", async (req, res) => {
  const { game = "Minecraft", contentType = "Challenges", audience = "Teens & Young Adults", language = "English", format = "Long-form (16:9)", count = 3 } = req.body;
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
      const ideas = Array.isArray(parsed) ? parsed : parsed.ideas || [parsed];
      return res.json({
        success: true,
        isDemoMode: false,
        source: "gemini-3.8-flash",
        ideas
      });
    } catch (e) {
      console.warn("Failed parsing Gemini ideas JSON, returning fallback");
    }
  }
  const fallback = getFallbackIdeas(game, contentType, format, language);
  res.json({
    success: true,
    isDemoMode: !apiKey,
    source: apiKey ? "procedural-fallback" : "demo-mode",
    message: !apiKey ? "Running in Demo Mode. Connect your Gemini API Key in Settings > Secrets for live real-time model synthesis." : "Fallback response applied.",
    ideas: fallback
  });
});
app.post("/api/generate-titles", async (req, res) => {
  const { game = "Minecraft", concept = "Surviving 100 Days", style = "Challenge", count = 6 } = req.body;
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
      const titles = Array.isArray(parsed) ? parsed : parsed.titles || [parsed];
      return res.json({
        success: true,
        isDemoMode: false,
        source: "gemini-3.8-flash",
        titles
      });
    } catch (e) {
      console.warn("Failed parsing Gemini titles JSON");
    }
  }
  const fallback = getFallbackTitles(game, concept, style);
  res.json({
    success: true,
    isDemoMode: !apiKey,
    source: apiKey ? "procedural-fallback" : "demo-mode",
    message: !apiKey ? "Demo Mode: Pre-calibrated high CTR gaming titles loaded." : void 0,
    titles: fallback
  });
});
app.post("/api/generate-script", async (req, res) => {
  const { game = "Minecraft", concept = "Secret base tour", scriptType = "Gameplay Commentary", tone = "Energetic", duration = "5 Minutes", audience = "General Gaming", language = "English" } = req.body;
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
      console.warn("Failed parsing Gemini script JSON");
    }
  }
  res.json({
    success: true,
    isDemoMode: !apiKey,
    script: {
      title: `I Attempted The Most Forbidden Strategy In ${game}`,
      estimatedDuration: duration,
      estimatedWordCount: 580,
      hookFormula: "Immediate danger + visual proof of impossible odds within 4 seconds",
      sections: [
        {
          sectionName: "Cold Open & Hook (0:00 - 0:45)",
          visualCues: `Fast cuts of player at 1 HP surrounded by chaos in ${game}. Red vignette effect pulses on screen. Quick freeze frame on the inventory screen.`,
          spokenDialogue: `Look at this. Right now, I am one single tap away from losing literally 50 hours of progress in ${game}. Everyone said this strategy was patched three updates ago. But today, we are going to find out if you can still pull it off... or if I just ruined everything.`,
          soundFx: "Intense riser into sharp silence, then high-energy synth beat drops."
        },
        {
          sectionName: "The Rules & The Setup (0:45 - 2:00)",
          visualCues: `Camera transitions to third-person or clean gameplay walking. Pop-up graphic showing rule 1: "No Armor", rule 2: "Hardest Difficulty". Quick comedic zoom on character face.`,
          spokenDialogue: `Okay, to make this fair, I placed three strict restrictions on myself. First: zero top-tier shields. Second: if I take damage before the first checkpoint, I have to drop my best weapon. Let's see how long my luck holds.`,
          soundFx: "Bouncy, rhythmic gaming background music."
        },
        {
          sectionName: "The Mid-Game Disaster (2:00 - 4:00)",
          visualCues: `Sudden unexpected enemy ambush or trap trigger. Gameplay shakes. Fast reaction cam cutout in the corner.`,
          spokenDialogue: `Wait, wait, wait! No way... did that just spawn behind me?! Run! RUN! Guys, this is NOT how the practice run went! If that hit connects, it is completely game over!`,
          soundFx: "Meme alert sound, heartbeat thumping, muffled filter on game audio."
        },
        {
          sectionName: "The Final Clutch & Outro (4:00 - 5:00)",
          visualCues: `Epic slow-motion leap, final decisive shot or block placement. Victory screen or miraculous survival. End screen template opens.`,
          spokenDialogue: `WE ACTUALLY DID IT! Look at that health bar! Drop a comment right now telling me: what impossible challenge in ${game} should I attempt next? Hit subscribe if you survived the heart attack with me!`,
          soundFx: "Triumphant victory fanfare leading into YouTube end-card music."
        }
      ],
      outroCta: "Comment your dream challenge idea and subscribe for next week\u2019s 100-hour experiment."
    }
  });
});
app.post("/api/generate-shorts", async (req, res) => {
  const { game = "Minecraft", topic = "Insane Clutch", angle = "Fast-Paced Myth", duration = "45 Seconds" } = req.body;
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
      console.warn("Failed parsing Shorts JSON");
    }
  }
  res.json({
    success: true,
    isDemoMode: !apiKey,
    shorts: {
      shortTitle: `DO NOT Do This In ${game}! #shorts #gaming`,
      retentionHook: `Stop scrolling if you play ${game}! You are losing 50% of your matches because of this one setting.`,
      scenes: [
        {
          timestamp: "0:00 - 0:03",
          visualAction: "Extreme zoom-in on game menu setting with red animated arrow pointing at default option.",
          voiceover: "Do NOT open your game until you change this single toggle!",
          captionStyle: "Bebas bold text, Neon Yellow with thick black outline, word-by-word punch.",
          soundCue: "Record scratch + bass impact sound."
        },
        {
          timestamp: "0:03 - 0:18",
          visualAction: "Side-by-side comparison screen showing slow default response vs instant optimized response.",
          voiceover: "Most players leave this setting on default, which adds 30 milliseconds of input delay every time you look around.",
          captionStyle: 'Green text for "OPTIMIZED", Red text for "DEFAULT DELAY".',
          soundCue: "Fast ticking clock sound."
        },
        {
          timestamp: "0:18 - 0:35",
          visualAction: "Live clutch highlight demonstrating how fast the player now snaps onto enemies.",
          voiceover: 'Turn off "Camera Smoothing", set this slider to 85, and your crosshair will snap like you have aimbot.',
          captionStyle: 'Highlighting key numbers "85" in Cyan.',
          soundCue: "Satisfying high-tempo phonk or drum-and-bass beat."
        },
        {
          timestamp: "0:35 - 0:45",
          visualAction: "Smiley victory animation, arrow pointing down to Subscribe and Comments.",
          voiceover: "Try it right now in your next match and tell me in the comments if you feel the difference! Double tap for part 2.",
          captionStyle: 'Pulsing purple "SUBSCRIBE FOR PART 2" callout.',
          soundCue: "Victory ding sound effect."
        }
      ],
      recommendedHashtags: ["#shorts", `#${game.toLowerCase().replace(/[^a-z0-9]/g, "")}`, "#gaming", "#gamingshorts", "#protips", "#gamer"],
      description: `The single biggest setting mistake in ${game}! Did you know about this? Let me know in the comments.

Subscribe for daily gaming tips & tricks!

#shorts #${game.toLowerCase().replace(/[^a-z0-9]/g, "")} #gaming`,
      longFormRepurposeIdea: `Expand into "10 Secret Settings Top ${game} Pros Don't Want You To Know" (12-minute video with comprehensive FPS & input lag benchmarks).`
    }
  });
});
app.post("/api/generate-thumbnail-concept", async (req, res) => {
  const { game = "Minecraft", title = "I Survived 100 Days", concept = "Hardcore survival" } = req.body;
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
      console.warn("Failed parsing Thumbnail concept JSON");
    }
  }
  res.json({
    success: true,
    isDemoMode: !apiKey,
    data: {
      concepts: [
        {
          name: "The High-Stakes Shock & Glow",
          focalPoint: "Character face in right third, high-contrast weapon or threat in left third",
          emotionOrAction: "Shocked gasping expression, bright rim-light highlighting silhouette",
          background: `Dark apocalyptic ${game} stormy arena with burning cyan particle embers`,
          colorPalette: "Neon Electric Purple (#a855f7) & Hot Orange (#f97316)",
          recommendedText: "100 DAYS?!",
          compositionTip: "Keep character face large enough to be clearly expressive at 100px width on a smartphone screen.",
          aiImagePrompt: `Cinematic YouTube gaming thumbnail style, dynamic ${game} hero character with expressive shocked face in foreground, glowing neon purple rim lighting, holding a mystical weapon, dark dramatic fiery storm in background, hyper-detailed, vibrant high contrast 3D render, 8k resolution, volumetric lighting --ar 16:9`
        },
        {
          name: 'The "Before vs After" Split',
          focalPoint: "Vertical split screen: humble start on left vs god-mode titan on right",
          emotionOrAction: "Left side: desperate struggling pose; Right side: glowing god-tier triumphant pose",
          background: "Left: rustic wooden shelter; Right: gigantic obsidian neon fortress",
          colorPalette: "Dull Grayscale vs Radiant Gold & Cyan",
          recommendedText: "DAY 1 vs DAY 100",
          compositionTip: "A sharp contrasting vertical divider line helps viewers immediately understand the progression story.",
          aiImagePrompt: `YouTube gaming thumbnail split composition, left side showing weak beginner character in ${game} holding wooden stick in rain, right side showing epic armored warrior radiating glowing cyan energy with massive fortress, dramatic contrast, unreal engine 5 render style, sharp focus, 16:9`
        },
        {
          name: "The Forbidden Question Hook",
          focalPoint: "Giant mysterious glowing vault or barrier in center with a red hazard stamp",
          emotionOrAction: "Character pointing finger with wide curious eyes looking directly into camera",
          background: `Unexplored forbidden cavern in ${game} with deep purple fog`,
          colorPalette: "Deep Midnight Black (#0f172a) & Radiant Red (#ef4444)",
          recommendedText: "DON\u2019T ENTER",
          compositionTip: "Use a bright red or yellow outline around the mysterious object to draw the first eye fixation.",
          aiImagePrompt: `3D gaming thumbnail visual, mysterious sealed glowing gateway in ${game} world, surrounded by glowing warning symbols, dark deep cavern atmosphere, intense purple and red volumetric fog, character standing in shadow pointing towards it, 8k high quality render --ar 16:9`
        }
      ]
    }
  });
});
app.post("/api/generate-seo", async (req, res) => {
  const { game = "Minecraft", title = "I Survived 100 Days", concept = "Challenge", targetKeywords = "gameplay, tips, walkthrough" } = req.body;
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
      console.warn("Failed parsing SEO JSON");
    }
  }
  res.json({
    success: true,
    isDemoMode: !apiKey,
    seo: {
      description: `In today's video, we are testing the ultimate limits of ${game}! Can we survive and complete the impossible challenge without making a single mistake? Watch until the end to see the day 100 finale!

TIMESTAMPS:
0:00 - The Impossible Challenge
1:24 - Gathering Initial Gear
4:10 - The Disaster Happens
8:30 - Recovering Against All Odds
12:45 - The Final Boss Confrontation
15:20 - Final Verdict & World Download

CONNECT WITH ME:
\u{1F3AE} Twitch: https://twitch.tv/yourchannel
\u{1F4AC} Discord Community: https://discord.gg/yourserver
\u{1F426} Twitter/X: https://x.com/yourhandle

#${game.replace(/\s+/g, "")} #Gaming #Walkthrough`,
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
        "gaming",
        "lets play",
        "funny moments"
      ],
      pinnedCommentPrompt: [
        `\u{1F3C6} Pin this comment: "Question of the Day: If you had to survive 100 days in ${game} with ONLY ONE item, which one are you picking? Comment below!"`,
        `\u{1F525} Pin this comment: "Drop a like if you thought I was completely dead at 8:30! What challenge should I take on in next week's video?"`
      ],
      checklist: [
        "Thumbnail clarity verified at 100px mobile preview size",
        "Title is under 60 characters to prevent mobile truncation",
        "Sound mix normalized: voiceover clearly audible over background music",
        "End screens and related video cards placed in the final 20 seconds",
        "Audio copyright check passed in YouTube Creator Studio",
        "Pinned engagement comment ready to paste right after upload"
      ]
    }
  });
});
app.post("/api/content-coach", async (req, res) => {
  const { channelName = "My Gaming Channel", primaryGame = "Minecraft", recentStats = {}, savedIdeasCount = 0, calendarCount = 0 } = req.body;
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
      console.warn("Failed parsing Coach JSON");
    }
  }
  res.json({
    success: true,
    isDemoMode: !apiKey,
    coach: {
      channelHealthSummary: `Your channel focuses on "${primaryGame}". With ${calendarCount} scheduled uploads and ${savedIdeasCount} ideas in your vault, your immediate priority is tightening thumbnail packaging to lift baseline CTR above 7%.`,
      topRecommendedExperiments: [
        {
          title: 'The "3-Word Thumbnail" Contrast Test',
          why: "Most gaming thumbnails suffer from visual clutter. Reducing thumbnail text to 2-3 high-impact words increases mobile tap-through rates.",
          howToMeasure: "Compare CTR over the first 48 hours against your 30-day channel average."
        },
        {
          title: "High-Retention Micro-Shorts Funnel",
          why: "Publishing 2 Shorts per week derived directly from your long-form challenge videos exposes your channel to fresh non-subscribed viewers.",
          howToMeasure: 'Track subscriber conversion rate from the "Shorts" tab in YouTube Studio.'
        },
        {
          title: "Curiosity Gap vs Descriptive Titles",
          why: 'Instead of "Playing ${primaryGame} Update 1.21", test "I Discovered The New ${primaryGame} Secret Nobody Is Talking About".',
          howToMeasure: "Look for increased Impressions click-through rate in Browse Features."
        }
      ],
      contentCalendarFeedback: calendarCount < 2 ? "Warning: Content calendar has fewer than 2 scheduled uploads. Gaming algorithms reward predictable publishing cadence (e.g. Every Friday at 3 PM)." : "Good scheduling momentum. Make sure to allow at least 48 hours between uploads for viewers to finish watching previous long-form videos.",
      formatBreakdown: "Recommended Balance: 1 polished Long-form video (10-18 min) + 2 high-paced Shorts per week.",
      weeklyActionPlan: [
        "Monday: Pick your top idea from the AI Idea Generator and generate 5 title variations.",
        "Tuesday: Design your thumbnail in the Thumbnail Studio BEFORE writing the script.",
        "Wednesday: Script the first 3 minutes with high visual cues in the Gaming Script Writer.",
        "Thursday: Record gameplay and edit with fast pacing (cut all dead pauses > 1.5 seconds).",
        "Friday: Publish at peak gaming audience hours (3:00 PM - 6:00 PM local time)."
      ],
      disclaimer: "Growth recommendations are strategic optimizations based on YouTube creator best practices, not guarantees of algorithmic impressions."
    }
  });
});
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("[GameCreator AI] Vite middleware mounted in development mode");
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`[GameCreator AI] Serving static production build from ${distPath}`);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GameCreator AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("[GameCreator AI] Failed to start server:", err);
  process.exit(1);
});
