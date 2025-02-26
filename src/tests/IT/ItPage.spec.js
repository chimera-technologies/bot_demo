import React from 'react';
import { render, screen,waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import ItPage from '../../pages/IT/ItPage';
import { ITProvider } from '../../context/ItPageContext';

jest.mock("axios");


jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
  }));

jest.mock("../../context/AuthContext", () => ({
    useAuth: () => ({ login: jest.fn() }),
  }));

      
describe('ItPage Component', () => {


    beforeEach(() => {
        jest.clearAllMocks();
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


    it('renders without crashing', () => {
        render(<ITProvider><ItPage /></ITProvider>);
        expect(screen.getByTestId('it-page')).toBeInTheDocument();
    });

    it("should show Spinner when loading is true", () => {
        render(<ITProvider value={{ loading: true }}><ItPage /></ITProvider>);
    
        // Check if the Spinner is rendered
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
      });

    

    
});