"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import TaskMessageBox from "./TaskMessageBox";
import { useUserStore } from "@/store/useUserStore";
import RouteProtection from "@/providers/routeProtection";

const Tasks: React.FC = () => {
  const { tasks, loading, error, setTasks, setLoading, setError } = useTaskStore();
  const router = useRouter();
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { token } = useUserStore();

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/tasks", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch tasks");
        }
      } catch (err) {
        console.error("Fetch tasks error:", err);
        setError("An error occurred while fetching tasks");
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    };

    fetchTasks();
  }, [token, setTasks, setLoading, setError, router]);

  if (loading || !dataLoaded) {
    return <div>Loading tasks...</div>; 
  }

  const handleCreateTask = () => {
    router.push("/tasks/create");
  };

  const handleEditTask = (id: string) => {
    router.push(`/tasks/${id}/edit`);
  };

  const handleDeleteClick = (id: string) => {
    setTaskToDelete(id);
    setMessageBoxContent({
      message: "Are you sure you want to delete this task?",
      type: "error",
    });
    setShowMessageBox(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      const response = await fetch(`/api/tasks/${taskToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskToDelete));
        setMessageBoxContent({
          message: "Task deleted successfully.",
          type: "success",
        });
        setTaskToDelete(null);
      } else {
        const errorData = await response.json();
        setMessageBoxContent({
          message: errorData.error || "Failed to delete task.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Delete task error:", err);
      setMessageBoxContent({
        message: "An error occurred while deleting the task.",
        type: "error",
      });
    } finally {
      setShowMessageBox(false);
    }
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
    setShowMessageBox(false);
  };

  return (
    <RouteProtection>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your Tasks
          </h1>
          <div>
            <button
              onClick={handleCreateTask}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded shadow-lg transition-all"
            >
              Create New Task
            </button>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {dataLoaded && tasks.length === 0 && (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-700 dark:text-gray-300">
              You have not created a task yet.
            </p>
          </div>
        )}

        {dataLoaded && tasks.length > 0 && (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-md p-4 mb-2 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {task.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {task.description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Due Date: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                      task.status === "to do"
                        ? "bg-blue-100 text-blue-800"
                        : task.status === "in progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : task.status === "test"
                        ? "bg-purple-100 text-purple-800"
                        : task.status === "done"
                        ? "bg-green-100 text-green-800"
                        : task.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : task.status === "rejected"
                        ? "bg-gray-200 text-gray-800"
                        : ""
                    }`}
                  >
                    {task.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex space-x-2 mt-4 md:mt-0">
                  <button
                    onClick={() => handleEditTask(task._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded shadow-lg transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded shadow-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {showMessageBox && messageBoxContent && (
          <TaskMessageBox
            message={messageBoxContent.message}
            onConfirm={confirmDeleteTask}
            onCancel={cancelDeleteTask}
          />
        )}
      </div>
    </RouteProtection>
  );
};

export default Tasks;
