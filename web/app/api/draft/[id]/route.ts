import { NextRequest, NextResponse } from 'next/server'
import { getDraft } from '@/lib/kv-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const draft = await getDraft(resolvedParams.id)

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(draft)
  } catch (error) {
    console.error('Error fetching draft:', error)
    return NextResponse.json(
      { error: 'Failed to fetch draft', details: String(error) },
      { status: 500 }
    )
  }
}
