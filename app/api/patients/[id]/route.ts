import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { patientSchema } from '@/lib/validations'

// GET /api/patients/[id] - Get a single patient
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        consultations: {
          orderBy: {
            startTime: 'desc'
          }
        }
      }
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    )
  }
}

// PUT /api/patients/[id] - Update a patient
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = patientSchema.partial().parse(body)

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        ...(validatedData.dob && { dob: new Date(validatedData.dob) })
      }
    })

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error updating patient:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    )
  }
}

// DELETE /api/patients/[id] - Delete a patient
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.patient.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    )
  }
}
