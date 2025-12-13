import { NextResponse } from 'next/server';
import { getEnvironmentData, updateEnvironmentData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getEnvironmentData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get environment data.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { temperature, humidity } = body;
    
    if (temperature === undefined && humidity === undefined) {
      return NextResponse.json({ message: 'Temperature or humidity is required.' }, { status: 400 });
    }

    const updatedData = await updateEnvironmentData({ temperature, humidity });
    return NextResponse.json(updatedData);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update environment data.' }, { status: 500 });
  }
}
