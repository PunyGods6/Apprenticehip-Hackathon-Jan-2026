import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LearningJournal from '../components/LearningJournal';
import { otjApi } from '../services/api';

// Mock the API module
vi.mock('../services/api', () => ({
  otjApi: {
    getAllEntries: vi.fn(),
    createEntry: vi.fn(),
    updateEntry: vi.fn(),
    deleteEntry: vi.fn(),
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

  it('should allow user to edit an existing entry', async () => {
    const mockEntry = {
      id: 1,
      title: 'Initial Title',
      description: 'Initial Description',
      category: 'Training',
      date: '2025-01-15',
      startTime: '09:00',
      endTime: '12:00',
      isOffTheJob: true,
      totalHours: 3.0,
    };

    otjApi.getAllEntries.mockResolvedValue([mockEntry]);
    otjApi.updateEntry.mockResolvedValue({ ...mockEntry, title: 'Updated Title' });

    render(<LearningJournal />);

    // Wait for the initial entry to load
    await waitFor(() => {
      expect(screen.getByText('Initial Title')).toBeInTheDocument();
    });

    // Click the edit button to open the form
    const editButton = screen.getByLabelText(/edit entry/i);
    fireEvent.click(editButton);

    // Verify the form opens in edit mode with the correct title
    await waitFor(() => {
      expect(screen.getByText('Edit Entry')).toBeInTheDocument();
    });

    // Verify the form is pre-populated with existing data
    expect(screen.getByDisplayValue('Initial Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial Description')).toBeInTheDocument();
  });

  it('should allow user to delete an entry', async () => {
    const mockEntries = [
      {
        id: 1,
        title: 'Entry to Delete',
        description: 'This will be deleted',
        category: 'Training',
        date: '2025-01-15',
        startTime: '09:00',
        endTime: '12:00',
        isOffTheJob: true,
        totalHours: 3.0,
      },
      {
        id: 2,
        title: 'Entry to Keep',
        description: 'This stays',
        category: 'Meeting',
        date: '2025-01-16',
        startTime: '10:00',
        endTime: '11:00',
        isOffTheJob: false,
        totalHours: 1.0,
      },
    ];

    otjApi.getAllEntries.mockResolvedValue(mockEntries);
    otjApi.deleteEntry.mockResolvedValue(undefined);

    // Mock window.confirm to return true
    vi.stubGlobal('confirm', vi.fn(() => true));

    render(<LearningJournal />);

    await waitFor(() => {
      expect(screen.getByText('Entry to Delete')).toBeInTheDocument();
      expect(screen.getByText('Entry to Keep')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText(/delete entry/i);
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Are you sure')
    );

    await waitFor(() => {
      expect(otjApi.deleteEntry).toHaveBeenCalledWith(1);
    });

    vi.unstubAllGlobals();
  });
});
