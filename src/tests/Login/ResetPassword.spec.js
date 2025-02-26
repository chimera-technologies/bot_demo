import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  userEvent,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import ResetPasswordDialog from "../../Dialogs/ResetPassword/ResetPasswordDialog";

describe("ResetPasswordDialog", () => {
  // Dialog opens when isOpen is true and renders with correct initial state
  it("should render dialog with empty email and no error when isOpen is true", () => {
    const onClose = jest.fn();
    const { getByText, getByLabelText } = render(
      <ResetPasswordDialog isOpen={true} onClose={onClose} />
    );

    expect(getByText("Reset Password")).toBeInTheDocument();
    expect(getByLabelText("Enter your Email")).toHaveValue("");
    expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
  });

  // Dialog closes when cancel button is clicked
  it("should close dialog when cancel button is clicked", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <ResetPasswordDialog isOpen={true} onClose={onClose} />
    );

    fireEvent.click(getByText("Cancel"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Error message is displayed when email is empty
  it("should display error message when email is empty", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <ResetPasswordDialog isOpen={true} onClose={onClose} />
    );

    fireEvent.click(getByText("Submit"));

    expect(getByText("Email is required")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  // Error message is cleared when email is entered
  it("should clear error message when email is entered", () => {
    const onClose = jest.fn();
    const { getByText, getByLabelText, queryByText } = render(
      <ResetPasswordDialog isOpen={true} onClose={onClose} />
    );

    fireEvent.click(getByText("Submit"));
    expect(getByText("Email is required")).toBeInTheDocument();

    fireEvent.change(getByLabelText("Enter your Email"), {
      target: { name: "email", value: "a@a.com" },
    });

    expect(queryByText("Email is required")).not.toBeInTheDocument();
  });

    // Dialog closes and email is cleared when submit button is clicked
    it("should clear email and close dialog when submit button is clicked", async () => {
      const onClose = jest.fn();
      const { getByText, getByLabelText } = render(
        <ResetPasswordDialog isOpen={true} onClose={onClose} />
      );

      fireEvent.change(getByLabelText("Enter your Email"), {
        target: { name: "email", value: "a@a.com" },
      });

        fireEvent.click(getByText("Submit"));

        await waitFor(() => {
            expect(getByLabelText("Enter your Email")).toHaveValue("");
            expect(onClose).toHaveBeenCalledTimes(1);
        });
    });
});
