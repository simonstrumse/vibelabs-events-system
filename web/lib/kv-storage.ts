import { kv } from '@vercel/kv'
import type { GeneratedContent } from './types'

const DRAFT_PREFIX = 'draft:'
const DRAFT_TTL = 86400 * 7 // 7 days

export async function saveDraft(content: GeneratedContent): Promise<void> {
  try {
    await kv.set(`${DRAFT_PREFIX}${content.id}`, content, { ex: DRAFT_TTL })
  } catch (error) {
    console.error('Error saving to KV:', error)
    // If KV is not configured, just log and continue
    // This allows local development without KV setup
  }
}

export async function getDraft(id: string): Promise<GeneratedContent | null> {
  try {
    const draft = await kv.get<GeneratedContent>(`${DRAFT_PREFIX}${id}`)
    return draft
  } catch (error) {
    console.error('Error reading from KV:', error)
    return null
  }
}

export async function deleteDraft(id: string): Promise<void> {
  try {
    await kv.del(`${DRAFT_PREFIX}${id}`)
  } catch (error) {
    console.error('Error deleting from KV:', error)
  }
}

export async function updateDraft(
  id: string,
  updates: Partial<GeneratedContent>
): Promise<void> {
  try {
    const existing = await getDraft(id)
    if (existing) {
      const updated = { ...existing, ...updates }
      await saveDraft(updated)
    }
  } catch (error) {
    console.error('Error updating draft:', error)
  }
}
