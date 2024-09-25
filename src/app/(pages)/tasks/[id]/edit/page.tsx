"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import MessageBox from "@/components/MessageBox";
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

const EditTask: React.FC<{ params: { id: string } }> = ({ params }) => {
  const router = useRouter();
  const { tasks, updateTask, setLoading, setError } = useTaskStore();
  const [message, setMessage] = useState<string | null>(null); // Mesaj durumu eklendi
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: yupResolver(schema),
  });

  const taskId = params.id;
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    const taskToEdit = tasks.find((task) => task._id === taskId);

    if (taskToEdit) {
      setValue("title", taskToEdit.title);
      setValue("description", taskToEdit.description);
      setValue(
        "dueDate",
        new Date(taskToEdit.dueDate).toISOString().split("T")[0]
      );
      setValue("status", taskToEdit.status);
    } else {
      console.error("Task not found");
      router.push("/tasks");
    }
  }, [taskId, tasks, setValue, router]);

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        updateTask(taskId, updatedTask.task);
        setMessage("Task updated successfully!");
        setMessageType("success");

        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
          router.push("/tasks");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update task");

        setMessage("Failed to update task.");
        setMessageType("error");

        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 2000);
      }
    } catch (err) {
      console.error("Update task error:", err);
      setError("An error occurred while updating task");

      setMessage("An error occurred while updating task.");
      setMessageType("error");

      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
      <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r">
        <span className="text-gray-800 dark:text-gray-500">Edit Task</span>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
            Title
          </label>
          <input
            {...register("title")}
            className="border border-gray-300 dark:border-gray-600 p-3 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          {errors.title && (
            <p className="text-red-500 mt-1 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            className="border border-gray-300 dark:border-gray-600 p-3 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-transparent dark:bg-gray-700 dark:text-white"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
            Due Date
          </label>
          <input
            type="date"
            {...register("dueDate")}
            className="border border-gray-300 dark:border-gray-600 p-3 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          {errors.dueDate && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
            Status
          </label>
          <select
            {...register("status")}
            className="border border-gray-300 dark:border-gray-600 p-3 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="to do">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="test">Test</option>
            <option value="done">Done</option>
            <option value="failed">Failed</option>
            <option value="rejected">Rejected</option>
          </select>
          {errors.status && (
            <p className="text-red-500 mt-1 text-sm">{errors.status.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-800 text-gray-100 font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300"
        >
          Update Task
        </button>
      </form>
      {message && messageType && (
        <MessageBox message={message} type={messageType} />
      )}
    </div>
  );
};

export default EditTask;
