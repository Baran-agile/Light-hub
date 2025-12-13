import { NextResponse } from 'next/server';
import { toggleLightStatusData, getLightByIdData } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const lightId = params.id;
  const light = getLightByIdData(lightId);

  if (light) {
    return NextResponse.json(light);
  } else {
    return NextResponse.json({ message: 'Light not found' }, { status: 404 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const lightId = params.id;
  const updatedLight = toggleLightStatusData(lightId);

  if (updatedLight) {
    return NextResponse.json(updatedLight);
  } else {
    return NextResponse.json({ message: 'Light not found' }, { status: 404 });
  }
}
