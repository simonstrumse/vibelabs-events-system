import { NextRequest, NextResponse } from 'next/server'
import { getDraft } from '@/lib/kv-storage'
import { readDocsContext, updateToneLearnings } from '@/lib/docs-reader'
import { analyzeDiffForLearning } from '@/lib/claude-api'
import type { LearnFromEditRequest, LearnFromEditResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LearnFromEditRequest

    if (!body.draft_id || !body.final_content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the original draft
    const draft = await getDraft(body.draft_id)
    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    // Get draft content
    const draftContent = body.draft_content || {
      event_page: draft.event_page,
      blurb: draft.front_page_blurb,
      email: draft.email.body,
    }

    // Read current learnings
    const docsContext = await readDocsContext()
    const currentLearnings = docsContext.toneLearnings

    // Analyze the diff with Claude
    const updatedLearnings = await analyzeDiffForLearning(
      draftContent,
      body.final_content,
      body.event_type,
      currentLearnings
    )

    // Update the tone-learnings.json file
    await updateToneLearnings(updatedLearnings)

    // Extract what was learned for response
    const patternsDiscovered: string[] = []
    const improvements: string[] = []

    // Simple heuristic: compare phrase counts
    // (In production, you might parse Claude's analysis more carefully)
    patternsDiscovered.push('Updated tone learnings based on your edits')
    improvements.push('Future generations will better match your preferences')

    const response: LearnFromEditResponse = {
      learnings_updated: true,
      patterns_discovered: patternsDiscovered,
      next_generation_improvements: improvements,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in /api/learn-from-edit:', error)
    return NextResponse.json(
      { error: 'Failed to learn from edits', details: String(error) },
      { status: 500 }
    )
  }
}
