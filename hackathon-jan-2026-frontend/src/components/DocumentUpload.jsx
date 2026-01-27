import { useState } from 'react';
import './DocumentUpload.css';

function DocumentUpload({ documents, onChange }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    const newDocuments = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));

    onChange([...documents, ...newDocuments]);
  };

  const removeDocument = (docId) => {
    onChange(documents.filter(doc => doc.id !== docId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <div className="document-upload">
      <label>
        Supporting Documents
        <span className="label-help">Upload evidence of your learning (PDF, Word, Excel, PowerPoint, Images)</span>
      </label>

      {/* Upload Area */}
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">📤</div>
        <p className="upload-text">Drag files here to upload, or</p>
        <label htmlFor="file-input" className="btn-upload">
          Choose Files
        </label>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <p className="upload-hint">Accepted: PDF, Word, Excel, PowerPoint, Images</p>
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="document-list">
          {documents.map(doc => (
            <div key={doc.id} className="document-item">
              <span className="doc-icon">{getFileIcon(doc.type)}</span>
              <div className="doc-info">
                <span className="doc-name">{doc.name}</span>
                <span className="doc-size">{formatFileSize(doc.size)}</span>
              </div>
              <button
                type="button"
                className="remove-doc-btn"
                onClick={() => removeDocument(doc.id)}
                aria-label={`Remove ${doc.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
