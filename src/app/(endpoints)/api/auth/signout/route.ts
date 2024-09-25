import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const headers = new Headers();
    headers.append('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
    
    return NextResponse.json({ message: "Signed out successfully" }, { status: 200, headers });
  } catch (error) {
    return NextResponse.json({ error: "Signout failed" }, { status: 500 });
  }
}
