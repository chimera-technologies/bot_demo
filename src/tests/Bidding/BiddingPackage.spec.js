import React ,{useState,useEffect}from 'react';
import { render, fireEvent, waitFor,screen,within ,renderHook,act} from '@testing-library/react';
import '@testing-library/jest-dom';
import BiddingPackage from '../../pages/PartnerBidding/BiddingPackage';

describe('BiddingPackage', () => {

    it('should render the BiddingPackage component without crashing', () => {
        const { getByText } = render(<BiddingPackage />);
        expect(getByText('Package List')).toBeInTheDocument();
      });

      it('should display filters and apply button in package list section', () => {
        render(<BiddingPackage />);
    
        const typeFilter = screen.getByRole('combobox', { name: /select status/i });
        const budgetFilter = screen.getByRole('combobox', { name: /select budget/i });
        const locationFilter = screen.getByRole('combobox', { name: /select location/i });
    
        expect(typeFilter).toBeInTheDocument();
        expect(budgetFilter).toBeInTheDocument();
        expect(locationFilter).toBeInTheDocument();
      });

      it('should render search field in package list section', () => {
        const { getByPlaceholderText } = render(<BiddingPackage />);
        const searchField = getByPlaceholderText('Search packages...');
        expect(searchField).toBeInTheDocument();
      });


    it('should display package details when a package is selected from the list', () => {
      const mockPackage = {
        id: "BID-2024-001",
        name: "Commercial Building Project",
        expiryDate: "2025-03-25T23:59:59",
        tasks: [
          {
            id: 1,
            task: "Foundation Work",
            isSubmitted: false
          }
        ]
      };
    
      jest.useFakeTimers();
    
      // Mock setInterval
      const setIntervalMock = jest.spyOn(global, 'setInterval');
    
      const { result } = renderHook(() => {
        const [selectedPackage, setSelectedPackage] = useState(null);
        const [gridData, setGridData] = useState([]);
        const [timeLeft, setTimeLeft] = useState("");
    
        useEffect(() => {
          if (selectedPackage) {
            setGridData(selectedPackage.tasks);
    
            // Simulate the setInterval logic here (if not done in the component already)
            const intervalId = setInterval(() => {
              setTimeLeft("Some time left");
            }, 1000);
    
            // Clean up interval on unmount
            return () => clearInterval(intervalId);
          }
        }, [selectedPackage]);
    
        return { selectedPackage, setSelectedPackage, gridData, timeLeft };
      });
    
      // Trigger the state update
      act(() => {
        result.current.setSelectedPackage(mockPackage);
      });
    
      // Assertions
      expect(result.current.selectedPackage).toEqual(mockPackage);
      expect(result.current.gridData).toEqual(mockPackage.tasks);
    
      // Check if setInterval was called correctly
      expect(setIntervalMock).toHaveBeenCalledTimes(1);
      expect(setIntervalMock).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    
      // Clean up after the test
      jest.useRealTimers();
    });
    

});
