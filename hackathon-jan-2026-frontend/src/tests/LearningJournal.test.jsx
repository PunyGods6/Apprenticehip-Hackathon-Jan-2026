import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LearningJournal from '../components/LearningJournal';
import { otjApi } from '../services/api';

// Mock the API module
vi.mock('../services/api', () => ({
  otjApi: {
    getAllEntries: vi.fn(),
    createEntry: vi.fn(),
  }
}));

describe('LearningJournal - Integration Tests', () => {
  const mockInitialEntries = [
    {
      id: 1,
      title: 'Existing Entry',
      description: 'An existing entry',
      category: 'Being mentored by a senior colleague',
      date: '2026-01-15',
      startTime: '09:00',
      endTime: '12:00',
      isOffTheJob: true,
      totalHours: 3,
      creation: '2026-01-15T09:00:00'
    }
  ];

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Default mock implementation - returns initial entries
    otjApi.getAllEntries.mockResolvedValue(mockInitialEntries);
  });

  it('should add a new entry and display it in the timeline', async () => {
    const user = userEvent.setup();
    
    // Mock the createEntry API call
    const newEntry = {
      id: 2,
      title: 'New Test Entry',
      description: 'Testing entry creation',
      category: 'Being mentored by a senior colleague',
      date: '2026-01-29',
      startTime: '10:00',
      endTime: '12:00',
      isOffTheJob: true,
      totalHours: 2,
      creation: '2026-01-29T10:00:00'
    };
    otjApi.createEntry.mockResolvedValue(newEntry);

    render(<LearningJournal />);

    // Wait for initial entries to load
    await waitFor(() => {
      expect(screen.getByText('Existing Entry')).toBeInTheDocument();
    });

    // Click "Add New Entry" button
    const addButton = screen.getByRole('button', { name: /add new entry/i });
    await user.click(addButton);

    // Verify form appears
    expect(screen.getByLabelText(/^title/i)).toBeInTheDocument();

    // Fill out the form
    await user.type(screen.getByLabelText(/^title/i), 'New Test Entry');
    await user.type(screen.getByLabelText(/^description/i), 'Testing entry creation');
    
    // Select category from dropdown
    const categorySelect = screen.getByLabelText(/select a category/i);
    await user.selectOptions(categorySelect, 'Being mentored by a senior colleague');
    
    // Fill date and time fields
    const dateInput = screen.getByLabelText(/date/i);
    await user.clear(dateInput);
    await user.type(dateInput, '2026-01-29');
    
    const startTimeInput = screen.getByLabelText(/start time/i);
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '10:00');
    
    const endTimeInput = screen.getByLabelText(/end time/i);
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '12:00');
    
    // Check "Off the Job" checkbox - wait for it to be clickable
    await waitFor(async () => {
      const otjCheckbox = screen.getByLabelText(/mark as off-the-job learning/i);
      await user.click(otjCheckbox);
      expect(otjCheckbox).toBeChecked();
    });

    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save entry/i });
    await user.click(saveButton);

    // Verify API was called with correct data
    await waitFor(() => {
      expect(otjApi.createEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Test Entry',
          description: 'Testing entry creation',
          category: 'Being mentored by a senior colleague',
          date: '2026-01-29',
          startTime: '10:00',
          endTime: '12:00',
          isOffTheJob: true,
          totalHours: 2
        })
      );
    });

    // Verify new entry appears in timeline
    await waitFor(() => {
      expect(screen.getByText('New Test Entry')).toBeInTheDocument();
      expect(screen.getByText('Testing entry creation')).toBeInTheDocument();
    });
  });

  it('should update progress dashboard when a new entry is added', async () => {
    const user = userEvent.setup();
    
    // Mock the createEntry API call
    const newOTJEntry = {
      id: 3,
      title: 'Another OTJ Entry',
      description: 'More OTJ hours',
      category: 'Being mentored by a senior colleague',
      date: '2026-01-29',
      startTime: '14:00',
      endTime: '17:00',
      isOffTheJob: true,
      totalHours: 3,
      creation: '2026-01-29T14:00:00'
    };
    otjApi.createEntry.mockResolvedValue(newOTJEntry);

    render(<LearningJournal />);

    // Wait for initial load and check initial OTJ hours (3h from existing entry)
    await waitFor(() => {
      expect(screen.getByText('3.0h')).toBeInTheDocument(); // Total OTJ hours
    });

    // Add new entry
    const addButton = screen.getByRole('button', { name: /add new entry/i });
    await user.click(addButton);

    // Fill and submit form
    await user.type(screen.getByLabelText(/^title/i), 'Another OTJ Entry');
    await user.type(screen.getByLabelText(/^description/i), 'More OTJ hours');
    
    const categorySelect = screen.getByLabelText(/select a category/i);
    await user.selectOptions(categorySelect, 'Being mentored by a senior colleague');
    
    const dateInput = screen.getByLabelText(/date/i);
    await user.clear(dateInput);
    await user.type(dateInput, '2026-01-29');
    
    const startTimeInput = screen.getByLabelText(/start time/i);
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '14:00');
    
    const endTimeInput = screen.getByLabelText(/end time/i);
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '17:00');
    
    // Check "Off the Job" checkbox - wait for it to be clickable
    await waitFor(async () => {
      const otjCheckbox = screen.getByLabelText(/mark as off-the-job learning/i);
      await user.click(otjCheckbox);
      expect(otjCheckbox).toBeChecked();
    });

    const saveButton = screen.getByRole('button', { name: /save entry/i });
    await user.click(saveButton);

    // Wait for dashboard to update - should now show 6h (3h + 3h)
    await waitFor(() => {
      expect(screen.getByText('6.0h')).toBeInTheDocument();
    });
  });

  it('should successfully submit form with valid data', async () => {
    const user = userEvent.setup();
    
    // Mock the createEntry API call
    const newEntry = {
      id: 4,
      title: 'Form Submission Test',
      description: 'No description provided',
      category: 'Being mentored by a senior colleague',
      date: '2026-01-29',
      startTime: '',
      endTime: '',
      isOffTheJob: false,
      totalHours: 0,
      creation: '2026-01-29T09:00:00'
    };
    otjApi.createEntry.mockResolvedValue(newEntry);

    render(<LearningJournal />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Existing Entry')).toBeInTheDocument();
    });

    // Open form
    const addButton = screen.getByRole('button', { name: /add new entry/i });
    await user.click(addButton);

    // Fill out required fields
    await user.type(screen.getByLabelText(/^title/i), 'Form Submission Test');
    
    const categorySelect = screen.getByLabelText(/select a category/i);
    await user.selectOptions(categorySelect, 'Being mentored by a senior colleague');

    // Submit
    const saveButton = screen.getByRole('button', { name: /save entry/i });
    await user.click(saveButton);

    // Verify API was called with correct data
    await waitFor(() => {
      expect(otjApi.createEntry).toHaveBeenCalledTimes(1);
    });
    
    expect(otjApi.createEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Form Submission Test',
        category: 'Being mentored by a senior colleague'
      })
    );
  });

  it('should display error message when entries fail to load', async () => {
    // Mock API failure
    otjApi.getAllEntries.mockRejectedValue(new Error('Network error'));

    render(<LearningJournal />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/failed to load entries/i)).toBeInTheDocument();
    });
  });

  it('should show loading state while fetching entries', () => {
    // Mock a delayed response
    otjApi.getAllEntries.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockInitialEntries), 1000))
    );

    render(<LearningJournal />);

    // Verify loading message appears
    expect(screen.getByText(/loading entries/i)).toBeInTheDocument();
  });
});
