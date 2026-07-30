import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function isAllowed(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') return false;
  const secret = request.headers.get('x-e2e-secret');
  if (process.env.E2E_SECRET && secret !== process.env.E2E_SECRET) return false;
  return true;
}

export async function POST(req: NextRequest) {
  if (!isAllowed(req)) {
    return NextResponse.json({ error: 'Not available outside E2E' }, { status: 403 });
  }

  const { doctorEmail, patientEmail } = await req.json();
  if (!doctorEmail || !patientEmail) {
    return NextResponse.json({ error: 'doctorEmail and patientEmail are required' }, { status: 400 });
  }

  const doctor = await prisma.user.findUnique({ where: { email: doctorEmail } });
  const patient = await prisma.user.findUnique({ where: { email: patientEmail } });
  if (!doctor || !patient) {
    return NextResponse.json({ error: 'Users not found' }, { status: 404 });
  }

  await prisma.doctor.update({ where: { userId: doctor.id }, data: { verified: true } });

  const caseRecord = await prisma.case.create({
    data: {
      patientId: patient.id,
      specialistId: doctor.id,
      serviceType: 'SPECIALIST_OPINION',
      status: 'UNDER_REVIEW',
      description: 'E2E test case for automated testing',
    },
  });

  await prisma.caseRecord.create({
    data: {
      caseId: caseRecord.id,
      fileUrl: 'https://example.com/e2e/test-report.pdf',
      fileType: 'PDF',
      fileName: 'test-clinical-report.pdf',
    },
  });

  await prisma.aIPrescreen.create({
    data: {
      caseId: caseRecord.id,
      findings: 'Elevated troponin levels\nAbnormal ECG findings\nHistory of hypertension',
      differentials: 'Acute coronary syndrome\nMyocarditis\nStress cardiomyopathy',
      urgentFlags: 'Elevated troponin requires immediate attention',
    },
  });

  const labResult = await prisma.labResult.create({
    data: {
      patientId: patient.id,
      name: 'Complete Blood Count',
      date: new Date(),
      doctor: 'E2E Test',
      status: 'REVIEW_NEEDED',
      icon: 'flask',
      metrics: {
        create: [
          { name: 'WBC', value: 12.5, unit: 'K/uL', referenceRange: '4.0-11.0', status: 'HIGH' },
          { name: 'Hemoglobin', value: 13.2, unit: 'g/dL', referenceRange: '12.0-16.0', status: 'NORMAL' },
          { name: 'Platelets', value: 450, unit: 'K/uL', referenceRange: '150-400', status: 'HIGH' },
        ],
      },
    },
  });

  const doctorRecord = await prisma.doctor.findUnique({ where: { userId: doctor.id } });
  if (doctorRecord) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);

    await prisma.appointment.createMany({
      data: [
        {
          patientId: patient.id,
          doctorId: doctorRecord.id,
          date: tomorrow,
          time: '09:00',
          status: 'SCHEDULED',
        },
        {
          patientId: patient.id,
          doctorId: doctorRecord.id,
          date: dayAfter,
          time: '14:30',
          status: 'CONFIRMED',
        },
      ],
    });
  }

  return NextResponse.json({
    caseId: caseRecord.id,
    labResultId: labResult.id,
  });
}
