'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDebounce } from '@/lib/use-debounce'
import { Check, Loader2 } from 'lucide-react'

interface ClinicalNoteSectionProps {
  consultationId: string
  title: string
  field: string
  value: string | null | undefined
  placeholder?: string
}

export function ClinicalNoteSection({
  consultationId,
  title,
  field,
  value,
  placeholder,
}: ClinicalNoteSectionProps) {
  const [text, setText] = useState(value || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const debouncedText = useDebounce(text, 1000)

  useEffect(() => {
    if (debouncedText !== (value || '')) {
      saveNote()
    }
  }, [debouncedText])

  const saveNote = async () => {
    setSaving(true)
    setSaved(false)

    try {
      const response = await fetch(`/api/consultations/${consultationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: text }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {saving && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Saving...
              </div>
            )}
            {saved && (
              <div className="flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                Saved
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder || `Enter ${title.toLowerCase()}...`}
          className="min-h-[120px] resize-y"
        />
      </CardContent>
    </Card>
  )
}
