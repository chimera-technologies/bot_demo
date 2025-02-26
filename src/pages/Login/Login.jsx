import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { ERROR_MESSAGES } from "../../utils/messages";
import ResetPasswordDialog from "../../components/Dialog/ResetPasswordDialog";
import BotLogo from "../../assets/ChimeraLogoBlack.png";
import wolverine from "../../assets/Chim_Login.png";
import "./login.css";
import ApiResponseDialog from "../../components/Dialog/ApiResponseDialog";
const LoginScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lockError, setLockError] = useState(false);
  const [apiDialogOpen, setApiDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: "",
    message: "",
  });
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = ERROR_MESSAGES.usernameRequired;
    }

    if (!formData.password) {
      newErrors.password = ERROR_MESSAGES.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = ERROR_MESSAGES.passwordTooShort;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // setLockError(true);
      setTimeout(() => {navigate("/my-work");}, 5000);
      
      try {
        setIsLoading(true);
        const response = await login(formData);
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
        console.log("Login successful:", data);
      } catch (error) {
        setDialogData({
          title: "Login Error",message:'Unable to login, please try again',
        });
        setApiDialogOpen(true);
        // navigate("/my-work");
        setErrors({ submit: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

     // Clear error for this field when user types
  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: "", // Remove the error for this field
  }));
  };

  const handleResetPassword = async () => {
    setDialogOpen(true); // Show the dialog
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-[#fff] overflow-hidden">
      <div className="lg:w-1/4 w-full flex items-start justify-center bg-[#fff] p-8">
        <div className="w-full  max-w-md">
          <div className="text-center rounded-[10px] mb-12 d-flex">
            <img src={BotLogo} alt="Logo" className="h-16 w-auto ml-0" />
          </div>

          {lockError && <div className=" flex  align-center w-full warning-container mb-6">
            <RiErrorWarningLine className="w-8 h-8 mr-1 warning-icon" />
            <p className="warning-note">
              Your account is temporarily locked, contact support
            </p>
          </div>}

          <div className="text-center rounded-[10px] mb-6 d-flex">
            <h2 className="mt-3 text-3xl font-bold text-primary text-left ml-1">
              Sign In
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 ml-4"
                >
                  Username
                </label>
                <div className="mt-1 relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    // required
                    className={` block w-full pl-4 pr-3 py-2 border ${
                      errors.username ? "border-red-500" : "border-[#E7E7E7]"
                    } rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                    placeholder="Enter your Username"
                    value={formData.username}
                    onChange={handleChange}
                    aria-label="username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500 ml-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 ml-4"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={!showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    // required
                    className={`block w-full pl-4 pr-10 py-2 border ${
                      errors.password ? "border-red-500" : "border-[#E7E7E7]"
                    } rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                    placeholder="Enter your Password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-black-400 hover:text-black-500" />
                    ) : (
                      <FaEye className="h-5 w-5 " />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 ml-1">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || lockError}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                } ${
                  lockError ? "bg-[#424242] cursor-not-allowed" : "bg-primary hover:bg-secondary"
                }`}
              >
                {isLoading ? "Signing in..." : "Log in"}
              </button>
              <div className="flex items-center justify-center">
                <div className="mt-4 text-sm">
                  <span className="text-gray-600 font-bold">Forgot Password? </span>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-primary hover:text-secondary focus:outline-none font-medium underline font-bold"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className=" flex justify-center mt-6">
            <FiInfo className="w-4 h-4 mr-1 info-icon" />
            <p className="login-note">
              
              Remember, Sharing password is against the  policy
            </p>
          </div>
        </div>
      </div>

      <div className="lg:w-3/4 w-full bg-[#fff] flex items-center justify-center p-8">
        <div className="w-full h-full">
          <img
            src={wolverine}
            alt="Wolverine Movie Banner"
            className="w-full h-full  rounded-3xl shadow-xl"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1608889476561-6242cfdbf622";
              e.target.alt = "Fallback Wolverine Banner";
            }}
          />
        </div>
      </div>

      <ResetPasswordDialog
        isOpen={dialogOpen} // Pass isOpen state to dialog
        onClose={() => setDialogOpen(false)} // Close the dialog
      />

      <ApiResponseDialog
        isOpen={apiDialogOpen}
        onClose={() => setApiDialogOpen(false)}
        title={dialogData.title}
        message={dialogData.message}
      />
    </div>
  );
};

export default LoginScreen;
