'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react'

export function AIInsightsButton({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
  return (
    <Button
      onClick={onClick}
      variant={isOpen ? "default" : "outline"}
      className="gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {isOpen ? 'Hide Insights' : 'AI Insights'}
    </Button>
  )
}

export function AIInsightsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch insights')
      }

      setAnalysis(data.analysis)
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

  return (
    <div className="w-full">
      {/* Button in header */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleToggle}
          variant={isOpen ? "default" : "outline"}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {isOpen ? 'Hide Insights' : 'AI Insights'}
        </Button>
      </div>

      {/* Expandable Panel */}
      {isOpen && (
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">AI Clinical Insights</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Today's Schedule
                </Badge>
              </div>
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
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && !analysis && (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing patient data...
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
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis.split('\n').map((line, index) => {
                    // Style numbered headers (e.g., "1. **Title**")
                    if (line.match(/^\d+\.\s*\*\*/)) {
                      return (
                        <p key={index} className="font-semibold mt-4 mb-2 text-primary">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      )
                    }
                    // Style bold text
                    if (line.startsWith('**') || line.includes('**')) {
                      return (
                        <p key={index} className="font-medium mt-3 mb-1">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      )
                    }
                    // Style bullet points
                    if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                      return (
                        <p key={index} className="ml-4 my-1 text-muted-foreground">
                          {line}
                        </p>
                      )
                    }
                    // Regular text
                    if (line.trim()) {
                      return <p key={index} className="my-1">{line}</p>
                    }
                    return null
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
