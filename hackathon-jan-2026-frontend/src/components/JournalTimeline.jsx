import './JournalTimeline.css';

function JournalTimeline({ entries, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="journal-timeline">
      <h2>Your Entries</h2>
      
      {entries.length === 0 ? (
        <div className="empty-state">
          <p>No entries yet. Click "+ Add New Entry" to get started!</p>
        </div>
      ) : (
        <div className="timeline">
          {entries.map((entry) => (
            <div key={entry.id} className="timeline-item">
              <div className="timeline-date">
                <div className="date-circle">{new Date(entry.date).getDate()}</div>
                <div className="date-month">
                  {new Date(entry.date).toLocaleDateString('en-GB', { month: 'short' })}
                </div>
                <div className="date-year">
                  {new Date(entry.date).getFullYear()}
                </div>
              </div>

              <div className="timeline-content">
                <div className="entry-card">
                  <div className="entry-header">
                    <h3>{entry.title}</h3>
                    <div className="entry-header-actions">
                      {entry.isOffTheJob && (
                        <span className="otj-badge">✓ Off the Job</span>
                      )}
                      <div className="entry-actions">
                        <button 
                          className="btn-icon-action" 
                          onClick={() => onEdit(entry)}
                          title="Edit entry"
                          aria-label="Edit entry"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon-action btn-delete" 
                          onClick={() => onDelete(entry.id)}
                          title="Delete entry"
                          aria-label="Delete entry"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="entry-meta">
                    <span className="entry-category">📚 {entry.category}</span>
                    <span className="entry-hours">⏱️ {entry.totalHours?.toFixed(1) || 0}h</span>
                  </div>

                  {entry.description && (
                    <p className="entry-description">{entry.description}</p>
                  )}

                  {entry.ksbs && entry.ksbs.length > 0 && (
                    <div className="entry-ksbs">
                      <strong>KSBs:</strong>
                      <div className="ksb-tags">
                        {entry.ksbs.map(ksb => (
                          <span key={ksb.id} className={`ksb-tag ${ksb.type.toLowerCase()}`}>
                            {ksb.id}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.documents && entry.documents.length > 0 && (
                    <div className="entry-documents">
                      <strong>Documents:</strong>
                      <div className="document-tags">
                        {entry.documents.map(doc => (
                          <span key={doc.id} className="doc-tag">
                            📎 {doc.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="entry-footer">
                    <span className="entry-timestamp">
                      Created {formatDate(entry.creation)} at {formatTime(entry.creation)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JournalTimeline;
