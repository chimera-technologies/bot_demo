import React,{ useState } from "react";
import PropTypes from "prop-types";

const ResetPasswordDialog = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    // Call API for password reset here
    console.log("Password reset link sent to:", email);
    setEmail("");  // Clear the email input
    onClose(); // Close the dialog after submit
  };

  const handleClose = () => {
    setError("");  // Reset the error when the dialog closes
    setEmail("");  // Optionally reset the email field as well
    onClose(); // Close the dialog
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4">Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <label className="block text-gray-700"  htmlFor="email">Enter your Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              className="w-full border border-gray-400 rounded-md p-2 mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error on change
              }}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-400 rounded-md text-gray-600 mr-2 "
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-md hover:bg-secondary bg-primary "
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ResetPasswordDialog;

ResetPasswordDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}