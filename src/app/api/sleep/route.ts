
import { getDb } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const db = await getDb();
  const userId = request.nextUrl.searchParams.get('userId');
  if (userId) {
    const sessions = await db.all('SELECT * FROM sleep_sessions WHERE userId = ?', userId);
    return NextResponse.json(sessions);
  }
  const sessions = await db.all('SELECT * FROM sleep_sessions');
  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const db = await getDb();
  const { startTime, endTime, quality, notes, userId } = await request.json();
  const result = await db.run(
    'INSERT INTO sleep_sessions (startTime, endTime, quality, notes, userId) VALUES (?, ?, ?, ?, ?)',
    startTime,
    endTime,
    quality,
    notes,
    userId
  );
  const id = result.lastID;
  const session = await db.get('SELECT * FROM sleep_sessions WHERE id = ?', id);
  return NextResponse.json(session);
}
