import { NextResponse } from 'next/server';
import { getLightsData } from '@/lib/data';

export async function GET() {
  const lights = getLightsData();
  return NextResponse.json(lights);
}
