import mongoose, { Document, Schema } from 'mongoose';

interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  status: 'to do' | 'in progress' | 'test' | 'done' | 'failed' | 'rejected';
  user: mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, required: true, enum: ['to do', 'in progress', 'test', 'done', 'failed', 'rejected'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Task = mongoose.models?.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
