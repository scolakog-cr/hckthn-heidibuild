import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { consultationUpdateSchema } from '@/lib/validations'

// GET /api/consultations/[id] - Get a single consultation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultation = await prisma.consultation.findUnique({
      where: { id: params.id },
      include: {
        patient: true
      }
    })

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(consultation)
  } catch (error) {
    console.error('Error fetching consultation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultation' },
      { status: 500 }
    )
  }
}

// PUT /api/consultations/[id] - Update a consultation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = consultationUpdateSchema.parse(body)

    const consultation = await prisma.consultation.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        ...(validatedData.startTime && { startTime: new Date(validatedData.startTime) }),
        ...(validatedData.endTime && { endTime: new Date(validatedData.endTime) })
      }
    })

    return NextResponse.json(consultation)
  } catch (error) {
    console.error('Error updating consultation:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    )
  }
}

// DELETE /api/consultations/[id] - Delete a consultation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.consultation.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting consultation:', error)
    return NextResponse.json(
      { error: 'Failed to delete consultation' },
      { status: 500 }
    )
  }
}
