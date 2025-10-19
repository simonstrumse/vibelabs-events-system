'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()

  const [content, setContent] = useState<any>(null)
  const [eventPage, setEventPage] = useState('')
  const [blurb, setBlurb] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [learning, setLearning] = useState(false)
  const [learnResult, setLearnResult] = useState<any>(null)
  const [downloadOnly, setDownloadOnly] = useState(false)

  // Load content from KV
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/draft/${resolvedParams.id}`)
        if (response.ok) {
          const data = await response.json()
          setContent(data)
          setEventPage(data.event_page)
          setBlurb(data.front_page_blurb)
          setEmailSubject(data.email.subject)
          setEmailBody(data.email.body)
        }
      } catch (err) {
        console.error('Failed to load content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [resolvedParams.id])

  const handleSaveAndLearn = async () => {
    setLearning(true)
    try {
      const response = await fetch('/api/learn-from-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft_id: resolvedParams.id,
          final_content: {
            event_page: eventPage,
            blurb,
            email: emailBody,
          },
          event_type: content?.event_type || 'vibelabs',
        }),
      })

      if (!response.ok) throw new Error('Failed to learn from edits')

      const result = await response.json()
      setLearnResult(result)

      // Download the final content
      handleDownload()

      // Redirect to home after 3 seconds
      setTimeout(() => router.push('/'), 3000)
    } catch (error) {
      console.error('Learning error:', error)
    } finally {
      setLearning(false)
    }
  }

  const handleDownload = () => {
    const markdown = `# Event Content - Final Version

## EVENT PAGE CONTENT

${eventPage}

## FRONT-PAGE BLURB

${blurb}

## EMAIL ANNOUNCEMENT

**Subject:** ${emailSubject}

${emailBody}
`

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `event-final-${resolvedParams.id}.md`
    a.click()
    URL.revokeObjectURL(url)

    if (downloadOnly) {
      setTimeout(() => router.push('/'), 500)
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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <button
          onClick={() => router.push(`/preview/${resolvedParams.id}`)}
          className="text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to preview
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Event Content</h1>
        <p className="mt-2 text-sm text-gray-600">
          Make final edits and save. The system will learn from your changes to improve future generations.
        </p>
      </div>

      {learnResult && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Learning Complete!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your edits have been analyzed and the system has been updated.</p>
                <p className="mt-1">Redirecting to home...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Event Page Editor */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Event Page Content</h2>
          <textarea
            value={eventPage}
            onChange={(e) => setEventPage(e.target.value)}
            rows={12}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
            placeholder="Edit your event page content here..."
          />
        </div>

        {/* Blurb Editor */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Front-Page Blurb</h2>
          <textarea
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
            placeholder="Edit your blurb here..."
          />
        </div>

        {/* Email Editor */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Email Announcement</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Line
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Email subject..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Body
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={10}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                placeholder="Edit your email body here..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
          <div className="text-sm text-gray-600">
            <p className="font-medium">What happens when you save?</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Your edits are analyzed to extract patterns</li>
              <li>The tone-learnings.json file is updated</li>
              <li>Future generations will match your style better</li>
              <li>Content is downloaded as markdown</li>
            </ul>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setDownloadOnly(true)
                handleDownload()
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Download Only
            </button>
            <button
              onClick={handleSaveAndLearn}
              disabled={learning || !eventPage}
              className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {learning ? 'Learning...' : 'Save & Learn from Edits'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
