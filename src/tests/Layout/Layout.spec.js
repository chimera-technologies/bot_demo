import React from "react";
import { render, screen, fireEvent, getByPlaceholderText,queryByPlaceholderText } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotificationsContext } from "../../context/NotificationsContext";
import Layout from "../../components/Layout/Layout";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Layout Component", () => {
  const mockNotificationsContext = {
    notifications: [
      { id: 1, message: "New message", read: false, timestamp: Date.now() },
      { id: 2, message: "Another message", read: true, timestamp: Date.now() },
    ],
    fetchNotifications: jest.fn(),
    markAllAsRead: jest.fn(),
    markAsRead: jest.fn(),
    markAsUnread: jest.fn(),
  };

  beforeEach(() => {
    sessionStorage.setItem(
      "user",
      JSON.stringify({ username: "JohnDoe", role: "Admin" })
    );
    sessionStorage.setItem("m-id", "2"); // Default active menu item
  });

  afterEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  const renderWithProviders = (ui) => {
    return render(
      <MemoryRouter>
        <NotificationsContext.Provider value={mockNotificationsContext}>
          {ui}
        </NotificationsContext.Provider>
      </MemoryRouter>
    );
  };

  it("should render the sidebar and header", () => {
    renderWithProviders(<Layout>Test Content</Layout>);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);  // Default active menu title
    expect(screen.getByText("JohnDoe")).toBeInTheDocument(); // Username should be displayed
  });

  it("should toggle the sidebar when clicked", () => {
    renderWithProviders(<Layout>Test Content</Layout>);

    const toggleButton = screen.getByTestId("expand-sidebar");

    // Sidebar should start open
    expect(screen.getByTestId("sidebar")).toHaveClass("w-20");

    // Click to toggle sidebar
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("sidebar")).toHaveClass("w-64");

    // Click again to expand
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("sidebar")).toHaveClass("w-64");
  });

  it('test_menu_item_selection', () => {
    const { getByText } = renderWithProviders(<Layout>Test Content</Layout>);;
  
    // Validate text content of menu items
    expect(getByText('My Work')).toBeInTheDocument();
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(getByText('Dailies')).toBeInTheDocument();
    expect(getByText('Bidding')).toBeInTheDocument();
    expect(getByText('Billing')).toBeInTheDocument();
    expect(getByText('HR Portal')).toBeInTheDocument();
    expect(getByText('IT')).toBeInTheDocument();
  });

  it("should navigate to menu item when clicked", () => {
    renderWithProviders(<Layout>Test Content</Layout>);

    const menuItem = screen.getByText("My Work");
    fireEvent.click(menuItem);

    expect(mockNavigate).toHaveBeenCalledWith("/my-work");
    expect(sessionStorage.getItem("m-id")).toBe("1");
  });

  it("should logout the user when logout button is clicked", () => {
    renderWithProviders(<Layout>Test Content</Layout>);
    const logoutButton = screen.getByLabelText(/logout/i);
    fireEvent.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(sessionStorage.getItem("user")).toBeNull();
  });

  it("should show and hide the notifications panel", () => {
    renderWithProviders(<Layout>Test Content</Layout>);
    const bellIcon = screen.getByLabelText(/bell/i);
    fireEvent.click(bellIcon);

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("New message")).toBeInTheDocument();

    // Click outside to close
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("Notifications")).not.toBeInTheDocument();
  });

  it("should mark all notifications as read when clicked", () => {
    renderWithProviders(<Layout>Test Content</Layout>);
   
    fireEvent.click(screen.getByLabelText( /bell/i ));

    const markAllButton = screen.getByText("Mark all as read");
    fireEvent.click(markAllButton);

    expect(mockNotificationsContext.markAllAsRead).toHaveBeenCalled();
  });

  it('test toggle search visibility on icon click', () => {
    renderWithProviders(<Layout>Test Content</Layout>);
    // Initially, the search input should not be visible
    expect(screen.queryByPlaceholderText('Search...')).toBeNull();
    
    const searchIcon = screen.getByLabelText(/search/i);
    fireEvent.click(searchIcon);

    // Click the search icon to show the search input
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    
    // Click the search icon again to hide the search input
    fireEvent.click(searchIcon);
    expect(screen.queryByPlaceholderText('Search...')).toBeNull();
  });

});
