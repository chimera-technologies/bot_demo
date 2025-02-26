import React from "react";
import { render, fireEvent,screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginScreen from "../../pages/Login/Login";
import ResetPasswordDialog from "../../Dialogs/ResetPassword/ResetPasswordDialog";
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ login: jest.fn() }),
}));

describe("LoginScreen", () => {
  // Email and password inputs update formData state on change
  it("should update formData state when input values change", () => {
    const { getByLabelText } = render(<LoginScreen />);

    const emailInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");

    fireEvent.change(emailInput, {
      target: { name: "username", value: "Admin" },
    });
    fireEvent.change(passwordInput, {
      target: { name: "password", value: "password123" },
    });

    expect(emailInput.value).toBe("Admin");
    expect(passwordInput.value).toBe("password123");
  });

  it('Form fields are present in UI', () => {
    render(<LoginScreen />);
    // Check if username field is present
    const usernameField = screen.getByPlaceholderText('Enter your Username');
    expect(usernameField).toBeInTheDocument();
    
    // Check if password field is present
    const passwordField = screen.getByPlaceholderText('Enter your Password');
    expect(passwordField).toBeInTheDocument();
  });

  it('Should Display Error messages when empty form is submitted', () => {
    render(<LoginScreen />);
    // Assuming there's a button to submit the form
    const loginButton = screen.getByRole('button', { name: /log in/i });
    
    // Click the login button without filling the fields
    fireEvent.click(loginButton);
    
    // Check for error messages
    const usernameError = screen.getByText(/username is required/i);
    expect(usernameError).toBeInTheDocument();
    
    const passwordError = screen.getByText(/password is required/i);
    expect(passwordError).toBeInTheDocument();
  });

  // Password visibility toggle switches between text and password input types
  it("should toggle password visibility when eye icon is clicked", () => {
    const { getByLabelText, getByRole } = render(<LoginScreen />);

    const passwordInput = getByLabelText("Password");
    const toggleButton = getByRole("button", { name: "" });

    expect(passwordInput.type).toBe("text");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  // Form validation passes with valid email and 6+ character password
  it("should pass validation with valid email and password", () => {
    const { getByLabelText, queryByText } = render(<LoginScreen />);

    fireEvent.change(getByLabelText("Username"), {
      target: { name: "email", value: "Admin" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { name: "password", value: "password123" },
    });

    expect(queryByText("Username is required")).not.toBeInTheDocument();
    expect(
      queryByText("Password must be at least 6 characters")
    ).not.toBeInTheDocument();
  });

  // Form submission with password less than 6 characters shows validation error
  it("should show error when password is too short", () => {
    const { getByText, getByLabelText } = render(<LoginScreen />);

    fireEvent.change(getByLabelText("Username"), {
      target: { name: "email", value: "Admin" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { name: "password", value: "12345" },
    });
    fireEvent.click(getByText("Log in"));

    expect(
      getByText("Password must be at least 6 characters")
    ).toBeInTheDocument();
  });

  // Image load error shows fallback image and alt text
  it("should show fallback image when main image fails to load", () => {
    const { getByAltText } = render(<LoginScreen />);

    const img = getByAltText("Wolverine Movie Banner");
    fireEvent.error(img);

    expect(img.src).toBe(
      "https://images.unsplash.com/photo-1608889476561-6242cfdbf622"
    );
    expect(img.alt).toBe("Fallback Wolverine Banner");
  });

  let setDialogOpenMock;

  beforeEach(() => {
    setDialogOpenMock = jest.fn();
  });

 
  it('test_reset_password_dialog_invisibility', () => {
    const { queryByRole } = render(
      <ResetPasswordDialog isOpen={false} onClose={() => setDialogOpenMock(false)} />
    );
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

});
