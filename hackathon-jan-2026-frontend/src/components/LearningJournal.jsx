import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ProgressDashboard from './ProgressDashboard';
import HolidayMode from './HolidayMode';
import OTJEntryForm from './OTJEntryForm';
import JournalTimeline from './JournalTimeline';
import { otjApi, holidayApi } from '../services/api';
import './LearningJournal.css';

function LearningJournal() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [holidayMode, setHolidayMode] = useState(false);

  // Target hours for the apprenticeship (example: 6 hours per week)
  const weeklyTarget = 6;
  const totalTarget = 396; // Annual target (matches backend course total)
  const APPRENTICE_ID = 1;

  // Helper function to sort entries by date (most recent first)
  const sortEntriesByDate = (entriesArray) => {
    return [...entriesArray].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // Descending order (most recent first)
    });
  };

  // Fetch entries and holiday status from backend on mount
  useEffect(() => {
    loadEntries();
    loadHolidayStatus();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await otjApi.getAllEntries();
      setEntries(sortEntriesByDate(data || []));
    } catch (err) {
      console.error('Failed to load entries:', err);
      setError('Failed to load entries. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadHolidayStatus = async () => {
    try {
      const holidays = await holidayApi.getAllHolidays();
      const userHoliday = holidays.find(h => h.apprenticeId === APPRENTICE_ID);
      setHolidayMode(userHoliday?.holidayMode || false);
    } catch (err) {
      console.error('Failed to load holiday status:', err);
      // Don't show error to user, just default to false
    }
  };

  // Calculate total OTJ hours logged
  const totalOTJHours = entries
    .filter(entry => entry.isOffTheJob)
    .reduce((sum, entry) => sum + entry.totalHours, 0);

  const handleAddEntry = async (newEntry, isMultiple = false) => {
    try {
      if (isMultiple) {
        // Handle multiple entries
        const createdEntries = await Promise.all(
          newEntry.map(entry => otjApi.createEntry(entry))
        );
        setEntries(sortEntriesByDate([...createdEntries, ...entries]));
        setShowForm(false);
      } else {
        // Handle single entry
        const createdEntry = await otjApi.createEntry(newEntry);
        setEntries(sortEntriesByDate([createdEntry, ...entries]));
        setShowForm(false);
      }
    } catch (err) {
      console.error('Failed to create entry:', err);
      alert('Failed to save entry. Please try again.');
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleUpdateEntry = async (updatedEntry) => {
    try {
      const updated = await otjApi.updateEntry(editingEntry.id, updatedEntry);
      setEntries(sortEntriesByDate(entries.map(e => e.id === editingEntry.id ? updated : e)));
      setShowForm(false);
      setEditingEntry(null);
    } catch (err) {
      console.error('Failed to update entry:', err);
      alert('Failed to update entry. Please try again.');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await otjApi.deleteEntry(entryId);
      setEntries(entries.filter(e => e.id !== entryId));
    } catch (err) {
      console.error('Failed to delete entry:', err);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  return (
    <div className="learning-journal">
      <Header
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isCollapsed={isSidebarCollapsed}
      />
      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="main-content">
        <header className="journal-header">
          <div className="header-content">
            <h1>Learning Journal</h1>
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add New Entry'}
            </button>
          </div>
        </header>

        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '12px 16px',
            margin: '0 0 20px 0',
            color: '#c33'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading entries...
          </div>
        ) : (
          <>
            <ProgressDashboard
              totalOTJHours={totalOTJHours}
              weeklyTarget={weeklyTarget}
              totalTarget={totalTarget}
              entries={entries}
              holidayMode={holidayMode}
            />

            <HolidayMode onHolidayModeChange={setHolidayMode} />

            {showForm && (
              <OTJEntryForm
                onSave={editingEntry ? handleUpdateEntry : handleAddEntry}
                onCancel={handleCancelEdit}
                initialData={editingEntry}
              />
            )}

            <JournalTimeline
              entries={entries}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default LearningJournal;
