"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTaskStore } from "@/store/useTaskStore";
import { useRouter } from "next/navigation";
import MessageBox from "@/components/MessageBox";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  dueDate: yup
    .string()
    .required("Due Date is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Due Date must be in the format yyyy-mm-dd"
    ),
  status: yup.string().required("Status is required"),
});

const CreateTask: React.FC = () => {
  const router = useRouter();
  const { addTask, setLoading, setError } = useTaskStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: yupResolver(schema),
  });

  const token = useUserStore((state) => state.token);

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);
    try {
      
      const formattedData = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const newTask = await response.json();
        addTask(newTask.task);
        reset();
        setMessage({ text: "Task created successfully!", type: "success" });
        setTimeout(() => {
          router.push("/tasks");
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create task");
        setMessage({
          text: errorData.error || "Failed to create task",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Create task error:", err);
      setError("An error occurred while creating task");
      setMessage({
        text: "An error occurred while creating task",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      {message && <MessageBox message={message.text} type={message.type} />}

      <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r">
        <span className="text-gray-800 dark:text-gray-500">
          Create a New Task
        </span>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-lg text-gray-700 dark:text-blue-300 font-semibold mb-2">
            Title
          </label>
          <input
            {...register("title")}
            className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-lg focus:ring-4 focus:ring-gray-600 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:shadow-md"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-lg text-gray-700 dark:text-blue-300 font-semibold mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-lg focus:ring-4 focus:ring-gray-600 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:shadow-md"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-lg text-gray-700 dark:text-blue-300 font-semibold mb-2">
            Due Date
          </label>
          <input
            type="date"
            {...register("dueDate")}
            className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-lg focus:ring-4 focus:ring-gray-400 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:shadow-md"
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-lg text-gray-700 dark:text-blue-300 font-semibold mb-2">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-lg focus:ring-4 focus:ring-gray-600 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:shadow-md"
          >
            <option value="to do">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="test">Test</option>
            <option value="done">Done</option>
            <option value="failed">Failed</option>
            <option value="rejected">Rejected</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-800  text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
