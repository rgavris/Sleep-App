
import { getDb } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const db = await getDb();
  const users = await db.all('SELECT * FROM users');
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const db = await getDb();
  const { name, email } = await request.json();
  const result = await db.run(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    name,
    email
  );
  const id = result.lastID;
  const user = await db.get('SELECT * FROM users WHERE id = ?', id);
  return NextResponse.json(user);
}
