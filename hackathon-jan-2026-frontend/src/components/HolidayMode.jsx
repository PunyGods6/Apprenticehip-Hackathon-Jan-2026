import { useState, useEffect } from 'react';
import { holidayApi } from '../services/api';
import './HolidayMode.css';

function HolidayMode({ onHolidayModeChange }) {
  const [holidayData, setHolidayData] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [daysUsed, setDaysUsed] = useState(0);
  const [allowance, setAllowance] = useState(28);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAllowance, setIsEditingAllowance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const APPRENTICE_ID = 1; // In a real app, this would come from auth context

  useEffect(() => {
    fetchHolidayData();
  }, []);

  const fetchHolidayData = async () => {
    try {
      setLoading(true);
      const holidays = await holidayApi.getAllHolidays();
      const userHoliday = holidays.find(h => h.apprenticeId === APPRENTICE_ID);

      if (userHoliday) {
        setHolidayData(userHoliday);
        setIsEnabled(userHoliday.holidayMode || false);
        setDaysUsed(userHoliday.holidayDays || 0);
        setAllowance(userHoliday.holidayAllowance || 28);
      } else {
        // Create initial holiday record
        const newHoliday = await holidayApi.createHoliday({
          apprenticeId: APPRENTICE_ID,
          holidayMode: false,
          holidayDays: 0,
          holidayAllowance: 28
        });
        setHolidayData(newHoliday);
        setIsEnabled(false);
        setDaysUsed(0);
        setAllowance(28);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch holiday data:', err);
      setError('Failed to load holiday settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const newValue = !isEnabled;
    try {
      const updated = await holidayApi.updateHoliday(holidayData.id, {
        apprenticeId: APPRENTICE_ID,
        holidayMode: newValue,
        holidayDays: daysUsed,
        holidayAllowance: allowance
      });
      setHolidayData(updated);
      setIsEnabled(newValue);
      setError(null);
      // Notify parent component of the change
      if (onHolidayModeChange) {
        onHolidayModeChange(newValue);
      }
    } catch (err) {
      console.error('Failed to update holiday mode:', err);
      setError('Failed to update holiday mode');
    }
  };

  const handleDaysUpdate = async (newDays) => {
    const days = Math.max(0, Math.min(allowance, parseInt(newDays) || 0));
    setDaysUsed(days);

    try {
      const updated = await holidayApi.updateHoliday(holidayData.id, {
        apprenticeId: APPRENTICE_ID,
        holidayMode: isEnabled,
        holidayDays: days,
        holidayAllowance: allowance
      });
      setHolidayData(updated);
      setError(null);
    } catch (err) {
      console.error('Failed to update holiday days:', err);
      setError('Failed to update holiday days');
    }
  };

  const handleAllowanceUpdate = async (newAllowance) => {
    const allowanceDays = Math.max(1, parseInt(newAllowance) || 28);
    setAllowance(allowanceDays);

    // If days used exceeds new allowance, cap it
    const cappedDaysUsed = Math.min(daysUsed, allowanceDays);
    if (cappedDaysUsed !== daysUsed) {
      setDaysUsed(cappedDaysUsed);
    }

    try {
      const updated = await holidayApi.updateHoliday(holidayData.id, {
        apprenticeId: APPRENTICE_ID,
        holidayMode: isEnabled,
        holidayDays: cappedDaysUsed,
        holidayAllowance: allowanceDays
      });
      setHolidayData(updated);
      setError(null);
    } catch (err) {
      console.error('Failed to update holiday allowance:', err);
      setError('Failed to update holiday allowance');
    }
  };

  const remainingDays = allowance - daysUsed;
  const percentageUsed = (daysUsed / allowance) * 100;

  if (loading) {
    return (
      <div className="holiday-mode-container">
        <div className="holiday-loading">Loading holiday settings...</div>
      </div>
    );
  }

  return (
    <div className="holiday-mode-container">
      <div className={`holiday-card ${isEnabled ? 'active' : ''}`}>
        <div className="holiday-header">
          <div className="holiday-title">
            <span className="holiday-icon">{isEnabled ? '🏖️' : '🎯'}</span>
            <div>
              <h3>Holiday Mode</h3>
              <p className="holiday-subtitle">
                {isEnabled
                  ? 'OTJ targets paused while on holiday'
                  : 'Enable when taking time off'}
              </p>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggle}
              aria-label="Toggle holiday mode"
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {error && (
          <div className="holiday-error">
            {error}
          </div>
        )}

        <div className="holiday-stats">
          <div className="holiday-stat">
            <span className="stat-label">Days Used</span>
            <div className="stat-value-container">
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max={allowance}
                  value={daysUsed}
                  onChange={(e) => setDaysUsed(parseInt(e.target.value) || 0)}
                  onBlur={(e) => {
                    handleDaysUpdate(e.target.value);
                    setIsEditing(false);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleDaysUpdate(e.target.value);
                      setIsEditing(false);
                    }
                  }}
                  className="days-input"
                  autoFocus
                />
              ) : (
                <span
                  className="stat-value clickable"
                  onClick={() => setIsEditing(true)}
                  title="Click to edit"
                >
                  {daysUsed}
                </span>
              )}
              <span className="stat-unit">days</span>
            </div>
          </div>

          <div className="holiday-stat">
            <span className="stat-label">Remaining</span>
            <div className="stat-value-container">
              <span className={`stat-value ${remainingDays < 5 ? 'warning' : ''}`}>
                {remainingDays}
              </span>
              <span className="stat-unit">days</span>
            </div>
          </div>

          <div className="holiday-stat">
            <span className="stat-label">Allowance</span>
            <div className="stat-value-container">
              {isEditingAllowance ? (
                <input
                  type="number"
                  min={daysUsed}
                  max="365"
                  value={allowance}
                  onChange={(e) => setAllowance(parseInt(e.target.value) || 28)}
                  onBlur={(e) => {
                    handleAllowanceUpdate(e.target.value);
                    setIsEditingAllowance(false);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAllowanceUpdate(e.target.value);
                      setIsEditingAllowance(false);
                    }
                  }}
                  className="days-input"
                  autoFocus
                />
              ) : (
                <span
                  className="stat-value clickable"
                  onClick={() => setIsEditingAllowance(true)}
                  title="Click to edit"
                >
                  {allowance}
                </span>
              )}
              <span className="stat-unit">days/year</span>
            </div>
          </div>
        </div>

        <div className="holiday-progress">
          <div className="progress-bar">
            <div
              className="progress-fill holiday-fill"
              style={{ width: `${percentageUsed}%` }}
            ></div>
          </div>
          <div className="progress-label">
            <span>{percentageUsed.toFixed(0)}% of allowance used</span>
          </div>
        </div>

        {isEnabled && (
          <div className="holiday-notice">
            <span className="notice-icon">ℹ️</span>
            <span>Weekly OTJ targets are paused while holiday mode is active</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default HolidayMode;
