import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.imagingStudy.deleteMany()
  await prisma.labResult.deleteMany()
  await prisma.medication.deleteMany()
  await prisma.consultation.deleteMany()
  await prisma.patient.deleteMany()

  // Create comprehensive patient data
  const patientsData = [
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      dob: new Date('1985-03-15'),
      gender: 'Female',
      phone: '+1-555-0101',
      email: 'sarah.johnson@email.com',
      address: '123 Maple Street, Boston, MA 02108',
      labels: ['Type 2 Diabetes', 'Hypertension'],
      allergies: ['Penicillin', 'Sulfa drugs'],
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        weight: 150,
        height: 165,
        bmi: 27.2,
        oxygenSaturation: 98
      },
      emergencyContact: {
        name: 'John Johnson',
        relationship: 'Spouse',
        phone: '+1-555-0199'
      },
      insuranceInfo: {
        provider: 'Blue Cross Blue Shield',
        policyNumber: 'BCBS-123456789',
        groupNumber: 'GRP-456'
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
      labels: ['Asthma', 'Seasonal Allergies'],
      allergies: ['Peanuts', 'Shellfish'],
      vitals: {
        bloodPressure: '118/75',
        heartRate: 68,
        temperature: 98.4,
        weight: 175,
        height: 178,
        bmi: 24.1,
        oxygenSaturation: 97
      },
      emergencyContact: {
        name: 'Lisa Chen',
        relationship: 'Spouse',
        phone: '+1-555-0198'
      },
      insuranceInfo: {
        provider: 'Aetna',
        policyNumber: 'AET-987654321',
        groupNumber: 'GRP-789'
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
      labels: ['Seasonal Allergies', 'Anxiety'],
      allergies: ['Latex'],
      vitals: {
        bloodPressure: '115/70',
        heartRate: 75,
        temperature: 98.5,
        weight: 140,
        height: 160,
        bmi: 24.7,
        oxygenSaturation: 99
      },
      emergencyContact: {
        name: 'Maria Rodriguez',
        relationship: 'Mother',
        phone: '+1-555-0197'
      },
      insuranceInfo: {
        provider: 'UnitedHealthcare',
        policyNumber: 'UHC-456789123',
        groupNumber: 'GRP-123'
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
      labels: ['COPD', 'Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
      allergies: ['Codeine', 'Aspirin'],
      vitals: {
        bloodPressure: '135/85',
        heartRate: 78,
        temperature: 98.7,
        weight: 185,
        height: 172,
        bmi: 31.3,
        oxygenSaturation: 94
      },
      emergencyContact: {
        name: 'Patricia Williams',
        relationship: 'Spouse',
        phone: '+1-555-0196'
      },
      insuranceInfo: {
        provider: 'Medicare',
        policyNumber: 'MED-789123456',
        groupNumber: 'MED-A'
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
      labels: ['Migraine', 'IBS'],
      allergies: [],
      vitals: {
        bloodPressure: '110/68',
        heartRate: 70,
        temperature: 98.3,
        weight: 135,
        height: 163,
        bmi: 23.1,
        oxygenSaturation: 98
      },
      emergencyContact: {
        name: 'David Anderson',
        relationship: 'Spouse',
        phone: '+1-555-0195'
      },
      insuranceInfo: {
        provider: 'Cigna',
        policyNumber: 'CIG-321654987',
        groupNumber: 'GRP-321'
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
      labels: ['CAD', 'Hypertension', 'Hyperlipidemia', 'Post-MI'],
      allergies: ['Contrast dye'],
      vitals: {
        bloodPressure: '140/90',
        heartRate: 82,
        temperature: 98.6,
        weight: 195,
        height: 175,
        bmi: 32.6,
        oxygenSaturation: 96
      },
      emergencyContact: {
        name: 'Margaret Taylor',
        relationship: 'Spouse',
        phone: '+1-555-0194'
      },
      insuranceInfo: {
        provider: 'Medicare',
        policyNumber: 'MED-159753486',
        groupNumber: 'MED-B'
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
      labels: ['Anxiety', 'Depression'],
      allergies: ['Sulfa drugs'],
      vitals: {
        bloodPressure: '112/72',
        heartRate: 74,
        temperature: 98.5,
        weight: 128,
        height: 158,
        bmi: 22.9,
        oxygenSaturation: 99
      },
      emergencyContact: {
        name: 'Jose Garcia',
        relationship: 'Father',
        phone: '+1-555-0193'
      },
      insuranceInfo: {
        provider: 'Humana',
        policyNumber: 'HUM-753951852',
        groupNumber: 'GRP-852'
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
      labels: ['Chronic Lower Back Pain', 'Osteoarthritis'],
      allergies: ['NSAIDs'],
      vitals: {
        bloodPressure: '122/78',
        heartRate: 71,
        temperature: 98.4,
        weight: 180,
        height: 183,
        bmi: 26.9,
        oxygenSaturation: 98
      },
      emergencyContact: {
        name: 'Jennifer Miller',
        relationship: 'Spouse',
        phone: '+1-555-0192'
      },
      insuranceInfo: {
        provider: 'Blue Cross Blue Shield',
        policyNumber: 'BCBS-951357468',
        groupNumber: 'GRP-753'
      }
    }
  ]

  for (const patientData of patientsData) {
    const patient = await prisma.patient.create({
      data: patientData
    })

    console.log(`Created patient: ${patient.firstName} ${patient.lastName}`)

    // Create medications based on patient's conditions
    const medications = getMedicationsForPatient(patient)
    for (const med of medications) {
      await prisma.medication.create({
        data: {
          ...med,
          patientId: patient.id
        }
      })
    }

    // Create lab results
    const labResults = getLabResultsForPatient(patient)
    for (const lab of labResults) {
      await prisma.labResult.create({
        data: {
          ...lab,
          patientId: patient.id
        }
      })
    }

    // Create imaging studies
    const imagingStudies = getImagingStudiesForPatient(patient)
    for (const imaging of imagingStudies) {
      await prisma.imagingStudy.create({
        data: {
          ...imaging,
          patientId: patient.id
        }
      })
    }

    // Create consultations
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
      const hcps = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis']

      const status = i === 0 ? statuses[Math.floor(Math.random() * statuses.length)] : 'Completed'

      await prisma.consultation.create({
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
    }
  }

  console.log('Seeding completed!')
}

// Helper functions to generate realistic medical data

function getMedicationsForPatient(patient: any) {
  const medications = []
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

  if (patient.labels.includes('Type 2 Diabetes') || patient.labels.includes('Diabetes')) {
    medications.push({
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      route: 'Oral',
      prescribedBy: 'Dr. Smith',
      startDate: oneYearAgo,
      status: 'Active',
      instructions: 'Take with meals',
      refills: 3
    })
  }

  if (patient.labels.includes('Hypertension')) {
    medications.push({
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      route: 'Oral',
      prescribedBy: 'Dr. Johnson',
      startDate: sixMonthsAgo,
      status: 'Active',
      instructions: 'Take in the morning',
      refills: 5
    })
  }

  if (patient.labels.includes('Asthma')) {
    medications.push(
      {
        name: 'Albuterol',
        dosage: '90mcg',
        frequency: 'As needed',
        route: 'Inhaled',
        prescribedBy: 'Dr. Williams',
        startDate: oneYearAgo,
        status: 'Active',
        instructions: 'Use as rescue inhaler for acute symptoms',
        refills: 2
      },
      {
        name: 'Fluticasone',
        dosage: '220mcg',
        frequency: 'Twice daily',
        route: 'Inhaled',
        prescribedBy: 'Dr. Williams',
        startDate: sixMonthsAgo,
        status: 'Active',
        instructions: 'Maintenance inhaler - rinse mouth after use',
        refills: 3
      }
    )
  }

  if (patient.labels.includes('Hyperlipidemia')) {
    medications.push({
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      route: 'Oral',
      prescribedBy: 'Dr. Brown',
      startDate: oneYearAgo,
      status: 'Active',
      instructions: 'Take in the evening',
      refills: 6
    })
  }

  if (patient.labels.includes('COPD')) {
    medications.push({
      name: 'Tiotropium',
      dosage: '18mcg',
      frequency: 'Once daily',
      route: 'Inhaled',
      prescribedBy: 'Dr. Davis',
      startDate: oneYearAgo,
      status: 'Active',
      instructions: 'Use same time each day',
      refills: 3
    })
  }

  if (patient.labels.includes('CAD') || patient.labels.includes('Post-MI')) {
    medications.push(
      {
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        route: 'Oral',
        prescribedBy: 'Dr. Smith',
        startDate: oneYearAgo,
        status: 'Active',
        instructions: 'Take with food',
        refills: 12
      },
      {
        name: 'Metoprolol',
        dosage: '50mg',
        frequency: 'Twice daily',
        route: 'Oral',
        prescribedBy: 'Dr. Smith',
        startDate: oneYearAgo,
        status: 'Active',
        instructions: 'Do not abruptly discontinue',
        refills: 6
      }
    )
  }

  if (patient.labels.includes('Migraine')) {
    medications.push({
      name: 'Sumatriptan',
      dosage: '50mg',
      frequency: 'As needed',
      route: 'Oral',
      prescribedBy: 'Dr. Johnson',
      startDate: sixMonthsAgo,
      status: 'Active',
      instructions: 'Take at onset of migraine. Max 200mg/day',
      refills: 2
    })
  }

  if (patient.labels.includes('Anxiety') || patient.labels.includes('Depression')) {
    medications.push({
      name: 'Sertraline',
      dosage: '50mg',
      frequency: 'Once daily',
      route: 'Oral',
      prescribedBy: 'Dr. Williams',
      startDate: sixMonthsAgo,
      status: 'Active',
      instructions: 'Take in the morning with or without food',
      refills: 3
    })
  }

  if (patient.labels.includes('Chronic Lower Back Pain')) {
    medications.push({
      name: 'Cyclobenzaprine',
      dosage: '10mg',
      frequency: 'At bedtime',
      route: 'Oral',
      prescribedBy: 'Dr. Brown',
      startDate: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
      status: 'Active',
      instructions: 'May cause drowsiness',
      refills: 1
    })
  }

  return medications
}

function getLabResultsForPatient(patient: any) {
  const labResults = []
  const now = new Date()
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())

  // Basic Metabolic Panel for most patients
  labResults.push({
    testName: 'Complete Metabolic Panel',
    testType: 'Blood',
    orderedBy: 'Dr. Smith',
    performedDate: threeMonthsAgo,
    status: 'Completed',
    results: {
      tests: [
        { name: 'Glucose', value: patient.labels.includes('Diabetes') ? 145 : 95, unit: 'mg/dL', referenceRange: '70-100', status: patient.labels.includes('Diabetes') ? 'High' : 'Normal' },
        { name: 'Sodium', value: 140, unit: 'mmol/L', referenceRange: '136-145', status: 'Normal' },
        { name: 'Potassium', value: 4.2, unit: 'mmol/L', referenceRange: '3.5-5.0', status: 'Normal' },
        { name: 'Chloride', value: 102, unit: 'mmol/L', referenceRange: '98-107', status: 'Normal' },
        { name: 'CO2', value: 25, unit: 'mmol/L', referenceRange: '23-29', status: 'Normal' },
        { name: 'BUN', value: 18, unit: 'mg/dL', referenceRange: '7-20', status: 'Normal' },
        { name: 'Creatinine', value: 0.9, unit: 'mg/dL', referenceRange: '0.7-1.3', status: 'Normal' },
        { name: 'Calcium', value: 9.5, unit: 'mg/dL', referenceRange: '8.5-10.5', status: 'Normal' }
      ]
    }
  })

  // Complete Blood Count
  labResults.push({
    testName: 'Complete Blood Count (CBC)',
    testType: 'Blood',
    orderedBy: 'Dr. Smith',
    performedDate: threeMonthsAgo,
    status: 'Completed',
    results: {
      tests: [
        { name: 'WBC', value: 7.5, unit: 'K/uL', referenceRange: '4.5-11.0', status: 'Normal' },
        { name: 'RBC', value: 4.8, unit: 'M/uL', referenceRange: '4.5-5.5', status: 'Normal' },
        { name: 'Hemoglobin', value: 14.2, unit: 'g/dL', referenceRange: '13.5-17.5', status: 'Normal' },
        { name: 'Hematocrit', value: 42, unit: '%', referenceRange: '38-50', status: 'Normal' },
        { name: 'Platelets', value: 250, unit: 'K/uL', referenceRange: '150-400', status: 'Normal' }
      ]
    }
  })

  if (patient.labels.includes('Diabetes') || patient.labels.includes('Type 2 Diabetes')) {
    labResults.push({
      testName: 'Hemoglobin A1C',
      testType: 'Blood',
      orderedBy: 'Dr. Smith',
      performedDate: threeMonthsAgo,
      status: 'Completed',
      results: {
        tests: [
          { name: 'HbA1c', value: 7.2, unit: '%', referenceRange: '<5.7', status: 'High' }
        ]
      },
      notes: 'Patient counseled on diabetes management. Consider medication adjustment.'
    })
  }

  if (patient.labels.includes('Hyperlipidemia') || patient.labels.includes('CAD')) {
    labResults.push({
      testName: 'Lipid Panel',
      testType: 'Blood',
      orderedBy: 'Dr. Brown',
      performedDate: sixMonthsAgo,
      status: 'Completed',
      results: {
        tests: [
          { name: 'Total Cholesterol', value: patient.labels.includes('Hyperlipidemia') ? 220 : 185, unit: 'mg/dL', referenceRange: '<200', status: patient.labels.includes('Hyperlipidemia') ? 'High' : 'Normal' },
          { name: 'LDL Cholesterol', value: patient.labels.includes('Hyperlipidemia') ? 145 : 110, unit: 'mg/dL', referenceRange: '<100', status: patient.labels.includes('Hyperlipidemia') ? 'High' : 'Borderline' },
          { name: 'HDL Cholesterol', value: 55, unit: 'mg/dL', referenceRange: '>40', status: 'Normal' },
          { name: 'Triglycerides', value: patient.labels.includes('Hyperlipidemia') ? 175 : 120, unit: 'mg/dL', referenceRange: '<150', status: patient.labels.includes('Hyperlipidemia') ? 'High' : 'Normal' }
        ]
      }
    })
  }

  if (patient.labels.includes('Hypertension') || patient.labels.includes('CAD')) {
    labResults.push({
      testName: 'Thyroid Function Tests',
      testType: 'Blood',
      orderedBy: 'Dr. Johnson',
      performedDate: sixMonthsAgo,
      status: 'Completed',
      results: {
        tests: [
          { name: 'TSH', value: 2.5, unit: 'mIU/L', referenceRange: '0.4-4.0', status: 'Normal' },
          { name: 'Free T4', value: 1.2, unit: 'ng/dL', referenceRange: '0.8-1.8', status: 'Normal' }
        ]
      }
    })
  }

  return labResults
}

function getImagingStudiesForPatient(patient: any) {
  const imagingStudies = []
  const now = new Date()
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
  const fourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 4, now.getDate())
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())

  if (patient.labels.includes('COPD') || patient.labels.includes('Asthma')) {
    imagingStudies.push({
      studyType: 'Chest X-Ray',
      bodyPart: 'Chest',
      orderedBy: 'Dr. Williams',
      performedDate: fourMonthsAgo,
      status: 'Reviewed',
      findings: 'Lungs are hyperinflated consistent with COPD. No acute infiltrates or effusions. Heart size normal.',
      impression: 'Chronic obstructive pulmonary disease changes. No acute cardiopulmonary disease.',
      radiologist: 'Dr. Anderson, MD'
    })
  }

  if (patient.labels.includes('CAD') || patient.labels.includes('Post-MI')) {
    imagingStudies.push({
      studyType: 'Echocardiogram',
      bodyPart: 'Heart',
      orderedBy: 'Dr. Smith',
      performedDate: sixMonthsAgo,
      status: 'Reviewed',
      findings: 'Left ventricular ejection fraction estimated at 55%. Mild left ventricular hypertrophy. No significant valvular abnormalities. Normal chamber sizes.',
      impression: 'Mild LVH. Normal systolic function. No significant valvular disease.',
      radiologist: 'Dr. Martinez, MD'
    })
  }

  if (patient.labels.includes('Chronic Lower Back Pain')) {
    imagingStudies.push({
      studyType: 'MRI',
      bodyPart: 'Lumbar Spine',
      orderedBy: 'Dr. Brown',
      performedDate: twoMonthsAgo,
      status: 'Reviewed',
      findings: 'Multilevel degenerative disc disease most pronounced at L4-L5 and L5-S1. Mild disc bulge at L4-L5 without significant central canal stenosis. Facet joint arthropathy at L5-S1.',
      impression: 'Degenerative disc disease L4-L5 and L5-S1 with mild disc bulge. Facet arthropathy. No high-grade stenosis or nerve root compression.',
      radiologist: 'Dr. Thompson, MD'
    })
  }

  if (patient.labels.includes('Migraine')) {
    imagingStudies.push({
      studyType: 'MRI',
      bodyPart: 'Brain',
      orderedBy: 'Dr. Johnson',
      performedDate: sixMonthsAgo,
      status: 'Reviewed',
      findings: 'Normal brain parenchyma without mass, hemorrhage, or infarction. Ventricles and sulci are normal in size and configuration. No abnormal enhancement.',
      impression: 'Normal brain MRI. No structural abnormality to explain headaches.',
      radiologist: 'Dr. Lee, MD'
    })
  }

  // General wellness imaging
  if (patient.gender === 'Female' && new Date().getFullYear() - new Date(patient.dob).getFullYear() > 40) {
    imagingStudies.push({
      studyType: 'Mammogram',
      bodyPart: 'Breast',
      orderedBy: 'Dr. Smith',
      performedDate: sixMonthsAgo,
      status: 'Reviewed',
      findings: 'Scattered fibroglandular densities. No masses, architectural distortion, or suspicious calcifications identified.',
      impression: 'Negative mammogram. BI-RADS Category 1. Continue annual screening.',
      radiologist: 'Dr. Roberts, MD'
    })
  }

  return imagingStudies
}

function getRandomChiefComplaint(labels: string[]): string {
  const complaints = [
    'Routine check-up',
    'Follow-up visit',
    'Medication refill',
    'New symptoms',
    'Worsening condition'
  ]

  if (labels.includes('Diabetes') || labels.includes('Type 2 Diabetes')) {
    return 'Follow-up for diabetes management and medication review'
  }
  if (labels.includes('Hypertension')) {
    return 'Blood pressure check and medication review'
  }
  if (labels.includes('Asthma')) {
    return 'Asthma control assessment and inhaler refill'
  }
  if (labels.includes('Migraine')) {
    return 'Recurrent headaches, increasing in frequency'
  }
  if (labels.includes('COPD')) {
    return 'Shortness of breath and medication review'
  }
  if (labels.includes('CAD') || labels.includes('Post-MI')) {
    return 'Cardiac follow-up and medication management'
  }
  if (labels.includes('Chronic Lower Back Pain')) {
    return 'Persistent lower back pain'
  }

  return complaints[Math.floor(Math.random() * complaints.length)]
}

function getRandomHPI(labels: string[]): string {
  const hpis = [
    'Patient presents for routine follow-up. Reports general good health with no significant changes since last visit. Medications taken as prescribed. No new symptoms or concerns.',
    'Patient reports increased symptoms over the past 2 weeks. Compliant with current medication regimen but notes persistent issues. No recent hospitalizations or emergency visits.',
    'Annual wellness visit. Patient denies any acute complaints. Reviews systems negative except as noted in chronic conditions. Continues home medications without adverse effects.',
    'Patient presents with symptoms as described in chief complaint. Onset was gradual over several weeks. No relieving or exacerbating factors identified. No associated symptoms.'
  ]

  return hpis[Math.floor(Math.random() * hpis.length)]
}

function getRandomExam(): string {
  return 'Vital signs stable and reviewed. General appearance: well-nourished, no acute distress. HEENT: normocephalic, atraumatic. Cardiovascular: regular rate and rhythm, no murmurs, rubs or gallops. Respiratory: clear to auscultation bilaterally, no wheezes, rales or rhonchi. Abdomen: soft, non-tender, non-distended, normal bowel sounds. Extremities: no edema, pulses intact, full range of motion. Neurological: alert and oriented x3, cranial nerves II-XII intact, strength 5/5 throughout.'
}

function getRandomAssessment(labels: string[]): string {
  let assessment = 'Patient is overall stable. '

  if (labels.includes('Type 2 Diabetes') || labels.includes('Diabetes')) {
    assessment += 'Type 2 Diabetes Mellitus - fair control, HbA1c elevated. '
  }
  if (labels.includes('Hypertension')) {
    assessment += 'Essential Hypertension - controlled on current regimen. '
  }
  if (labels.includes('Asthma')) {
    assessment += 'Asthma - intermittent, well controlled with current medications. '
  }
  if (labels.includes('COPD')) {
    assessment += 'COPD - stable on current therapy, no acute exacerbation. '
  }
  if (labels.includes('CAD')) {
    assessment += 'Coronary Artery Disease - stable, no angina. '
  }
  if (labels.includes('Migraine')) {
    assessment += 'Migraine headaches - managed with current therapy. '
  }

  assessment += 'Continue current management plan with close monitoring.'

  return assessment
}

function getRandomPlan(labels: string[]): string {
  let plan = '1. Continue current medications as prescribed\n'

  if (labels.includes('Diabetes') || labels.includes('Type 2 Diabetes')) {
    plan += '2. Monitor blood glucose levels daily, maintain log\n'
    plan += '3. HbA1c check in 3 months\n'
    plan += '4. Diabetic diet counseling, exercise 30 min daily\n'
  }
  if (labels.includes('Hypertension')) {
    plan += '2. Continue blood pressure monitoring at home twice daily\n'
    plan += '3. Low sodium diet (< 2g/day), limit alcohol\n'
  }
  if (labels.includes('Hyperlipidemia')) {
    plan += '2. Repeat lipid panel in 6 months\n'
    plan += '3. Heart-healthy diet, regular exercise\n'
  }
  if (labels.includes('COPD') || labels.includes('Asthma')) {
    plan += '2. Pulmonary function tests if symptoms worsen\n'
    plan += '3. Influenza and pneumococcal vaccination up to date\n'
  }

  plan += '4. Follow up as scheduled\n'
  plan += '5. Return sooner if symptoms worsen\n'
  plan += '6. Patient education provided, questions answered\n'
  plan += '7. Prescription refills provided'

  return plan
}

function getRandomFollowUp(): string {
  const options = [
    'Follow up in 3 months or sooner if symptoms worsen',
    'Follow up in 6 months for annual visit',
    'Return if symptoms persist or worsen',
    'Follow up in 1 month for lab review',
    'Annual visit next year unless acute issues arise',
    'Follow up in 2 weeks to reassess'
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
