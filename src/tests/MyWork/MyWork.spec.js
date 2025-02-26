import React from "react";
import { render, screen,waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyWork from "../../pages/MyWork/MyWork";
import { MyWorkProvider } from "../../context/MyworkContext";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ login: jest.fn() }),
}));

describe("MyWork", () => {
  beforeEach(() => {
    sessionStorage.setItem(
      "user",
      JSON.stringify({ username: "JohnDoe", role: "Admin" })
    );
    sessionStorage.setItem("m-id", "2");
  });

  afterEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("Component loads without crashing", () => {
    render(
      <MyWorkProvider>
        <MyWork />
      </MyWorkProvider>
    );

    expect(screen.getByTestId("mywork")).toBeInTheDocument();
  });

  it("should show Spinner when loading is true", () => {
    render(
      <MyWorkProvider value={{ loading: true }}>
        <MyWork />
      </MyWorkProvider>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

});
