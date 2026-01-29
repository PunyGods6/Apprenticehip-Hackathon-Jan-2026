import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HolidayMode from '../components/HolidayMode';
import { holidayApi } from '../services/api';

// Mock the API module
vi.mock('../services/api', () => ({
  holidayApi: {
    getAllHolidays: vi.fn(),
    createHoliday: vi.fn(),
    updateHoliday: vi.fn(),
  }
}));

describe('HolidayMode', () => {
  const mockHoliday = {
    id: 1,
    apprenticeId: 1,
    holidayMode: false,
    holidayDays: 0
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should display loading state initially', () => {
      holidayApi.getAllHolidays.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<HolidayMode />);

      expect(screen.getByText(/loading holiday settings/i)).toBeInTheDocument();
    });

    it('should render holiday mode component with initial data', async () => {
      holidayApi.getAllHolidays.mockResolvedValue([mockHoliday]);

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText('Holiday Mode')).toBeInTheDocument();
      });

      expect(screen.getByText(/enable when taking time off/i)).toBeInTheDocument();
      expect(screen.getByText('Days Used')).toBeInTheDocument();
      expect(screen.getByText('Remaining')).toBeInTheDocument();
      expect(screen.getByText('Allowance')).toBeInTheDocument();
    });

    it('should create new holiday record if none exists', async () => {
      holidayApi.getAllHolidays.mockResolvedValue([]);
      holidayApi.createHoliday.mockResolvedValue(mockHoliday);

      render(<HolidayMode />);

      await waitFor(() => {
        expect(holidayApi.createHoliday).toHaveBeenCalledWith({
          apprenticeId: 1,
          holidayMode: false,
          holidayDays: 0,
          holidayAllowance: 28
        });
      });
    });
  });

  describe('Holiday Mode Toggle', () => {
    it('should toggle holiday mode on', async () => {
      const updatedHoliday = { ...mockHoliday, holidayMode: true };
      holidayApi.getAllHolidays.mockResolvedValue([mockHoliday]);
      holidayApi.updateHoliday.mockResolvedValue(updatedHoliday);

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText('Holiday Mode')).toBeInTheDocument();
      });

      const toggle = screen.getByLabelText(/toggle holiday mode/i);
      fireEvent.click(toggle);

      await waitFor(() => {
        expect(holidayApi.updateHoliday).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            holidayMode: true,
            holidayDays: 0
          })
        );
      });
    });

    it('should display holiday notice when mode is enabled', async () => {
      const activeHoliday = { ...mockHoliday, holidayMode: true };
      holidayApi.getAllHolidays.mockResolvedValue([activeHoliday]);

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText(/weekly otj targets are paused/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/otj targets paused while on holiday/i)).toBeInTheDocument();
    });

    it('should show correct icon based on holiday mode state', async () => {
      // First render with inactive mode
      holidayApi.getAllHolidays.mockResolvedValue([mockHoliday]);

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText('🎯')).toBeInTheDocument();
      });

      // Toggle to active mode
      const updatedHoliday = { ...mockHoliday, holidayMode: true };
      holidayApi.updateHoliday.mockResolvedValue(updatedHoliday);
      
      const toggle = screen.getByLabelText(/toggle holiday mode/i);
      fireEvent.click(toggle);

      await waitFor(() => {
        expect(screen.getByText('🏖️')).toBeInTheDocument();
      });
    });
  });

  describe('Holiday Days Tracking', () => {
    it('should display correct days used and remaining', async () => {
      const holidayWith10Days = { ...mockHoliday, holidayDays: 10 };
      holidayApi.getAllHolidays.mockResolvedValue([holidayWith10Days]);

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument(); // Days used
        expect(screen.getByText('18')).toBeInTheDocument(); // Remaining (28 - 10)
      });
    });

    it('should calculate correct percentage used', async () => {
      const holidayWith14Days = { ...mockHoliday, holidayDays: 14 };
      holidayApi.getAllHolidays.mockResolvedValue([holidayWith14Days]);

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText('50% of allowance used')).toBeInTheDocument();
      });
    });

    it('should show warning styling when remaining days are low', async () => {
      const holidayWith24Days = { ...mockHoliday, holidayDays: 24 };
      holidayApi.getAllHolidays.mockResolvedValue([holidayWith24Days]);

      render(<HolidayMode />);

      await waitFor(() => {
        const remainingValue = screen.getByText('4');
        expect(remainingValue.className).toContain('warning');
      });
    });

    it('should update holiday days when edited', async () => {
      holidayApi.getAllHolidays.mockResolvedValue([mockHoliday]);
      holidayApi.updateHoliday.mockResolvedValue({ ...mockHoliday, holidayDays: 5 });

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText('Days Used')).toBeInTheDocument();
      });

      // Click on days value to edit
      const daysValue = screen.getByText('0');
      fireEvent.click(daysValue);

      // Find the input and change value
      const input = screen.getByDisplayValue('0');
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(holidayApi.updateHoliday).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            holidayDays: 5
          })
        );
      });
    });

    it('should not allow negative days', async () => {
      holidayApi.getAllHolidays.mockResolvedValue([mockHoliday]);
      holidayApi.updateHoliday.mockResolvedValue({ ...mockHoliday, holidayDays: 0 });

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText('Days Used')).toBeInTheDocument();
      });

      const daysValue = screen.getByText('0');
      fireEvent.click(daysValue);

      const input = screen.getByDisplayValue('0');
      fireEvent.change(input, { target: { value: '-5' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(holidayApi.updateHoliday).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            holidayDays: 0 // Should be clamped to 0
          })
        );
      });
    });

    it('should not allow days exceeding total allowance', async () => {
      holidayApi.getAllHolidays.mockResolvedValue([mockHoliday]);
      holidayApi.updateHoliday.mockResolvedValue({ ...mockHoliday, holidayDays: 28 });

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText('Days Used')).toBeInTheDocument();
      });

      const daysValue = screen.getByText('0');
      fireEvent.click(daysValue);

      const input = screen.getByDisplayValue('0');
      fireEvent.change(input, { target: { value: '50' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(holidayApi.updateHoliday).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            holidayDays: 28 // Should be clamped to max 28
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when fetching fails', async () => {
      holidayApi.getAllHolidays.mockRejectedValue(new Error('Network error'));

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load holiday settings/i)).toBeInTheDocument();
      });
    });

    it('should display error message when update fails', async () => {
      holidayApi.getAllHolidays.mockResolvedValue([mockHoliday]);
      holidayApi.updateHoliday.mockRejectedValue(new Error('Update failed'));

      render(<HolidayMode />);

      await waitFor(() => {
        expect(screen.getByText('Holiday Mode')).toBeInTheDocument();
      });

      const toggle = screen.getByLabelText(/toggle holiday mode/i);
      fireEvent.click(toggle);

      await waitFor(() => {
        expect(screen.getByText(/failed to update holiday mode/i)).toBeInTheDocument();
      });
    });
  });
});
