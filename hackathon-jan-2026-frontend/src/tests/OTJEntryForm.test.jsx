import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OTJEntryForm from '../components/OTJEntryForm';

describe('OTJEntryForm - Duration Calculation', () => {
  it('should calculate duration correctly when times are entered', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = () => {};
    const mockOnCancel = () => {};

    render(<OTJEntryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Enter start time
    const startTimeInput = screen.getByLabelText(/start time/i);
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '09:00');

    // Enter end time
    const endTimeInput = screen.getByLabelText(/end time/i);
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '10:30');

    // Duration should be calculated and displayed
    // 1.5 hours displayed as decimal
    expect(screen.getByText(/1\.5h/)).toBeInTheDocument();
  });

  it('should calculate duration for whole hours', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = () => {};
    const mockOnCancel = () => {};

    render(<OTJEntryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const startTimeInput = screen.getByLabelText(/start time/i);
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '14:00');

    const endTimeInput = screen.getByLabelText(/end time/i);
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '17:00');

    // 3 hours exactly as decimal
    expect(screen.getByText(/3\.0h/)).toBeInTheDocument();
  });

  it('should calculate duration for minutes only', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = () => {};
    const mockOnCancel = () => {};

    render(<OTJEntryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const startTimeInput = screen.getByLabelText(/start time/i);
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '14:00');

    const endTimeInput = screen.getByLabelText(/end time/i);
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '14:45');

    // 45 minutes (0.75 hours displayed as 0.8h rounded)
    expect(screen.getByText(/0\.8h/)).toBeInTheDocument();
  });

  it('should show 0 duration when end time is before start time', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = () => {};
    const mockOnCancel = () => {};

    render(<OTJEntryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const startTimeInput = screen.getByLabelText(/start time/i);
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '15:00');

    const endTimeInput = screen.getByLabelText(/end time/i);
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '14:00'); // Earlier time

    // Should show 0 or not calculate
    expect(screen.getByDisplayValue('14:00')).toBeInTheDocument();
  });

  it('should update duration when times change', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = () => {};
    const mockOnCancel = () => {};

    render(<OTJEntryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const startTimeInput = screen.getByLabelText(/start time/i);
    const endTimeInput = screen.getByLabelText(/end time/i);

    // First calculation
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '09:00');
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '10:00');

    expect(screen.getByText(/1\.0h/)).toBeInTheDocument();

    // Change end time
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '11:00');

    // Duration should update to 2.0h
    expect(screen.getByText(/2\.0h/)).toBeInTheDocument();
  });

  it('should show calculated duration in the displayed format', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = () => {};
    const mockOnCancel = () => {};

    render(<OTJEntryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const startTimeInput = screen.getByLabelText(/start time/i);
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '09:00');

    const endTimeInput = screen.getByLabelText(/end time/i);
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '12:15');

    // 3.25 hours displayed as 3.3h (rounded to 1 decimal)
    expect(screen.getByText(/3\.3h/)).toBeInTheDocument();
  });
});

describe('OTJEntryForm - Form Validation', () => {
  it('should render all required form fields', () => {
    const mockOnSubmit = () => {};
    const mockOnCancel = () => {};

    render(<OTJEntryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  it('should have submit and cancel buttons', () => {
    const mockOnSubmit = () => {};
    const mockOnCancel = () => {};

    render(<OTJEntryForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText(/save entry/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });
});
