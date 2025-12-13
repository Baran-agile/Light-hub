import { NextResponse } from 'next/server';
import { getEnvironmentData, updateEnvironmentData } from '@/lib/data';

export async function GET() {
  const data = getEnvironmentData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const { temperature, humidity } = await request.json();

    if (temperature === undefined && humidity === undefined) {
      return NextResponse.json({ message: 'Missing temperature or humidity' }, { status: 400 });
    }

    const updatedData = updateEnvironmentData({ temperature, humidity });
    return NextResponse.json(updatedData);
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }
}
