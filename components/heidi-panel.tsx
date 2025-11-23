'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Mic, FileText, Loader2 } from 'lucide-react'

interface HeidiPanelProps {
  consultationId: string
  transcriptionText?: string | null
  structuredNotes?: any
}

export function HeidiPanel({
  consultationId,
  transcriptionText,
  structuredNotes,
}: HeidiPanelProps) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'transcription' | 'notes'>('upload')

  const handleTranscribe = async () => {
    setProcessing(true)
    try {
      const response = await fetch('/api/heidi/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationId,
          audioFile: 'mock-audio-file.mp3',
        }),
      })

      if (!response.ok) throw new Error('Transcription failed')

      const data = await response.json()

      // Update consultation with transcription
      await fetch(`/api/consultations/${consultationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcriptionId: data.transcriptionId,
          transcriptionText: data.text,
        }),
      })

      router.refresh()
      setActiveTab('transcription')
    } catch (error) {
      console.error('Error transcribing:', error)
      alert('Failed to transcribe audio. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const handleGenerateNotes = async () => {
    if (!transcriptionText) {
      alert('Please transcribe audio first')
      return
    }

    setProcessing(true)
    try {
      const response = await fetch('/api/heidi/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationId,
          transcriptionText,
        }),
      })

      if (!response.ok) throw new Error('Note generation failed')

      const data = await response.json()

      // Update consultation with structured notes
      await fetch(`/api/consultations/${consultationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structuredNotes: data,
          chiefComplaint: data.sections.chiefComplaint,
          hpi: data.sections.subjective,
          exam: data.sections.objective,
          assessment: data.sections.assessment,
          plan: data.sections.plan,
          followUp: data.sections.followUp,
        }),
      })

      router.refresh()
      setActiveTab('notes')
    } catch (error) {
      console.error('Error generating notes:', error)
      alert('Failed to generate notes. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Heidi Health AI Assistant
          <Badge variant="outline" className="ml-auto">
            Mock
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="notes">Structured Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="text-center py-6 border-2 border-dashed rounded-lg">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload or record audio from consultation
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleTranscribe}
                  disabled={processing}
                  size="sm"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Audio
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleTranscribe}
                  disabled={processing}
                  variant="outline"
                  size="sm"
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Record Audio
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              This is a mock interface. Clicking will generate sample transcription.
            </p>
          </TabsContent>

          <TabsContent value="transcription" className="space-y-4 mt-4">
            {transcriptionText ? (
              <>
                <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-muted/50">
                  <pre className="text-sm whitespace-pre-wrap font-sans">
                    {transcriptionText}
                  </pre>
                </div>
                <Button
                  onClick={handleGenerateNotes}
                  disabled={processing}
                  className="w-full"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Notes...
                    </>
                  ) : (
                    'Generate Structured Notes'
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No transcription available</p>
                <p className="text-sm mt-2">Upload audio to generate transcription</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-4">
            {structuredNotes ? (
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-muted/50">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {JSON.stringify(structuredNotes, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No structured notes available</p>
                <p className="text-sm mt-2">Generate notes from transcription</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
