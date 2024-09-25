import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectMongo from '@/lib/mongodb';
import { verify, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Task from '@/models/Task';

async function getUserIdFromToken(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token missing or invalid format');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded || typeof decoded.userId !== 'string') {
      throw new Error('Invalid token');
    }
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectMongo();

    const userId = await getUserIdFromToken(request);

    const { username, email, password } = await request.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Şifreyi hashle
    }
    
    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Profile update error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error('Unknown profile update error:', error);
    return NextResponse.json({ error: 'Profile update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
    try {
      await connectMongo();
  
      const userId = await getUserIdFromToken(request);

      await Task.deleteMany({ user: userId });
      // Kullanıcıyı sil
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'User and their tasks deleted successfully' }, { status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        console.error('User delete error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      console.error('Unknown user delete error:', error);
      return NextResponse.json({ error: 'User deletion failed' }, { status: 500 });
    }
  }