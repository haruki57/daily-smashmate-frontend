import { NextResponse } from 'next/server';
//export const runtime = 'edge';
export async function GET(request: Request, 
  { params }: { params: any }) {
  return NextResponse.json({
    timestamp: Date.now(),
    params: JSON.stringify(params|| {}),
  });
}