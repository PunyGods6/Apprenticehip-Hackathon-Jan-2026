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

function OTJEntryForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    isOffTheJob: true,
    ksbs: [],
    documents: []
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

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
  };

  return (
    <div className="otj-form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>New Off-the-Job Entry</h2>
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
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
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
