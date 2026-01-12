// app/(auth)/auth/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // This route will handle the server-side logic for OAuth callbacks
  return NextResponse.json({ message: 'Auth callback processing...' });
}
