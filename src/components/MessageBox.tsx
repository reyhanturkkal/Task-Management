"use client";

interface MessageBoxProps {
  message: string;
  type: "success" | "error";
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, type }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50`}>
      <div
        className={`p-4 rounded-lg shadow-lg text-white ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
        style={{ minWidth: "300px", textAlign: "center" }}
      >
        {message}
      </div>
    </div>
  );
};

export default MessageBox;
