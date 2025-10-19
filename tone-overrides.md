# Active Tone of Voice Overrides

**Last Updated:** October 18, 2025
**Status:** Active - these instructions override all other tone guidance
**Priority:** HIGHEST - Apply before tone-of-voice-guide.md and tone-learnings.json

---

## How This Works

This file contains **active instructions** that take precedence over all learned patterns and historical analysis. When you want to make a quick style change to all future event generations, just tell Claude Code and it will update this file.

**Priority System:**
1. **tone-overrides.md** ← YOU ARE HERE (highest priority)
2. tone-of-voice-guide.md (manual style guide)
3. tone-learnings.json (automated pattern learning)

---

## Active Overrides

<!-- Add your active instructions below this line -->
<!-- Use clear, direct language - examples provided below -->
<!-- To activate an instruction, uncomment it by removing the <!-- and --> markers -->

### Emoji Usage
<!-- **OVERRIDE:** Use emojis very sparingly - maximum 1 per entire output (all three sections combined) -->
<!-- **OVERRIDE:** No emojis at all in any generated content -->
<!-- **OVERRIDE:** Use emojis more liberally to add personality (3-5 per output) -->

### Formality Level
<!-- **OVERRIDE:** Make all content more formal and professional -->
<!-- **OVERRIDE:** Make all content more casual and conversational -->
<!-- **OVERRIDE:** Use British English spelling and conventions -->

### Language Mixing
<!-- **OVERRIDE:** Use primarily English with minimal Norwegian -->
<!-- **OVERRIDE:** Use primarily Norwegian with minimal English -->
<!-- **OVERRIDE:** Keep all tech terms and platform names in English, everything else in Norwegian -->

### Content Structure
<!-- **OVERRIDE:** Keep all content under 150 words per section (shorter is better) -->
<!-- **OVERRIDE:** Make content longer and more detailed (300-500 words per section) -->
<!-- **OVERRIDE:** Always include a detailed program timeline -->
<!-- **OVERRIDE:** Skip program details and focus on outcomes -->

### Partnership Mentions
<!-- **OVERRIDE:** Always mention V0 pizza sponsorship for Vibelabs events -->
<!-- **OVERRIDE:** Do not assume any partnerships unless explicitly stated -->
<!-- **OVERRIDE:** Emphasize partnerships and sponsors prominently -->

### Call to Action
<!-- **OVERRIDE:** Make CTAs more urgent and action-oriented -->
<!-- **OVERRIDE:** Keep CTAs very low-pressure and optional -->
<!-- **OVERRIDE:** Always include registration links (use placeholder if not provided) -->

### Specific Phrases
<!-- **OVERRIDE:** Avoid the phrase "vibecoding" - use "building with AI" instead -->
<!-- **OVERRIDE:** Always use "AI-assisted development" instead of "AI coding" -->
<!-- **OVERRIDE:** Emphasize "professional code" in every event description -->

---

## Example Usage

### Example 1: Tone Down Emojis

**User says:** "Tone down the use of emojis drastically"

**Claude Code updates this file:**
```markdown
### Emoji Usage
**OVERRIDE:** Use emojis very sparingly - maximum 1 per entire output (all three sections combined)
```

**Result:** All future generations use max 1 emoji total, even for Vibelabs events that historically used 2-3.

---

### Example 2: More Professional Tone

**User says:** "Make everything more professional, I have some corporate leads attending community events now"

**Claude Code updates this file:**
```markdown
### Formality Level
**OVERRIDE:** Increase formality for all event types - Vibelabs should be 5/10 instead of 2/10

### Emoji Usage
**OVERRIDE:** No emojis in event pages or emails, only in casual announcements if absolutely necessary
```

**Result:** Even Vibelabs events get a more professional tone and minimal emoji use.

---

### Example 3: Emphasize Partnerships

**User says:** "Always emphasize our partnership with V0 and Databutton prominently"

**Claude Code updates this file:**
```markdown
### Partnership Mentions
**OVERRIDE:** Always mention V0 and Databutton partnerships in the opening paragraph, not buried later

### Specific Phrases
**OVERRIDE:** Use the exact phrase "In partnership with V0 and Databutton" when applicable
```

**Result:** Partnerships get prime placement in all content.

---

### Example 4: Shorter Content

**User says:** "Keep everything more concise, people don't read long emails"

**Claude Code updates this file:**
```markdown
### Content Structure
**OVERRIDE:** Maximum 150 words for event pages, 50 words for blurbs, 200 words for emails

### Call to Action
**OVERRIDE:** Lead with the CTA, then provide details - invert typical structure
```

**Result:** All content becomes more concise and action-oriented.

---

## How to Use

### Adding New Overrides

**Method 1: Tell Claude Code (Recommended)**
Just say what you want changed:
- "Use fewer emojis"
- "Make content more formal"
- "Always mention X partnership"
- "Keep everything under 150 words"

Claude Code will update this file automatically.

**Method 2: Edit Manually**
1. Add a new override under the appropriate section
2. Use format: `**OVERRIDE:** [Clear instruction]`
3. Save the file

### Removing Overrides

**To deactivate an override:**
1. Comment it out: Add `<!--` before and `-->` after the line
2. Or delete it entirely

**To clear all overrides:**
Delete all uncommented `**OVERRIDE:**` lines

### Temporary vs Permanent

**Temporary overrides:**
- Useful for specific campaigns or event series
- Easy to remove when no longer needed
- Example: "For the next month, emphasize our new course structure"

**Permanent overrides:**
- Style preferences that should always apply
- Consider moving to tone-of-voice-guide.md if truly permanent
- Example: "Always use British English spelling"

---

## Override Syntax

**Format:**
```markdown
**OVERRIDE:** [Clear, actionable instruction in imperative form]
```

**Good examples:**
- `**OVERRIDE:** Use maximum 1 emoji per output`
- `**OVERRIDE:** Keep event pages under 200 words`
- `**OVERRIDE:** Always mention prerequisites in opening paragraph`
- `**OVERRIDE:** Use "building with AI" instead of "vibecoding"`

**Bad examples:**
- `**OVERRIDE:** Maybe use fewer emojis` (not clear)
- `**OVERRIDE:** I think we should be more professional` (not actionable)
- `**OVERRIDE:** Emojis` (not a complete instruction)

---

## Current Active Overrides

**Count:** 0 active overrides
**Status:** Using default tone from tone-of-voice-guide.md and tone-learnings.json

<!-- When you add overrides, they will appear uncommented below this line -->

---

## Notes

- **Immediate Effect:** Overrides apply to the very next generation
- **System Check:** AI agents read this file FIRST before generating content
- **Clear Communication:** Tell Claude Code what you want in plain language
- **Easy Rollback:** Comment out or delete any override to remove it
- **Stackable:** Multiple overrides work together (e.g., "no emojis" + "more formal")
- **Explicit Wins:** Clear overrides beat fuzzy learned patterns every time

---

## Troubleshooting

**Override not working?**
- Check that it's uncommented (no `<!--` markers around it)
- Make sure instruction is clear and actionable
- Verify format: `**OVERRIDE:**` with proper markdown

**Conflicting overrides?**
- More specific wins over more general
- Later in file wins over earlier
- If unclear, Claude Code will ask for clarification

**Want to reset everything?**
- Delete all `**OVERRIDE:**` lines
- Or comment them all out with `<!-- -->`
- System falls back to tone-of-voice-guide.md

---

**Remember:** This file is for ACTIVE, TEMPORARY adjustments. For permanent style rules, consider updating `tone-of-voice-guide.md` instead.
