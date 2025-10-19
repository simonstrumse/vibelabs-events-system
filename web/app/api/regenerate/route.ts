import { NextRequest, NextResponse } from 'next/server'
import { getDraft, saveDraft } from '@/lib/kv-storage'
import { readDocsContext } from '@/lib/docs-reader'
import { generateEventContent } from '@/lib/claude-api'
import type { RegenerateRequest } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RegenerateRequest

    if (!body.previous_id) {
      return NextResponse.json(
        { error: 'Missing required field: previous_id' },
        { status: 400 }
      )
    }

    // Get the previous draft
    const previousDraft = await getDraft(body.previous_id)
    if (!previousDraft || !previousDraft.raw_input) {
      return NextResponse.json(
        { error: 'Previous draft not found' },
        { status: 404 }
      )
    }

    // Merge user answers into metadata
    const updatedInput = {
      ...previousDraft.raw_input,
      metadata: {
        ...previousDraft.raw_input.metadata,
        ...body.user_answers,
      },
    }

    // Read documentation context
    const docsContext = await readDocsContext(previousDraft.event_type)

    // Regenerate with updated information
    const regeneratedContent = await generateEventContent(
      updatedInput,
      docsContext,
      body.user_answers
    )

    // Update the existing draft
    const updated = {
      ...previousDraft,
      event_page: regeneratedContent.event_page || previousDraft.event_page,
      front_page_blurb: regeneratedContent.front_page_blurb || previousDraft.front_page_blurb,
      email: regeneratedContent.email || previousDraft.email,
      missing_info: regeneratedContent.missing_info || [],
      confidence_score: regeneratedContent.confidence_score || previousDraft.confidence_score,
      questions: regeneratedContent.questions || [],
      raw_input: updatedInput,
    }

    await saveDraft(updated)

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error in /api/regenerate:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate event content', details: String(error) },
      { status: 500 }
    )
  }
}
