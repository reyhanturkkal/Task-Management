import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Task from '@/models/Task';
import { getUserFromToken } from '../../lib';


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; 
    try {
      await connectMongo();
  
      const user = await getUserFromToken(request, true);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const { title, description, dueDate, status } = await request.json();
  
      const updatedTask = await Task.findOneAndUpdate(
        { _id: id, user: user._id },
        { title, description, dueDate, status },
        { new: true }
      );
  
      if (!updatedTask) {
        return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Task updated successfully', task: updatedTask }, { status: 200 });
    } catch (error) {
    
      return NextResponse.json({ error: 'Task update failed' }, { status: 500 });
    }
  }
  
  
  export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      await connectMongo();
  
      // JWT ile kimlik doğrulama
      const user = await getUserFromToken(request, true);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const deletedTask = await Task.findOneAndDelete({ _id: params.id, user: user._id });
  
      if (!deletedTask) {
        return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Delete task error:', error);
      return NextResponse.json({ error: 'Task deletion failed' }, { status: 500 });
    }
  }
  