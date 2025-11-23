import { formatDate } from '@/lib/date-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FlaskConical, AlertCircle } from 'lucide-react'

interface LabResult {
  id: string
  testName: string
  testType: string
  orderedBy?: string | null
  performedDate: Date | string
  results: any
  status: string
  notes?: string | null
}

interface LabResultsListProps {
  labResults: LabResult[]
}

export function LabResultsList({ labResults }: LabResultsListProps) {
  if (labResults.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No lab results available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
      Completed: 'secondary',
      Abnormal: 'destructive',
      Pending: 'default',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const getResultStatusColor = (status: string) => {
    if (status === 'High' || status === 'Low') return 'text-destructive'
    if (status === 'Borderline') return 'text-yellow-600'
    return 'text-muted-foreground'
  }

  return (
    <div className="space-y-4">
      {labResults.map((lab) => (
        <Card key={lab.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  {lab.testName}
                </CardTitle>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Type: {lab.testType}</span>
                  <span>Date: {formatDate(lab.performedDate)}</span>
                  {lab.orderedBy && <span>Ordered by: {lab.orderedBy}</span>}
                </div>
              </div>
              {getStatusBadge(lab.status)}
            </div>
          </CardHeader>
          <CardContent>
            {lab.results?.tests && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Reference Range</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lab.results.tests.map((test: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>
                        {test.value} {test.unit}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {test.referenceRange}
                      </TableCell>
                      <TableCell>
                        <span className={getResultStatusColor(test.status)}>
                          {test.status}
                        </span>
                        {(test.status === 'High' || test.status === 'Low') && (
                          <AlertCircle className="h-4 w-4 inline ml-1 text-destructive" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {lab.notes && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium mb-1">Clinical Notes:</p>
                <p className="text-sm text-muted-foreground">{lab.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
