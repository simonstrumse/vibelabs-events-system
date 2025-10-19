# Vibelabs Event Generation System

AI-powered event content generation system that creates event pages, front-page blurbs, and email announcements in authentic Vibelabs tone of voice.

## System Overview

This is a **unified system** that works in two modes:

1. **CLI Mode** (via Claude Code) - Free, instant, local generation
2. **Web App** (Next.js on Vercel) - Guided interface with learning system

Both modes use the **same documentation**, **same tone of voice**, and **same learning system** - ensuring consistent outputs.

---

## Repository Structure

```
vibelabs-events-system/
├── docs/                          # Documentation (Single Source of Truth)
│   ├── tone-of-voice-guide.md     # Style guide (manually editable)
│   ├── tone-overrides.md          # Active tone instructions (highest priority)
│   ├── tone-learnings.json        # Automated pattern learnings
│   ├── event-generation-instructions.md  # Master prompt for AI
│   ├── vibelabs-events.md         # Historical Vibelabs events
│   ├── shifter-courses.md         # Shifter course documentation
│   ├── anfo-events.md             # ANFO partnership events
│   └── corporate-biz-dev.md       # Corporate training events
│
├── generated/                     # Draft storage (organized by date)
│   └── YYYY/MM/
│       └── event-name-draft.md
│
├── web/                           # Next.js Web Application
│   ├── app/                       # Next.js app directory
│   │   ├── page.tsx               # Home page (event form)
│   │   ├── preview/[id]/          # Preview generated content
│   │   ├── edit/[id]/             # Edit and finalize
│   │   └── api/                   # API routes
│   │       ├── generate-event/    # Main generation endpoint
│   │       ├── regenerate/        # Iteration endpoint
│   │       └── learn-from-edit/   # Learning system endpoint
│   │
│   ├── components/                # React components
│   ├── lib/                       # Utilities and integrations
│   │   ├── types.ts               # TypeScript types
│   │   ├── docs-reader.ts         # Read docs from filesystem
│   │   ├── claude-api.ts          # Claude API integration
│   │   └── kv-storage.ts          # Vercel KV for sessions
│   │
│   └── package.json
│
├── CLAUDE.md                      # Instructions for Claude Code (CLI mode)
└── README.md                      # This file
```

---

## Quick Start

### CLI Mode (Claude Code)

1. Open this folder in Claude Code
2. Describe your event naturally:
   ```
   "I want to do a Vibelabs event on November 20th about AI agents,
   with a guest speaker from Lovable, at Mesh Youngstorget at 17:00"
   ```
3. Claude Code reads the docs and generates content
4. Content saved to `generated/YYYY/MM/event-draft.md`
5. Edit and finalize - system learns from your changes

### Web App Mode

#### Local Development

1. **Install dependencies:**
   ```bash
   cd web
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...

   # Optional: Vercel KV (for session storage)
   KV_URL=...
   KV_REST_API_URL=...
   KV_REST_API_TOKEN=...
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

#### Deploy to Vercel

1. **Push to GitHub** (already done!)

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo
   - Set **Root Directory** to `web/`
   - Add environment variables:
     - `ANTHROPIC_API_KEY` (required)
     - Vercel KV will be auto-configured if you add it

3. **Add Vercel KV (optional but recommended):**
   - In Vercel project → Storage → Create Database → KV
   - Environment variables auto-added

4. **Deploy!**

---

## Features

### Phase 1: MVP (✅ Complete)
- [x] Event generation from natural language
- [x] All 4 event types supported (Vibelabs, Shifter, ANFO, Corporate)
- [x] Three outputs: Event page + Blurb + Email
- [x] Tone of voice matching from historical examples
- [x] Download as markdown

### Phase 2: Iteration (✅ Complete)
- [x] Missing information detection
- [x] Clarifying questions system
- [x] Regenerate with user answers
- [x] Inline content editing
- [x] Vercel KV session storage

### Phase 3: Learning System (✅ Complete)
- [x] AI-powered diff analysis
- [x] Automatic tone learnings updates
- [x] Pattern extraction from edits
- [x] Temporal weighting (recent edits matter more)
- [x] Tone overrides system (quick style changes)

---

## How the System Works

### 1. Tone of Voice System (Priority Order)

```
1. tone-overrides.md        (HIGHEST - active instructions)
   ↓
2. tone-of-voice-guide.md   (Manual style guide)
   ↓
3. tone-learnings.json      (Automated pattern learning)
   ↓
4. Historical events        (Reference examples)
```

**Example: Quick Style Change**

User says: *"Tone down the use of emojis drastically"*

System updates `tone-overrides.md`:
```markdown
**OVERRIDE:** Use emojis very sparingly - maximum 1 per entire output
```

All future generations apply this rule automatically.

### 2. Generation Workflow

```
User describes event
    ↓
Read docs (instructions, tone guides, examples)
    ↓
Call Claude API with all context
    ↓
Claude generates: Event Page + Blurb + Email
    ↓
Show preview with missing info & questions
    ↓
User answers → Regenerate → Iterate
    ↓
User edits → Finalize
    ↓
AI analyzes edits → Updates tone-learnings.json
    ↓
Next generation is better!
```

### 3. Learning System (Phase 3)

When you finalize content:
1. System compares your draft vs final version
2. Claude analyzes the differences
3. Extracts patterns:
   - Phrases you added → increase frequency
   - Phrases you removed → decrease frequency
   - Tone shifts → note preferences
4. Updates `tone-learnings.json` automatically
5. Future generations match your style better

---

## API Routes

### `POST /api/generate-event`
Generate initial event content

**Request:**
```json
{
  "eventType": "vibelabs",
  "description": "Event on Nov 20th about AI agents...",
  "metadata": {
    "date": "2025-11-20",
    "time": "17:00",
    "venue": "Mesh Youngstorget"
  }
}
```

**Response:**
```json
{
  "id": "abc123",
  "event_page": "Markdown content...",
  "front_page_blurb": "Short blurb...",
  "email": {
    "subject": "Subject line",
    "body": "Email body..."
  },
  "missing_info": ["capacity", "registration link"],
  "questions": ["What's the capacity?"],
  "confidence_score": 0.85
}
```

### `POST /api/regenerate`
Regenerate with user answers

**Request:**
```json
{
  "previous_id": "abc123",
  "user_answers": {
    "capacity": "150",
    "registration": "https://..."
  }
}
```

### `POST /api/learn-from-edit`
Update learnings from user edits (Phase 3)

**Request:**
```json
{
  "draft_id": "abc123",
  "final_content": {
    "event_page": "Final edited version...",
    "blurb": "...",
    "email": "..."
  },
  "event_type": "vibelabs"
}
```

**Response:**
```json
{
  "learnings_updated": true,
  "patterns_discovered": ["Increased use of casual tone", "..."],
  "next_generation_improvements": ["Future events will..."]
}
```

---

## Cost Estimation

### Development Time
- Phase 1 (MVP): 6-8 hours ✅
- Phase 2 (Iteration): 4-6 hours ✅
- Phase 3 (Learning): 6-8 hours ✅
- **Total:** ~20 hours

### Operational Costs (Monthly)
- **Vercel Hosting:** Free (Hobby) or $20 (Pro)
- **Vercel KV:** Free tier (256 MB) sufficient for most use
- **Claude API:**
  - Sonnet-4: $3/M input tokens, $15/M output tokens
  - ~$0.03 per event generation
  - **100 events/month:** ~$3
  - **1000 events/month:** ~$30

**Total:** $3-50/month depending on usage

---

## Configuration

### Environment Variables

**Required:**
- `ANTHROPIC_API_KEY` - Your Anthropic API key

**Optional:**
- `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` - Vercel KV (auto-configured in Vercel)
- `GITHUB_TOKEN` - For committing learnings to GitHub (future feature)

### Customizing Tone

**Quick changes (temporary):**
Edit `tone-overrides.md`:
```markdown
**OVERRIDE:** Use maximum 1 emoji per output
**OVERRIDE:** Maximum 200 words for event pages
```

**Permanent changes:**
Edit `tone-of-voice-guide.md` directly

**Let the system learn:**
Just use it! Edit the generated content and the system learns your preferences automatically.

---

## Development

### Tech Stack
- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **AI:** Claude Sonnet 4 (Anthropic)
- **Storage:** Vercel KV (Redis)
- **Deployment:** Vercel

### Local Development

```bash
# Install dependencies
cd web && npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Project Structure

See "Repository Structure" section above for complete overview.

---

## Troubleshooting

### "Failed to read documentation files"
- Ensure you're running from the correct directory
- Check that all `.md` files exist in the root

### "Failed to generate event content"
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check API key has sufficient credits
- Review Claude API status

### Preview page shows "Content not found"
- Vercel KV might not be configured
- Content expires after 7 days
- Generate new content from home page

### Learning system not updating
- Check write permissions for `tone-learnings.json`
- Verify Claude API is accessible
- Review API route logs in Vercel

---

## Future Enhancements

Potential additions (not yet implemented):

- [ ] Multi-language generation (full Norwegian / full English)
- [ ] A/B testing (generate 2-3 variations)
- [ ] Calendar integration (.ics file generation)
- [ ] Social media variants (LinkedIn, Twitter optimized)
- [ ] Template library (save favorite structures)
- [ ] Analytics dashboard (track what works best)
- [ ] Authentication (multi-user support)
- [ ] GitHub auto-commit for learnings

---

## Contributing

This is a private project for Vibelabs, but if you're working on it:

1. Make changes in a feature branch
2. Test thoroughly locally
3. Create a PR with clear description
4. Deploy to Vercel preview
5. Merge when approved

---

## License

Private - Vibelabs Internal Use Only

---

## Support

Questions? Contact:
- **Simon Souyris Strumse**
- Email: hello@vibelabs.no
- GitHub: [@simonstrumse](https://github.com/simonstrumse)

---

**Built with Claude Code** 🤖
