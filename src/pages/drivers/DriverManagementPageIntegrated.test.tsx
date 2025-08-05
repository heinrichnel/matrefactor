import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DriverManagementPage from './DriverManagementPageIntegrated';

// Mock the firebase modules
jest.mock('../../firebase/config', () => ({
  db: {},
}));

jest.mock('../../hooks/useOfflineForm', () => ({
  useOfflineForm: () => ({
    submit: jest.fn(),
    isSubmitting: false,
    isOfflineOperation: false,
  }),
}));

describe('DriverManagementPage', () => {
  test('renders the driver management page', () => {
    render(
      <BrowserRouter>
        <DriverManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Driver Management')).toBeInTheDocument();
    expect(screen.getByText('Add New Driver')).toBeInTheDocument();
  });

  test('displays mock drivers', () => {
    render(
      <BrowserRouter>
        <DriverManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sarah Smith')).toBeInTheDocument();
    expect(screen.getByText('Michael Johnson')).toBeInTheDocument();
  });
});
