import { NextRequest, NextResponse } from 'next/server'

// POST /api/heidi/notes - Mock structured notes generation endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transcriptionText, consultationId } = body

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Return mock structured notes
    const mockStructuredNotes = {
      consultationId,
      generated: new Date().toISOString(),
      sections: {
        chiefComplaint: 'Shortness of breath on exertion for 2 weeks, progressively worsening',

        subjective: 'Patient reports experiencing shortness of breath, particularly when climbing stairs, that began approximately 2 weeks ago. Symptoms have been progressively worsening. Patient denies chest pain but reports occasional palpitations. No other associated symptoms reported.',

        objective: `Vital Signs:
- Blood Pressure: 145/92 mmHg (elevated)
- Heart Rate: Elevated (exact rate not specified in transcript)

Physical Examination:
- Lungs: Clear to auscultation bilaterally
- Heart: Heart sounds audible, rate slightly elevated, no murmurs noted in transcript
- General: Patient alert and conversant`,

        assessment: `1. Dyspnea on exertion - DDx includes:
   - Cardiac etiology (given elevated BP and palpitations)
   - Pulmonary etiology (less likely given clear lung sounds)
   - Deconditioning

2. Hypertension - Blood pressure 145/92 mmHg

3. Palpitations - Intermittent, timing and triggers unclear`,

        plan: `Diagnostic:
1. Order EKG to evaluate for cardiac abnormalities
2. Order comprehensive metabolic panel and cardiac biomarkers
3. Consider chest X-ray if initial workup unrevealing

Treatment:
1. Advise patient to avoid strenuous activities until workup complete
2. Blood pressure management to be addressed based on repeat measurements and test results

Patient Education:
1. Discussed warning signs requiring immediate ER visit (chest pain, severe shortness of breath)
2. Explained rationale for cardiac workup

Follow-up:
1. Schedule follow-up appointment after test results available
2. Patient instructed to seek emergency care if symptoms worsen or chest pain develops`,

        followUp: 'Follow-up appointment after EKG and laboratory results are available. Patient educated on red flag symptoms requiring immediate emergency evaluation.'
      },

      clinicalInsights: {
        keyFindings: [
          'Elevated blood pressure (145/92)',
          'Progressive dyspnea on exertion',
          'Palpitations reported',
          'Clear lung examination'
        ],
        concerns: [
          'New onset dyspnea requires cardiac workup',
          'Elevated blood pressure may be contributing factor',
          'Progressive nature of symptoms is concerning'
        ],
        recommendations: [
          'Urgent cardiac evaluation with EKG',
          'Laboratory workup including cardiac markers',
          'Blood pressure monitoring and management',
          'Activity restriction until diagnosis established'
        ]
      }
    }

    return NextResponse.json(mockStructuredNotes)
  } catch (error) {
    console.error('Error generating structured notes:', error)
    return NextResponse.json(
      { error: 'Failed to generate structured notes' },
      { status: 500 }
    )
  }
}
