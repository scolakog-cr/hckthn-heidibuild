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
import { Pill } from 'lucide-react'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  route?: string | null
  prescribedBy?: string | null
  startDate: Date | string
  endDate?: Date | string | null
  status: string
  instructions?: string | null
  refills?: number | null
}

interface MedicationsListProps {
  medications: Medication[]
}

export function MedicationsList({ medications }: MedicationsListProps) {
  const activeMeds = medications.filter((m) => m.status === 'Active')
  const inactiveMeds = medications.filter((m) => m.status !== 'Active')

  if (medications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No medications on record</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activeMeds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Active Medications ({activeMeds.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Prescribed By</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Refills</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeMeds.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{med.name}</p>
                        {med.instructions && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {med.instructions}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>{med.route || 'Oral'}</TableCell>
                    <TableCell>{med.prescribedBy || 'N/A'}</TableCell>
                    <TableCell>{formatDate(med.startDate)}</TableCell>
                    <TableCell>
                      {med.refills !== null && med.refills !== undefined
                        ? `${med.refills} remaining`
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {inactiveMeds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inactive/Discontinued Medications ({inactiveMeds.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inactiveMeds.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{med.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(med.startDate)}</TableCell>
                    <TableCell>{formatDate(med.endDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
