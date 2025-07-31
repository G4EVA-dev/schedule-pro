import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { fetchMutation } from 'convex/nextjs';

// POST /api/appointments
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { businessId, serviceId, staffId, clientId, startTime, endTime, notes } = body;
  if (!businessId || !serviceId || !staffId || !clientId || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const appointmentId = await fetchMutation(api.appointments.createAppointment, {
      businessId,
      serviceId,
      staffId,
      clientId,
      startTime,
      endTime,
      notes,
      status: 'scheduled',
    });
    return NextResponse.json({ _id: appointmentId }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating appointment:', err);
    return NextResponse.json({ error: 'Failed to create appointment', details: err?.message || String(err) }, { status: 500 });
  }
}
