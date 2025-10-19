'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { GeneratedContent } from '@/lib/types'

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'event' | 'blurb' | 'email'>('event')
  const [regenerating, setRegenerating] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/draft/${resolvedParams.id}`)
        if (response.ok) {
          const data = await response.json()
          setContent(data)
        } else {
          setError('Content not found')
        }
      } catch (err) {
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [resolvedParams.id])

  const handleDownload = () => {
    if (!content) return

    const markdown = `# Event Content Generation
Generated: ${new Date(content.generated_at).toLocaleString()}

## EVENT PAGE CONTENT

${content.event_page}

## FRONT-PAGE BLURB

${content.front_page_blurb}

## EMAIL ANNOUNCEMENT

**Subject:** ${content.email.subject}

${content.email.body}

${content.missing_info.length > 0 ? `\n## MISSING INFORMATION\n\n${content.missing_info.map(item => `- ${item}`).join('\n')}` : ''}
`

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `event-${resolvedParams.id}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRegenerate = async () => {
    if (!content) return

    setRegenerating(true)
    try {
      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previous_id: content.id,
          user_answers: answers,
        }),
      })

      if (!response.ok) throw new Error('Failed to regenerate')

      const updated = await response.json()
      setContent(updated)
      setAnswers({})
    } catch (err) {
      setError('Failed to regenerate content')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-red-600">{error || 'Content not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to generator
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to generator
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generated Event Content</h1>
            <p className="text-sm text-gray-500 mt-1">
              Event Type: <span className="font-medium capitalize">{content.event_type}</span> |
              Confidence: <span className="font-medium">{Math.round(content.confidence_score * 100)}%</span>
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Download Markdown
            </button>
            <button
              onClick={() => router.push(`/edit/${content.id}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit & Finalize
            </button>
          </div>
        </div>
      </div>

      {/* Missing Info Alert */}
      {content.missing_info.length > 0 && (
        <div className="mb-6 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Missing Information</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  {content.missing_info.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      {content.questions.length > 0 && (
        <div className="mb-6 rounded-md bg-blue-50 p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Answer these to improve the content:</h3>
          <div className="space-y-3">
            {content.questions.map((question, index) => (
              <div key={index}>
                <label className="block text-sm text-blue-800 mb-1">{question}</label>
                <input
                  type="text"
                  value={answers[`q${index}`] || ''}
                  onChange={(e) => setAnswers({ ...answers, [`q${index}`]: e.target.value })}
                  className="w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {regenerating ? 'Regenerating...' : 'Regenerate with Answers'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('event')}
            className={`${
              activeTab === 'event'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Event Page
          </button>
          <button
            onClick={() => setActiveTab('blurb')}
            className={`${
              activeTab === 'blurb'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Front-Page Blurb
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`${
              activeTab === 'email'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Email Announcement
          </button>
        </nav>
      </div>

      {/* Content Display */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-8">
        {activeTab === 'event' && (
          <div className="markdown-preview prose prose-slate max-w-none">
            <ReactMarkdown>{content.event_page}</ReactMarkdown>
          </div>
        )}

        {activeTab === 'blurb' && (
          <div className="markdown-preview prose prose-slate max-w-none">
            <ReactMarkdown>{content.front_page_blurb}</ReactMarkdown>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
              <div className="bg-gray-50 rounded-md p-3 text-gray-900 font-medium">
                {content.email.subject}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
              <div className="markdown-preview prose prose-slate max-w-none">
                <ReactMarkdown>{content.email.body}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
