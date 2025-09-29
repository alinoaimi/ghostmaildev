import { NextResponse } from 'next/server';
import { emailStore } from '@/lib/emailStore';

export async function GET() {
  const emails = await emailStore.getAll();
  return NextResponse.json(emails);
}

export async function DELETE() {
  await emailStore.clear();
  return NextResponse.json({ success: true });
}
