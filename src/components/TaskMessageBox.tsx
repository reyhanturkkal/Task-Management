"use client";

interface TaskMessageBoxProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const TaskMessageBox: React.FC<TaskMessageBoxProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="p-4 rounded-lg shadow-lg bg-gray-800 text-white dark:bg-gray-300 dark:text-black"
        style={{ minWidth: "300px", textAlign: "center" }}
      >
        <p>{message}</p>
        <div className="flex justify-around mt-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white p-2 rounded dark:bg-green-500"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white p-2 rounded dark:bg-red-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskMessageBox;
