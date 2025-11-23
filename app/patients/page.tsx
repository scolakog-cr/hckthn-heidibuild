import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/date-utils'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NewPatientDialog } from '@/components/new-patient-dialog'
import { AIInsightsPanel } from '@/components/ai-insights-panel'

async function getPatients() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { nextAppointment: 'asc' },
      include: {
        consultations: {
          orderBy: { startTime: 'desc' },
          take: 1,
        },
      },
    })
    return patients
  } catch (error) {
    console.error('Error fetching patients:', error)
    return []
  }
}

export default async function PatientsPage() {
  const patients = await getPatients()
  const today = format(new Date(), 'EEEE, MMMM d, yyyy')

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Today's Schedule</h1>
          <p className="text-muted-foreground">
            {today} · {patients.length} appointments
          </p>
        </div>
        <NewPatientDialog />
      </div>

      <AIInsightsPanel />

      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No appointments scheduled</p>
              <NewPatientDialog />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Allergies</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {patient.nextAppointment
                        ? format(new Date(patient.nextAppointment), 'h:mm a')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/patients/${patient.id}`}
                        className="font-medium hover:underline"
                      >
                        {patient.firstName} {patient.lastName}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {patient.gender}, {formatDate(patient.dob)}
                      </p>
                    </TableCell>
                    <TableCell>
                      {patient.appointmentType ? (
                        <Badge variant={
                          patient.appointmentType === 'Urgent Care' ? 'destructive' :
                          patient.appointmentType === 'Sick Visit' ? 'default' :
                          'secondary'
                        }>
                          {patient.appointmentType}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.labels.length > 0 ? (
                          patient.labels.slice(0, 2).map((label) => (
                            <Badge key={label} variant="outline">
                              {label}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                        {patient.labels.length > 2 && (
                          <Badge variant="outline">+{patient.labels.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.allergies && patient.allergies.length > 0 ? (
                          patient.allergies.slice(0, 2).map((allergy) => (
                            <Badge key={allergy} variant="destructive" className="text-xs">
                              {allergy}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">NKA</span>
                        )}
                        {patient.allergies && patient.allergies.length > 2 && (
                          <Badge variant="destructive" className="text-xs">+{patient.allergies.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{patient.phone || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
