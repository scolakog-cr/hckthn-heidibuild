'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertTriangle,
  BookOpen,
  Pill,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText
} from 'lucide-react'

interface RiskAlert {
  severity: 'high' | 'medium' | 'low'
  category: string
  title: string
  description: string
  evidence: string
  recommendation: string
}

interface ClinicalGuideline {
  condition: string
  guideline: string
  relevance: string
  keyPoints: string[]
  recommendation: string
}

interface DrugWarning {
  severity: 'high' | 'medium' | 'low'
  type: string
  drugs: string[]
  warning: string
  recommendation: string
}

interface ConsultationAnalysis {
  riskAlerts: RiskAlert[]
  clinicalGuidelines: ClinicalGuideline[]
  drugWarnings: DrugWarning[]
  suggestedActions: string[]
  documentationSuggestions?: {
    diagnosis: string
    icdCodes: string[]
    planElements: string[]
  }
}

interface ConsultationAISupportProps {
  consultationId: string
  patientName: string
  initialTranscript?: string
}

export function ConsultationAISupport({
  consultationId,
  patientName,
  initialTranscript = ''
}: ConsultationAISupportProps) {
  const [transcript, setTranscript] = useState(initialTranscript)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ConsultationAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    riskAlerts: true,
    guidelines: true,
    drugWarnings: true,
    actions: true
  })

  const analyzeTranscript = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript to analyze')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch(`/api/ai/consultation/${consultationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze transcript')
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-4">
      {/* Transcript Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Consultation Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste or enter the consultation transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {transcript.length} characters
            </p>
            <Button
              onClick={analyzeTranscript}
              disabled={isAnalyzing || !transcript.trim()}
              className="gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Transcript
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <>
          {/* Risk Alerts */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleSection('riskAlerts')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Alerts
                  {analysis.riskAlerts.length > 0 && (
                    <Badge variant="destructive">{analysis.riskAlerts.length}</Badge>
                  )}
                </CardTitle>
                {expandedSections.riskAlerts ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {expandedSections.riskAlerts && (
              <CardContent className="space-y-4">
                {analysis.riskAlerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No risk alerts identified</p>
                ) : (
                  analysis.riskAlerts.map((alert, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="font-semibold">{alert.title}</span>
                        </div>
                        <Badge variant="outline">{alert.category}</Badge>
                      </div>
                      <p className="text-sm">{alert.description}</p>
                      <div className="text-sm">
                        <span className="font-medium">Evidence: </span>
                        <span className="text-muted-foreground">{alert.evidence}</span>
                      </div>
                      <div className="text-sm bg-muted p-2 rounded">
                        <span className="font-medium">Recommendation: </span>
                        {alert.recommendation}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            )}
          </Card>

          {/* Clinical Guidelines */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleSection('guidelines')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <BookOpen className="h-5 w-5" />
                  Clinical Guidelines
                  {analysis.clinicalGuidelines.length > 0 && (
                    <Badge variant="secondary">{analysis.clinicalGuidelines.length}</Badge>
                  )}
                </CardTitle>
                {expandedSections.guidelines ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {expandedSections.guidelines && (
              <CardContent className="space-y-4">
                {analysis.clinicalGuidelines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No relevant guidelines identified</p>
                ) : (
                  analysis.clinicalGuidelines.map((guideline, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{guideline.condition}</span>
                        <Badge variant="outline">{guideline.guideline}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{guideline.relevance}</p>
                      <div className="space-y-1">
                        <span className="text-sm font-medium">Key Points:</span>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {guideline.keyPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-sm bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
                        <span className="font-medium">Recommendation: </span>
                        {guideline.recommendation}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            )}
          </Card>

          {/* Drug Warnings */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleSection('drugWarnings')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Pill className="h-5 w-5" />
                  Drug Warnings
                  {analysis.drugWarnings.length > 0 && (
                    <Badge variant="default">{analysis.drugWarnings.length}</Badge>
                  )}
                </CardTitle>
                {expandedSections.drugWarnings ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {expandedSections.drugWarnings && (
              <CardContent className="space-y-4">
                {analysis.drugWarnings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No drug warnings identified</p>
                ) : (
                  analysis.drugWarnings.map((warning, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(warning.severity)}>
                            {warning.severity.toUpperCase()}
                          </Badge>
                          <span className="font-semibold capitalize">{warning.type}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {warning.drugs.map((drug, i) => (
                          <Badge key={i} variant="outline">{drug}</Badge>
                        ))}
                      </div>
                      <p className="text-sm">{warning.warning}</p>
                      <div className="text-sm bg-orange-50 dark:bg-orange-950/30 p-2 rounded">
                        <span className="font-medium">Recommendation: </span>
                        {warning.recommendation}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            )}
          </Card>

          {/* Suggested Actions */}
          {analysis.suggestedActions && analysis.suggestedActions.length > 0 && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('actions')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Sparkles className="h-5 w-5" />
                    Suggested Actions
                  </CardTitle>
                  {expandedSections.actions ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </CardHeader>
              {expandedSections.actions && (
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.suggestedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          )}

          {/* Documentation Suggestions */}
          {analysis.documentationSuggestions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Suggested Diagnosis: </span>
                  <span className="text-sm">{analysis.documentationSuggestions.diagnosis}</span>
                </div>
                {analysis.documentationSuggestions.icdCodes.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">ICD-10 Codes: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.documentationSuggestions.icdCodes.map((code, i) => (
                        <Badge key={i} variant="outline">{code}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.documentationSuggestions.planElements.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Plan Elements: </span>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      {analysis.documentationSuggestions.planElements.map((element, i) => (
                        <li key={i}>{element}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
