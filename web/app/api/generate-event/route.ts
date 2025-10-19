import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { readDocsContext } from '@/lib/docs-reader'
import { generateEventContent } from '@/lib/claude-api'
import { saveDraft } from '@/lib/kv-storage'
import type { EventInput, GeneratedContent } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EventInput

    if (!body.eventType || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType and description' },
        { status: 400 }
      )
    }

    // Read documentation context
    const docsContext = await readDocsContext(body.eventType)

    // Generate content with Claude
    const generatedContent = await generateEventContent(body, docsContext)

    // Create full response object
    const response: GeneratedContent = {
      id: nanoid(),
      generated_at: new Date().toISOString(),
      event_type: body.eventType,
      event_page: generatedContent.event_page || '',
      front_page_blurb: generatedContent.front_page_blurb || '',
      email: generatedContent.email || { subject: '', body: '' },
      missing_info: generatedContent.missing_info || [],
      confidence_score: generatedContent.confidence_score || 0.8,
      questions: generatedContent.questions || [],
      raw_input: body,
    }

    // Save to KV storage
    await saveDraft(response)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in /api/generate-event:', error)
    return NextResponse.json(
      { error: 'Failed to generate event content', details: String(error) },
      { status: 500 }
    )
  }
}
