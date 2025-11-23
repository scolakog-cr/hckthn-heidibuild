export interface Patient {
  id: string
  firstName: string
  lastName: string
  dob: Date | string
  gender: string
  phone?: string | null
  email?: string | null
  address?: string | null
  labels: string[]
  vitals?: any
  consultations?: Consultation[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Consultation {
  id: string
  patientId: string
  patient?: Patient
  hcpId?: string | null
  type?: string | null
  startTime?: Date | string | null
  endTime?: Date | string | null
  status?: string | null
  chiefComplaint?: string | null
  hpi?: string | null
  exam?: string | null
  assessment?: string | null
  plan?: string | null
  followUp?: string | null
  transcriptionId?: string | null
  transcriptionText?: string | null
  structuredNotes?: any
  riskAlerts?: any
  guidelineRefs?: any
  drugWarnings?: any
  researchNotes?: any
  insuranceFlags?: any
  patientContext?: any
  createdAt: Date | string
  updatedAt: Date | string
}
