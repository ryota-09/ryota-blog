import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CopyButton from '../index';

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

// Mock document.execCommand for fallback
Object.assign(document, {
  execCommand: vi.fn(() => true),
});

describe('CopyButton', () => {
  const testText = 'console.log("Hello, World!");';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with copy icon initially', () => {
    render(<CopyButton text={testText} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'コードをコピー');
  });

  it('copies text to clipboard when clicked', async () => {
    render(<CopyButton text={testText} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText);
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label', 'コピー済み');
    });
  });

  it('shows copied state temporarily', async () => {
    render(<CopyButton text={testText} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent('コピーしました!');
    });
    
    // Should return to normal state after timeout
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label', 'コードをコピー');
    }, { timeout: 2000 });
  });

  it('shows tooltip on hover', async () => {
    render(<CopyButton text={testText} />);
    
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent('コピー');
    });
  });

  it('hides tooltip on mouse leave when not copied', async () => {
    render(<CopyButton text={testText} />);
    
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
    
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('opacity-0');
    });
  });

  it('falls back to execCommand when clipboard API fails', async () => {
    // Mock clipboard API to fail
    (navigator.clipboard.writeText as any).mockRejectedValueOnce(new Error('Clipboard API failed'));
    
    // Mock document methods
    const mockCreateElement = vi.spyOn(document, 'createElement');
    const mockAppendChild = vi.spyOn(document.body, 'appendChild');
    const mockRemoveChild = vi.spyOn(document.body, 'removeChild');
    
    const mockTextArea = {
      value: '',
      style: {},
      select: vi.fn(),
    };
    mockCreateElement.mockReturnValue(mockTextArea as any);
    mockAppendChild.mockImplementation(() => mockTextArea as any);
    mockRemoveChild.mockImplementation(() => mockTextArea as any);
    
    render(<CopyButton text={testText} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockCreateElement).toHaveBeenCalledWith('textarea');
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
    
    mockCreateElement.mockRestore();
    mockAppendChild.mockRestore();
    mockRemoveChild.mockRestore();
  });

  it('changes icon to checkmark when copied', async () => {
    render(<CopyButton text={testText} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      // Check if the checkmark icon is displayed (polyline element)
      const polyline = button.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });
  });
});