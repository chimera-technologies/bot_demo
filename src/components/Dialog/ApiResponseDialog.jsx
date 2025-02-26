import { useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";

const ApiResponseDialog = ({ isOpen, onClose, title, message, autoClose = 3000 }) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-fadeIn">
        <div className="flex items-center space-x-3">
          <FaTimesCircle className="text-red-500 text-2xl" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <p className="mt-2 text-gray-600">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiResponseDialog;
