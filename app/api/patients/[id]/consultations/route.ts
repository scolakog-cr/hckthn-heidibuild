import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { consultationSchema } from '@/lib/validations'

// GET /api/patients/[id]/consultations - Get all consultations for a patient
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultations = await prisma.consultation.findMany({
      where: { patientId: params.id },
      orderBy: {
        startTime: 'desc'
      }
    })

    return NextResponse.json(consultations)
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    )
  }
}

// POST /api/patients/[id]/consultations - Create a new consultation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = consultationSchema.parse({
      ...body,
      patientId: params.id
    })

    const consultation = await prisma.consultation.create({
      data: {
        ...validatedData,
        patientId: params.id,
        ...(validatedData.startTime && { startTime: new Date(validatedData.startTime) }),
        ...(validatedData.endTime && { endTime: new Date(validatedData.endTime) })
      }
    })

    return NextResponse.json(consultation, { status: 201 })
  } catch (error) {
    console.error('Error creating consultation:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create consultation' },
      { status: 500 }
    )
  }
}
