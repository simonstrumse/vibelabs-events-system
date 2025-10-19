import Anthropic from '@anthropic-ai/sdk'
import type { EventInput, GeneratedContent, DocsContext } from './types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

function constructPrompt(
  eventInput: EventInput,
  context: DocsContext,
  previousAnswers?: Record<string, any>
): string {
  const { eventType, description, metadata } = eventInput

  let prompt = `You are an expert event copywriter for Vibelabs. Your task is to generate complete event content based on the user's description.

**IMPORTANT CONTEXT FILES TO FOLLOW:**

1. **TONE OVERRIDES (HIGHEST PRIORITY):**
${context.toneOverrides}

2. **GENERATION INSTRUCTIONS:**
${context.instructions}

3. **TONE OF VOICE GUIDE:**
${context.toneGuide}

4. **LEARNED PATTERNS:**
${JSON.stringify(context.toneLearnings, null, 2)}

5. **HISTORICAL EXAMPLES FOR ${eventType.toUpperCase()}:**
${context.historicalExamples[eventType] || 'No specific examples for this type'}

---

**USER INPUT:**

Event Type: ${eventType}
Description: ${description}

**Additional Metadata:**
${metadata ? JSON.stringify(metadata, null, 2) : 'None provided'}

${previousAnswers ? `**Previous Answers:**\n${JSON.stringify(previousAnswers, null, 2)}` : ''}

---

**YOUR TASK:**

Follow the event-generation-instructions.md workflow EXACTLY. Generate a complete event content package with three sections:

1. EVENT PAGE CONTENT (200-400 words)
2. FRONT-PAGE BLURB (50-100 words)
3. EMAIL ANNOUNCEMENT (with subject line, 200-300 words)

**OUTPUT FORMAT:**

Return your response as a JSON object with this exact structure:

\`\`\`json
{
  "event_page": "Full event page content in markdown...",
  "front_page_blurb": "Short promotional blurb...",
  "email_subject": "Email subject line",
  "email_body": "Full email content...",
  "missing_info": ["List of missing information"],
  "confidence_score": 0.85,
  "questions": ["Question 1?", "Question 2?"]
}
\`\`\`

Remember:
- Apply tone-overrides.md rules FIRST (highest priority)
- Use smart defaults from historical patterns
- Use [ITEM TBD] only when truly unknown
- Ask specific questions for missing crucial info
- Match the authentic ${eventType} voice from examples
`

  return prompt
}

function parseClaudeResponse(content: string): Partial<GeneratedContent> {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
    const jsonString = jsonMatch ? jsonMatch[1] : content

    const parsed = JSON.parse(jsonString)

    return {
      event_page: parsed.event_page || parsed.eventPage || '',
      front_page_blurb: parsed.front_page_blurb || parsed.frontPageBlurb || parsed.blurb || '',
      email: {
        subject: parsed.email_subject || parsed.emailSubject || parsed.subject || '',
        body: parsed.email_body || parsed.emailBody || parsed.body || '',
      },
      missing_info: parsed.missing_info || parsed.missingInfo || [],
      confidence_score: parsed.confidence_score || parsed.confidenceScore || 0.8,
      questions: parsed.questions || [],
    }
  } catch (error) {
    console.error('Error parsing Claude response:', error)
    console.error('Raw content:', content)

    // Fallback: treat the entire response as event page content
    return {
      event_page: content,
      front_page_blurb: '',
      email: { subject: '', body: '' },
      missing_info: ['Failed to parse structured response'],
      confidence_score: 0.5,
      questions: [],
    }
  }
}

export async function generateEventContent(
  eventInput: EventInput,
  context: DocsContext,
  previousAnswers?: Record<string, any>
): Promise<Partial<GeneratedContent>> {
  try {
    const prompt = constructPrompt(eventInput, context, previousAnswers)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0].type === 'text' ? message.content[0].text : ''

    return parseClaudeResponse(content)
  } catch (error) {
    console.error('Error calling Claude API:', error)
    throw new Error('Failed to generate event content with Claude')
  }
}

export async function analyzeDiffForLearning(
  draftContent: { event_page: string; blurb: string; email: string },
  finalContent: { event_page: string; blurb: string; email: string },
  eventType: string,
  currentLearnings: any
): Promise<any> {
  try {
    const prompt = `You are analyzing edits to event content to extract pattern learnings.

**TASK:** Compare the generated draft vs the user's final version and identify:
1. Phrases the user ADDED (these are good patterns to remember)
2. Phrases the user REMOVED (these should be used less)
3. Tone shifts (more formal/casual, emoji changes, etc.)
4. Structural preferences

**DRAFT VERSION:**

Event Page:
${draftContent.event_page}

Blurb:
${draftContent.blurb}

Email:
${draftContent.email}

---

**FINAL VERSION (user-edited):**

Event Page:
${finalContent.event_page}

Blurb:
${finalContent.blurb}

Email:
${finalContent.email}

---

**CURRENT LEARNINGS DATABASE:**
${JSON.stringify(currentLearnings, null, 2)}

---

**YOUR TASK:**

Return an UPDATED learnings JSON that incorporates these new patterns. For phrases the user added, increase their frequency. For phrases they removed, decrease frequency. Track new patterns discovered.

Return the complete updated tone-learnings.json structure with the new patterns integrated.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0].type === 'text' ? message.content[0].text : ''

    // Try to parse JSON from response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
    const jsonString = jsonMatch ? jsonMatch[1] : content

    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Error analyzing diff with Claude:', error)
    throw new Error('Failed to analyze edits for learning')
  }
}
