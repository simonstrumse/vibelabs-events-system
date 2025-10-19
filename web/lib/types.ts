export type EventType = 'vibelabs' | 'shifter' | 'anfo' | 'corporate'

export interface EventMetadata {
  date?: string
  time?: string
  venue?: string
  guests?: string[]
  capacity?: number
  registrationLink?: string
  partnerships?: string[]
  [key: string]: any
}

export interface EventInput {
  eventType: EventType
  description: string
  metadata?: EventMetadata
}

export interface GeneratedContent {
  id: string
  generated_at: string
  event_type: EventType
  event_page: string
  front_page_blurb: string
  email: {
    subject: string
    body: string
  }
  missing_info: string[]
  confidence_score: number
  questions: string[]
  raw_input?: EventInput
}

export interface RegenerateRequest {
  previous_id: string
  user_answers: Record<string, any>
  edits?: {
    event_page?: string
    blurb?: string
    email?: string
  }
}

export interface LearnFromEditRequest {
  draft_id: string
  draft_content: {
    event_page: string
    blurb: string
    email: string
  }
  final_content: {
    event_page: string
    blurb: string
    email: string
  }
  event_type: EventType
}

export interface LearnFromEditResponse {
  learnings_updated: boolean
  patterns_discovered: string[]
  next_generation_improvements: string[]
}

export interface DocsContext {
  instructions: string
  toneGuide: string
  toneOverrides: string
  toneLearnings: any
  historicalExamples: {
    vibelabs?: string
    shifter?: string
    anfo?: string
    corporate?: string
  }
}
