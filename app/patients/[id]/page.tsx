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
import { PatientInsightsPanel } from '@/components/patient-insights-panel'
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

      <PatientInsightsPanel
        patientId={patient.id}
        patientName={`${patient.firstName} ${patient.lastName}`}
      />

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

          <div className="grid md:grid-cols-2 gap-4">
            {patient.emergencyContact && (
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                  <CardTitle>Insurance Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-medium">{patient.insuranceInfo.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member ID</p>
                    <p className="font-medium">{patient.insuranceInfo.memberId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Group / Plan</p>
                    <p className="font-medium">{patient.insuranceInfo.groupNumber} · {patient.insuranceInfo.planType}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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

            <Card>
              <CardHeader>
                <CardTitle>Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy: string) => (
                      <Badge key={allergy} variant="destructive">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No known allergies</p>
                )}
              </CardContent>
            </Card>
          </div>

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
                  {patient.vitals.respiratoryRate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Resp. Rate</p>
                      <p className="font-medium">{patient.vitals.respiratoryRate} /min</p>
                    </div>
                  )}
                  {patient.vitals.oxygenSaturation && (
                    <div>
                      <p className="text-sm text-muted-foreground">O₂ Saturation</p>
                      <p className="font-medium">{patient.vitals.oxygenSaturation}%</p>
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
                  {patient.vitals.bmi && (
                    <div>
                      <p className="text-sm text-muted-foreground">BMI</p>
                      <p className="font-medium">{patient.vitals.bmi}</p>
                    </div>
                  )}
                  {patient.vitals.painLevel !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Pain Level</p>
                      <p className="font-medium">{patient.vitals.painLevel}/10</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {patient.socialHistory && (
            <Card>
              <CardHeader>
                <CardTitle>Social History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Smoking</p>
                    <p className="font-medium">{patient.socialHistory.smoking}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alcohol</p>
                    <p className="font-medium">{patient.socialHistory.alcohol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium">{patient.socialHistory.occupation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Exercise</p>
                    <p className="font-medium">{patient.socialHistory.exercise}</p>
                  </div>
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
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.medications && patient.medications.length > 0 ? (
                <div className="space-y-4">
                  {patient.medications.map((med: { name: string; dosage: string; frequency: string; purpose: string }, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-lg">{med.name}</p>
                          <p className="text-sm text-muted-foreground">{med.purpose}</p>
                        </div>
                        <Badge variant="outline">{med.dosage}</Badge>
                      </div>
                      <p className="text-sm mt-2">
                        <span className="text-muted-foreground">Frequency:</span> {med.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No medications on file</p>
                </div>
              )}
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
