/**
 * High-quality procedural gaming creator fallbacks.
 * Used when no GEMINI_API_KEY is configured or during network timeouts,
 * ensuring the creator never sees empty screens or generic "lorem ipsum".
 */

export function getFallbackIdeas(game: string, contentType: string, format: string, language: string = 'English') {
  const g = game.trim() || 'Minecraft';
  const isShort = format.toLowerCase().includes('short');

  if (isShort) {
    return [
      {
        id: 'idea-' + Date.now() + '-1',
        title: `The 1 ${g} Secret 99% Of Players Never Realize`,
        concept: `Fast-paced 45-second mythbuster showing a game mechanic that feels like a glitch but is actually built-in.`,
        hook: `"Stop scrolling! If you play ${g}, you have been doing this completely wrong your entire life."`,
        structure: [
          '0-3s: Dramatic game fail / controversial statement',
          '3-15s: Proof of why the common method wastes time',
          '15-35s: Step-by-step secret execution with zoom-in cues',
          '35-45s: Mind-blown reaction + "Subscribe for more pro tips"'
        ],
        targetAudience: 'Curious casual & competitive players wanting quick edge',
        appealReason: 'High curiosity gap and immediate practical value within 30 seconds',
        difficulty: 'Easy',
        estimatedMinutes: 1,
        format: 'Short-form (9:16)'
      },
      {
        id: 'idea-' + Date.now() + '-2',
        title: `I Bet You Can't Guess What Happens Next in ${g}`,
        concept: `Suspense-driven clutch or unpredictable physics moment with an unexpected comedic ending.`,
        hook: `"Watch my health bar... I am 1 hit from losing 40 hours of progress."`,
        structure: [
          '0-4s: Intense slow-mo clutch scenario with heartbeat audio',
          '4-20s: Rapid dodging and impossible maneuvers',
          '20-35s: The twist (funny glitch or accidental clutch save)',
          '35-50s: Funny audio meme outro'
        ],
        targetAudience: 'Action & comedy gaming fans',
        appealReason: 'High retention trigger through suspense and unexpected punchline',
        difficulty: 'Medium',
        estimatedMinutes: 1,
        format: 'Short-form (9:16)'
      },
      {
        id: 'idea-' + Date.now() + '-3',
        title: `${g} But Every Death Upgrades The Enemy`,
        concept: `A micro-challenge showing 3 rapid progression stages where each mistake makes the game exponentially harder.`,
        hook: `"Rule 1: If I die in ${g}, I have to spawn 10x more enemies."`,
        structure: [
          '0-3s: Visual setup of the chaotic handicap rules',
          '3-18s: Stage 1 easy run turning into accidental disaster',
          '18-40s: Stage 2 overwhelming boss battle survival',
          '40-55s: The final clutch escape with cliffhanger'
        ],
        targetAudience: 'Challenge and hardcore gaming viewers',
        appealReason: 'Escalating stakes keep viewers watching until the final second',
        difficulty: 'Medium',
        estimatedMinutes: 1,
        format: 'Short-form (9:16)'
      }
    ];
  }

  return [
    {
      id: 'idea-' + Date.now() + '-1',
      title: `I Spent 100 Hours In ${g}'s Most Feared Dimension`,
      concept: `High-stakes survival challenge where the creator enters the hardest zone with strict custom rules and cinematic editing.`,
      hook: `"Most players avoid this area completely. But for the next 100 hours, I am not allowed to leave until I collect every impossible item."`,
      structure: [
        '0:00 - 1:15: Cold open with high-energy preview of the day 99 catastrophe',
        '1:15 - 5:30: The Preparation Phase (crafting, base build, tactical limits)',
        '5:30 - 12:00: The Mid-game crisis: losing primary weapons & clutch recovery',
        '12:00 - 18:30: The final boss encounter and cinematic resolution'
      ],
      targetAudience: 'Long-form immersion lovers, teenagers, and challenge enthusiasts',
      appealReason: 'Narrative storytelling with high stakes, visual progression, and emotional peaks',
      difficulty: 'Epic',
      estimatedMinutes: 18,
      format: 'Long-form (16:9)'
    },
    {
      id: 'idea-' + Date.now() + '-2',
      title: `We Tested 10 ${g} Myths So You Don't Have To`,
      concept: `Fast-paced collaborative experiment video busting community rumors, patch note secrets, and viral TikTok hacks.`,
      hook: `"The internet claims this new ${g} trick gives you infinite XP. Today we are testing if it's real, or if it will corrupt our world."`,
      structure: [
        '0:00 - 0:45: Rapid montage of all 10 myths with a "Busted or Confirmed" stamp',
        '0:45 - 4:00: Myths 1-3 (Beginner & funny glitches)',
        '4:00 - 9:30: Myths 4-7 (High-value tactical & combat tricks)',
        '9:30 - 14:00: The Legendary Myth 10 (High budget experiment with unexpected results)'
      ],
      targetAudience: 'Broad gaming community, casual to dedicated players',
      appealReason: 'Satisfies deep gamer curiosity with high information density and fast pacing',
      difficulty: 'Medium',
      estimatedMinutes: 14,
      format: 'Long-form (16:9)'
    },
    {
      id: 'idea-' + Date.now() + '-3',
      title: `I Trapped 50 Players In A Custom ${g} Escape Room`,
      concept: `Social experiment and tournament where community members compete through custom puzzles and lethal obstacle rooms.`,
      hook: `"50 players entered this mega labyrinth. Only ONE will make it through the 5 trial chambers to win the grand prize."`,
      structure: [
        '0:00 - 1:30: Introduction of the death maze and funny player interviews',
        '1:30 - 6:00: Chamber 1 & 2 eliminations and surprise alliances',
        '6:00 - 11:30: The traitor puzzle (betrayals and dramatic clutch plays)',
        '11:30 - 16:00: Sudden-death 1v1 finale and post-game awards'
      ],
      targetAudience: 'Fans of MrBeast-style gaming spectacles and competitive chaos',
      appealReason: 'High drama, participant personalities, and relatable competition',
      difficulty: 'Hard',
      estimatedMinutes: 16,
      format: 'Long-form (16:9)'
    }
  ];
}

export function getFallbackTitles(game: string, concept: string, style: string) {
  const g = game || 'Gaming';
  const c = concept || 'Impossible Challenge';

  const styleMap: Record<string, string[]> = {
    'curiosity': [
      `The Secret In ${g} Nobody Was Supposed To Find`,
      `I Broke ${g} And Found This Hidden Mechanic...`,
      `Why Everyone Is Suddenly Playing ${g} Like This`,
      `I Tried The Most Illegal Strategy In ${g}`,
      `What Happens If You Push ${g} To Its Absolute Limit?`
    ],
    'challenge': [
      `I Survived 100 Days In Hardcore ${g}`,
      `Can You Beat ${g} With Only 1 HP?`,
      `I Played ${g} But Every Mistake Costs $10`,
      `Beating ${g}'s Hardest Mode Without Taking Damage`,
      `I Spent 24 Hours Trapped In ${g}'s Most Dangerous Zone`
    ],
    'funny': [
      `When Noobs Try Pro Strategies In ${g}`,
      `How We Accidentally Ruined A Whole ${g} Server`,
      `The Most Chaotic 15 Minutes In ${g} History`,
      `I Pretended To Be A Total Beginner In ${g}`,
      `10 Types Of Players You Always Meet In ${g}`
    ],
    'educational': [
      `10 ${g} Habits You MUST Break In 2025`,
      `The Ultimate Guide To Mastering ${g} (From Zero To Pro)`,
      `How Top 0.1% Players Actually Play ${g}`,
      `5 Game-Changing ${g} Settings You Need To Turn On NOW`,
      `The Complete Combat Breakdown for ${g}`
    ],
    'competitive': [
      `How I Reached The Highest Rank In ${g} Solo`,
      `1v5 Clutch In ${g} That Shocked The Entire Lobby`,
      `Pro vs Hacker in ${g} (Who Actually Wins?)`,
      `I Entered A $10,000 ${g} Tournament As An Underdog`,
      `The Most Intense Ranked Match Of My Life In ${g}`
    ],
    'story': [
      `The Rise and Tragic Fall of ${g}'s Greatest Empire`,
      `I Investigated ${g}'s Oldest Unsolved Mystery`,
      `The Day The ${g} Community Joined Forces`,
      `My 3-Year Journey Building The Impossible In ${g}`,
      `How One Player Secretly Controlled All Of ${g}`
    ]
  };

  const titles = styleMap[style.toLowerCase()] || styleMap['challenge'];
  return titles.map((title, idx) => ({
    id: `title-${Date.now()}-${idx}`,
    title,
    style: style.toUpperCase(),
    characterCount: title.length,
    estimatedCTR: 82 + (idx * 3) % 15,
    tagline: idx === 0 ? 'Highest retention probability' : 'Great A/B test candidate'
  }));
}
