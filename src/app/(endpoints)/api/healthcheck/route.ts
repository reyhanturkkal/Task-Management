import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';

export async function GET() {
  try {
    await connectMongo();
    return NextResponse.json({ message: 'MongoDB connected successfully!' });
  } catch (error) {
    return NextResponse.json({ error: 'MongoDB connection failed' });
  }
}
