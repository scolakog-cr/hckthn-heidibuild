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
import { MedicationsList } from '@/components/medications-list'
import { LabResultsList } from '@/components/lab-results-list'
import { ImagingStudiesList } from '@/components/imaging-studies-list'
import { ArrowLeft, AlertTriangle, Phone, CreditCard } from 'lucide-react'

async function getPatient(id: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        consultations: {
          orderBy: { startTime: 'desc' },
        },
        medications: {
          orderBy: { startDate: 'desc' },
        },
        labResults: {
          orderBy: { performedDate: 'desc' },
        },
        imagingStudies: {
          orderBy: { performedDate: 'desc' },
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
          <TabsTrigger value="medications">
            Medications ({patient.medications?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="labs">
            Labs ({patient.labResults?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="imaging">
            Imaging ({patient.imagingStudies?.length || 0})
          </TabsTrigger>
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

          {patient.allergies && patient.allergies.length > 0 && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {patient.emergencyContact && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{patient.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship</p>
                    <p className="font-medium">{patient.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{patient.emergencyContact.phone}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {patient.insuranceInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Insurance Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-medium">{patient.insuranceInfo.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Policy Number</p>
                    <p className="font-medium">{patient.insuranceInfo.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Group Number</p>
                    <p className="font-medium">{patient.insuranceInfo.groupNumber}</p>
                  </div>
                </CardContent>
              </Card>
            )}
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
                <CardTitle>Recent Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {patient.vitals.bloodPressure && (
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Pressure</p>
                      <p className="font-medium text-lg">{patient.vitals.bloodPressure}</p>
                      <p className="text-xs text-muted-foreground">mmHg</p>
                    </div>
                  )}
                  {patient.vitals.heartRate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Heart Rate</p>
                      <p className="font-medium text-lg">{patient.vitals.heartRate}</p>
                      <p className="text-xs text-muted-foreground">bpm</p>
                    </div>
                  )}
                  {patient.vitals.temperature && (
                    <div>
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="font-medium text-lg">{patient.vitals.temperature}</p>
                      <p className="text-xs text-muted-foreground">°F</p>
                    </div>
                  )}
                  {patient.vitals.weight && (
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-medium text-lg">{patient.vitals.weight}</p>
                      <p className="text-xs text-muted-foreground">lbs</p>
                    </div>
                  )}
                  {patient.vitals.height && (
                    <div>
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="font-medium text-lg">{patient.vitals.height}</p>
                      <p className="text-xs text-muted-foreground">cm</p>
                    </div>
                  )}
                  {patient.vitals.bmi && (
                    <div>
                      <p className="text-sm text-muted-foreground">BMI</p>
                      <p className="font-medium text-lg">{patient.vitals.bmi}</p>
                      <p className="text-xs text-muted-foreground">kg/m²</p>
                    </div>
                  )}
                  {patient.vitals.oxygenSaturation && (
                    <div>
                      <p className="text-sm text-muted-foreground">O₂ Saturation</p>
                      <p className="font-medium text-lg">{patient.vitals.oxygenSaturation}</p>
                      <p className="text-xs text-muted-foreground">%</p>
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
          <MedicationsList medications={patient.medications || []} />
        </TabsContent>

        <TabsContent value="labs">
          <LabResultsList labResults={patient.labResults || []} />
        </TabsContent>

        <TabsContent value="imaging">
          <ImagingStudiesList imagingStudies={patient.imagingStudies || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
