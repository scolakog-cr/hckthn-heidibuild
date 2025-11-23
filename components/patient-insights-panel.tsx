'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Loader2, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

interface PatientInsightsPanelProps {
  patientId: string
  patientName: string
}

export function PatientInsightsPanel({ patientId, patientName }: PatientInsightsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [consultationCount, setConsultationCount] = useState<number>(0)

  const fetchInsights = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/ai/patient/${patientId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch insights')
      }

      setAnalysis(data.analysis)
      setConsultationCount(data.consultationCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = () => {
    if (!isOpen && !analysis && !isLoading) {
      fetchInsights()
    }
    setIsOpen(!isOpen)
  }

  const handleRefresh = () => {
    fetchInsights()
  }

  // Parse markdown-style headers and format them
  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Main headers (## Header)
      if (line.startsWith('## ')) {
        return (
          <h3 key={index} className="font-bold text-lg mt-6 mb-3 text-primary border-b pb-2">
            {line.replace('## ', '')}
          </h3>
        )
      }
      // Sub headers (### Header)
      if (line.startsWith('### ')) {
        return (
          <h4 key={index} className="font-semibold mt-4 mb-2">
            {line.replace('### ', '')}
          </h4>
        )
      }
      // Bold text (**text**)
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={index} className="my-1">
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        )
      }
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <p key={index} className="ml-4 my-1 text-muted-foreground">
            {line}
          </p>
        )
      }
      // Numbered lists
      if (line.trim().match(/^\d+\./)) {
        return (
          <p key={index} className="ml-4 my-1">
            {line}
          </p>
        )
      }
      // Regular text
      if (line.trim()) {
        return <p key={index} className="my-1">{line}</p>
      }
      return null
    })
  }

  return (
    <Card className="mb-6 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle className="text-lg">Pre-Consultation AI Briefing</CardTitle>
            {consultationCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {consultationCount} visits analyzed
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            )}
            <Button
              onClick={handleToggle}
              variant={isOpen ? "default" : "outline"}
              size="sm"
              className="gap-2"
            >
              {isOpen ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Insights
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Prepare for Visit
                </>
              )}
            </Button>
          </div>
        </div>
        {!isOpen && (
          <p className="text-sm text-muted-foreground mt-2">
            Get AI-powered insights analyzing {patientName}'s complete medical history before your consultation
          </p>
        )}
      </CardHeader>

      {isOpen && (
        <CardContent>
          {isLoading && !analysis && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <p className="text-sm text-muted-foreground">
                  Analyzing {patientName}'s complete medical history...
                </p>
                <p className="text-xs text-muted-foreground">
                  Looking for patterns across all visits
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-destructive py-4">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {analysis && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="text-sm leading-relaxed">
                {formatAnalysis(analysis)}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
