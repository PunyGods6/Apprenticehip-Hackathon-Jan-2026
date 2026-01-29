import { useState } from 'react';
import './KSBSelector.css';

const SAMPLE_KSBS = [
  { id: 'K1', type: 'Knowledge', description: 'Understanding of software development lifecycle' },
  { id: 'K2', type: 'Knowledge', description: 'Knowledge of version control systems' },
  { id: 'K3', type: 'Knowledge', description: 'Understanding of testing methodologies' },
  { id: 'K4', type: 'Knowledge', description: 'Knowledge of agile practices' },
  { id: 'S1', type: 'Skill', description: 'Ability to write clean, maintainable code' },
  { id: 'S2', type: 'Skill', description: 'Problem-solving and debugging skills' },
  { id: 'S3', type: 'Skill', description: 'Communication and collaboration' },
  { id: 'S4', type: 'Skill', description: 'Time management and prioritization' },
  { id: 'B1', type: 'Behaviour', description: 'Professional attitude and work ethic' },
  { id: 'B2', type: 'Behaviour', description: 'Continuous learning mindset' },
  { id: 'B3', type: 'Behaviour', description: 'Attention to detail' }
];

function KSBSelector({ selectedKSBs, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredKSBs = SAMPLE_KSBS.filter(ksb => {
    const matchesSearch = ksb.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ksb.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || ksb.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleKSB = (ksb) => {
    const isSelected = selectedKSBs.some(k => k.id === ksb.id);
    if (isSelected) {
      onChange(selectedKSBs.filter(k => k.id !== ksb.id));
    } else {
      onChange([...selectedKSBs, ksb]);
    }
  };

  const removeKSB = (ksbId) => {
    onChange(selectedKSBs.filter(k => k.id !== ksbId));
  };

  return (
    <div className="ksb-selector">
      <label>
        Knowledge, Skills & Behaviours (KSBs)
        <span className="label-help">Select relevant KSBs demonstrated</span>
      </label>

      {/* Selected KSBs */}
      {selectedKSBs.length > 0 && (
        <div className="selected-ksbs">
          {selectedKSBs.map(ksb => (
            <span key={ksb.id} className={`ksb-tag ${ksb.type.toLowerCase()}`}>
              <span className="ksb-id">{ksb.id}</span>
              <span className="ksb-desc">{ksb.description}</span>
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeKSB(ksb.id)}
                aria-label={`Remove ${ksb.id}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add KSB Button */}
      <button
        type="button"
        className="btn-add-ksb"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        + Add KSB
      </button>

      {/* KSB Dropdown */}
      {showDropdown && (
        <div className="ksb-dropdown">
          <div className="dropdown-header">
            <input
              type="text"
              placeholder="Search KSBs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ksb-search"
            />
            <div className="filter-tabs">
              {['All', 'Knowledge', 'Skill', 'Behaviour'].map(type => (
                <button
                  key={type}
                  type="button"
                  className={`filter-tab ${filterType === type ? 'active' : ''}`}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="ksb-list">
            {filteredKSBs.length === 0 ? (
              <p className="no-results">No KSBs found</p>
            ) : (
              filteredKSBs.map(ksb => {
                const isSelected = selectedKSBs.some(k => k.id === ksb.id);
                return (
                  <div
                    key={ksb.id}
                    className={`ksb-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleKSB(ksb)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleKSB(ksb)}
                      aria-label={`Select ${ksb.id}`}
                    />
                    <div className="ksb-content">
                      <span className={`ksb-badge ${ksb.type.toLowerCase()}`}>
                        {ksb.id}
                      </span>
                      <span className="ksb-description">{ksb.description}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="dropdown-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowDropdown(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default KSBSelector;
