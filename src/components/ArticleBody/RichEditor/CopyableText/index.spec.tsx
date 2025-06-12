import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import CopyableText from './index';

// Mock navigator.clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Setup for tests

describe('CopyableText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('テキスト内容とコピーボタンが表示される', () => {
    render(<CopyableText>TEST_CODE_123</CopyableText>);
    
    expect(screen.getByText('TEST_CODE_123')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'コードをコピー' })).toBeInTheDocument();
  });

  it('ボタンをクリックするとテキストがクリップボードにコピーされる', async () => {
    mockWriteText.mockResolvedValue(undefined);
    
    render(<CopyableText>TEST_CODE_123</CopyableText>);
    
    const copyButton = screen.getByRole('button', { name: 'コードをコピー' });
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('TEST_CODE_123');
    });
  });

  it('コピー後に成功メッセージが表示される', async () => {
    mockWriteText.mockResolvedValue(undefined);
    
    render(<CopyableText>TEST_CODE_123</CopyableText>);
    
    const copyButton = screen.getByRole('button', { name: 'コードをコピー' });
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(screen.getByText('コピーしました')).toBeInTheDocument();
    });
  });

  it('キーボード操作でコピーできる', async () => {
    mockWriteText.mockResolvedValue(undefined);
    
    render(<CopyableText>TEST_CODE_123</CopyableText>);
    
    const copyButton = screen.getByRole('button', { name: 'コードをコピー' });
    
    // Enterキーのテスト
    fireEvent.keyDown(copyButton, { key: 'Enter' });
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('TEST_CODE_123');
    });
    
    vi.clearAllMocks();
    
    // スペースキーのテスト
    fireEvent.keyDown(copyButton, { key: ' ' });
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('TEST_CODE_123');
    });
  });

  it('クリップボードAPI失敗時に適切に処理される', async () => {
    mockWriteText.mockRejectedValue(new Error('Clipboard API not available'));
    
    render(<CopyableText>TEST_CODE_123</CopyableText>);
    
    const copyButton = screen.getByRole('button', { name: 'コードをコピー' });
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('TEST_CODE_123');
    });
    
    // コピー失敗時はコピー成功メッセージは表示されない
    expect(screen.queryByText('コピーしました')).not.toBeInTheDocument();
  });

  it('カスタムクラス名が適用される', () => {
    const { container } = render(<CopyableText className="custom-class">TEST_CODE_123</CopyableText>);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('文字列の子要素が正しく処理される', async () => {
    mockWriteText.mockResolvedValue(undefined);
    
    render(<CopyableText>SIMPLE_STRING</CopyableText>);
    
    const copyButton = screen.getByRole('button', { name: 'コードをコピー' });
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('SIMPLE_STRING');
    });
  });
});