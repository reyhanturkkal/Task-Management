import Task from '@/models/Task';
import connectMongo from '@/lib/mongodb';


export async function createTask(taskData: unknown) {
  await connectMongo();
  const newTask = new Task(taskData);
  return await newTask.save();
}

export async function getTasks(userId: string) {
  await connectMongo();
  return await Task.find({ user: userId });
}
