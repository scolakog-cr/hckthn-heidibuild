import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, getAge } from '@/lib/date-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EditPatientDialog } from '@/components/edit-patient-dialog'
import { ConsultationsTimeline } from '@/components/consultations-timeline'
import { ArrowLeft } from 'lucide-react'

async function getPatient(id: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        consultations: {
          orderBy: { startTime: 'desc' },
        },
      },
    })
    return patient
  } catch (error) {
    console.error('Error fetching patient:', error)
    return null
  }
}

export default async function PatientDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const patient = await getPatient(params.id)

  if (!patient) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/patients">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-muted-foreground">
              {getAge(patient.dob)} years old · {patient.gender}
            </p>
          </div>
          <EditPatientDialog patient={patient} />
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="consultations">
            Consultations ({patient.consultations?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="labs">Labs</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {formatDate(patient.dob)} ({getAge(patient.dob)} years old)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{patient.gender}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{patient.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{patient.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{patient.address || 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Labels & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.labels.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.labels.map((label) => (
                    <Badge key={label} variant="secondary">
                      {label}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No labels assigned</p>
              )}
            </CardContent>
          </Card>

          {patient.vitals && (
            <Card>
              <CardHeader>
                <CardTitle>Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {patient.vitals.bloodPressure && (
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Pressure</p>
                      <p className="font-medium">{patient.vitals.bloodPressure}</p>
                    </div>
                  )}
                  {patient.vitals.heartRate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Heart Rate</p>
                      <p className="font-medium">{patient.vitals.heartRate} bpm</p>
                    </div>
                  )}
                  {patient.vitals.temperature && (
                    <div>
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="font-medium">{patient.vitals.temperature}°F</p>
                    </div>
                  )}
                  {patient.vitals.weight && (
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-medium">{patient.vitals.weight} lbs</p>
                    </div>
                  )}
                  {patient.vitals.height && (
                    <div>
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="font-medium">{patient.vitals.height} cm</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="consultations">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Consultation History</CardTitle>
                <Link href={`/consultations/new?patientId=${patient.id}`}>
                  <Button size="sm">New Consultation</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ConsultationsTimeline consultations={patient.consultations || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Medications management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Lab results coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imaging">
          <Card>
            <CardHeader>
              <CardTitle>Imaging Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Imaging studies coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
