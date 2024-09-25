import { create } from "zustand";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updatedTask: Task) => void;
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  addTask: (task: Task) => set((state) => ({ tasks: [...state.tasks, task] })),
  setTasks: (tasks: Task[]) => set((state) => ({ ...state, tasks: [...tasks] })),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  updateTask: (taskId: string, updatedTask: Task) => 
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === taskId ? updatedTask : task
      ),
    })),
}));
