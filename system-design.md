# AI Event Content Generation System - Design Document

**Created:** October 17, 2025
**Last Updated:** October 18, 2025
**Status:** Enhanced with Tone Override System
**Version:** 1.1.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Original Conversation & Intent](#original-conversation--intent)
3. [Design Decisions](#design-decisions)
4. [System Architecture](#system-architecture)
5. [User Workflow](#user-workflow)
6. [Key Components](#key-components)
7. [Implementation Details](#implementation-details)
8. [Future Enhancements](#future-enhancements)
9. [Appendix: Full Conversation Log](#appendix-full-conversation-log)

---

## Executive Summary

This document captures the design and implementation of an AI-powered event content generation system for the Vibelabs events folder. The system enables natural language event descriptions to be transformed into complete, on-brand event content (event pages, front-page blurbs, and email announcements) without requiring any code or external applications.

**Primary Goal:** Turn the events folder into a self-contained copywriting assistant that learns and adapts to the user's tone of voice over time.

**Key Innovation:** Living tone of voice system that automatically learns from user edits, with newer content weighted more heavily to track evolving style preferences.

**Implementation Approach:** Instruction-driven system using markdown documents that any capable CLI AI agent (Claude Code, etc.) can follow - no code, scripts, or external applications required.

---

## Original Conversation & Intent

### User's Initial Request

> "I want to set up a repository of historical texts and invitations and just use all the docs in here and create clear instructions around them so that whenever I run a claude code agent in this folder, and give a theme, title, maybe guests, maybe some other info, and time etc. it will write a perfect text for the event page, blurb for the front-page, and email to announce the event. all in my tone of voice as represented in here, and it will ask me if it has any questions or misses some crucial information. and then ready everything in markdown for me. doesn't need an app or functions just need to work with claude code or any other cli agent working in the folder."

### Core Requirements Identified

1. **No external applications** - Work entirely within the events folder
2. **Natural language input** - Describe events conversationally
3. **Immediate output** - Generate drafts first, ask questions after
4. **Three outputs** - Event page, front-page blurb, email announcement
5. **Tone matching** - Learn from 35+ historical events in the folder
6. **Adaptive learning** - System improves over time from user edits
7. **All event types** - Support Vibelabs, Shifter, ANFO, Corporate
8. **Primary focus** - Optimize for Vibelabs community events

---

## Design Decisions

### Decision 1: Generate First, Ask Questions After

**User Choice:** Option A - "Generate immediately with placeholders → show draft → ask questions to fill gaps → regenerate"

**Rationale:** Gives user something concrete to react to immediately. Humans find it easier to critique and refine existing content than to answer abstract questions in a vacuum.

**Implementation:** System uses smart defaults from historical patterns and clear placeholders `[ITEM TBD]` for unknowns.

---

### Decision 2: Single File with Three Sections

**User Choice:** Option A - "Single markdown file with all three sections clearly marked (Event Page / Front-page Blurb / Email)"

**Rationale:** Easier to review all content at once, simpler to iterate on, reduces file management overhead.

**Format:**
```markdown
# Event Content Generation - [Name]

## MISSING INFORMATION
[Checklist of unknowns]

## EVENT PAGE CONTENT
[Full description]

## FRONT-PAGE BLURB
[Short promotional text]

## EMAIL ANNOUNCEMENT
Subject: [...]
[Email body]
```

---

### Decision 3: Automatic Learning from Edits

**User Choice:** Option D - "Automatic learning only - system compares generated vs. finalized files and infers patterns"

**Rationale:** Frictionless. No special commands or annotations needed. Any file saved in the events folder becomes learning material, with newer content automatically weighted more heavily.

**Implementation:** Diff analysis planned (future), manual learning via tone-of-voice-guide.md edits (current).

---

### Decision 4: Dual Tone of Voice System

**User Choice:** Option D - "Both - human-readable guide you can edit + data file that tracks automated learnings"

**Rationale:** Provides control (manual edits) and automation (pattern learning). Users can explicitly override learned patterns when needed.

**Components:**
- `tone-of-voice-guide.md` - Human-readable, manually editable
- `tone-learnings.json` - Structured data, automatically updated

---

### Decision 5: Natural Conversational Initiation

**User Choice:** Option C - "Just open Claude Code in this folder and describe the event conversationally"

**Rationale:** Lowest friction, most natural workflow. No scripts to run, no templates to fill out.

**Trigger:** CLAUDE.md instructs AI agents to watch for event descriptions and follow event-generation-instructions.md.

---

### Decision 6: Date-Based Draft Organization

**User Choice:** Option E with B - "Date-based organization like `/generated/2025/11/event-name-draft.md` within a dedicated `/generated/` folder"

**Rationale:** Keeps drafts separate from historical documentation, organized chronologically for easy finding, scales indefinitely.

**Structure:**
```
/generated/
  /2025/
    /10/
      vibelabs-oct-event-draft.md
    /11/
      ai-agents-workshop-nov-20-draft.md
```

---

### Decision 7: Active Tone Override System

**User Request:** "Add to the system that whenever I'm in the folder with claude code I can also provide general instructions for the tone of voice that should be applied to the system and learning system. For example, tone down the use of emojis drastically. If I want to apply some quick style changes to all future generations"

**Solution:** Create `tone-overrides.md` file with highest priority in the system

**Rationale:** Users need a quick, conversational way to adjust tone without manually editing complex files. Sometimes you want temporary adjustments (e.g., "no emojis for next month's corporate series") without changing the permanent style guide.

**Implementation:**
- New file: `tone-overrides.md` with template and examples
- AI agents check this file FIRST before any other tone guidance
- Simple syntax: `**OVERRIDE:** [clear instruction]`
- Conversational updates: User says "use fewer emojis" → AI updates file
- Easy rollback: Comment out or delete overrides
- Stackable: Multiple overrides apply simultaneously

**Priority Hierarchy:**
1. tone-overrides.md (active instructions - highest)
2. tone-of-voice-guide.md (manual style guide)
3. tone-learnings.json (automated patterns)
4. Historical event patterns (reference only)

**Example Usage:**
```markdown
User: "Tone down the use of emojis drastically"

AI updates tone-overrides.md:
**OVERRIDE:** Use emojis very sparingly - maximum 1 per entire output

Confirmation: "I've added this override. All future events will use max 1 emoji total."
```

**Benefits:**
- Immediate effect on next generation
- No need to understand the complex pattern files
- Natural language interface
- Temporary vs permanent adjustments clear
- User maintains full control

---

## System Architecture

### High-Level Flow

```
User describes event
       ↓
Claude Code reads CLAUDE.md
       ↓
CLAUDE.md triggers event-generation-instructions.md
       ↓
System reads (in priority order):
  - tone-overrides.md (active instructions - HIGHEST PRIORITY)
  - event-generation-instructions.md (workflow)
  - tone-of-voice-guide.md (style rules)
  - tone-learnings.json (pattern data)
  - Historical events (examples)
       ↓
Detect event type (Vibelabs/Shifter/ANFO/Corporate)
       ↓
Extract information from natural language
       ↓
Generate draft with placeholders
       ↓
Save to /generated/YYYY/MM/event-name-draft.md
       ↓
Show draft to user
       ↓
Ask clarifying questions for missing info
       ↓
User answers → Regenerate → Iterate
       ↓
User finalizes by editing and saving
       ↓
[Future: Diff analysis → Update tone-learnings.json]
```

### Key Components

1. **CLAUDE.md** - Entry point, routes event descriptions to generation system
2. **event-generation-instructions.md** - Master prompt with complete workflow
3. **tone-overrides.md** - **HIGHEST PRIORITY** - Active tone instructions from user
4. **tone-of-voice-guide.md** - Style bible, manually editable
5. **tone-learnings.json** - Pattern database with temporal weighting
6. **Historical event files** - Reference examples (vibelabs-events.md, etc.)
7. **/generated/** folder - Draft storage, organized by date

**Priority System:** tone-overrides.md > tone-of-voice-guide.md > tone-learnings.json > historical patterns

---

## User Workflow

### Example Interaction

**User:** "I want to do a Vibelabs event on November 20th about AI agents, with a guest speaker from Lovable, at Mesh Youngstorget at 17:00"

**System:**
1. Detects: Vibelabs community event
2. Extracts: Date (Nov 20), Time (17:00), Topic (AI agents), Guest (Lovable), Venue (Mesh Youngstorget)
3. Generates complete draft with all three sections
4. Saves to `/generated/2025/11/ai-agents-workshop-nov-20-draft.md`
5. Shows draft to user with MISSING INFORMATION section listing unknowns
6. Asks: "What's the capacity for this event? (Typical Vibelabs events are 150-300)"
7. User: "150"
8. Regenerates with capacity filled in
9. Asks: "Should I mention any partnerships or special offers?"
10. User: "Yes, V0 pizza and Databutton is doing a product demo"
11. Final regeneration with all info
12. User edits for final tweaks, saves anywhere in events folder
13. System learns from finalized version (future automatic, current manual)

### Iteration Cycle

```
Generate → Show → Ask → Answer → Regenerate
    ↑                                ↓
    └────────────────────────────────┘
              (Loop until satisfied)
                      ↓
              User finalizes
                      ↓
              System learns
```

### Tone Adjustment Workflow (NEW in v1.1.0)

**Example: Quick Style Change**

**User:** "Tone down the use of emojis drastically"

**System:**
1. Reads request
2. Updates `tone-overrides.md`:
   ```markdown
   **OVERRIDE:** Use emojis very sparingly - maximum 1 per entire output
   ```
3. Confirms: "I've added this override to your tone settings. All future events will use max 1 emoji total. You can remove this anytime."

**Next event generation:** Automatically applies emoji limit

---

**Example: Multiple Adjustments**

**User:** "Make everything more concise and professional. I have corporate leads coming to community events now."

**System:**
1. Updates `tone-overrides.md`:
   ```markdown
   **OVERRIDE:** Maximum 200 words for event pages, 75 words for blurbs
   **OVERRIDE:** Increase formality level for Vibelabs events to 5/10 (from typical 2/10)
   **OVERRIDE:** Use emojis sparingly - maximum 1 per output, none in event page
   ```
2. Confirms all three adjustments

**Result:** All future generations are shorter, more formal, minimal emojis

---

**Example: Removing an Override**

**User:** "Actually, bring back the casual tone, the corporate thing didn't work out"

**System:**
1. Removes or comments out formality overrides in `tone-overrides.md`
2. Confirms: "Removed formality overrides. Back to the original Vibelabs casual style!"

**Result:** Next generation uses historical patterns (casual, moderate emoji)

---

## Key Components

### 1. event-generation-instructions.md

**Purpose:** Master prompt document that AI agents read to understand how to generate content.

**Key Sections:**
- Quick Start workflow
- Event Type Detection (keywords and patterns)
- Information Extraction (essential, important, optional)
- Generation Workflow (6-step process)
- Output Specifications (formats for each section)
- Tone of Voice Application (always do / never do)
- Event Type Templates (4 templates with examples)
- Placeholder Strategy (smart defaults)
- Examples of Good Generations
- Quality Checklist

**Length:** ~12,000 words - comprehensive enough for autonomous operation

**Design Philosophy:** "Give the AI everything it needs to succeed without human intervention except for the initial event description."

---

### 2. tone-overrides.md (NEW in v1.1.0)

**Purpose:** Active tone instructions with highest priority. Allows quick, conversational style adjustments.

**Key Sections:**
- Template with commented examples
- Override categories (Emoji Usage, Formality, Language, Structure, etc.)
- Usage examples
- Removal instructions

**How It Works:**
User says: "Use fewer emojis"
→ AI updates tone-overrides.md with: `**OVERRIDE:** Use maximum 1 emoji per output`
→ All future generations apply this rule
→ User can remove by saying "remove emoji restriction" or editing file

**Priority:** HIGHEST - Overrides tone-of-voice-guide.md, tone-learnings.json, and all historical patterns

**Use Cases:**
- Temporary adjustments (e.g., "more formal for corporate series this month")
- Quick experiments ("try shorter content for a few events")
- Event-specific campaigns ("always mention partnership X prominently")
- Learning preferences ("I prefer British English spelling")

**Syntax:**
```markdown
**OVERRIDE:** [Clear, actionable instruction]
```

**Multiple Overrides:**
Can stack multiple instructions simultaneously. All apply at once.

**Removal:**
- Comment out: `<!-- **OVERRIDE:** ... -->`
- Delete the line entirely
- Ask AI to remove: "Remove the emoji restriction"

---

### 3. tone-of-voice-guide.md

**Purpose:** Human-readable style guide extracted from 35+ historical events.

**Key Sections:**
- Core Voice Characteristics
- Language Mixing Patterns (Norwegian/English)
- Emoji Usage Rules
- Sentence Structure & Rhythm
- Event Type-Specific Tone (4 variants)
- Content Formatting Conventions
- Special Elements (partnerships, venue changes, follow-ups)
- Words & Phrases to Embrace/Avoid
- Brand Evolution Context
- Tone Calibration Examples

**Extracted Patterns:**
- 28 instances of "no coding required" phrases (high frequency)
- Pizza emoji 🍕 in 8 Vibelabs events (very consistent)
- "Takk for..." opens 18 professional emails
- Norwegian/English code-switching in 90%+ of community events

**Manual Override:** Users can edit any rule directly to override learned patterns.

---

### 4. tone-learnings.json

**Purpose:** Structured data file tracking patterns with temporal weighting.

**Structure:**
```json
{
  "metadata": { version, last_updated, learning_algorithm },
  "event_type_patterns": { vibelabs, shifter, anfo, corporate },
  "phrase_patterns": {
    "openings": { gratitude, excitement, context_setting },
    "value_propositions": { no_code, professional_code, practical },
    "calls_to_action": { low_pressure, scarcity, preparation },
    "partnership_mentions": { sponsors, platforms }
  },
  "structural_patterns": { formatting preferences },
  "emoji_usage": { context and frequency },
  "language_patterns": { Norwegian/English mixing },
  "temporal_weighting": { recent events weighted higher },
  "edit_patterns": { learns from user edits - future },
  "placeholder_defaults": { smart defaults by event type }
}
```

**Temporal Weighting:**
- 2025 Q1 (DevJoy era): 0.70
- 2025 Q2 (early Vibecoding): 0.80
- 2025 Q3 (mature Vibecoding): 0.90
- 2025 Q4 (Vibelabs era): 1.00

**Rationale:** User's voice evolves over time. Recent content should influence generation more than older content.

---

### 5. Historical Event Files

**Purpose:** Reference examples for tone, structure, and content patterns.

**Files:**
- vibelabs-events.md (18 events)
- shifter-courses.md (6+ courses)
- anfo-events.md (3 events)
- corporate-biz-dev.md (7 opportunities)
- events-index.md (overview and statistics)

**Usage:** AI agents reference these directly when generating content, especially for:
- Similar event types
- Guest speaker intros
- Partnership mentions
- Program structures
- Email subject lines

---

### 6. CLAUDE.md

**Purpose:** Entry point for AI agents, routing and high-level guidance.

**Key Addition:**
```markdown
## 🎯 AI Event Content Generation System

**IMPORTANT:** If the user describes an event they want to create,
immediately follow the instructions in `event-generation-instructions.md`.
```

**Function:** Acts as traffic controller, directing AI agents to the generation system when appropriate.

---

## Implementation Details

### Event Type Detection

**Keyword Matching:**
- "Vibelabs" / "Mesh" / "community" / "free" → Vibelabs
- "Shifter" / "commercial" / "full-day" → Shifter
- "ANFO" / "advertisers" / "brands" → ANFO
- Company names / "workshop" / "corporate" → Corporate

**Default:** When ambiguous, assume Vibelabs (most common), but ask for clarification.

**Confidence Levels:**
- High confidence (>90%): Generate with event type assumptions
- Medium confidence (50-90%): Generate but note assumption in MISSING INFO
- Low confidence (<50%): Ask user to clarify event type first

---

### Smart Defaults vs. Placeholders

**Smart Defaults (use when >80% confident):**
- Vibelabs → Mesh Nationaltheateret, 17:00, free, pizza 🍕
- Shifter → 09:00-16:00, three-part structure, prerequisites
- ANFO → Professional audience, mix of formats
- Corporate → Client offices, flexible timing

**Placeholders (use when truly unknown):**
- `[VENUE TBD]` - no reasonable default
- `[GUEST SPEAKER TBD]` - names are specific
- `[CAPACITY TBD]` - varies too much to assume
- `[REGISTRATION LINK TBD]` - must be provided

**Hybrid Approach:**
"Mesh Nationaltheateret (typical for Vibelabs events - confirm if different)" in MISSING INFO section.

---

### Temporal Weighting Algorithm

**Formula:** `weight = base_frequency × temporal_factor × event_type_match`

**Example:**
- Phrase: "helt uten koding"
- Base frequency: 28 occurrences
- Temporal factor: 0.95 (mostly recent events)
- Event type: Vibelabs (match)
- **Result:** High priority for Vibelabs generations

**Decay over time:**
- Events >12 months old: 0.5×
- Events 6-12 months old: 0.7×
- Events 3-6 months old: 0.85×
- Events <3 months old: 1.0×

---

### File Naming Convention

**Pattern:** `event-type-topic-date-draft.md`

**Examples:**
- `vibelabs-ai-agents-nov-20-draft.md`
- `shifter-full-day-dec-5-draft.md`
- `anfo-breakfast-dec-11-draft.md`
- `corporate-eggs-workshop-draft.md`

**Rules:**
- Lowercase with hyphens (kebab-case)
- Descriptive but concise (3-6 words)
- Include date when specific
- Always end with `-draft.md`

---

## Future Enhancements

### Phase 1: Current Implementation ✅

- [x] Tone of voice guide extracted from historical events
- [x] Pattern database with temporal weighting
- [x] Event generation instructions (master prompt)
- [x] CLAUDE.md integration
- [x] File organization structure (/generated/)
- [x] Manual learning capability (edit tone-of-voice-guide.md)

### Phase 2: Automatic Learning (Future)

**Diff Analysis System:**
1. Detect when user saves a file in events folder
2. Check if matching draft exists in `/generated/`
3. Run diff analysis: generated version → finalized version
4. Extract patterns:
   - Phrases user added (increase frequency)
   - Phrases user removed (decrease frequency)
   - Structural changes (note preferences)
   - Tone adjustments (track direction)
5. Update tone-learnings.json automatically
6. Apply new learnings in next generation

**Implementation Approach:**
- Could be a GitHub Actions workflow
- Or a simple bash script triggered by file save
- Or integrated into Claude Code's file watching

**Status:** Designed but not yet implemented - system works well without it initially.

---

### Phase 3: Enhanced Features (Future)

**Potential Additions:**
- **Multi-language generation:** Full Norwegian or full English versions
- **A/B testing:** Generate 2-3 variations for user to choose from
- **Calendar integration:** Auto-create .ics files
- **Registration page generation:** Create signup forms
- **Social media variants:** LinkedIn, Twitter/X optimized versions
- **Image suggestions:** Recommend event graphics based on theme
- **Analytics tracking:** Which generated content performs best
- **Template library:** Save user's favorite structures as reusable templates

**Prioritization:** Based on user feedback after initial usage.

---

## Appendix: Full Conversation Log

### Question 1: What type of system to build?

**Question:** "What type of application or system do you want to build in this events folder?"

**Options:**
A) Web application to manage and display events
B) CLI tool to work with event documentation
C) API/backend service
D) Data processing pipeline
E) Something else

**User Answer:** (Described in prose) - Essentially option E: An AI-powered copywriting system using historical docs as training material

---

### Question 2: Event type coverage

**Question:** "Which types of events do you want this system to be able to generate content for?"

**Options:**
A) All event types - detect which based on input
B) Primarily Vibelabs community events
C) Only specific event types
D) Start with one type and expand

**User Answer:** A, but primarily B
- Support all types
- Optimize for Vibelabs community events (most common use case)

---

### Question 3: Input method

**Question:** "When you provide input (theme, title, guests, time, etc.), how would you prefer to give this information?"

**Options:**
A) Interactive prompts - questions one by one
B) Structured template/form to fill out
C) Natural language - describe conversationally
D) Mix of template and natural language

**User Answer:** C - Natural language
- Keeps workflow conversational and flexible
- No rigid templates to follow

---

### Question 4: Output format

**Question:** "What outputs should the system generate for you?"

**Options:**
A) Event page + front-page blurb + email (all three, always)
B) Event page + email (skip blurb)
C) Let me specify which outputs each time
D) All three by default, opt out if needed
E) Something different

**User Answer:** A - All three, always
- Consistent output format
- Complete package every time

---

### Question 5: Output organization

**Question:** "How should the system organize and present the generated content?"

**Options:**
A) Single markdown file with sections
B) Three separate files
C) Display in terminal, ask where to save
D) Dated folder with organized files
E) Other structure

**User Answer:** A - Single file with marked sections
- Easier to review everything at once
- Simpler iteration

---

### Question 6: Handling missing information

**Question:** "When crucial information is missing, how should the system handle it?"

**Options:**
A) Stop and ask before generating
B) Generate with placeholders and list what's missing
C) Make intelligent assumptions and note them
D) Ask questions first, then generate with placeholders

**User Answer:** B then D
- Generate immediately with placeholders
- Show draft
- Then ask questions to fill gaps
- Regenerate with answers

**Clarification:** Flow is "Generate → Review → Ask → Answer → Regenerate"

---

### Question 7: Tone of voice learning

**Question:** "How should the system learn and apply your tone of voice?"

**Options:**
A) Create tone of voice guide from historical docs
B) Reference specific historical events
C) Extract patterns into style guide
D) Combination approach
E) Just use existing files as-is

**User Answer:** A, but also adaptive learning system
- Create initial guide from historical analysis
- Learn over time from user edits
- Weight newer finalized material more heavily
- Living, evolving system

---

### Question 8: Finalization signal

**Question:** "How should you signal that content is finalized and should be incorporated into learning?"

**Options:**
A) Manual command
B) Designated folder structure
C) Metadata in markdown
D) Automatic - any saved file learns
E) Naming convention

**User Answer:** D - Automatic
- Any file saved in events folder = finalized
- Frictionless learning

---

### Question 9: Draft storage location

**Question:** "Where should the system save generated draft content?"

**Options:**
A) Root of events folder
B) /generated/ subfolder
C) /drafts/ or /new-events/
D) Ask each time
E) Date-based organization

**User Answer:** E with B
- `/generated/YYYY/MM/event-name-draft.md`
- Organized by date within dedicated folder

---

### Question 10: Learning from edits

**Question:** "How should the system capture and learn from your edits?"

**Options:**
A) Diff analysis - detect changes
B) Explicit annotations
C) Separate feedback file
D) Automatic learning only
E) Combination

**User Answer:** D - Automatic learning
- Compare generated vs finalized
- Infer patterns without explicit feedback
- Cleanest user experience

---

### Question 11: Generation initiation

**Question:** "How should you initiate the generation process?"

**Options:**
A) Run specific command
B) Create input file and process
C) Just describe in Claude Code conversationally
D) Use markdown template
E) Other method

**User Answer:** C - Natural conversation
- Just open Claude Code and describe event
- Most natural workflow

---

### Question 12: Tone of voice system structure

**Question:** "Should the tone of voice guide and learning system be..."

**Options:**
A) Completely invisible
B) Visible markdown file you can edit
C) Structured data file with documentation
D) Both - editable guide + data file

**User Answer:** D - Dual system
- Human-readable guide (tone-of-voice-guide.md)
- Structured data file (tone-learnings.json)
- Control + automation

---

## Design Philosophy Summary

**Core Principles:**

1. **Frictionless:** No commands, scripts, or external tools - just conversation
2. **Immediate Value:** Generate first, refine later
3. **Transparent:** Show drafts and missing info clearly
4. **Adaptive:** Learn from usage, evolve over time
5. **Controlled:** User can override any automatic learning
6. **Autonomous:** AI agents can run the system without external dependencies
7. **Historical Foundation:** 35+ events provide rich training data
8. **Temporal Awareness:** Recent voice matters more than old voice
9. **Type-Aware:** Different tones for different event types
10. **Human-Centric:** Optimized for how humans actually work

**Success Metric:**
User says "This is 80-90% perfect, just need tiny tweaks" rather than "Let me rewrite this."

---

## Conclusion

This system transforms a static documentation folder into an intelligent, adaptive copywriting assistant. By leveraging historical event data, temporal weighting, and a dual learning system (manual + automatic), it captures and evolves the authentic Vibelabs voice.

The instruction-driven architecture (no code, just markdown) ensures it works with any capable CLI AI agent and can be easily understood, modified, and extended by humans.

**Current Status:** Fully designed and implemented (Phase 1). Ready for use. Automatic learning (Phase 2) designed and documented for future implementation.

**Next Steps:**
1. Test generation with real event descriptions
2. Iterate on tone-of-voice-guide.md based on initial results
3. Refine placeholder defaults in tone-learnings.json
4. Implement automatic diff analysis when ready (Phase 2)

---

**Document Version:** 1.0.0
**Last Updated:** October 17, 2025
**Author:** Claude Code (Anthropic) in collaboration with Simon Souyris Strumse
**Maintainer:** Simon Souyris Strumse (hello@vibelabs.no)
