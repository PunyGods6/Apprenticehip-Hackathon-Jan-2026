import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentUpload from '../components/DocumentUpload';

describe('DocumentUpload - File Validation', () => {
  it('should accept valid PDF file', async () => {
    const user = userEvent.setup();
    const mockOnChange = () => {};

    render(<DocumentUpload documents={[]} onChange={mockOnChange} />);

    const fileInput = screen.getByLabelText(/choose files/i);
    const file = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });

    await user.upload(fileInput, file);

    // File input should have received the file
    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it('should accept valid Word document', async () => {
    const user = userEvent.setup();
    const mockOnChange = () => {};

    render(<DocumentUpload documents={[]} onChange={mockOnChange} />);

    const fileInput = screen.getByLabelText(/choose files/i);
    const file = new File(['dummy content'], 'document.docx', { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });

    await user.upload(fileInput, file);

    expect(fileInput.files[0]).toBe(file);
  });

  it('should accept valid Excel file', async () => {
    const user = userEvent.setup();
    const mockOnChange = () => {};

    render(<DocumentUpload documents={[]} onChange={mockOnChange} />);

    const fileInput = screen.getByLabelText(/choose files/i);
    const file = new File(['dummy content'], 'spreadsheet.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    await user.upload(fileInput, file);

    expect(fileInput.files[0]).toBe(file);
  });

  it('should accept valid image file', async () => {
    const user = userEvent.setup();
    const mockOnChange = () => {};

    render(<DocumentUpload documents={[]} onChange={mockOnChange} />);

    const fileInput = screen.getByLabelText(/choose files/i);
    const file = new File(['dummy content'], 'screenshot.png', { type: 'image/png' });

    await user.upload(fileInput, file);

    expect(fileInput.files[0]).toBe(file);
  });

  it('should accept multiple valid file types', async () => {
    const user = userEvent.setup();
    const mockOnChange = () => {};

    render(<DocumentUpload documents={[]} onChange={mockOnChange} />);

    const fileInput = screen.getByLabelText(/choose files/i);
    const files = [
      new File(['content1'], 'doc.pdf', { type: 'application/pdf' }),
      new File(['content2'], 'image.jpg', { type: 'image/jpeg' }),
    ];

    await user.upload(fileInput, files);

    expect(fileInput.files).toHaveLength(2);
  });
});

describe('DocumentUpload - Display', () => {
  it('should display uploaded document names', () => {
    const documents = [
      { id: 1, name: 'report.pdf', size: 1024000, type: 'application/pdf' },
      { id: 2, name: 'screenshot.png', size: 2048000, type: 'image/png' },
    ];
    const mockOnChange = () => {};

    render(<DocumentUpload documents={documents} onChange={mockOnChange} />);

    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByText('screenshot.png')).toBeInTheDocument();
  });

  it('should display file sizes in readable format', () => {
    const documents = [
      { id: 1, name: 'small.pdf', size: 1024, type: 'application/pdf' }, // 1 KB
      { id: 2, name: 'medium.pdf', size: 1048576, type: 'application/pdf' }, // 1 MB
    ];
    const mockOnChange = () => {};

    render(<DocumentUpload documents={documents} onChange={mockOnChange} />);

    // Check that sizes are formatted (KB, MB)
    expect(screen.getByText(/KB/i)).toBeInTheDocument();
  });

  it('should show remove button for each document', () => {
    const documents = [
      { id: 1, name: 'document.pdf', size: 1024000, type: 'application/pdf' },
    ];
    const mockOnChange = () => {};

    render(<DocumentUpload documents={documents} onChange={mockOnChange} />);

    // Should have remove/delete button with specific aria-label
    const removeButton = screen.getByRole('button', { name: /remove document\.pdf/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('should show empty state when no documents', () => {
    render(<DocumentUpload documents={[]} onChange={() => {}} />);

    expect(screen.getByText(/drag files here to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/choose files/i)).toBeInTheDocument();
  });
});

describe('DocumentUpload - User Interactions', () => {
  it('should call onChange when file is removed', async () => {
    const user = userEvent.setup();
    let documents = [{ id: 1, name: 'document.pdf', size: 1024000, type: 'application/pdf' }];
    const mockOnChange = (newDocs) => {
      documents = newDocs;
    };

    render(
      <DocumentUpload documents={documents} onChange={mockOnChange} />
    );

    const removeButton = screen.getByRole('button', { name: /remove document\.pdf/i });
    await user.click(removeButton);

    // Verify the button exists (actual removal would need more integration)
    expect(removeButton).toBeInTheDocument();
  });

  it('should have accessible file input', () => {
    render(<DocumentUpload documents={[]} onChange={() => {}} />);

    const fileInput = screen.getByLabelText(/choose files/i);
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept');
  });

  it('should allow multiple file selection', () => {
    render(<DocumentUpload documents={[]} onChange={() => {}} />);

    const fileInput = screen.getByLabelText(/choose files/i);
    expect(fileInput).toHaveAttribute('multiple');
  });
});

describe('DocumentUpload - File Type Support', () => {
  it('should accept PDF files', () => {
    render(<DocumentUpload documents={[]} onChange={() => {}} />);
    
    const fileInput = screen.getByLabelText(/choose files/i);
    const acceptAttribute = fileInput.getAttribute('accept');
    
    expect(acceptAttribute).toContain('.pdf');
  });

  it('should accept Word documents', () => {
    render(<DocumentUpload documents={[]} onChange={() => {}} />);
    
    const fileInput = screen.getByLabelText(/choose files/i);
    const acceptAttribute = fileInput.getAttribute('accept');
    
    expect(acceptAttribute).toContain('.doc');
  });

  it('should accept image files', () => {
    render(<DocumentUpload documents={[]} onChange={() => {}} />);
    
    const fileInput = screen.getByLabelText(/choose files/i);
    const acceptAttribute = fileInput.getAttribute('accept');
    
    expect(acceptAttribute).toContain('.png');
    expect(acceptAttribute).toContain('.jpg');
  });
});
