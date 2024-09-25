import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectMongo from '@/lib/mongodb';
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectMongo();
    const { username, email, password } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret is not set');
    }

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error: unknown) {

    if (error instanceof Error) {
      console.error('Signup error:', error.message);
      return NextResponse.json({ error: `Signup failed: ${error.message}` }, { status: 500 });
    } else {
      console.error('Signup error:', error);
      return NextResponse.json({ error: 'Signup failed: An unknown error occurred' }, { status: 500 });
    }
  }
}
