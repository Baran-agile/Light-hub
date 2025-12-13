import { NextResponse } from 'next/server';
import { getLight, toggleLightStatus } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const light = await getLight(params.id);
    if (!light) {
      return NextResponse.json({ message: 'Light not found.' }, { status: 404 });
    }
    return NextResponse.json(light);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get light.' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedLight = await toggleLightStatus(params.id);
    if (!updatedLight) {
      return NextResponse.json({ message: 'Light not found.' }, { status: 404 });
    }
    return NextResponse.json(updatedLight);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to toggle light.' }, { status: 500 });
  }
}
