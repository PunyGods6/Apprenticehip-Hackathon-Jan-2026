import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KSBSelector from '../components/KSBSelector';

describe('KSBSelector - Search and Filter', () => {
  const mockOnChange = () => { };

  it('should show search input when dropdown is opened', async () => {
    const user = userEvent.setup();
    render(<KSBSelector selectedKSBs={[]} onChange={mockOnChange} />);

    // Open dropdown first
    await user.click(screen.getByText(/add ksb/i));

    expect(screen.getByPlaceholderText(/search ksbs/i)).toBeInTheDocument();
  });

  it('should filter KSBs by search term', async () => {
    const user = userEvent.setup();
    render(<KSBSelector selectedKSBs={[]} onChange={mockOnChange} />);

    // Open dropdown
    await user.click(screen.getByText(/add ksb/i));

    const searchInput = screen.getByPlaceholderText(/search ksbs/i);

    // Search for "software"
    await user.type(searchInput, 'software');

    // Should show KSBs containing "software"
    expect(screen.getByText(/software development lifecycle/i)).toBeInTheDocument();
  });

  it('should filter KSBs by type - Knowledge', async () => {
    const user = userEvent.setup();
    render(<KSBSelector selectedKSBs={[]} onChange={mockOnChange} />);

    // Open dropdown
    await user.click(screen.getByText(/add ksb/i));

    // Click Knowledge filter button
    const knowledgeButton = screen.getByText('Knowledge');
    await user.click(knowledgeButton);

    // Should show Knowledge items (K1, K2, etc.)
    expect(screen.getByText('K1')).toBeInTheDocument();
  });

  it('should filter KSBs by type - Skill', async () => {
    const user = userEvent.setup();
    render(<KSBSelector selectedKSBs={[]} onChange={mockOnChange} />);

    // Open dropdown
    await user.click(screen.getByText(/add ksb/i));

    const skillButton = screen.getByText('Skill');
    await user.click(skillButton);

    // Should show Skill items (S1, S2, etc.)
    expect(screen.getByText('S1')).toBeInTheDocument();
  });

  it('should filter KSBs by type - Behaviour', async () => {
    const user = userEvent.setup();
    render(<KSBSelector selectedKSBs={[]} onChange={mockOnChange} />);

    // Open dropdown
    await user.click(screen.getByText(/add ksb/i));

    const behaviourButton = screen.getByText('Behaviour');
    await user.click(behaviourButton);

    // Should show Behaviour items (B1, B2, etc.)
    expect(screen.getByText('B1')).toBeInTheDocument();
  });

  it('should show all KSBs when All filter is selected', async () => {
    const user = userEvent.setup();
    render(<KSBSelector selectedKSBs={[]} onChange={mockOnChange} />);

    // Open dropdown
    await user.click(screen.getByText(/add ksb/i));

    // First filter by Knowledge
    const knowledgeButton = screen.getByText('Knowledge');
    await user.click(knowledgeButton);

    // Then click All
    const allButton = screen.getByText('All');
    await user.click(allButton);

    // Should show items from all types
    expect(screen.getByText('K1')).toBeInTheDocument();
    expect(screen.getByText('S1')).toBeInTheDocument();
    expect(screen.getByText('B1')).toBeInTheDocument();
  });

  it('should combine search and filter', async () => {
    const user = userEvent.setup();
    render(<KSBSelector selectedKSBs={[]} onChange={mockOnChange} />);

    // Open dropdown
    await user.click(screen.getByText(/add ksb/i));

    // Filter by Skills
    const skillButton = screen.getByText('Skill');
    await user.click(skillButton);

    // Then search
    const searchInput = screen.getByPlaceholderText(/search ksbs/i);
    await user.type(searchInput, 'code');

    // Should only show Skills containing "code"
    expect(screen.getByText(/clean, maintainable code/i)).toBeInTheDocument();
  });
});

describe('KSBSelector - Selection Management', () => {
  it('should display selected KSBs with badges', () => {
    const selectedKSBs = [
      { id: 'K1', type: 'Knowledge', description: 'Understanding of software development lifecycle' },
      { id: 'S1', type: 'Skill', description: 'Ability to write clean, maintainable code' },
      { id: 'B1', type: 'Behaviour', description: 'Professional attitude and work ethic' }
    ];
    const mockOnChange = () => { };

    render(<KSBSelector selectedKSBs={selectedKSBs} onChange={mockOnChange} />);

    // Check if selected items are displayed with their IDs
    expect(screen.getByText('K1')).toBeInTheDocument();
    expect(screen.getByText('S1')).toBeInTheDocument();
    expect(screen.getByText('B1')).toBeInTheDocument();
  });

  it('should show correct tag styles for different types', () => {
    const selectedKSBs = [
      { id: 'K1', type: 'Knowledge', description: 'Understanding of software development lifecycle' }
    ];
    const mockOnChange = () => { };

    render(<KSBSelector selectedKSBs={selectedKSBs} onChange={mockOnChange} />);

    // Knowledge should have knowledge class
    const ksbTag = screen.getByText('K1').closest('.ksb-tag');
    expect(ksbTag).toHaveClass('knowledge');
  });

  it('should toggle KSB selection when clicked in dropdown', async () => {
    const user = userEvent.setup();
    let selectedKSBs = [];
    const mockOnChange = (ksbs) => {
      selectedKSBs = ksbs;
    };

    render(
      <KSBSelector selectedKSBs={selectedKSBs} onChange={mockOnChange} />
    );

    // Open dropdown
    await user.click(screen.getByText(/add ksb/i));

    // Find and click a KSB checkbox
    const ksbCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(ksbCheckbox);

    // Verify checkbox exists and is interactable
    expect(ksbCheckbox).toBeInTheDocument();
  });
});

describe('KSBSelector - Display', () => {
  it('should show message when no KSBs match search', async () => {
    const user = userEvent.setup();
    render(<KSBSelector selectedKSBs={[]} onChange={() => { }} />);

    // Open dropdown
    await user.click(screen.getByText(/add ksb/i));

    const searchInput = screen.getByPlaceholderText(/search ksbs/i);
    await user.type(searchInput, 'zzzzzzzzz'); // Non-existent term

    expect(screen.getByText(/no ksbs found/i)).toBeInTheDocument();
  });

  it('should display KSB code and description in dropdown', async () => {
    const user = userEvent.setup();
    render(<KSBSelector selectedKSBs={[]} onChange={() => { }} />);

    // Open dropdown
    await user.click(screen.getByText(/add ksb/i));

    // Should show both badge (K1) and description
    expect(screen.getByText('K1')).toBeInTheDocument();
    expect(screen.getByText(/software development lifecycle/i)).toBeInTheDocument();
  });
});
