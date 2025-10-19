# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This directory contains comprehensive event documentation for Vibelabs (formerly Vibecoding, originally DevJoy) covering February 2025 - December 2025. The documentation tracks 35+ events, courses, and workshops across multiple partnership models and formats.

**Documentation Source:** All content derived from Gmail MCP server email analysis
**Geographic Focus:** Primarily Oslo, Norway; expansion to Bergen and Sweden
**Total Reach:** 1500+ participants across all event types

---

## 🎯 AI Event Content Generation System

**IMPORTANT:** If the user describes an event they want to create (e.g., "I want to do a Vibelabs event on November 20th about AI agents"), immediately follow the instructions in `event-generation-instructions.md`.

### How It Works

This events folder includes an intelligent content generation system that creates event pages, front-page blurbs, and email announcements in the authentic Vibelabs tone of voice.

**User Experience:**
1. User describes event in natural language
2. System generates complete draft immediately (with placeholders for missing info)
3. System asks clarifying questions about missing details
4. User provides answers, system regenerates
5. Iterate until user is satisfied
6. User edits and saves finalized content → system learns automatically

**Key Files (Priority Order):**
- `tone-overrides.md` - **HIGHEST PRIORITY** - Active tone instructions from user
- `event-generation-instructions.md` - Master prompt document (read this to generate content)
- `tone-of-voice-guide.md` - Human-editable style guide extracted from historical events
- `tone-learnings.json` - Automated pattern tracking with temporal weighting
- `/generated/YYYY/MM/` - Where drafts are saved

**Priority System:** tone-overrides.md > tone-of-voice-guide.md > tone-learnings.json

**Event Types Supported:**
- **Vibelabs Community** (primary focus) - Free events, casual tone, pizza emoji 🍕
- **Shifter Courses** - Commercial full-day courses, structured format
- **ANFO Partnership** - Professional events for marketing leaders
- **Corporate Training** - Custom workshops, flexible format

**Output Format:**
Single markdown file with three clearly marked sections:
1. EVENT PAGE CONTENT - Full event description (200-400 words)
2. FRONT-PAGE BLURB - Promotional snippet (50-100 words)
3. EMAIL ANNOUNCEMENT - Complete email with subject line (200-300 words)

**Learning System:**
- The system learns from finalized content automatically
- Newer content weighted more heavily (temporal decay)
- Manual overrides: Edit `tone-of-voice-guide.md` directly
- Automatic pattern tracking in `tone-learnings.json`

**When User Describes an Event:**
→ Read `event-generation-instructions.md` and follow the workflow exactly
→ Check `tone-overrides.md` FIRST for active instructions
→ DO NOT ask questions first - generate immediately with smart defaults
→ Use placeholders `[ITEM TBD]` for truly unknown information
→ Reference historical events for tone and structure examples
→ Save to `/generated/YYYY/MM/event-name-draft.md`

**When User Provides Tone Instructions:**
If the user says something like:
- "Tone down the use of emojis drastically"
- "Make everything more professional"
- "Keep content concise, under 200 words"
- "Always mention our V0 partnership prominently"

→ Immediately update `tone-overrides.md` with the instruction
→ Use clear format: `**OVERRIDE:** [actionable instruction]`
→ Confirm the change with the user
→ Apply to all future generations automatically

**Examples:**
```markdown
User: "Use fewer emojis"
→ Add to tone-overrides.md: **OVERRIDE:** Use maximum 1 emoji per output

User: "Remove that emoji restriction"
→ Remove or comment out the emoji override in tone-overrides.md
```

---

## Documentation Structure

The events documentation is organized into five files:

### 1. events-index.md (Master Index)
**Purpose:** Navigation hub and high-level overview of all event documentation

**Key Sections:**
- Overall statistics and timeline distribution
- Events by type (community, commercial, association, corporate)
- Geographic and attendance metrics
- Brand evolution timeline (DevJoy → Vibecoding → Vibelabs)
- Cross-event connections and patterns
- Complete contact directory

**Use this when:** You need an overview of all events, want to understand the business model evolution, or need to find which document covers a specific event type.

### 2. vibelabs-events.md
**Coverage:** 18 self-organized free community events
**Venues:** Mesh Community (Nationaltheateret & Youngstorget, Oslo)
**Format:** Weekly courses (Spring 2025), monthly meetups (Fall 2025)

**Key Highlights:**
- Spring 2025: 8-week course series at Mesh
- Peak attendance: 250 participants (Trekanten, March 4)
- Oslo Innovation Week 2025 participation
- Platform partnerships: V0/Vercel, Databutton
- At least 3 companies emerged from these events

**Use this when:** Researching community events, understanding the free event model, or tracking Vibelabs brand development.

### 3. shifter-courses.md
**Coverage:** 6+ commercial full-day courses
**Partnership:** Shifter (Schibsted Media Group)
**Instructor:** Simon Souyris Strumse
**Locations:** Oslo, Bergen, Sweden

**Key Details:**
- Full-day intensive format (09:00-16:00)
- Participant investment: ~NOK 300+ in tools (V0, OpenAI Platform)
- Course evolution tracked: 4.8/5 → 4.4/5 ratings
- Three-part structure: Websites → Web Apps → Going Live
- Recurring feedback: Intro shortened to max 7 minutes

**Use this when:** Understanding commercial course model, curriculum development, or geographic expansion patterns.

### 4. anfo-events.md
**Coverage:** 3 events (1 completed, 2 upcoming)
**Partnership:** ANFO (Annonsørforeningen - Norwegian Advertisers)
**Audience:** Marketing/communication leaders from Norway's largest brands

**Key Events:**
- June 10, 2025: Workshop (20 participants, 12+ major brands - FREE)
- December 2, 2025: Two full-day AI-skolen courses (40 total capacity - PAID)
- December 11, 2025: AI Community breakfast (~100 participants - FREE)

**Major Brands Represented:** DNB, Storebrand, Orkla, Telenor, Lyse, Tine, Ringnes

**Use this when:** Understanding association partnerships, B2B event models, or access to corporate decision-makers.

### 5. corporate-biz-dev.md
**Coverage:** 7 opportunities (3 completed, 2 confirmed, 2 proposals)
**Sectors:** Technology, Insurance, Design, Education, Logistics
**Format:** 35-minute sessions to full-day courses

**Completed Events:**
- Posten Bring AHA! Conference (June 4) - delegated to Ainformed
- Epinova Full-Day Course (Sept 24) - 15 employees
- CMO Summit Breakout (Sept 25) - 50+ attendees

**Active Partnerships:**
- Startup Lab: Revenue-sharing model (similar to Shifter)
- BI The Village: Student/faculty event (Oct 28)
- EGGS Design: Team workshop (pricing stage)

**Use this when:** Understanding corporate training pipeline, partnership models, or lead generation from community events.

## Key Patterns & Cross-References

### Event-to-Event Pipeline
- **Community → Corporate:** Most corporate leads attend public Mesh events first
- **Partner Events → Credibility:** Association/partnership events boost reputation
- **Referral-Based Growth:** 2-4 month lead time from contact to execution

### Brand Evolution Timeline
- **February 2025:** DevJoy (email: simon@devjoy.pro)
- **March 2025:** Vibecoding (domain: vibecoding.no)
- **September 2025:** Vibelabs (domain: vibelabs.no, email: hello@vibelabs.no)

### Revenue Models
1. **Free Community:** All Vibelabs events, select ANFO events
2. **Paid Commercial:** Shifter partnership, ANFO courses, custom corporate
3. **Revenue-Sharing:** Startup Lab partnership, knowledge partner arrangements

### Common Tools Ecosystem
**Primary Stack:**
- V0.dev (main development platform)
- GitHub (version control, auth)
- OpenAI Platform (API access)

**Backend Options:**
- Firebase (Shifter, early courses)
- Supabase (advanced courses)
- Databutton (Norwegian platform, BI)

**Design Resources:**
- 21.dev, Mobbin.com, Shadcn
- Bunny.net (CDN)
- Screenshot-based inspiration

## Important Contacts

### Primary Organizer
**Simon Souyris Strumse**
- simon@devjoy.pro, hello@vibelabs.no
- +47 91 71 71 54

### Key Partnership Contacts

**Shifter (Schibsted):**
- Lucas H. Weldeghebriel (CEO) - lucas@shifter.no, +47 98644403
- Kathrine Fjære (Business Developer) - kathrine.fjaere@schibsted.com, +47 951 44 498

**ANFO:**
- Fredrik Pettersson (Teknologidirektør) - fredrik@anfo.no, +47 980 97 632

**Startup Lab:**
- Christina Wiig - christina@startuplab.no
- Per Einar Dybvik - pere@startuplab.no

**Ainformed (Delegation Partners):**
- Fredrik Øien - fredrik@ainformed.com, +47 412 63 533
- Henrik Hayes - henrik@ainformed.com, +47 401 07 775

## Working with This Documentation

### When Adding New Events
1. Determine event type (community, commercial, association, corporate)
2. Add detailed entry to appropriate category file
3. Update events-index.md with summary statistics
4. Include: date, time, location, attendance, contact info, program details
5. Preserve email metadata (dates, subjects) for reference

### Document Formatting Conventions
- **Dates:** Full format (e.g., "Tuesday, March 4, 2025")
- **Times:** 24-hour format with timezone (e.g., "15:00-18:00")
- **Email timestamps:** UTC format (e.g., "March 4, 2025 (11:48 UTC)")
- **Contact info:** Name, title, email, phone when available
- **Companies:** Include full company names and parent organizations

### Course Content Documentation
When documenting courses, include:
- Course structure and timeline
- Prerequisites (accounts, tools, equipment)
- Participant investment (fees, tool costs)
- Feedback ratings and evolution
- Key improvements based on participant feedback

### Partnership Documentation
When documenting partnerships, include:
- Partnership model (direct, revenue-sharing, etc.)
- Key contacts and their roles
- Terms discussed (even if informal)
- Reference to similar models (e.g., "similar to Shifter")
- Corporate network access details

## Notes & Context

- **TEST emails excluded:** All emails with [TEST] prefix filtered out
- **Virtual Doorbell excluded:** 24 automated emails not event-related
- **Proposals vs Confirmed:** Clearly distinguish between proposed and confirmed events
- **Geographic expansion:** Oslo hub well-established, Bergen/Sweden expansion documented
- **Feedback integration:** Course evolution tracked systematically
- **Platform flexibility:** Important to corporate clients - avoid platform lock-in

## Statistics Quick Reference

**By Type:**
- Community (Vibelabs): 18 events
- Commercial (Shifter): 6+ courses
- Association (ANFO): 3 events
- Corporate/Private: 7 opportunities

**Timeline:**
- Q1 2025: Community building (Feb-Apr)
- Q2 2025: Partnership exploration (May-Jun)
- Q3 2025: Scaling phase (Jul-Sep)
- Q4 2025: Diversification (Oct-Dec)

**Peak Metrics:**
- Largest event: 250 attendees (Trekanten)
- Highest rating: 4.8/5 (Shifter June)
- Most exclusive: 20 participants (ANFO brands)
- Estimated total reach: 1500+ unique participants
