import Link from 'next/link'
import { Consultation } from '@/lib/types'
import { formatDate, formatTime, calculateDuration } from '@/lib/date-utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, User } from 'lucide-react'

interface ConsultationsTimelineProps {
  consultations: Consultation[]
}

export function ConsultationsTimeline({ consultations }: ConsultationsTimelineProps) {
  if (consultations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No consultations recorded
      </div>
    )
  }

  const getStatusColor = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500'
      case 'in progress':
        return 'bg-blue-500'
      case 'scheduled':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      {consultations.map((consultation, index) => (
        <Link key={consultation.id} href={`/consultations/${consultation.id}`}>
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(consultation.status)}`} />
                  {index < consultations.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2 flex-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {consultation.type || 'Consultation'}
                      </h3>
                      {consultation.chiefComplaint && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {consultation.chiefComplaint}
                        </p>
                      )}
                    </div>
                    <Badge variant={consultation.status === 'Completed' ? 'secondary' : 'default'}>
                      {consultation.status || 'Scheduled'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(consultation.startTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(consultation.startTime)}
                      {consultation.endTime && (
                        <> · {calculateDuration(consultation.startTime, consultation.endTime)}</>
                      )}
                    </div>
                    {consultation.hcpId && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {consultation.hcpId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
