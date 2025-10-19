import fs from 'fs'
import path from 'path'
import type { DocsContext, EventType } from './types'

// Docs are in parent directory relative to web/
const DOCS_DIR = path.join(process.cwd(), '..')

export async function readDocsContext(eventType?: EventType): Promise<DocsContext> {
  try {
    // Read core instruction files
    const instructions = fs.readFileSync(
      path.join(DOCS_DIR, 'event-generation-instructions.md'),
      'utf-8'
    )

    const toneGuide = fs.readFileSync(
      path.join(DOCS_DIR, 'tone-of-voice-guide.md'),
      'utf-8'
    )

    const toneOverrides = fs.readFileSync(
      path.join(DOCS_DIR, 'tone-overrides.md'),
      'utf-8'
    )

    const toneLearningsRaw = fs.readFileSync(
      path.join(DOCS_DIR, 'tone-learnings.json'),
      'utf-8'
    )
    const toneLearnings = JSON.parse(toneLearningsRaw)

    // Read historical examples based on event type
    const historicalExamples: Record<string, string> = {}

    if (!eventType || eventType === 'vibelabs') {
      historicalExamples.vibelabs = fs.readFileSync(
        path.join(DOCS_DIR, 'vibelabs-events.md'),
        'utf-8'
      )
    }

    if (!eventType || eventType === 'shifter') {
      historicalExamples.shifter = fs.readFileSync(
        path.join(DOCS_DIR, 'shifter-courses.md'),
        'utf-8'
      )
    }

    if (!eventType || eventType === 'anfo') {
      historicalExamples.anfo = fs.readFileSync(
        path.join(DOCS_DIR, 'anfo-events.md'),
        'utf-8'
      )
    }

    if (!eventType || eventType === 'corporate') {
      historicalExamples.corporate = fs.readFileSync(
        path.join(DOCS_DIR, 'corporate-biz-dev.md'),
        'utf-8'
      )
    }

    return {
      instructions,
      toneGuide,
      toneOverrides,
      toneLearnings,
      historicalExamples,
    }
  } catch (error) {
    console.error('Error reading docs:', error)
    throw new Error('Failed to read documentation files')
  }
}

export async function updateToneLearnings(updatedLearnings: any): Promise<void> {
  try {
    const filePath = path.join(DOCS_DIR, 'tone-learnings.json')
    fs.writeFileSync(filePath, JSON.stringify(updatedLearnings, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error updating tone learnings:', error)
    throw new Error('Failed to update tone learnings')
  }
}

export async function saveDraft(
  eventType: EventType,
  date: string,
  content: string,
  filename: string
): Promise<string> {
  try {
    // Parse date to get year and month
    const dateObj = date ? new Date(date) : new Date()
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')

    const draftDir = path.join(DOCS_DIR, 'generated', String(year), month)

    // Create directory if it doesn't exist
    if (!fs.existsSync(draftDir)) {
      fs.mkdirSync(draftDir, { recursive: true })
    }

    const filePath = path.join(draftDir, filename)
    fs.writeFileSync(filePath, content, 'utf-8')

    return filePath
  } catch (error) {
    console.error('Error saving draft:', error)
    throw new Error('Failed to save draft')
  }
}
