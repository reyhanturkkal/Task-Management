import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import { getUserFromToken } from '../../lib';


export async function GET(request: NextRequest) {
  await connectMongo();

  const user = await getUserFromToken(request, false); 

  if (!user) {
    return NextResponse.json({ error: 'User not found or token invalid' }, { status: 401 });
  }

  return NextResponse.json({ user }, { status: 200 });
}