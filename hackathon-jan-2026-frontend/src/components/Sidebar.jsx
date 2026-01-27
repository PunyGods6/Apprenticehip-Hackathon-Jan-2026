import { useState } from 'react';
import './Sidebar.css';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: '🏠', label: 'Home', active: false },
    { icon: '💼', label: 'Portfolio', active: false },
    { icon: '✓', label: 'Tasks', badge: '1', active: false },
    { icon: '📋', label: 'Assessments', active: false },
    { icon: '⏰', label: 'Timesheets', active: false },
    { icon: '📓', label: 'Learning Journal', active: true },
    { icon: '🎯', label: 'Scorecard', active: false },
    { icon: '📚', label: 'Courses', badge: '3', active: false },
    { icon: '✉️', label: 'Messages', badge: '0', active: false },
    { icon: '📊', label: 'Progress', badge: '78%', active: false },
    { icon: '📁', label: 'Resources', active: false },
    { icon: '❓', label: 'Help Centre', active: false }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="hamburger-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="logo">
          <span className="logo-icon">📝</span>
          <span className="logo-text">OneFile</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`nav-item ${item.active ? 'active' : ''}`}
            onClick={(e) => e.preventDefault()}
            title={isCollapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
