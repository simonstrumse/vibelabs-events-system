'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EventType, EventMetadata } from '@/lib/types'

export default function Home() {
  const router = useRouter()
  const [eventType, setEventType] = useState<EventType>('vibelabs')
  const [description, setDescription] = useState('')
  const [showOptional, setShowOptional] = useState(false)
  const [metadata, setMetadata] = useState<EventMetadata>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/generate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          description,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      const data = await response.json()
      router.push(`/preview/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const updateMetadata = (key: string, value: string) => {
    setMetadata((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Generate Event Content
        </h1>
        <p className="text-lg text-gray-600">
          Describe your event and let AI create the event page, blurb, and email announcement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
        {/* Event Type */}
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
            Event Type
          </label>
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as EventType)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          >
            <option value="vibelabs">Vibelabs Community Event</option>
            <option value="shifter">Shifter Course</option>
            <option value="anfo">ANFO Event</option>
            <option value="corporate">Corporate Workshop</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Event Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
            placeholder="E.g., I want to do a Vibelabs event on November 20th about AI agents, with a guest speaker from Lovable, at Mesh Youngstorget at 17:00"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
          <p className="mt-2 text-sm text-gray-500">
            Describe your event in natural language. Include as much or as little detail as you want.
          </p>
        </div>

        {/* Optional Fields Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showOptional ? '− Hide' : '+ Add'} optional fields
          </button>
        </div>

        {/* Optional Metadata Fields */}
        {showOptional && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  onChange={(e) => updateMetadata('date', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  onChange={(e) => updateMetadata('time', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
            </div>

            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <input
                type="text"
                id="venue"
                onChange={(e) => updateMetadata('venue', e.target.value)}
                placeholder="e.g., Mesh Nationaltheateret"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                onChange={(e) => updateMetadata('capacity', e.target.value)}
                placeholder="e.g., 150"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label htmlFor="registrationLink" className="block text-sm font-medium text-gray-700 mb-2">
                Registration Link
              </label>
              <input
                type="url"
                id="registrationLink"
                onChange={(e) => updateMetadata('registrationLink', e.target.value)}
                placeholder="https://..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !description}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Event Content'}
          </button>
        </div>
      </form>
    </div>
  )
}
