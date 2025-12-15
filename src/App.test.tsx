import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

// Simple mock setup that actually works
const mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
  close: jest.fn(),
  connected: true,
};

// Mock socket.io-client before importing anything
jest.mock('socket.io-client', () => jest.fn(() => mockSocket));

// Mock fetch
global.fetch = jest.fn();

// Now import the components
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSocket.on.mockClear();
    mockSocket.emit.mockClear();
    mockSocket.close.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders employee management system', () => {
    render(<App />);
    expect(screen.getByText('Employee Management System')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter employee name')).toBeInTheDocument();
    expect(screen.getByText('Create Employee')).toBeInTheDocument();
  });

  test('shows disconnected status initially', () => {
    render(<App />);
    expect(screen.getByText(/🔴 Disconnected/)).toBeInTheDocument();
  });

  test('sets up socket event listeners', () => {
    render(<App />);
    
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('new_employee', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('welcome', expect.any(Function));
  });

  test('shows connected status when socket connects', async () => {
    render(<App />);
    
    // Find the connect handler and call it
    const connectCall = mockSocket.on.mock.calls.find(call => call[0] === 'connect');
    const connectHandler = connectCall[1];
    
    act(() => {
      connectHandler();
    });

    await waitFor(() => {
      expect(screen.getByText(/🟢 Connected/)).toBeInTheDocument();
    });
  });

  test('adds new employee to list when notification received', async () => {
    render(<App />);
    
    // Find the new_employee handler
    const newEmployeeCall = mockSocket.on.mock.calls.find(call => call[0] === 'new_employee');
    const newEmployeeHandler = newEmployeeCall[1];
    
    const employeeData = {
      employee: {
        id: 1,
        name: 'John Doe',
        role: 'Developer'
      }
    };

    act(() => {
      newEmployeeHandler(employeeData);
    });

    await waitFor(() => {
      expect(screen.getByText('👤 John Doe')).toBeInTheDocument();
    });
  });

  test('creates employee via API call', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Employee created' }),
    });

    render(<App />);

    const nameInput = screen.getByPlaceholderText('Enter employee name');
    const createButton = screen.getByText('Create Employee');

    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/employees/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Jane Smith' }),
      });
    });
  });

  test('shows error message on API failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    const nameInput = screen.getByPlaceholderText('Enter employee name');
    const createButton = screen.getByText('Create Employee');

    fireEvent.change(nameInput, { target: { value: 'Test Employee' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create employee. Please try again.')).toBeInTheDocument();
    });
  });

  test('clears error message when X button clicked', async () => {
    render(<App />);
    
    // Trigger an error first
    const connectErrorCall = mockSocket.on.mock.calls.find(call => call[0] === 'connect_error');
    const connectErrorHandler = connectErrorCall[1];
    
    act(() => {
      connectErrorHandler(new Error('Connection failed'));
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to connect to server')).toBeInTheDocument();
    });

    // Click the X button
    const clearButton = screen.getByText('✕');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByText('Failed to connect to server')).not.toBeInTheDocument();
    });
  });

  test('shows debug information', () => {
    render(<App />);
    
    expect(screen.getByText('Socket.IO Client connected to: http://localhost:8001')).toBeInTheDocument();
    expect(screen.getByText('API Server: http://localhost:8000')).toBeInTheDocument();
    expect(screen.getByText('Total employees: 0')).toBeInTheDocument();
  });

  test('closes socket on unmount', () => {
    const { unmount } = render(<App />);
    
    unmount();
    
    expect(mockSocket.close).toHaveBeenCalled();
  });

  test('handles multiple employee notifications', async () => {
    render(<App />);
    
    const newEmployeeCall = mockSocket.on.mock.calls.find(call => call[0] === 'new_employee');
    const newEmployeeHandler = newEmployeeCall[1];
    
    const employees = [
      { employee: { id: 1, name: 'Alice', role: 'Manager' } },
      { employee: { id: 2, name: 'Bob', role: 'Developer' } },
    ];

    employees.forEach(emp => {
      act(() => {
        newEmployeeHandler(emp);
      });
    });

    await waitFor(() => {
      expect(screen.getByText('👤 Alice')).toBeInTheDocument();
      expect(screen.getByText('👤 Bob')).toBeInTheDocument();
      expect(screen.getByText('Total employees: 2')).toBeInTheDocument();
    });
  });
});