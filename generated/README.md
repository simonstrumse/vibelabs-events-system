# Generated Event Content

This folder contains AI-generated event content drafts organized by date.

## Purpose

When you describe an event to Claude Code (or any AI agent) in the events folder, the system automatically generates a complete draft and saves it here in a date-organized structure.

## Folder Structure

```
/generated/
  /YYYY/           # Year (e.g., 2025)
    /MM/           # Month (e.g., 10, 11, 12)
      event-name-draft.md
      another-event-draft.md
```

**Example:**
```
/generated/
  /2025/
    /10/
      vibelabs-ai-agents-oct-28-draft.md
    /11/
      shifter-course-nov-5-draft.md
      anfo-breakfast-nov-15-draft.md
    /12/
      corporate-eggs-workshop-dec-10-draft.md
```

## Draft Format

Each draft file contains three sections:

1. **EVENT PAGE CONTENT** - Full event description (200-400 words)
2. **FRONT-PAGE BLURB** - Short promotional text (50-100 words)
3. **EMAIL ANNOUNCEMENT** - Complete email with subject line (200-300 words)

Plus a **MISSING INFORMATION** section listing any details that need to be filled in.

## Workflow

1. **Generate:** AI creates draft with placeholders for missing info
2. **Review:** You review the draft
3. **Clarify:** AI asks questions about missing details
4. **Iterate:** Regenerate with new information until satisfied
5. **Finalize:** Edit the draft to your liking
6. **Save:** Save finalized content anywhere in the events folder
7. **Learn:** System automatically learns from your edits (future feature)

## File Naming Convention

Filenames follow this pattern:
- Lowercase with hyphens (kebab-case)
- Descriptive but concise (3-6 words)
- Include date when specific
- Always end with `-draft.md`

**Good examples:**
- `vibelabs-ai-agents-nov-20-draft.md`
- `shifter-full-day-dec-5-draft.md`
- `anfo-breakfast-dec-11-draft.md`

**Avoid:**
- `Event Draft.md` (spaces, not descriptive)
- `new-event-2025-11-20-vibelabs-ai-agents-workshop.md` (too long)
- `draft.md` (not descriptive enough)

## Automatic Creation

The AI agent automatically creates year/month subdirectories as needed. You don't need to create them manually.

**Example:**
If you describe an event in March 2026 and `/generated/2026/03/` doesn't exist yet, the system will create it automatically.

## What Happens After Finalization?

When you finish editing a draft:

1. **Save it anywhere** in the events folder (not just in /generated/)
2. System detects the finalized content
3. **Automatic learning** (future): Compares draft → final to learn your preferences
4. Patterns extracted:
   - Phrases you added (increase frequency)
   - Phrases you removed (decrease frequency)
   - Structural changes (note preferences)
   - Tone adjustments (track direction)
5. **Next generation** incorporates these learnings

**Current state:** Learning is manual (edit tone-of-voice-guide.md directly). Automatic diff analysis coming in Phase 2.

## Draft Retention

**Keep or delete drafts as you prefer:**
- Keep them for reference
- Delete after finalizing to keep folder tidy
- Drafts don't affect the system (only finalized content is used for learning)

**Recommendation:** Keep recent drafts (last 3-6 months) for comparison and delete older ones to avoid clutter.

## Integration with Historical Docs

The system references historical event files for tone and style:
- `vibelabs-events.md` - Community event examples
- `shifter-courses.md` - Commercial course examples
- `anfo-events.md` - Association partnership examples
- `corporate-biz-dev.md` - Corporate training examples

Generated drafts aim to match the tone and quality of these historical examples.

## Troubleshooting

**Draft not generating?**
- Make sure you're describing an event clearly
- Check that CLAUDE.md integration is in place
- Reference event-generation-instructions.md for system requirements

**Wrong tone or style?**
- Edit tone-of-voice-guide.md to override learned patterns
- Reference specific historical events when describing your event
- Provide more context about event type (Vibelabs, Shifter, ANFO, Corporate)

**Missing information not detected?**
- System uses smart defaults for common patterns
- Check MISSING INFORMATION section in draft
- Provide more details when describing the event

## System Files

**Don't edit these generated drafts directly for learning purposes.**

Instead:
- Edit `tone-of-voice-guide.md` for manual style adjustments
- Save finalized content to historical event files
- Let the system learn from finalized versions

## Questions?

See `system-design.md` for complete documentation of how the generation system works.

---

**Last Updated:** October 17, 2025
**System Version:** 1.0.0
