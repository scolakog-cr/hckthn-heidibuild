import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.consultation.deleteMany()
  await prisma.patient.deleteMany()

  // Get today's date for appointments
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Helper to create appointment time for today
  const appointmentTime = (hour: number, minute: number = 0) => {
    const date = new Date(today)
    date.setHours(hour, minute, 0, 0)
    return date
  }

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
        height: 165,
        oxygenSaturation: 98,
        respiratoryRate: 16,
        painLevel: 0,
        bmi: 24.2
      },
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'twice daily', purpose: 'Diabetes' },
        { name: 'Lisinopril', dosage: '10mg', frequency: 'once daily', purpose: 'Blood pressure' }
      ],
      allergies: ['Penicillin'],
      insuranceInfo: {
        provider: 'Blue Cross Blue Shield',
        memberId: 'BCB123456789',
        groupNumber: 'GRP001',
        planType: 'PPO'
      },
      emergencyContact: {
        name: 'John Johnson',
        relationship: 'Spouse',
        phone: '+1-555-0201'
      },
      socialHistory: {
        smoking: 'Never',
        alcohol: 'Occasional',
        occupation: 'Teacher',
        exercise: '3x per week'
      },
      nextAppointment: appointmentTime(8, 30),
      appointmentType: 'Follow-up'
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
        height: 178,
        oxygenSaturation: 97,
        respiratoryRate: 18,
        painLevel: 0,
        bmi: 22.0
      },
      medications: [
        { name: 'Albuterol', dosage: '90mcg', frequency: 'as needed', purpose: 'Asthma rescue' },
        { name: 'Fluticasone', dosage: '110mcg', frequency: 'twice daily', purpose: 'Asthma maintenance' }
      ],
      allergies: ['Sulfa drugs', 'Shellfish'],
      insuranceInfo: {
        provider: 'Aetna',
        memberId: 'AET987654321',
        groupNumber: 'GRP002',
        planType: 'HMO'
      },
      emergencyContact: {
        name: 'Linda Chen',
        relationship: 'Wife',
        phone: '+1-555-0202'
      },
      socialHistory: {
        smoking: 'Former (quit 2015)',
        alcohol: 'None',
        occupation: 'Software Engineer',
        exercise: 'Daily'
      },
      nextAppointment: appointmentTime(9, 0),
      appointmentType: 'Sick Visit'
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
        height: 160,
        oxygenSaturation: 99,
        respiratoryRate: 14,
        painLevel: 0,
        bmi: 21.9
      },
      medications: [
        { name: 'Cetirizine', dosage: '10mg', frequency: 'once daily', purpose: 'Allergies' }
      ],
      allergies: ['Peanuts', 'Tree nuts', 'Latex'],
      insuranceInfo: {
        provider: 'United Healthcare',
        memberId: 'UHC456789012',
        groupNumber: 'GRP003',
        planType: 'PPO'
      },
      emergencyContact: {
        name: 'Carlos Rodriguez',
        relationship: 'Father',
        phone: '+1-555-0203'
      },
      socialHistory: {
        smoking: 'Never',
        alcohol: 'Social',
        occupation: 'Graphic Designer',
        exercise: '2x per week'
      },
      nextAppointment: appointmentTime(9, 30),
      appointmentType: 'Annual Physical'
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
        height: 172,
        oxygenSaturation: 94,
        respiratoryRate: 20,
        painLevel: 2,
        bmi: 26.3
      },
      medications: [
        { name: 'Tiotropium', dosage: '18mcg', frequency: 'once daily', purpose: 'COPD' },
        { name: 'Metformin', dosage: '1000mg', frequency: 'twice daily', purpose: 'Diabetes' },
        { name: 'Amlodipine', dosage: '5mg', frequency: 'once daily', purpose: 'Blood pressure' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'once daily', purpose: 'Cholesterol' }
      ],
      allergies: ['Aspirin', 'NSAIDs'],
      insuranceInfo: {
        provider: 'Medicare',
        memberId: 'MED789012345',
        groupNumber: 'N/A',
        planType: 'Medicare Advantage'
      },
      emergencyContact: {
        name: 'Patricia Williams',
        relationship: 'Wife',
        phone: '+1-555-0204'
      },
      socialHistory: {
        smoking: 'Former (30 pack-years, quit 2010)',
        alcohol: 'None',
        occupation: 'Retired Accountant',
        exercise: 'Walking daily'
      },
      nextAppointment: appointmentTime(10, 0),
      appointmentType: 'Follow-up'
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
        height: 163,
        oxygenSaturation: 99,
        respiratoryRate: 15,
        painLevel: 0,
        bmi: 20.2
      },
      medications: [
        { name: 'Sumatriptan', dosage: '50mg', frequency: 'as needed', purpose: 'Migraine acute' },
        { name: 'Topiramate', dosage: '25mg', frequency: 'twice daily', purpose: 'Migraine prevention' }
      ],
      allergies: [],
      insuranceInfo: {
        provider: 'Cigna',
        memberId: 'CIG234567890',
        groupNumber: 'GRP004',
        planType: 'PPO'
      },
      emergencyContact: {
        name: 'Mark Anderson',
        relationship: 'Husband',
        phone: '+1-555-0205'
      },
      socialHistory: {
        smoking: 'Never',
        alcohol: 'Rare',
        occupation: 'Marketing Manager',
        exercise: 'Yoga 4x per week'
      },
      nextAppointment: appointmentTime(10, 30),
      appointmentType: 'Consultation'
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
        height: 175,
        oxygenSaturation: 96,
        respiratoryRate: 18,
        painLevel: 1,
        bmi: 25.9
      },
      medications: [
        { name: 'Metoprolol', dosage: '50mg', frequency: 'twice daily', purpose: 'Heart rate/BP' },
        { name: 'Lisinopril', dosage: '20mg', frequency: 'once daily', purpose: 'Blood pressure' },
        { name: 'Aspirin', dosage: '81mg', frequency: 'once daily', purpose: 'Cardiac protection' },
        { name: 'Clopidogrel', dosage: '75mg', frequency: 'once daily', purpose: 'Blood thinner' }
      ],
      allergies: ['Codeine'],
      insuranceInfo: {
        provider: 'Medicare',
        memberId: 'MED345678901',
        groupNumber: 'N/A',
        planType: 'Medicare Part D'
      },
      emergencyContact: {
        name: 'Susan Taylor',
        relationship: 'Wife',
        phone: '+1-555-0206'
      },
      socialHistory: {
        smoking: 'Former (quit 2000)',
        alcohol: 'None (cardiac)',
        occupation: 'Retired Engineer',
        exercise: 'Cardiac rehab 3x per week'
      },
      nextAppointment: appointmentTime(11, 0),
      appointmentType: 'Urgent Care'
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
        height: 158,
        oxygenSaturation: 99,
        respiratoryRate: 16,
        painLevel: 0,
        bmi: 20.4
      },
      medications: [
        { name: 'Sertraline', dosage: '50mg', frequency: 'once daily', purpose: 'Anxiety' },
        { name: 'Lorazepam', dosage: '0.5mg', frequency: 'as needed', purpose: 'Acute anxiety' }
      ],
      allergies: ['Erythromycin'],
      insuranceInfo: {
        provider: 'Harvard Pilgrim',
        memberId: 'HP567890123',
        groupNumber: 'GRP005',
        planType: 'HMO'
      },
      emergencyContact: {
        name: 'Rosa Garcia',
        relationship: 'Mother',
        phone: '+1-555-0207'
      },
      socialHistory: {
        smoking: 'Never',
        alcohol: 'Social',
        occupation: 'Nurse',
        exercise: 'Running 3x per week'
      },
      nextAppointment: appointmentTime(13, 30),
      appointmentType: 'Follow-up'
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
        height: 183,
        oxygenSaturation: 98,
        respiratoryRate: 14,
        painLevel: 4,
        bmi: 21.4
      },
      medications: [
        { name: 'Cyclobenzaprine', dosage: '10mg', frequency: 'as needed', purpose: 'Muscle relaxant' },
        { name: 'Ibuprofen', dosage: '600mg', frequency: 'three times daily with food', purpose: 'Pain/inflammation' }
      ],
      allergies: ['Tramadol'],
      insuranceInfo: {
        provider: 'Blue Cross Blue Shield',
        memberId: 'BCB678901234',
        groupNumber: 'GRP006',
        planType: 'PPO'
      },
      emergencyContact: {
        name: 'Jennifer Miller',
        relationship: 'Wife',
        phone: '+1-555-0208'
      },
      socialHistory: {
        smoking: 'Never',
        alcohol: 'Moderate',
        occupation: 'Construction Manager',
        exercise: 'Physical therapy exercises daily'
      },
      nextAppointment: appointmentTime(14, 0),
      appointmentType: 'Follow-up'
    },
    // New UK patients with extended clinical data
    {
      firstName: 'Daniel',
      lastName: 'Harper',
      dob: new Date('1987-03-15'),
      gender: 'Male',
      phone: '+44 7700 900001',
      email: 'daniel.harper@example.com',
      address: '23 Mill Lane, Birmingham, B1 2AB, UK',
      labels: ['L4-L5 disc herniation', 'Sciatica', 'Low back pain'],
      vitals: {
        bloodPressure: '128/82',
        heartRate: 78,
        temperature: 98.2, // converted from 36.8°C
        respiratoryRate: 16,
        painLevel: 7
      },
      medications: [
        { name: 'Ibuprofen', dosage: '400 mg', frequency: 'TDS PRN', purpose: 'Back pain', route: 'oral' },
        { name: 'NSAID (GP prescribed)', dosage: 'as directed', frequency: 'regular', purpose: 'Back pain / inflammation', route: 'oral' }
      ],
      allergies: [],
      insuranceInfo: {
        provider: 'Midlands Health Plan',
        memberId: 'MHP-45823910',
        groupNumber: 'EMP-INDUSTRIAL-01',
        planType: 'Employer'
      },
      emergencyContact: {
        name: 'Laura Harper',
        relationship: 'Spouse',
        phone: '+44 7700 900501'
      },
      socialHistory: {
        smoking: 'Never',
        alcohol: 'Social, occasional',
        occupation: 'Warehouse worker (heavy lifting)',
        exercise: 'Moderate at work, minimal structured exercise'
      },
      nextAppointment: appointmentTime(14, 30),
      appointmentType: 'Follow-up'
    },
    {
      firstName: 'Emily',
      lastName: 'Roberts',
      dob: new Date('1993-06-02'),
      gender: 'Female',
      phone: '+44 7700 900002',
      email: 'emily.roberts@example.com',
      address: '14 Oakfield Road, Manchester, M3 4CD, UK',
      labels: ['Placental abruption', 'Fetal distress', 'Third trimester pregnancy'],
      vitals: {
        bloodPressure: '138/88',
        heartRate: 96,
        temperature: 98.4, // converted from 36.9°C
        respiratoryRate: 18,
        painLevel: 8,
        gestationalAgeWeeks: 35
      },
      medications: [
        { name: 'IV fluids', dosage: 'as per protocol', frequency: 'continuous', purpose: 'Pre-op stabilisation', route: 'IV' }
      ],
      allergies: [],
      insuranceInfo: {
        provider: 'Northern Maternity Cover',
        memberId: 'NMC-98273456',
        groupNumber: 'MAT-2025',
        planType: 'Maternity'
      },
      emergencyContact: {
        name: 'James Roberts',
        relationship: 'Partner',
        phone: '+44 7700 900502'
      },
      socialHistory: {
        smoking: 'Never',
        alcohol: 'None during pregnancy',
        occupation: 'Primary school teacher',
        exercise: 'N/A - pregnancy restricted',
        childrenAtHome: 0
      },
      nextAppointment: appointmentTime(15, 0),
      appointmentType: 'Urgent Care'
    },
    {
      firstName: 'Martin',
      lastName: 'Ellis',
      dob: new Date('1962-09-21'),
      gender: 'Male',
      phone: '+44 7700 900003',
      email: 'martin.ellis@example.com',
      address: '7 Riverside Court, Leeds, LS1 3EF, UK',
      labels: ['Colorectal cancer', 'Rectal bleeding', 'Unintentional weight loss'],
      vitals: {
        bloodPressure: '132/84',
        heartRate: 82,
        temperature: 98.1, // converted from 36.7°C
        respiratoryRate: 16,
        weight: 163, // converted from 74kg
        recentWeightLossKg: 6.8
      },
      medications: [],
      allergies: [],
      insuranceInfo: {
        provider: 'Yorkshire Health',
        memberId: 'YH-77432019',
        groupNumber: 'ONC-GI-01',
        planType: 'Oncology'
      },
      emergencyContact: {
        name: 'Helen Ellis',
        relationship: 'Spouse',
        phone: '+44 7700 900503'
      },
      socialHistory: {
        smoking: 'Former',
        alcohol: '1–2 units/week',
        occupation: 'Accountant',
        exercise: 'Limited',
        diet: 'Mixed; low fibre historically',
        familyHistory: 'No known colorectal cancer; otherwise non-contributory'
      },
      nextAppointment: appointmentTime(15, 30),
      appointmentType: 'Consultation'
    },
    {
      firstName: 'Sophie',
      lastName: 'Turner',
      dob: new Date('1978-01-09'),
      gender: 'Female',
      phone: '+44 7700 900004',
      email: 'sophie.turner@example.com',
      address: '89 Kingsway, Bristol, BS1 5GH, UK',
      labels: ['Subarachnoid haemorrhage', 'Thunderclap headache', 'Neck stiffness'],
      vitals: {
        bloodPressure: '162/94',
        heartRate: 104,
        temperature: 98.6, // converted from 37.0°C
        respiratoryRate: 20,
        painLevel: 9,
        glasgowComaScale: 15
      },
      medications: [
        { name: 'IV antihypertensive', dosage: 'as per protocol', frequency: 'titrated', purpose: 'Blood pressure control in SAH', route: 'IV' },
        { name: 'Analgesia', dosage: 'as required', frequency: 'PRN', purpose: 'Severe headache', route: 'IV' }
      ],
      allergies: [],
      insuranceInfo: {
        provider: 'West Country Health',
        memberId: 'WCH-66321987',
        groupNumber: 'NEURO-ACUTE',
        planType: 'Acute Care'
      },
      emergencyContact: {
        name: 'Michael Turner',
        relationship: 'Spouse',
        phone: '+44 7700 900504'
      },
      socialHistory: {
        smoking: 'Never',
        alcohol: 'Occasional',
        occupation: 'Marketing manager',
        exercise: 'Regular',
        familyHistory: 'No known aneurysm or stroke'
      },
      nextAppointment: appointmentTime(16, 0),
      appointmentType: 'Urgent Care'
    },
    {
      firstName: 'Robert',
      lastName: 'Mitchell',
      dob: new Date('1970-11-30'),
      gender: 'Male',
      phone: '+44 7700 900005',
      email: 'robert.mitchell@example.com',
      address: '51 Church Street, Newcastle, NE1 6JK, UK',
      labels: ['Non-small cell lung cancer', 'Chronic cough', 'Shortness of breath', 'Heavy smoker', 'Family history of lung cancer'],
      vitals: {
        bloodPressure: '140/88',
        heartRate: 90,
        temperature: 98.2, // converted from 36.8°C
        respiratoryRate: 20,
        oxygenSaturation: 94,
        weight: 154, // converted from 70kg
        recentWeightLossKg: 6.8
      },
      medications: [
        { name: 'Amlodipine', dosage: '5 mg', frequency: 'OD', purpose: 'Hypertension', route: 'oral' }
      ],
      allergies: [],
      insuranceInfo: {
        provider: 'NorthEast Health Shield',
        memberId: 'NEHS-22019845',
        groupNumber: 'RESP-ONC-25',
        planType: 'Oncology'
      },
      emergencyContact: {
        name: 'Karen Mitchell',
        relationship: 'Spouse',
        phone: '+44 7700 900505'
      },
      socialHistory: {
        smoking: 'Current (35 pack-years)',
        alcohol: 'Social, weekly',
        occupation: 'Construction site supervisor',
        exercise: 'Limited due to dyspnoea',
        familyHistory: 'Father died of lung cancer in his 60s'
      },
      nextAppointment: appointmentTime(16, 30),
      appointmentType: 'Consultation'
    },
    {
      firstName: 'Alex',
      lastName: 'Morgan',
      dob: new Date('1991-05-18'),
      gender: 'Female',
      phone: '+44 7700 900006',
      email: 'alex.morgan@example.com',
      address: '3 Park View Apartments, London, SE1 2LM, UK',
      labels: ['Work-related stress', 'Exhaustion', 'Anxiety symptoms', 'Subclinical hypothyroidism', 'Menorrhagia', 'Iron deficiency'],
      vitals: {
        bloodPressure: '118/76',
        heartRate: 74,
        temperature: 97.9, // converted from 36.6°C
        respiratoryRate: 14,
        painLevel: 0,
        weight: 143, // gradual weight gain noted
        mood: 'anxious / low',
        sleepQuality: 'poor after high-pressure work periods',
        skinCondition: 'dry, cool',
        hairCondition: 'thinning, increased shedding'
      },
      medications: [],
      allergies: [],
      insuranceInfo: {
        provider: 'CityCare Mental Health Plan',
        memberId: 'CCMH-55982017',
        groupNumber: 'PSY-OUTPATIENT',
        planType: 'Mental Health'
      },
      emergencyContact: {
        name: 'Chloe Bennett',
        relationship: 'Friend',
        phone: '+44 7700 900506'
      },
      socialHistory: {
        smoking: 'Never',
        alcohol: 'Binge episodes with wine when overwhelmed',
        occupation: 'Project manager in tech ("Phoenix Initiative" project)',
        exercise: 'Minimal due to exhaustion',
        livingSituation: 'Lives alone',
        supportNetwork: 'Close friends Chloe and Sam; estranged from ex-partner Liam',
        psychosocialNotes: 'Longstanding pattern of people-pleasing, performance in relationships, fear of rejection and criticism, uses withdrawal and alcohol to cope when overwhelmed',
        menstrualHistory: 'Heavy periods with clotting, irregular cycles over past year'
      },
      nextAppointment: appointmentTime(17, 0),
      appointmentType: 'Follow-up'
    }
  ]

  for (const patientData of patients) {
    const patient = await prisma.patient.create({
      data: patientData
    })

    // Special handling for Alex Morgan - create her specific consultation history
    if (patient.firstName === 'Alex' && patient.lastName === 'Morgan') {
      await createAlexMorganConsultations(patient.id)
      console.log(`Created patient: ${patient.firstName} ${patient.lastName} with detailed consultation history`)
      continue
    }

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

  async function createAlexMorganConsultations(patientId: string) {
    const today = new Date()

    // Consultation 1: About 5 years ago - First "I'm tired all the time" visit
    const visit1Date = new Date(today)
    visit1Date.setFullYear(visit1Date.getFullYear() - 5)
    visit1Date.setMonth(3) // April
    visit1Date.setHours(10, 0, 0, 0)

    await prisma.consultation.create({
      data: {
        patientId,
        hcpId: 'Dr. Sarah Chen',
        type: 'Sick Visit',
        startTime: visit1Date,
        endTime: new Date(visit1Date.getTime() + 30 * 60000),
        status: 'Completed',
        chiefComplaint: 'Fatigue - "tired all the time" for nearly a year',
        hpi: `Patient is a 28-year-old female presenting with chronic fatigue for approximately 1 year. Reports sleeping 7-8 hours nightly but waking unrefreshed. Describes hitting a "wall" in late afternoon. Also notes menstrual periods have become heavier over the past year, requiring pad changes every 2-3 hours on heaviest days. Denies chest pain or breathlessness. Mentions feeling colder than colleagues in office and some difficulty concentrating at work. No significant mood complaints reported.`,
        exam: `General: Well-appearing female, no acute distress. Skin: Slightly dry. HEENT: Thyroid normal to palpation, no nodules or enlargement appreciated. Cardiovascular: RRR, no murmurs. Lungs: CTAB. Vitals: BP 115/72, HR 68, Temp 98.2°F, RR 14.`,
        assessment: `1. Fatigue - likely multifactorial
2. Menorrhagia with probable iron deficiency
3. Rule out thyroid dysfunction`,
        plan: `1. CBC, ferritin, iron studies ordered
2. TSH, free T4 ordered "to be thorough"
3. Start oral iron supplementation 325mg daily with vitamin C
4. Dietary counseling for iron-rich foods
5. Sleep hygiene counseling
6. Follow up in 6-8 weeks or sooner if symptoms worsen`,
        followUp: 'Follow up in 6-8 weeks',
        structuredNotes: {
          labResults: {
            hemoglobin: '11.2 g/dL (slightly low)',
            MCV: '78 fL (low-normal, borderline microcytic)',
            ferritin: '12 ng/mL (low-normal)',
            TSH: '4.2 mIU/L (upper end of normal, range 0.4-4.5)',
            freeT4: '1.1 ng/dL (normal)'
          },
          clinicalNotes: 'TSH at upper normal - noted but not acted on. Fatigue attributed to iron deficiency from menorrhagia and demanding job.'
        },
        riskAlerts: ['Borderline TSH not followed up']
      }
    })
    console.log('Created Alex Morgan consultation 1: Initial fatigue visit (5 years ago)')

    // Consultation 2: About 3 years ago - Hair shedding, constipation, low energy
    const visit2Date = new Date(today)
    visit2Date.setFullYear(visit2Date.getFullYear() - 3)
    visit2Date.setMonth(6) // July
    visit2Date.setHours(14, 30, 0, 0)

    await prisma.consultation.create({
      data: {
        patientId,
        hcpId: 'Dr. Sarah Chen',
        type: 'Follow-up',
        startTime: visit2Date,
        endTime: new Date(visit2Date.getTime() + 30 * 60000),
        status: 'Completed',
        chiefComplaint: 'Hair shedding, constipation, persistent low energy',
        hpi: `Patient returns approximately 2 years after initial visit with new concerns. Reports increased hair shedding - notices more hair in brush and shower drain. Feeling "sluggish" with energy described as "like moving through molasses," especially mornings. Constipation has developed - bowel movements now every 2-3 days with harder stools. Has gained approximately 3-4 kg over past year despite no major dietary changes. Mood feels "flatter" with less motivation, but still functioning at work and socially. Attributes much of this to ongoing work stress. Periods remain heavy.`,
        exam: `General: Appears tired but well-nourished. Skin: Cool and dry to touch, especially hands. Hair: Overall slightly thinned, no focal alopecia or bald patches. HEENT: Thyroid feels slightly fuller and rubbery compared to prior exam, but not obviously enlarged or nodular. No tenderness. Cardiovascular: RRR. Lungs: Clear. Vitals: BP 118/74, HR 64, Temp 97.8°F, Weight 138 lbs (up from 130 lbs).`,
        assessment: `1. Fatigue, constipation, hair changes - consider thyroid etiology
2. Possible subclinical hypothyroidism
3. Low mood - possibly related to thyroid or situational stress
4. Weight gain`,
        plan: `1. Repeat thyroid panel
2. Increase dietary fiber, fluids for constipation
3. General stress reduction counseling
4. Offered mental health referral - patient declined, wants to see if things improve
5. Monitor thyroid, repeat in approximately 1 year`,
        followUp: 'Repeat thyroid labs in 1 year',
        structuredNotes: {
          labResults: {
            hemoglobin: '12.8 g/dL (improved)',
            TSH: '5.8 mIU/L (mildly elevated above range)',
            freeT4: '0.9 ng/dL (low-normal)'
          },
          clinicalNotes: 'TSH now above reference range with low-normal free T4. Interpreted as possible subclinical hypothyroidism - could be stress, lab variation, or early dysfunction. Plan to monitor. No recall or alarm set for follow-up.'
        },
        riskAlerts: ['Elevated TSH not treated', 'No firm follow-up scheduled']
      }
    })
    console.log('Created Alex Morgan consultation 2: Subclinical hypothyroidism identified (3 years ago)')

    // Consultation 3: About 18 months ago - Urgent care panic episode
    const visit3Date = new Date(today)
    visit3Date.setMonth(today.getMonth() - 18)
    visit3Date.setHours(19, 15, 0, 0)

    await prisma.consultation.create({
      data: {
        patientId,
        hcpId: 'Dr. James Morrison',
        type: 'Urgent Care',
        startTime: visit3Date,
        endTime: new Date(visit3Date.getTime() + 45 * 60000),
        status: 'Completed',
        chiefComplaint: 'Acute episode of racing heart, chest tightness, tremor, sense of doom',
        hpi: `Patient presents to urgent care after episode at work approximately 2 hours ago. During high-pressure deadline, after several nights of poor sleep and heavy caffeine intake, suddenly experienced: rapid heartbeat, chest tightness, lightheadedness, tremulousness, and strong sense of impending doom. Episode lasted approximately 15-20 minutes. By presentation, symptoms have mostly settled. Denies similar prior episodes. Reports high stress at work recently. Has been drinking 4-5 cups of coffee daily. Sleep has been 4-5 hours nightly for past week.`,
        exam: `General: Anxious-appearing but improving. Cardiovascular: Slightly elevated HR at 92, regular rhythm, no murmurs. Lungs: Clear bilaterally. Neuro: Alert, oriented, no focal deficits. Tremor resolved. ECG: Normal sinus rhythm, no ST changes, no arrhythmia. Vitals: BP 128/82, HR 92, Temp 98.4°F, O2 sat 99%.`,
        assessment: `1. Acute anxiety/panic-like episode
2. Precipitated by stress, sleep deprivation, excessive caffeine
3. ECG reassuring - no cardiac etiology identified`,
        plan: `1. Reassurance provided - ECG normal, symptoms consistent with panic/anxiety
2. Reduce caffeine intake significantly
3. Improve sleep hygiene
4. Information provided about counseling options if episodes recur
5. Return if chest pain, syncope, or worsening symptoms`,
        followUp: 'Return if symptoms recur or worsen',
        structuredNotes: {
          clinicalNotes: 'History of borderline thyroid function mentioned in past medical history but no thyroid tests ordered at this visit. Episode attributed entirely to stress/caffeine/sleep deprivation.',
          ecgFindings: 'Normal sinus rhythm, rate 88, normal axis, no ST-T changes'
        },
        riskAlerts: ['Thyroid connection not explored', 'Palpitations could be thyroid-related']
      }
    })
    console.log('Created Alex Morgan consultation 3: Urgent care panic episode (18 months ago)')

    // Consultation 4: About 9 months ago - Annual physical with clearer thyroid signal
    const visit4Date = new Date(today)
    visit4Date.setMonth(today.getMonth() - 9)
    visit4Date.setHours(9, 0, 0, 0)

    await prisma.consultation.create({
      data: {
        patientId,
        hcpId: 'Dr. Sarah Chen',
        type: 'Annual Physical',
        startTime: visit4Date,
        endTime: new Date(visit4Date.getTime() + 40 * 60000),
        status: 'Completed',
        chiefComplaint: 'Annual wellness exam; ongoing fatigue, dry skin, hair thinning, constipation',
        hpi: `Annual wellness visit. Patient reports still feeling chronically tired and "slowed down." Ongoing dry skin despite moisturizers. Continued hair thinning - notices more hair loss when washing. Bowels are "better than before but still not daily." Weight has continued to creep up. Describes mood as low and unmotivated but still meeting basic obligations at work. Menstrual cycles, previously very regular, have become slightly irregular - some cycles shorter, some longer - and still fairly heavy on first 2 days with some clotting.`,
        exam: `General: Well but tired-appearing. Skin: Dry and cool, especially hands and forearms. Hair: Diffuse thinning. HEENT: Thyroid mildly enlarged, smooth, non-tender, no discrete nodules. Cardiovascular: Bradycardic at 58, regular, no murmurs. Lungs: Clear. Neuro: Slightly delayed relaxation of deep tendon reflexes. Vitals: BP 122/78, HR 58, Temp 97.6°F, Weight 143 lbs.`,
        assessment: `1. Evolving primary hypothyroidism - clinical picture increasingly consistent
2. Dyslipidemia - likely related to thyroid
3. Fatigue, constipation, dry skin, hair thinning, weight gain, menstrual irregularity - all potentially thyroid-related
4. Low mood - thyroid contribution likely`,
        plan: `1. Comprehensive metabolic panel, lipid panel, CBC, thyroid panel
2. Continue monitoring thyroid - consider treatment if TSH rises further or symptoms worsen
3. Lifestyle modifications for cholesterol (diet, exercise)
4. Follow up to review results`,
        followUp: 'Follow up in 4-6 weeks for lab review',
        structuredNotes: {
          labResults: {
            totalCholesterol: '218 mg/dL (borderline high)',
            LDL: '142 mg/dL (borderline high)',
            HDL: '52 mg/dL',
            triglycerides: '120 mg/dL',
            hemoglobin: '11.8 g/dL (modestly low)',
            TSH: '7.2 mIU/L (clearly elevated)',
            freeT4: '0.8 ng/dL (low end of normal)'
          },
          clinicalNotes: 'TSH now clearly elevated with free T4 at low-normal. Very suggestive of evolving primary hypothyroidism. Note framed as "keep an eye on" rather than requiring immediate treatment. No thyroid medication started. No firm reminder set.'
        },
        riskAlerts: ['Symptomatic hypothyroidism not treated', 'Multiple organ systems affected', 'Lipid changes secondary to thyroid']
      }
    })
    console.log('Created Alex Morgan consultation 4: Annual physical with clear hypothyroidism (9 months ago)')

    // Consultation 5: About 4 months ago - Gynecology visit
    const visit5Date = new Date(today)
    visit5Date.setMonth(today.getMonth() - 4)
    visit5Date.setHours(11, 30, 0, 0)

    await prisma.consultation.create({
      data: {
        patientId,
        hcpId: 'Dr. Amanda Foster',
        type: 'Consultation',
        startTime: visit5Date,
        endTime: new Date(visit5Date.getTime() + 35 * 60000),
        status: 'Completed',
        chiefComplaint: 'Irregular menstrual cycles, heavy periods, fatigue around menses',
        hpi: `Patient referred to gynecology for evaluation of menstrual changes. Reports cycles have become more irregular over past year - ranging from 24 to 35 days. Flow is heavier, especially days 1-2, with increased clotting. Feels especially worn out around periods and generally more fatigued than expected for her age. Concerned about what might be causing these changes. No intermenstrual bleeding. No dyspareunia. Last Pap smear 2 years ago, normal.`,
        exam: `Pelvic exam: External genitalia normal. Vagina and cervix appear healthy. Bimanual exam: Uterus normal size and shape, anteverted, non-tender. Adnexa: No masses or tenderness bilaterally. No cervical motion tenderness. Vitals: BP 116/74, HR 70.`,
        assessment: `1. Menorrhagia with irregular cycles
2. Iron deficiency anemia - secondary to menstrual blood loss
3. Known thyroid dysfunction - likely contributing to menstrual irregularity and fatigue`,
        plan: `1. Pelvic ultrasound to evaluate for structural abnormalities
2. Repeat CBC, iron studies
3. Pregnancy test - negative
4. Discussed hormonal options (OCP, IUD) to regulate cycles and reduce bleeding - patient wants to "talk to primary first"
5. STRONGLY recommend follow up with primary care or endocrinology to address thyroid - this is likely contributing to menstrual changes and fatigue
6. Iron-rich diet counseling, consider restarting iron supplementation`,
        followUp: 'Follow up after ultrasound results; coordinate with primary care for thyroid management',
        structuredNotes: {
          labResults: {
            hemoglobin: '11.4 g/dL (mild anemia)',
            ferritin: '15 ng/mL (low)',
            TSH: '7.8 mIU/L (elevated)',
            pregnancyTest: 'Negative'
          },
          imagingResults: 'Pelvic ultrasound: Normal uterus, no fibroids, normal endometrial stripe, ovaries unremarkable',
          clinicalNotes: 'TSH remains significantly elevated. Explicitly noted as likely contributor to menstrual changes and fatigue. Patient advised to follow up with primary care or endocrinology for thyroid management.'
        },
        riskAlerts: ['Thyroid dysfunction causing secondary symptoms', 'Patient has not yet followed up for thyroid treatment', 'Fragmented care across multiple providers']
      }
    })
    console.log('Created Alex Morgan consultation 5: Gynecology visit (4 months ago)')

    // Consultation 6: Today's completed appointment with Heidi transcript
    const todayVisit = new Date(today)
    todayVisit.setHours(17, 0, 0, 0) // 5:00 PM appointment

    await prisma.consultation.create({
      data: {
        patientId,
        hcpId: 'Dr. Sarah Chen',
        type: 'Follow-up',
        startTime: todayVisit,
        endTime: new Date(todayVisit.getTime() + 30 * 60000),
        status: 'Completed',
        chiefComplaint: 'Follow-up for ongoing fatigue, mood symptoms, and work stress',
        hpi: `Patient reports feeling overwhelmed and depleted following recent work project completion (Phoenix Initiative). Describes pattern of emotional exhaustion after high-pressure periods. Experiencing difficulty maintaining social connections when stressed. Cancelled social plans with friends due to exhaustion. Reports drinking most of a bottle of wine alone on Friday evening as coping mechanism for overwhelm and guilt. Notes pattern of using alcohol to numb difficult feelings followed by increased self-criticism. Demonstrates hypervigilance in professional settings with tendency to anticipate problems and manage others' emotional responses.`,
        exam: `Mental Status Examination: Patient demonstrates good insight into behavioural patterns. Able to reflect on emotional responses and make connections between current experiences and childhood dynamics. Reports feeling "hollowed out" after work demands. Experiences guilt about social withdrawal. Describes emotional exhaustion requiring recovery periods. Shows pattern of performing rather than authentically engaging in social and professional situations.`,
        assessment: `1. Work-related stress with emotional exhaustion pattern
2. Anxiety symptoms - constant vigilance, hypervigilance around managing others' emotions, fear of disappointment and criticism
3. Avoidance behaviours when feeling depleted
4. Pattern of alcohol use as maladaptive coping mechanism
5. Insight into connection between childhood role as emotional caretaker and current workplace hypervigilance
6. Successfully resisted unhealthy coping behaviours (contacting previous romantic interest)
7. Made progress in authentic communication with friend`,
        plan: `1. Trial small boundary experiment at work - saying "let me check my capacity" instead of immediate yes
2. If returning to dating, practice internal focus - pay attention to own feelings rather than managing others' perceptions
3. Mindful awareness of alcohol use - notice the "why" behind reaching for wine (relaxation vs numbing)
4. Continue work on self-compassion and reducing harsh self-judgment
5. Practice clearer, kinder communication even when uncomfortable
6. Remember progress made - not texting Liam, honest conversation with Chloe`,
        followUp: 'Follow up in 2 weeks, same time',
        transcriptionText: `So settle in. How have the last couple of weeks unfolded for you, Alex? Anything particularly standing out, good or bad? Unfolded. That's a good word. It feels tangled, maybe? Not disastrously so, just messy. It's been busy, which is part of it. Work has been absolutely relentless. We finally launched that big project I was dreading. You know, the Phoenix Initiative, they dramatically called it. Ah, yes. Phoenix. The one causing those late nights a few weeks back. How did the launch actually go? Technically, fine. Smooth even. Minimal glitches. Client seemed happy. My boss, Sarah, even gave me a sort of public nod in the team meeting, which was unexpected. But internally, it was like running a marathon I hadn't trained for and then being expected to immediately start planning the next one. I felt hollowed out afterwards, like, completely spent. And the nod from Sarah, it was weird. It felt performative, Or maybe I'm just projecting because I felt like I was performing the whole time. Tell me more about that feeling of performing. What did that look like, feel like during the launch week? It was constant vigilance, making sure every email was perfectly worded, double checking everyone else's work without looking like I was micromanaging, anticipating problems that might not even exist, smiling through status meetings where I felt like screaming, saying, Yes, absolutely. I can get that to you by end of day, when my internal monologue was just a string of expletives. It was that old familiar feeling, the need to be the capable, unflappable one, the one who holds it all together so no one else has to worry, or worse, so no one gets annoyed at me. That resonates with what we've explored before, That sense of responsibility for managing the emotional temperature of a room or a project in this case. Taking on the burden to prevent what? What's the feared outcome if you weren't that capable, unflappable one? Disappointment, I guess. Criticism. Someone thinking I'm not up to the job, Sarah relying on me less, maybe even losing the respect of the team, or fundamentally just not being liked, not being seen as valuable. It sounds so basic when I say it out loud, but it feels huge in the moment. It feels like if I drop one ball, the whole illusion shatters, and they'll see I'm just scrambling. Like that feeling I used to get as a kid, trying to make sure mom wasn't upset about dad being late again, tidying things, making her tea, trying to be good so the tension would just stop. That connection feels significant. The hypervigilance at work mirroring that childhood role of trying to manage parental emotions to maintain a sense of stability or safety by being good or capable. And the cost both then and now seems to be this feeling of being hollowed out of performing rather than genuinely experiencing or expressing your own needs or limits. Exactly. And it's exhausting. Utterly exhausting. After the launch, on Friday night, I just crashed. I had plans to meet up with Chloe and Sam just for a casual drink, but I couldn't face it. I canceled last minute, made some vague excuse about feeling unwell, which wasn't entirely untrue, I suppose. I felt physically drained. But mostly, I just felt empty and guilty for canceling. Guilty towards Chloe and Sam? Yeah. Because they were looking forward to it. And I know Chloe's been having a tough time with her mom's health stuff, and I wanted to be there for her. But the thought of having to put on a social face even with close friends, it felt like another performance I just didn't have the energy for. So I stayed home, ordered pizza, watched some mindless TV, and ended up opening a bottle of wine. How did that feel? Staying home the wine initially? Relief. Huge relief. Just silence. No demands. No need to anticipate anyone's need. S. The pizza was good, greasy comfort food. The first glass of wine, it felt like it loosened something tight in my chest, like I could finally exhale properly. But then, I didn't just have one glass. I think I finished most of the bottle, not intentionally really, just topping up while watching this incredibly bland reality show. And then I felt not better, just fuzzy and a bit numb. And the guilt about canceling on Chloe and Sam came back, but sort of muffled, less sharp. And then I woke up Saturday morning feeling dehydrated and groggy and even more annoyed with myself. So the wine provided a temporary numbing, a way to soften the edges of the exhaustion and the guilt, but ultimately led to feeling worse physically and perhaps emotionally the next day. Yeah. It's such a stupid cycle. I use it to cope with feeling overwhelmed or anxious, and then I feel bad about using it or about how much I used, and that just adds another layer of ugh to everything. It wasn't even a fun night in. It was just escaping. And not even escaping well. It wasn't like I was thinking deep thoughts or having revelations, just marinating in low level self pity and cheap sauvignon blanc. It sounds like the function of the alcohol in that moment was primarily about shutting down difficult feelings, the exhaustion, the guilt, the pressure, rather than enhancing enjoyment or connection. Totally. Connection was the last thing I wanted. I ignored a couple of texts that came through. Just wanted to be left alone in my little numb bubble, which then, of course, makes me feel isolated. Catch twenty two. The isolation that follows the attempt to cope by withdrawing. That also sounds like a familiar pattern we've touched upon. Protecting yourself by pulling away, but then feeling the loneliness of that distance. Yeah. It's like, I crave connection, but the effort involved in maintaining it, especially when I'm already depleted, feels immense. And I get scared I'll do it wrong, say the wrong thing, not be supportive enough, reveal too much of my own mess, or maybe just be boring. So pulling away feels safer sometimes, less risky. But then, yeah, lonely. Like Saturday. I woke up feeling rubbish, scrolled through Instagram seeing photos Chloe had posted from the night before. They'd met up anyway, just the two of them. And I felt this pang of missing out and also, weirdly, a little bit resentful. Resentful towards whom or what? I don't know. Resentful that they could just go out and have fun. Resentful that I felt too drained to join them. Resentful at myself for canceling, resentful at work for draining me, maybe a bit resentful that Chloe didn't text me again later even though I was the one ignoring texts. That sounds awful, doesn't it? It sounds human, Alex. It sounds like a complex mix of feelings stemming from feeling depleted and disconnected. There's the longing to be part of things, the self criticism for not participating, the awareness of the external pressures, work, and maybe underneath that old fear or sensitivity about potentially being forgotten or left out, even when you're the one who stepped back. Does that resonate? That fear of missing out, activating something deeper about attachment, about whether your absence is even noticed or felt? Yeah. Yeah. It does. It's like, if I'm not actively there performing my role as the friend, the colleague, whatever, Do I cease to exist in their minds? Logically, I know that's ridiculous. Chloe and Sam are my friends. They understand. But emotionally, it triggers that insecure part of me, the part that always felt like I had to earn my place, constantly prove my worth, be useful, be present, or risk fading away. Like with dad, maybe. If he wasn't focused on if mom and I weren't catering to his moods, he'd just disappear into his own world or out the door. There was always this feeling that connection was conditional and required constant effort from my side. That parallel feels very potent. The fear that connection is conditional on your active performance, your effort, your presence, and when you're too depleted to perform, the anxiety spikes. Not just about letting others down, but about your own place, your own value, being precarious. Precisely. So Saturday was a write off. Sunday, I tried to rally. I forced myself to go for a run, which did help a bit. Cleared my head, then I called my mom. How was that? Oh, you know, it was fine. Predictable. She asked about work. I gave her the edited highlights. Yes. Launch went well. Very busy. She talked about her garden for ten minutes, the neighbor's cat, her bridge club drama, standard stuff. Then she asked if I was seeing anyone. Ah, the million dollar question. Always. And I gave the usual vague non answer. Oh, you know, just busy with work. And then she launched into this story about my cousin Jessica's new boyfriend, how wonderful he is, how happy they are, how they're already talking about moving in together, and it wasn't malicious. I know she doesn't mean it that way, but just landed so heavily, especially after the weekend I'd had. It felt like another comparison, another benchmark I wasn't meeting. So even a seemingly innocuous conversation with your mom tapped into those feelings of inadequacy or not measuring up that were already simmering? Yeah. And it made me think about, well, about dating or the lack thereof. I did actually go on a date the week before last, just before the launch craziness hit peak levels. Oh, you hadn't mentioned that. How did it come about? It was through that app I occasionally dip in and out of. Hinge, I think. This guy, Mark, seemed nice enough in his messages. Finance bro type, but seemed to have a bit more depth than usual. We met for a drink after work on Tuesday. Yeah. Tuesday. And how was it? It was okay. Just okay. The conversation flowed alright. He asked questions. I asked questions. We talked about work, travel, the usual first date stuff. He was perfectly pleasant. But I felt myself doing it again. Performing, being the cool, easygoing, interesting date. Laughing a bit too readily at jokes that weren't that funny. Sharing anecdotes designed to make me sound adventurous or witty. Carefully curating myself. That sounds exhausting, especially layered on top of the work performance. It was. And I realized halfway through, I wasn't really listening to him properly. I was too busy monitoring myself, managing his perception of me, and I also wasn't feeling anything really. No spark. No real curiosity about him as a person beyond whether he liked me, which is a terrible way to approach dating, I know. What do you think was driving that focus on his perception of you, rather than your own experience or connection with him? Fear, probably. Fear of rejection? Fear of silence? Fear of being found boring or awkward? It's easier to keep the performance going to fill the space with this curated version of myself than to risk just being me and finding out that me isn't what they want. It's that same pattern, isn't it? Needing external validation to feel okay, seeking approval rather than authentic connection. It does sound like the same underlying dynamic playing out in a different context, the performance geared towards securing liking or approval at the expense of genuine presence and connection, and perhaps also preventing you from assessing if you actually like or connect with them. Exactly. Because I left the date, and he texted later saying he had a great time and would like to see me again. And my first reaction wasn't yay or even let me think. It was dread. Like, oh god. Now I have to decide. Now I might have to let him down, or worse, go on a second date and keep up the act. So the positive feedback which part of you craves actually created more anxiety in this instance? Yes. Isn't that messed up? Because I spent the whole date trying to get him to like me, and then when he apparently did, I just wanted to run away. It felt like a trap, like I'd accidentally succeeded in selling him a product that wasn't actually me, and now I'd have to keep up the false advertising. That feeling of being trapped by your own success in performing, it speaks volumes about how disconnected that performance feels from your authentic self. If genuine connection felt possible, perhaps his interest wouldn't feel like a burden, but an opportunity? Maybe. I don't know. What does genuine connection even look like on a first date? Is it realistic to expect that? Maybe okay is normal. Maybe the problem is me expecting too much or being too quick to find fault or bail. Am I just self sabotaging any chance of a relationship because I'm scared? Those are important questions. It's possible to be both discerning and fearful. It's possible that okay sometimes is just okay and not a basis for more. And it's also possible that fear is leading you to shut down potential connections prematurely or to approach them in a way that prevents real connection from developing. Like focusing on performance, it's rarely just one thing. How did you leave things with Mark? Alex, I texted back something noncommittal a day later, like, hey. Great meeting you too. This week is crazy with the work launch. Can I let you know about getting together again once the dust settles? Which was technically true, but also kicking the can down the road. He just replied, sure. Sounds good. And I haven't contacted him, and I feel guilty about that too now. Leading him on, maybe? Being flaky. It sounds like you were trying to buy yourself time and space, perhaps hoping the decision would become clearer or maybe just avoiding the discomfort of a more direct rejection. Avoidance is a powerful coping mechanism, isn't it? We saw it with canceling on your friends and now here with Mark. It provides temporary relief from anxiety or discomfort, but often creates those secondary feelings. Guilt, self criticism, isolation. Avoidance and wine, my dynamic duo. It's just, god, I felt so pathetic after that phone call with mom on Sunday. Hearing about Jessica and her perfect boyfriend after my okay date that I'm now ghosting and my weekend of isolating myself with cheap wine, it just highlighted everything I feel I'm doing wrong. That sounds incredibly painful. Like, the external comparison just amplified your own internal criticisms. Yeah. And I nearly nearly texted Lim. Yeah. Just for I don't know. Comfort, validation, a distraction, it was a stupid impulse. Came out of nowhere, really. Just this sudden urge to reach out to someone familiar, someone who, well, someone who has made me feel desired in the past even if it was complicated and ultimately not good for me. What stopped you? I actually typed out a message, something casual like, hey. How are things? And then I just stared at it. And I thought about our last conversation, the one where I finally said I couldn't do the back and forth thing anymore. And I thought about how reaching out now, especially when I was feeling low and vulnerable, would just pull me right back into that dynamic. The ambiguity, the insecurity, the feeling of never quite knowing where I stood, which is exactly the stuff I'm supposedly trying to get away from. It would be like swapping the Sauvignon Blanc for something harder but equally unhelpful. That sounds like a moment of significant insight and strength, Alex. Recognizing the impulse, understanding its roots in vulnerability, predicting the likely negative consequences, and making a different choice despite the urge. That's huge. You think? It felt more like narrowly avoiding a really dumb mistake. White knuckling it. Sometimes white knuckling it is the strength. It's resisting the familiar unhealthy pattern when it calls to you most strongly. You didn't just react on impulse. You paused. You reflected on past experiences and future consequences, and you chose a path aligned with what you consciously want for yourself, healthier connections, less ambiguity, even when it was the harder choice emotionally in that moment. That takes awareness and resolve. How did you feel after you decided not to send the text? Shaky, actually. A bit restless. Like, I dodged a bullet but was still keyed up. But also slightly proud, maybe? Like, okay. I didn't fall back into that particular hole this time. Small victory. It sounds like more than a small victory. It sounds like you successfully deployed the very skills we work on here, observing your impulse without immediately acting on it, connecting it to your patterns, considering the outcomes, and making a conscious choice. And you tolerated the discomfort that came with not getting the immediate, if ultimately unsatisfying, relief that contacting Liam might have momentarily provided. I hadn't really framed it like that. I was mostly just focused on the fact I'd even wanted to text him, which felt like a failure in itself. The urge isn't the failure. Urges, feelings, impulses, they arise often based on old conditioning, especially when we're stressed or vulnerable. The success lies in how you respond to them. You responded differently this time. What did you do instead, feeling shaky and restless? I actually, I put on some music really loud and did that frantic cleaning thing I do sometimes, scrub the kitchen counters like my life depended on it. It's physical. It's distracting. It makes me feel like I'm regaining some control, I guess. Productive avoidance? Perhaps. Or perhaps channeling that restless energy into a tangible action that does create a sense of order and accomplishment, which can be grounding when internal feelings are chaotic. It certainly sounds healthier than opening another bottle of wine or sending a risky text. How was the rest of your week leading up to today? More work pressure? Work calmed down slightly after the launch fallout. Still busy but manageable. Lots of planning meetings for the next big thing, which feels daunting, but okay. I did manage to see Chloe for coffee yesterday, actually. Oh, good. How was that? Did you talk about canceling on Friday? I did. I apologized properly, explained I'd been completely wiped out by work and just crashed. I didn't go into the whole wine and self pity saga, but I was honest about feeling overwhelmed. How did she respond? She was totally fine about it, Said she completely understood. She'd figured it was something like that. She told me about her evening with Sam, and then she talked more about her mom. It was nice, normal, easy. No performance required. It felt good to just connect. And I realized how much I'd missed that feeling over the weekend. It sounds like a moment of genuine connection built on honesty, at least about the overwhelm and mutual understanding. A contrast to the date with Mark or the impulse to contact Liam. Definitely. And it made me think, maybe that's what I should be aiming for. Not some dazzling spark or perfect performance, but just easy, comfortable. Feeling like I can be myself, tired or stressed or whatever, and it's okay. That sounds like a really valuable insight, Alex. Prioritizing authenticity and ease in your connections rather than performance or external validation. What would it take, do you think, to bring more of that easy, comfortable, authentic quality into other areas, like dating or even managing work stress? God. That's the million dollar question again, isn't it? With work, maybe it's about setting better boundaries, not saying yes to everything immediately, trusting that things won't fall apart if I'm not personally propping them up twenty four seven, delegating more, maybe, Admitting when I am overwhelmed instead of just smiling through it? That feels terrifying, though. Weak. Why does admitting overwhelm feel weak? Where might that belief come from? Alex. From always having to be the capable one, like back home. Mom leaning on me emotionally, dad being unpredictable. There wasn't really space for me to be overwhelmed or vulnerable. I had to be the strong, stable one. Admitting I wasn't coping felt like failing them, letting down the side, making things worse. So I learned to just push through, pretend everything was fine, keep the performance going. So vulnerability became associated with failure or even danger, the danger of things falling apart or of losing your perceived role and value within the family system. And that association seems to persist powerfully in your adult life, particularly at work. It's like my brain knows logically that my colleagues probably wouldn't see me as weak if I asked for help or admitted I was stretched thin. They might even appreciate the honesty, but my gut reaction, my ingrained programming screams, don't do it, danger, weakness, they'll think less of you. That internal conflict is really clear, the logical understanding versus the deeply ingrained emotional programming. Working with that conflict is central to change. Noticing the gut reaction, acknowledging the fear rooted in past experiences, but consciously choosing to act based on your present reality and your adult understanding. It's like you did with the Liam text. You noticed the urge, understood its roots, but chose differently. Perhaps similar small steps could be possible at work, not a sudden confession of total overwhelm, but maybe smaller acts of boundary setting, pushing back gently on a deadline, delegating a minor task, saying, let me check my workload and get back to you, instead of an immediate yes, maybe, little experiments. That sounds less terrifying, like testing the waters, seeing if the world actually ends if I don't immediately agree to everything. It probably won't. Sarah, my boss, she's actually pretty reasonable when you push back calmly. I've seen other people do it. It's just me. I find it so hard. Because for you, it's not just pushing back on a task, it's pushing back against a lifetime of conditioning that told you your value lies in compliance and capability. Each small act of boundary setting is also an act of self definition, of saying your needs and limits matter. Self definition, I like that. It feels more active than just setting boundaries, like I'm carving out my own space. And with dating, how do I apply that easy, comfortable, authentic thing? It feels harder there, more vulnerable. It often is more vulnerable. Perhaps it starts with shifting the focus like you identified earlier, moving the internal spotlight from what do they think of me? Am I performing well enough? To how do I feel in this person's presence? Am I curious about them? Does this feel easy or forced? Am I comfortable? So less external monitoring, more internal check ins? Exactly. Paying attention to your own genuine reactions, thoughts, and feelings during the interaction. Allowing silences perhaps rather than rushing to fill them with performative chat, asking questions you're genuinely curious about, not just ones you think you should ask, and maybe being a little more direct if you're not feeling it, rather than letting things drift into ambiguity. Like with Mark. Could there have been a kinder, clearer way to communicate you didn't see a romantic connection, rather than the non committal text in silence? Probably. I hate letting people down, though. That directness feels potentially hurtful. Rejection can sting, that's true. But is ambiguity, ghosting, or leading someone on ultimately kinder? Often, clarity, even if disappointing, allows everyone to move on more cleanly. And it honors your own feelings too. You're not forcing yourself into something that doesn't feel right or carrying the burden of unspoken intentions. It comes back to that idea of authenticity, being true to your own experience. True. Okay. So more internal focus on dates, less performance, and maybe practicing clearer, kinder communication even when it's uncomfortable. That feels like a direction. Still daunting, but a direction. It's a process, Alex, not an overnight switch. It involves noticing the old patterns as they arise, the urge to perform, to please, to avoid, and consciously choosing little by little to try something different. Celebrating the small victories, like not texting Liam or having that honest coffee with Chloe. Learning from the times it doesn't go perfectly without harsh self judgment. Less harsh self judgment. That's another big one. The internal critic was having a field day last weekend. He often gets loudest when you're feeling depleted or vulnerable. Part of the work is learning to recognize his voice, understand his often misguided protective intentions, and not automatically accept everything he says as truth. Offering yourself some of the compassion you readily offer to others, like Chloe. Yeah. I would never speak to Chloe the way I speak to myself sometimes. It's weird, isn't it? Why is it so much harder to be kind to ourselves? That's a profound question. Often, it's tied to those early experiences again. If kindness and acceptance from others felt conditional or if self criticism was modeled or internalized as a way to motivate or stay safe, it becomes a deeply ingrained habit. Learning self compassion is like learning a new language for many people. It takes practice. What helps you access that kinder part of yourself even fleetingly? You mentioned the run helped on Sunday. Yeah. Physical exertion sometimes cuts through the mental noise. Music helps too sometimes, or getting lost in a really good book, something that takes me out of my own head for a bit and talking things through like this. Hearing you reframe things helps me see them differently. Like the Liam text thing, I saw it as failure. You framed it as strength. That shifts something. Therapy can provide that external perspective, helping to challenge ingrained patterns of thinking and feeling. But, ultimately, the goal is for you to internalize that kinder, more balanced perspective yourself, to become your own compassionate observer and guide. The internal doctor Lee? Perhaps a collaborative internal team. The part that recognizes the patterns, the part that feels the old fear, the part that holds the hope for something different, and the part that can offer compassion along the way. It sounds like despite the challenges of the last couple of weeks, the work stress, the dip into isolation and alcohol, the dating anxieties, you've also had moments of real clarity and made choices that align with the direction you want to go. You navigated the work launch. You reconnected authentically with Chloe. You resisted a significant unhealthy impulse with Liam, and you're reflecting deeply on these patterns. That's progress even if it feels messy. Messy progress. I guess I can live with that. Better than feeling stuck anyway. Just need to remember the progress part when I'm feeling stuck in the messy part, like last weekend. Exactly. Holding on to the bigger picture. Remembering t. Hat setbacks or difficult moments don't erase the progress made. They're part of the process. So looking ahead to the next couple of weeks, what feels important to focus on or perhaps experiment with based on our conversation today? Maybe trying one small boundary experiment at work, like saying, let me check my capacity instead of just yes. And if I do decide to dip back into the dating app world, trying that internal focus thing, paying more attention to how I'm feeling rather than just managing their perception, and maybe being mindful of the wine. Not necessarily banning it, but noticing why I'm reaching for it. Am I genuinely relaxing and enjoying it, or am I just trying to numb something out? Those sound like very concrete manageable intentions. Small experiments, increased awareness, and noticing the why. Behind the wine ties back into that goal of responding to your feelings constructively rather than just reacting or avoiding. How does it feel thinking about those intentions? Feels okay. Doable. Still a bit nerve wracking, the work boundary thing especially, but doable. It's helpful to break it down like that. Good. Remember to be kind to yourself in the process. If an experiment doesn't go as planned, it's data, not failure. It tells us something we can work with next time. We're just about out of time for today, Alex. It feels like we covered a lot of ground, connecting the recent events back to those core themes of performance, connection, avoidance, and self criticism, but also highlighting moments of strength and insight. Yeah. Thanks, Doctor. Li. Helps unravels the tangle a bit. Even just talking about the messy bits makes them feel less overwhelming. That's often the case. Giving voice to the internal experience can make it feel more manageable. So continue noticing, continue experimenting gently, and we can pick up wherever you are in two weeks. Same time? Yep. Sounds good. Thanks again. See you then. Take care, Alex.`,
        structuredNotes: {
          heidiSessionId: '750333248699968106772992654159',
          duration: '1824 seconds (30 minutes)',
          noteStatus: 'COMPLETED',
          backgroundInformation: {
            familyHistory: 'Father described as unpredictable, mother relied on Alex emotionally during childhood',
            developmentalHistory: 'Childhood role involved managing parental emotions and maintaining household stability to reduce tension',
            occupationalHistory: 'Currently employed in demanding role, recently completed Phoenix Initiative project launch which was technically successful but personally exhausting'
          },
          presentingConcerns: {
            currentIssues: 'Reports feeling overwhelmed and depleted following recent work project completion, describes pattern of emotional exhaustion after high-pressure periods, experiencing difficulty maintaining social connections when stressed'
          },
          psychosocialAssessment: {
            livingSituation: 'Lives independently, cancelled social plans with friends Chloe and Sam due to exhaustion',
            supportSystem: 'Maintains friendships with Chloe and Sam, had reconnecting coffee meeting with Chloe where discussed work overwhelm honestly',
            substanceUse: 'Reports drinking most of a bottle of wine alone on Friday evening following work stress, describes this as coping mechanism for overwhelm and guilt, notes pattern of using alcohol to numb difficult feelings followed by increased self-criticism'
          },
          psychologicalAssessment: {
            mentalStatusExamination: 'Demonstrates good insight into behavioural patterns, able to reflect on emotional responses and make connections between current experiences and childhood dynamics',
            emotionalFunctioning: 'Reports feeling "hollowed out" after work demands, experiences guilt about social withdrawal, describes emotional exhaustion requiring recovery periods',
            behavioralObservations: 'Shows pattern of hypervigilance in professional settings, tendency to anticipate problems and manage others\' emotional responses, demonstrates avoidance behaviours when feeling depleted'
          },
          adhdAndMentalHealthAssessment: {
            anxietyDisorderSymptoms: 'Reports constant vigilance at work, hypervigilance around managing others\' emotions, fear of disappointment and criticism, anxiety about not meeting expectations',
            otherMentalHealthDiagnosisSymptoms: 'Describes pattern of performing rather than authentically engaging in social and professional situations, reports fear that connection is conditional on active performance and effort'
          },
          summary: {
            findingsAndConclusions: 'Alex demonstrates insight into patterns of emotional exhaustion following high-pressure work periods, shows awareness of connection between childhood role as emotional caretaker and current workplace hypervigilance, successfully resisted unhealthy coping behaviours including contacting previous romantic interest, made progress in authentic communication with friend, identified goals for boundary-setting at work and more genuine approach to dating'
          }
        },
        riskAlerts: ['Alcohol use as maladaptive coping mechanism', 'Pattern of social withdrawal when stressed', 'Unaddressed hypothyroidism (TSH 7.8)'],
        guidelineRefs: null,
        drugWarnings: null,
        patientContext: {
          reasonForVisit: 'Patient requested follow-up to discuss ongoing symptoms including fatigue, low mood, and difficulty coping with work stress. Has been seen by multiple specialists over past 5 years.',
          pendingIssues: [
            'Unaddressed hypothyroidism (TSH 7.8, not on treatment)',
            'Recurrent iron deficiency anemia',
            'Menstrual irregularity',
            'Work-related stress and possible anxiety disorder'
          ],
          keyHistoryPoints: [
            'TSH progressively rising over 5 years (4.2 → 5.8 → 7.2 → 7.8)',
            'Multiple classic hypothyroid symptoms present',
            'Panic-like episode 18 months ago - thyroid not reconsidered',
            'Gynecology explicitly recommended thyroid follow-up 4 months ago',
            'Care fragmented across primary care, urgent care, and gynecology'
          ]
        }
      }
    })
    console.log('Created Alex Morgan consultation 6: Today\'s completed appointment with Heidi transcript')
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
