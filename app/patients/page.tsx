import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/date-utils'
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

async function getPatients() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">
            Manage and view all patient records
          </p>
        </div>
        <NewPatientDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Patients ({patients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No patients found</p>
              <NewPatientDialog />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>DOB</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Labels</TableHead>
                  <TableHead>Last Visit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} className="cursor-pointer">
                    <TableCell>
                      <Link
                        href={`/patients/${patient.id}`}
                        className="font-medium hover:underline"
                      >
                        {patient.firstName} {patient.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(patient.dob)}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.phone || 'N/A'}</TableCell>
                    <TableCell>{patient.email || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.labels.length > 0 ? (
                          patient.labels.map((label) => (
                            <Badge key={label} variant="secondary">
                              {label}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            None
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {patient.consultations && patient.consultations.length > 0
                        ? formatDate(patient.consultations[0].startTime)
                        : 'No visits'}
                    </TableCell>
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
