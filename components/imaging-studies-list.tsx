import { formatDate } from '@/lib/date-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scan, FileImage } from 'lucide-react'

interface ImagingStudy {
  id: string
  studyType: string
  bodyPart: string
  orderedBy?: string | null
  performedDate: Date | string
  findings?: string | null
  impression?: string | null
  status: string
  imageUrl?: string | null
  radiologist?: string | null
}

interface ImagingStudiesListProps {
  imagingStudies: ImagingStudy[]
}

export function ImagingStudiesList({ imagingStudies }: ImagingStudiesListProps) {
  if (imagingStudies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No imaging studies available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      Completed: 'secondary',
      Reviewed: 'default',
      Scheduled: 'outline',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const getStudyIcon = (studyType: string) => {
    const icons: Record<string, typeof Scan> = {
      'X-Ray': FileImage,
      'CT': Scan,
      'MRI': Scan,
      'Ultrasound': Scan,
      'Echocardiogram': Scan,
      'Mammogram': FileImage,
    }
    const Icon = icons[studyType] || Scan
    return <Icon className="h-5 w-5" />
  }

  return (
    <div className="space-y-4">
      {imagingStudies.map((study) => (
        <Card key={study.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStudyIcon(study.studyType)}
                  {study.studyType} - {study.bodyPart}
                </CardTitle>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Date: {formatDate(study.performedDate)}</span>
                  {study.orderedBy && <span>Ordered by: {study.orderedBy}</span>}
                  {study.radiologist && <span>Radiologist: {study.radiologist}</span>}
                </div>
              </div>
              {getStatusBadge(study.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {study.findings && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Findings:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {study.findings}
                </p>
              </div>
            )}
            {study.impression && (
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-semibold text-sm mb-2">Impression:</h4>
                <p className="text-sm leading-relaxed">{study.impression}</p>
              </div>
            )}
            {study.imageUrl && (
              <div>
                <a
                  href={study.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <FileImage className="h-4 w-4" />
                  View Images
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
