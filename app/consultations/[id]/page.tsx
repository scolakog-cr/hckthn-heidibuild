import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, formatTime, calculateDuration } from '@/lib/date-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ClinicalNoteSection } from '@/components/clinical-note-section'
import { HeidiPanel } from '@/components/heidi-panel'
import { ConsultationAISupport } from '@/components/consultation-ai-support'
import { ArrowLeft, Calendar, Clock, User, Stethoscope } from 'lucide-react'

async function getConsultation(id: string) {
  try {
    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        patient: true,
      },
    })
    return consultation
  } catch (error) {
    console.error('Error fetching consultation:', error)
    return null
  }
}

export default async function ConsultationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const consultation = await getConsultation(params.id)

  if (!consultation) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href={`/patients/${consultation.patientId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patient
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {consultation.type || 'Consultation'}
            </h1>
            <p className="text-muted-foreground">
              {consultation.patient.firstName} {consultation.patient.lastName}
            </p>
          </div>
          <Badge
            variant={
              consultation.status === 'Completed' ? 'secondary' : 'default'
            }
          >
            {consultation.status || 'Scheduled'}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consultation Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {formatDate(consultation.startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {formatTime(consultation.startTime)}
                      {consultation.endTime && (
                        <> · {calculateDuration(consultation.startTime, consultation.endTime)}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Healthcare Provider</p>
                    <p className="font-medium">{consultation.hcpId || 'Not assigned'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Stethoscope className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{consultation.type || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Clinical Notes</h2>

            <ClinicalNoteSection
              consultationId={consultation.id}
              title="Chief Complaint"
              field="chiefComplaint"
              value={consultation.chiefComplaint}
              placeholder="Primary reason for visit..."
            />

            <ClinicalNoteSection
              consultationId={consultation.id}
              title="History of Present Illness (HPI)"
              field="hpi"
              value={consultation.hpi}
              placeholder="Detailed history of the patient's current condition..."
            />

            <ClinicalNoteSection
              consultationId={consultation.id}
              title="Physical Examination"
              field="exam"
              value={consultation.exam}
              placeholder="Physical examination findings..."
            />

            <ClinicalNoteSection
              consultationId={consultation.id}
              title="Assessment"
              field="assessment"
              value={consultation.assessment}
              placeholder="Clinical assessment and diagnosis..."
            />

            <ClinicalNoteSection
              consultationId={consultation.id}
              title="Plan"
              field="plan"
              value={consultation.plan}
              placeholder="Treatment plan and recommendations..."
            />

            <ClinicalNoteSection
              consultationId={consultation.id}
              title="Follow-up Instructions"
              field="followUp"
              value={consultation.followUp}
              placeholder="Follow-up care instructions..."
            />
          </div>

          {/* AI Support Channels */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">AI Clinical Decision Support</h2>
            <ConsultationAISupport
              consultationId={consultation.id}
              patientName={`${consultation.patient.firstName} ${consultation.patient.lastName}`}
              initialTranscript={consultation.transcriptionText || ''}
            />
          </div>
        </div>

        {/* Right Sidebar - 1 column */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <HeidiPanel
              consultationId={consultation.id}
              transcriptionText={consultation.transcriptionText}
              structuredNotes={consultation.structuredNotes}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
