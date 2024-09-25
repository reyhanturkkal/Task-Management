import Slider from "@/components/Slider";

export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-900 p-6">
      <Slider />
      <div className="max-w-screen-md mx-auto mt-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Manage Your Tasks Efficiently
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Stay organized and keep track of your daily tasks effortlessly. With
          our task management application, you can create, edit, and delete
          tasks with ease. Prioritize your workload and never miss a deadline
          again.
        </p>
        <h3 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Features:
        </h3>
        <ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-400 text-center">
          <li>✔ Easy task creation and management</li>
          <li>✔ Prioritize tasks with different statuses</li>
          <li>✔ Set due dates and reminders</li>
          <li>✔ User-friendly interface</li>
        </ul>
      </div>
    </main>
  );
}
