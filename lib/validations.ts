import { z } from 'zod'

export const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.string().or(z.date()),
  gender: z.string().min(1, 'Gender is required'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  labels: z.array(z.string()).optional().default([]),
  vitals: z.any().optional(),
})

export const consultationSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  hcpId: z.string().optional(),
  type: z.string().optional(),
  startTime: z.string().or(z.date()).optional(),
  endTime: z.string().or(z.date()).optional(),
  status: z.string().optional(),
  chiefComplaint: z.string().optional(),
  hpi: z.string().optional(),
  exam: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  followUp: z.string().optional(),
  transcriptionId: z.string().optional(),
  transcriptionText: z.string().optional(),
  structuredNotes: z.any().optional(),
})

export const consultationUpdateSchema = z.object({
  hcpId: z.string().optional(),
  type: z.string().optional(),
  startTime: z.string().or(z.date()).optional(),
  endTime: z.string().or(z.date()).optional(),
  status: z.string().optional(),
  chiefComplaint: z.string().optional(),
  hpi: z.string().optional(),
  exam: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  followUp: z.string().optional(),
  transcriptionId: z.string().optional(),
  transcriptionText: z.string().optional(),
  structuredNotes: z.any().optional(),
})
