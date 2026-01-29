import './ProgressDashboard.css';

function ProgressDashboard({ totalOTJHours, weeklyTarget, totalTarget, entries, holidayMode = false }) {
  const progressPercentage = Math.min((totalOTJHours / totalTarget) * 100, 100);

  // Calculate variance - if holiday mode is on, show 0 variance (no penalty)
  const variance = holidayMode ? 0 : (totalOTJHours - weeklyTarget);

  // Calculate current week's hours
  const currentWeekStart = new Date();
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  const currentWeekHours = entries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.isOffTheJob && entryDate >= currentWeekStart;
    })
    .reduce((sum, entry) => sum + entry.totalHours, 0);

  return (
    <div className="progress-dashboard">
      <div className="dashboard-cards">
        <div className="stat-card primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total OTJ Hours</h3>
            <p className="stat-value">{totalOTJHours.toFixed(1)}h</p>
            <p className="stat-subtitle">of {totalTarget}h target</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>This Week</h3>
            <p className="stat-value">{currentWeekHours.toFixed(1)}h</p>
            <p className="stat-subtitle">Target: {weeklyTarget}h/week</p>
          </div>
        </div>

        <div className={`stat-card ${holidayMode ? 'neutral' : (variance >= 0 ? 'success' : 'warning')}`}>
          <div className="stat-icon">{holidayMode ? '🏖️' : (variance >= 0 ? '✅' : '⚠️')}</div>
          <div className="stat-content">
            <h3>OTJ Weekly Target</h3>
            <p className="stat-value">
              {holidayMode ? '—' : (variance >= 0 ? '+' : '') + variance.toFixed(1) + 'h'}
            </p>
            <p className="stat-subtitle">
              {holidayMode ? 'On holiday' : (variance === 0 ? 'On target!' : variance > 0 ? 'Ahead of target!' : 'Behind target')}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Entries</h3>
            <p className="stat-value">{entries.length}</p>
            <p className="stat-subtitle">
              {entries.filter(e => e.isOffTheJob).length} off-the-job
            </p>
          </div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-header">
          <span className="progress-label">Annual Progress</span>
          <span className="progress-percentage">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="progress-footer">
          <span>{totalOTJHours.toFixed(1)} hours logged</span>
          <span>{(totalTarget - totalOTJHours).toFixed(1)} hours remaining</span>
        </div>
      </div>
    </div>
  );
}

export default ProgressDashboard;
