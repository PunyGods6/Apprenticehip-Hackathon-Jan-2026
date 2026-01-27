import { useState } from 'react';
import Sidebar from './Sidebar';
import ProgressDashboard from './ProgressDashboard';
import OTJEntryForm from './OTJEntryForm';
import JournalTimeline from './JournalTimeline';
import './LearningJournal.css';

function LearningJournal() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2026-01-22',
      title: 'Digi-Dev Monthly Huddle',
      category: 'Attending webinars on key industry topics',
      description: 'More on AI integration and tools.',
      isOffTheJob: true,
      totalHours: 1,
      ksbs: [],
      documents: [],
      createdAt: '2026-01-23T15:43:00'
    }
  ]);

  const [showForm, setShowForm] = useState(false);

  // Target hours for the apprenticeship (example: 6 hours per week)
  const weeklyTarget = 6;
  const totalTarget = weeklyTarget * 52; // Annual target

  // Calculate total OTJ hours logged
  const totalOTJHours = entries
    .filter(entry => entry.isOffTheJob)
    .reduce((sum, entry) => sum + entry.totalHours, 0);

  const handleAddEntry = (newEntry) => {
    setEntries([
      {
        ...newEntry,
        id: entries.length + 1,
        createdAt: new Date().toISOString()
      },
      ...entries
    ]);
    setShowForm(false);
  };

  return (
    <div className="learning-journal">
      <Sidebar />
      
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
      </div>
    </div>
  );
}

export default LearningJournal;
