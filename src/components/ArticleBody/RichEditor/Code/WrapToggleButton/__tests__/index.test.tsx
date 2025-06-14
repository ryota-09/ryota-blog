import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WrapToggleButton from '../index';

describe('WrapToggleButton', () => {
  const mockOnToggleWrap = vi.fn();

  beforeEach(() => {
    mockOnToggleWrap.mockClear();
  });

  it('renders with default unwrapped state', () => {
    render(<WrapToggleButton onToggleWrap={mockOnToggleWrap} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', '折り返しを有効化');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders with default wrapped state when defaultWrapped is true', () => {
    render(<WrapToggleButton onToggleWrap={mockOnToggleWrap} defaultWrapped={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', '折り返しを解除');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onToggleWrap when clicked', () => {
    render(<WrapToggleButton onToggleWrap={mockOnToggleWrap} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnToggleWrap).toHaveBeenCalledWith(true);
  });

  it('toggles state correctly', () => {
    render(<WrapToggleButton onToggleWrap={mockOnToggleWrap} />);
    
    const button = screen.getByRole('button');
    
    // First click - should wrap
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(mockOnToggleWrap).toHaveBeenCalledWith(true);
    
    // Second click - should unwrap
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(mockOnToggleWrap).toHaveBeenCalledWith(false);
  });

  it('shows tooltip on hover', async () => {
    render(<WrapToggleButton onToggleWrap={mockOnToggleWrap} />);
    
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent('折り返しを有効化');
    });
  });

  it('hides tooltip on mouse leave', async () => {
    render(<WrapToggleButton onToggleWrap={mockOnToggleWrap} />);
    
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
    
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('opacity-0');
    });
  });

  it('updates tooltip text based on wrap state', async () => {
    render(<WrapToggleButton onToggleWrap={mockOnToggleWrap} />);
    
    const button = screen.getByRole('button');
    
    // Initially unwrapped
    fireEvent.mouseEnter(button);
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('折り返しを有効化');
    });
    
    // Click to wrap
    fireEvent.click(button);
    
    // Should show unwrap tooltip
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('折り返しを解除');
    });
  });
});