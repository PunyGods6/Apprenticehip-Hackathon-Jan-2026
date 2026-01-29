import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ProgressDashboard from './ProgressDashboard';
import OTJEntryForm from './OTJEntryForm';
import JournalTimeline from './JournalTimeline';
import { otjApi } from '../services/api';
import './LearningJournal.css';

function LearningJournal() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Target hours for the apprenticeship (example: 6 hours per week)
  const weeklyTarget = 6;
  const totalTarget = weeklyTarget * 52; // Annual target

  // Fetch entries from backend on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await otjApi.getAllEntries();
      setEntries(data || []);
    } catch (err) {
      console.error('Failed to load entries:', err);
      setError('Failed to load entries. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total OTJ hours logged
  const totalOTJHours = entries
    .filter(entry => entry.isOffTheJob)
    .reduce((sum, entry) => sum + entry.totalHours, 0);

  const handleAddEntry = async (newEntry) => {
    try {
      const createdEntry = await otjApi.createEntry(newEntry);
      setEntries([createdEntry, ...entries]);
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create entry:', err);
      alert('Failed to save entry. Please try again.');
    }
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
            />

            {showForm && (
              <OTJEntryForm 
                onSave={handleAddEntry}
                onCancel={() => setShowForm(false)}
              />
            )}

            <JournalTimeline entries={entries} />
          </>
        )}
      </div>
    </div>
  );
}

export default LearningJournal;
