
import { getDb } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const db = await getDb();
  const sessions = await db.all('SELECT * FROM sleep_sessions');
  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const db = await getDb();
  const { startTime, endTime, quality, notes } = await request.json();
  const result = await db.run(
    'INSERT INTO sleep_sessions (startTime, endTime, quality, notes) VALUES (?, ?, ?, ?)',
    startTime,
    endTime,
    quality,
    notes
  );
  const id = result.lastID;
  const session = await db.get('SELECT * FROM sleep_sessions WHERE id = ?', id);
  return NextResponse.json(session);
}
