import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '../lib';
import { createTask, getTasks } from '@/services/taskService';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';


interface DecodedToken {
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectMongo()
    
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    const userID = decoded.userId;
    
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, dueDate, status } = await request.json();
    const taskData = {
      user: user._id,
      title,
      description,
      dueDate,
      status,
    };

    const newTask = await createTask(taskData);

    return NextResponse.json({ message: 'Task created successfully', task: newTask }, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Task creation failed' }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request, true);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await getTasks(user._id);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
