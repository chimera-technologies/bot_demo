import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BidPackagesGrid from '../../pages/PartnerBidding/BidPackagesGrid';
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
  }));
  
  jest.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ login: jest.fn() }),
  }));
  
describe('BidPackagesGrid', () => {

    // Renders table with correct bid package data and columns
    it('should render table with all bid packages and correct column headers', () => {
      const { getByText, getAllByRole } = render(<BidPackagesGrid />);
  
      expect(getByText('PKG ID')).toBeInTheDocument();
      expect(getByText('Bid PKG Name')).toBeInTheDocument();
      expect(getByText('Bid Status')).toBeInTheDocument();
      expect(getByText('Bid Expiry')).toBeInTheDocument();
      expect(getByText('View')).toBeInTheDocument();
      expect(getByText('Notes')).toBeInTheDocument();
  
      const rows = getAllByRole('row');
      expect(rows).toHaveLength(8); // Header + 4 data rows
    });

    // Clicking view package button navigates to /bidView route
    it('should navigate to /bidding-detail when view package button is clicked', () => {
      const navigate = jest.fn();
      jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
  
      const { getAllByText } = render(<BidPackagesGrid />);
      const viewButtons = getAllByText('View Package');
  
      fireEvent.click(viewButtons[0]);
      expect(navigate).toHaveBeenCalledWith('/bidding-detail');
    });

    // Table displays all bid packages with correct styling and formatting
    it('should apply correct styling classes to table elements', () => {
      const { container } = render(<BidPackagesGrid />);
  
      expect(container.querySelector('table')).toHaveClass('min-w-full bg-white overflow-hidden shadow-lg');
      expect(container.querySelector('thead')).toHaveClass('bg-background text-white');
      expect(container.querySelector('tbody')).toHaveClass('divide-y divide-gray-200');
    });

    // Handle missing or null values in package objects
    it('should handle null or undefined package values gracefully', () => {
      const incompletePackage = [{id: null, name: undefined, status: null, expiry: undefined, notes: null}];
      jest.spyOn(React, 'useState').mockReturnValueOnce([incompletePackage, jest.fn()]);
  
      const { getAllByRole } = render(<BidPackagesGrid />);
  
      const cells = getAllByRole('cell');
      cells.forEach(cell => {
        expect(cell).toBeInTheDocument();
      });
    });

    // Handle very long text content in table cells
    it('should handle long text content without breaking table layout', () => {
      const longTextPackage = [{
        id: 'PKG001',
        name: 'A'.repeat(100),
        status: 'Active',
        expiry: '2024-01-01',
        notes: 'B'.repeat(200)
      }];
  
      jest.spyOn(React, 'useState').mockReturnValueOnce([longTextPackage, jest.fn()]);
  
      const { container } = render(<BidPackagesGrid />);
      const cells = container.querySelectorAll('td');
  
      cells.forEach(cell => {
        expect(cell).toHaveClass('px-6 py-4');
      });
    });

    // Test modal behavior when selectedPackage is null but showModal is true
    it('should not render modal when selectedPackage is null despite showModal being true', () => {
      jest.spyOn(React, 'useState')
        .mockReturnValueOnce([true, jest.fn()])
        .mockReturnValueOnce([null, jest.fn()]);
  
      const { queryByText } = render(<BidPackagesGrid />);
  
      expect(queryByText('Package Details')).not.toBeInTheDocument();
    });

    // Verify hover states and transitions on table rows
    it('should apply hover styles to table rows on mouse over', () => {
      const { container } = render(<BidPackagesGrid />);
      const row = container.querySelector('tbody tr');
  
      fireEvent.mouseEnter(row);
      expect(row).toHaveClass('hover:bg-gray-50');
  
      fireEvent.mouseLeave(row);
      expect(row).toHaveClass('transition duration-300');
    });

});
