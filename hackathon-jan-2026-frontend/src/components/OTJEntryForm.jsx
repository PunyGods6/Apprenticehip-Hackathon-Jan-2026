import { useState } from 'react';
import KSBSelector from './KSBSelector';
import DocumentUpload from './DocumentUpload';
import './OTJEntryForm.css';

const OTJ_CATEGORIES = [
  {
    name: 'Attending webinars on key industry topics',
    description: 'Online seminars and industry events'
  },
  {
    name: 'Being mentored by a senior colleague',
    description: 'One-on-one mentorship sessions'
  },
  {
    name: 'Classroom session/theory or lectures',
    description: 'Formal training and education sessions'
  },
  {
    name: 'Research and self-study',
    description: 'Independent learning and research'
  },
  {
    name: 'Skills workshops and practical training',
    description: 'Hands-on skill development sessions'
  },
  {
    name: 'Team training sessions',
    description: 'Group learning activities'
  }
];

function OTJEntryForm({ onSave, onCancel, initialData }) {
  // Initialize form data with initialData if editing, otherwise use defaults
  const [formData, setFormData] = useState(
    initialData ? {
      title: initialData.title || '',
      category: initialData.category || '',
      description: initialData.description || '',
      date: initialData.date || new Date().toISOString().split('T')[0],
      startTime: initialData.startTime || '09:00',
      endTime: initialData.endTime || '10:00',
      isOffTheJob: initialData.isOffTheJob ?? true,
      ksbs: initialData.ksbs || [],
      documents: initialData.documents || []
    } : {
      title: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      isOffTheJob: true,
      ksbs: [],
      documents: []
    }
  );

  const [multiDateMode, setMultiDateMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);

  // Calculate duration directly from formData
  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      const durationMinutes = endMinutes - startMinutes;
      const hours = durationMinutes / 60;

      return hours > 0 ? Math.round(hours * 10) / 10 : 0;
    }
    return 0;
  };

  const duration = calculateDuration();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateToggle = (date) => {
    setSelectedDates(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      } else {
        return [...prev, date].sort();
      }
    });
  };

  const handleMultiModeToggle = () => {
    const newMode = !multiDateMode;
    setMultiDateMode(newMode);
    if (newMode) {
      // When enabling multi-mode, always start with empty selection
      setSelectedDates([]);
    } else {
      // When disabling multi-mode, clear selected dates
      setSelectedDates([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (multiDateMode && selectedDates.length === 0) {
      alert('Please select at least one date');
      return;
    }

    // If multi-date mode, create multiple entries
    if (multiDateMode) {
      const entries = selectedDates.map(date => ({
        title: formData.title,
        description: formData.description || 'No description provided',
        category: formData.category,
        date: date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isOffTheJob: formData.isOffTheJob,
        totalHours: duration
      }));
      onSave(entries, true); // Pass true to indicate multiple entries
    } else {
      // Send only the fields the backend expects
      onSave({
        title: formData.title,
        description: formData.description || 'No description provided',
        category: formData.category,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isOffTheJob: formData.isOffTheJob,
        totalHours: duration
      });
    }
  };

  return (
    <div className="otj-form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>
            {initialData ? 'Edit Entry' : 'New Off-the-Job Entry'}
            {multiDateMode && selectedDates.length > 0 && (
              <span className="entry-count-badge">
                {selectedDates.length} {selectedDates.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </h2>
          <button className="btn-icon" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Weekly Tech Workshop"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">
              Select a Category <span className="required">*</span>
              <span className="label-help">What type of off-the-job learning?</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
            >
              <option value="">-- Select Category --</option>
              {OTJ_CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formData.category && (
              <p className="category-description">
                {OTJ_CATEGORIES.find(c => c.name === formData.category)?.description}
              </p>
            )}
          </div>

          {/* Date and Time Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">
                Date <span className="required">*</span>
                <label className="multi-date-toggle">
                  <input
                    type="checkbox"
                    checked={multiDateMode}
                    onChange={handleMultiModeToggle}
                    disabled={!!initialData}
                  />
                  <span>Multi-date</span>
                </label>
              </label>
              {multiDateMode ? (
                <div className="multi-date-selector">
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    onBlur={(e) => {
                      if (e.target.value && !selectedDates.includes(e.target.value)) {
                        handleDateToggle(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        e.preventDefault();
                        if (!selectedDates.includes(e.target.value)) {
                          handleDateToggle(e.target.value);
                          e.target.value = '';
                        }
                      }
                    }}
                    className="date-picker"
                  />
                  <div className="selected-dates">
                    {selectedDates.length === 0 ? (
                      <p className="no-dates"><b><u>Note:</u> Input date and press Enter or click the date picker above to select dates</b></p>
                    ) : (
                      selectedDates.map(date => (
                        <span key={date} className="date-chip">
                          {new Date(date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                          <button
                            type="button"
                            onClick={() => handleDateToggle(date)}
                            className="remove-date"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <input
                  id="date"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <div className="duration-display">
                {duration > 0 ? `${duration.toFixed(1)}h` : '0h'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">
              Description
              <span className="label-help">What did you learn?</span>
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="Describe what you did and what you learned..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          {/* KSB Selector */}
          <KSBSelector
            selectedKSBs={formData.ksbs}
            onChange={(ksbs) => handleChange('ksbs', ksbs)}
          />

          {/* Document Upload */}
          <DocumentUpload
            documents={formData.documents}
            onChange={(docs) => handleChange('documents', docs)}
          />

          {/* Off the Job Toggle */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isOffTheJob}
                onChange={(e) => handleChange('isOffTheJob', e.target.checked)}
              />
              <span className="checkbox-text">
                Mark as Off-The-Job learning
                <span className="checkbox-help">
                  This will count towards your OTJ hours target
                </span>
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OTJEntryForm;
