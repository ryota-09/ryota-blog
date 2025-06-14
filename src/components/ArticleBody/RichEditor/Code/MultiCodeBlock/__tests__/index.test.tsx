import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MultiCodeBlock from '../index';

// Mock the child components
vi.mock('@/components/ArticleBody/RichEditor/Code/CopyButton', () => ({
  default: ({ text }: { text: string }) => (
    <button data-testid="copy-button" data-text={text}>Copy</button>
  ),
}));

vi.mock('@/components/ArticleBody/RichEditor/Code/WrapToggleButton', () => ({
  default: ({ onToggleWrap, defaultWrapped }: { onToggleWrap: (wrapped: boolean) => void; defaultWrapped?: boolean }) => (
    <button 
      data-testid="wrap-toggle-button" 
      onClick={() => onToggleWrap(!defaultWrapped)}
    >
      Toggle Wrap
    </button>
  ),
}));

// Mock SyntaxHighlighter
vi.mock('react-syntax-highlighter', () => ({
  PrismAsyncLight: ({ children, wrapLongLines, language }: any) => (
    <pre data-testid="syntax-highlighter" data-wrap={wrapLongLines} data-language={language}>
      {children}
    </pre>
  ),
}));

vi.mock('react-syntax-highlighter/dist/esm/styles/prism/one-dark', () => ({}));

describe('MultiCodeBlock', () => {
  const defaultProps = {
    children: 'console.log("Hello, World!");',
    filename: null,
  };

  it('renders code content correctly', () => {
    render(<MultiCodeBlock {...defaultProps} />);
    
    const syntaxHighlighter = screen.getByTestId('syntax-highlighter');
    expect(syntaxHighlighter).toHaveTextContent('console.log("Hello, World!");');
  });

  it('renders filename when provided', () => {
    render(<MultiCodeBlock {...defaultProps} filename="example.js" />);
    
    expect(screen.getByText('example.js')).toBeInTheDocument();
  });

  it('does not render filename when not provided', () => {
    render(<MultiCodeBlock {...defaultProps} />);
    
    expect(screen.queryByText(/\.js$/)).not.toBeInTheDocument();
  });

  it('passes language to SyntaxHighlighter', () => {
    render(<MultiCodeBlock {...defaultProps} lang="javascript" />);
    
    const syntaxHighlighter = screen.getByTestId('syntax-highlighter');
    expect(syntaxHighlighter).toHaveAttribute('data-language', 'javascript');
  });

  it('defaults to text language when no lang provided', () => {
    render(<MultiCodeBlock {...defaultProps} />);
    
    const syntaxHighlighter = screen.getByTestId('syntax-highlighter');
    expect(syntaxHighlighter).toHaveAttribute('data-language', 'text');
  });

  it('handles array children correctly', () => {
    const arrayChildren = ['line 1', 'line 2', 'line 3'];
    render(<MultiCodeBlock {...defaultProps} children={arrayChildren} />);
    
    const syntaxHighlighter = screen.getByTestId('syntax-highlighter');
    expect(syntaxHighlighter).toHaveTextContent('line 1\nline 2\nline 3');
  });

  it('passes correct text to CopyButton', () => {
    render(<MultiCodeBlock {...defaultProps} />);
    
    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toHaveAttribute('data-text', 'console.log("Hello, World!");');
  });

  it('passes array content as joined string to CopyButton', () => {
    const arrayChildren = ['line 1', 'line 2'];
    render(<MultiCodeBlock {...defaultProps} children={arrayChildren} />);
    
    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toHaveAttribute('data-text', 'line 1\nline 2');
  });

  it('toggles wrap state when WrapToggleButton is clicked', () => {
    render(<MultiCodeBlock {...defaultProps} />);
    
    const syntaxHighlighter = screen.getByTestId('syntax-highlighter');
    const wrapToggleButton = screen.getByTestId('wrap-toggle-button');
    
    // Initially not wrapped
    expect(syntaxHighlighter).toHaveAttribute('data-wrap', 'false');
    
    // Click to toggle wrap
    fireEvent.click(wrapToggleButton);
    
    // Should be wrapped now
    expect(syntaxHighlighter).toHaveAttribute('data-wrap', 'true');
  });

  it('starts with wrapped state when defaultWrapped is true', () => {
    render(<MultiCodeBlock {...defaultProps} defaultWrapped={true} />);
    
    const syntaxHighlighter = screen.getByTestId('syntax-highlighter');
    expect(syntaxHighlighter).toHaveAttribute('data-wrap', 'true');
  });

  it('handles empty children gracefully', () => {
    render(<MultiCodeBlock {...defaultProps} children="" />);
    
    const syntaxHighlighter = screen.getByTestId('syntax-highlighter');
    expect(syntaxHighlighter).toHaveTextContent('');
    
    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toHaveAttribute('data-text', '');
  });

  it('renders both control buttons', () => {
    render(<MultiCodeBlock {...defaultProps} />);
    
    expect(screen.getByTestId('wrap-toggle-button')).toBeInTheDocument();
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();
  });
});