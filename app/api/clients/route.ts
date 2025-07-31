import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { fetchQuery, fetchMutation } from 'convex/nextjs';

// GET /api/clients?businessId=...&email=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId');
  const email = searchParams.get('email');
  if (!businessId || !email) {
    return NextResponse.json({ error: 'Missing businessId or email' }, { status: 400 });
  }
  try {
    // Query for existing client by businessId and email
    const clients = await fetchQuery(api.clients.getClients, { businessId });
    const filtered = clients.filter((c: any) => c.email === email);
    return NextResponse.json(filtered, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

// POST /api/clients
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { businessId, name, email, phone } = body;
  if (!businessId || !name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const clientId = await fetchMutation(api.clients.createClient, {
      businessId,
      name,
      email,
      phone,
    });
    return NextResponse.json({ _id: clientId, businessId, name, email, phone }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
