import './Header.css';

function Header({ onToggleSidebar }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="header-logo">
          <span className="logo-icon">📝</span>
          <span className="logo-text">OneFile</span>
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" aria-label="Messages">
          <span className="icon-wrapper">
            ✉️
            <span className="icon-badge">0</span>
          </span>
        </button>

        <button className="header-icon-btn" aria-label="Tasks">
          <span className="icon-wrapper">
            ✓
            <span className="icon-badge">1</span>
          </span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <span className="user-name">Book Seenonmuang</span>
            <span className="user-role">Apprentice</span>
          </div>
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
