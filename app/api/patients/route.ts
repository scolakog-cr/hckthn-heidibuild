import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { patientSchema } from '@/lib/validations'

// GET /api/patients - Get all patients
export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        consultations: {
          orderBy: {
            startTime: 'desc'
          },
          take: 1
        }
      }
    })

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

// POST /api/patients - Create a new patient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = patientSchema.parse(body)

    const patient = await prisma.patient.create({
      data: {
        ...validatedData,
        dob: new Date(validatedData.dob),
        labels: validatedData.labels || []
      }
    })

    return NextResponse.json(patient, { status: 201 })
  } catch (error) {
    console.error('Error creating patient:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    )
  }
}
