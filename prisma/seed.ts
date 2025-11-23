import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.consultation.deleteMany()
  await prisma.patient.deleteMany()

  // Create patients with consultations
  const patients = [
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      dob: new Date('1985-03-15'),
      gender: 'Female',
      phone: '+1-555-0101',
      email: 'sarah.johnson@email.com',
      address: '123 Maple Street, Boston, MA 02108',
      labels: ['Diabetes', 'Hypertension'],
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        weight: 150,
        height: 165
      }
    },
    {
      firstName: 'Michael',
      lastName: 'Chen',
      dob: new Date('1978-07-22'),
      gender: 'Male',
      phone: '+1-555-0102',
      email: 'michael.chen@email.com',
      address: '456 Oak Avenue, Cambridge, MA 02139',
      labels: ['Asthma'],
      vitals: {
        bloodPressure: '118/75',
        heartRate: 68,
        temperature: 98.4,
        weight: 175,
        height: 178
      }
    },
    {
      firstName: 'Emily',
      lastName: 'Rodriguez',
      dob: new Date('1992-11-08'),
      gender: 'Female',
      phone: '+1-555-0103',
      email: 'emily.rodriguez@email.com',
      address: '789 Pine Road, Somerville, MA 02143',
      labels: ['Allergies'],
      vitals: {
        bloodPressure: '115/70',
        heartRate: 75,
        temperature: 98.5,
        weight: 140,
        height: 160
      }
    },
    {
      firstName: 'James',
      lastName: 'Williams',
      dob: new Date('1965-05-30'),
      gender: 'Male',
      phone: '+1-555-0104',
      email: 'james.williams@email.com',
      address: '321 Elm Street, Brookline, MA 02445',
      labels: ['COPD', 'Hypertension', 'Diabetes'],
      vitals: {
        bloodPressure: '135/85',
        heartRate: 78,
        temperature: 98.7,
        weight: 185,
        height: 172
      }
    },
    {
      firstName: 'Lisa',
      lastName: 'Anderson',
      dob: new Date('1988-09-14'),
      gender: 'Female',
      phone: '+1-555-0105',
      email: 'lisa.anderson@email.com',
      address: '654 Birch Lane, Newton, MA 02458',
      labels: ['Migraine'],
      vitals: {
        bloodPressure: '110/68',
        heartRate: 70,
        temperature: 98.3,
        weight: 135,
        height: 163
      }
    },
    {
      firstName: 'Robert',
      lastName: 'Taylor',
      dob: new Date('1955-12-03'),
      gender: 'Male',
      phone: '+1-555-0106',
      email: 'robert.taylor@email.com',
      address: '987 Cedar Court, Watertown, MA 02472',
      labels: ['Heart Disease', 'Hypertension'],
      vitals: {
        bloodPressure: '140/90',
        heartRate: 82,
        temperature: 98.6,
        weight: 195,
        height: 175
      }
    },
    {
      firstName: 'Maria',
      lastName: 'Garcia',
      dob: new Date('1995-04-18'),
      gender: 'Female',
      phone: '+1-555-0107',
      email: 'maria.garcia@email.com',
      address: '147 Spruce Street, Arlington, MA 02474',
      labels: ['Anxiety'],
      vitals: {
        bloodPressure: '112/72',
        heartRate: 74,
        temperature: 98.5,
        weight: 128,
        height: 158
      }
    },
    {
      firstName: 'David',
      lastName: 'Miller',
      dob: new Date('1982-01-25'),
      gender: 'Male',
      phone: '+1-555-0108',
      email: 'david.miller@email.com',
      address: '258 Walnut Drive, Belmont, MA 02478',
      labels: ['Back Pain'],
      vitals: {
        bloodPressure: '122/78',
        heartRate: 71,
        temperature: 98.4,
        weight: 180,
        height: 183
      }
    }
  ]

  for (const patientData of patients) {
    const patient = await prisma.patient.create({
      data: patientData
    })

    // Create 1-3 consultations for each patient
    const numConsultations = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < numConsultations; i++) {
      const daysAgo = Math.floor(Math.random() * 90) + (i * 30)
      const startTime = new Date()
      startTime.setDate(startTime.getDate() - daysAgo)
      startTime.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0)

      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + 30 + Math.floor(Math.random() * 30))

      const consultationTypes = ['Follow-up', 'Annual Physical', 'Sick Visit', 'Consultation', 'Urgent Care']
      const statuses = ['Completed', 'Completed', 'Scheduled', 'In Progress']
      const hcps = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown']

      const status = i === 0 ? statuses[Math.floor(Math.random() * statuses.length)] : 'Completed'

      const consultation = await prisma.consultation.create({
        data: {
          patientId: patient.id,
          hcpId: hcps[Math.floor(Math.random() * hcps.length)],
          type: consultationTypes[Math.floor(Math.random() * consultationTypes.length)],
          startTime,
          endTime,
          status,
          chiefComplaint: status === 'Completed' ? getRandomChiefComplaint(patient.labels) : null,
          hpi: status === 'Completed' ? getRandomHPI(patient.labels) : null,
          exam: status === 'Completed' ? getRandomExam() : null,
          assessment: status === 'Completed' ? getRandomAssessment(patient.labels) : null,
          plan: status === 'Completed' ? getRandomPlan(patient.labels) : null,
          followUp: status === 'Completed' ? getRandomFollowUp() : null,
          transcriptionText: status === 'Completed' ? 'Sample transcription text from consultation recording...' : null,
          structuredNotes: status === 'Completed' ? {
            sections: {
              subjective: 'Patient reports symptoms as described in HPI',
              objective: 'Physical examination findings documented',
              assessment: 'Clinical impression and diagnosis',
              plan: 'Treatment plan and recommendations'
            }
          } : null
        }
      })

      console.log(`Created consultation ${consultation.id} for patient ${patient.firstName} ${patient.lastName}`)
    }

    console.log(`Created patient: ${patient.firstName} ${patient.lastName}`)
  }

  console.log('Seeding completed!')
}

function getRandomChiefComplaint(labels: string[]): string {
  const complaints = [
    'Routine check-up',
    'Follow-up visit',
    'Medication refill',
    'New symptoms',
    'Worsening condition',
    'Shortness of breath',
    'Chest pain',
    'Headache',
    'Fatigue',
    'Dizziness'
  ]

  if (labels.includes('Diabetes')) {
    return 'Follow-up for diabetes management'
  }
  if (labels.includes('Hypertension')) {
    return 'Blood pressure check and medication review'
  }
  if (labels.includes('Asthma')) {
    return 'Asthma control assessment'
  }

  return complaints[Math.floor(Math.random() * complaints.length)]
}

function getRandomHPI(labels: string[]): string {
  const hpis = [
    'Patient presents for routine follow-up. Reports general good health with no significant changes since last visit. Medications taken as prescribed. No new symptoms or concerns.',
    'Patient reports increased symptoms over the past 2 weeks. Compliant with current medication regimen but notes persistent issues. No recent hospitalizations or emergency visits.',
    'Annual wellness visit. Patient denies any acute complaints. Reviews systems negative except as noted in chronic conditions. Continues home medications without adverse effects.',
    'Patient presents with new onset symptoms beginning 3-4 days ago. Describes gradual worsening. Tried over-the-counter remedies with minimal relief. No fever or other systemic symptoms.'
  ]

  return hpis[Math.floor(Math.random() * hpis.length)]
}

function getRandomExam(): string {
  return 'Vital signs stable. General appearance: well-nourished, no acute distress. HEENT: normocephalic, atraumatic. Cardiovascular: regular rate and rhythm, no murmurs. Respiratory: clear to auscultation bilaterally. Abdomen: soft, non-tender, non-distended. Extremities: no edema, pulses intact.'
}

function getRandomAssessment(labels: string[]): string {
  let assessment = 'Patient is overall stable. '

  if (labels.includes('Diabetes')) {
    assessment += 'Type 2 Diabetes Mellitus - well controlled. '
  }
  if (labels.includes('Hypertension')) {
    assessment += 'Essential Hypertension - controlled on current regimen. '
  }
  if (labels.includes('Asthma')) {
    assessment += 'Asthma - intermittent, well controlled. '
  }
  if (labels.includes('COPD')) {
    assessment += 'COPD - stable on current therapy. '
  }

  assessment += 'Continue current management plan.'

  return assessment
}

function getRandomPlan(labels: string[]): string {
  let plan = '1. Continue current medications\n'

  if (labels.includes('Diabetes')) {
    plan += '2. Monitor blood glucose levels daily\n'
    plan += '3. HbA1c check in 3 months\n'
  }
  if (labels.includes('Hypertension')) {
    plan += '2. Continue blood pressure monitoring at home\n'
    plan += '3. Low sodium diet counseling\n'
  }

  plan += '4. Follow up as scheduled\n'
  plan += '5. Patient education provided and questions answered'

  return plan
}

function getRandomFollowUp(): string {
  const options = [
    'Follow up in 3 months',
    'Follow up in 6 months',
    'Return if symptoms worsen',
    'Follow up in 1 month for lab review',
    'Annual visit next year',
    'Follow up in 2 weeks'
  ]

  return options[Math.floor(Math.random() * options.length)]
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
