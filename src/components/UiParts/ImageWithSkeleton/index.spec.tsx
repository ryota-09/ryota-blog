import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// NOTE: vitestのglobals設定に依存せず型チェック(tsc --noEmit)を通すため明示importする
import { describe, it, expect, vi } from 'vitest';
import ImageWithSkeleton from './index';

describe('ImageWithSkeleton', () => {
  it('初期表示ではスケルトンが表示される（opacity-100 / animate-pulse）', () => {
    render(
      <ImageWithSkeleton src="/author.png" alt="テスト画像" width={100} height={100} />
    );

    const skeleton = screen.getByRole('img', { hidden: true }).nextSibling as HTMLElement;
    expect(skeleton).toHaveClass('opacity-100');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('画像のonLoadが発火するとスケルトンがフェードアウトする（opacity-0）', async () => {
    render(
      <ImageWithSkeleton src="/author.png" alt="テスト画像" width={100} height={100} />
    );

    const img = screen.getByRole('img', { hidden: true });
    fireEvent.load(img);

    // NOTE: next/image の onLoad は img.decode() の Promise 解決を経由して
    // 非同期に呼ばれるため（node_modules/next/dist/client/image-component.js の
    // handleLoading 参照）、waitFor でマイクロタスクの解決を待つ必要がある
    const skeleton = img.nextSibling as HTMLElement;
    await waitFor(() => {
      expect(skeleton).toHaveClass('opacity-0');
    });
    expect(skeleton).not.toHaveClass('animate-pulse');
  });

  it('画像のonErrorが発火してもスケルトンは解除される（読み込み中のまま固まらない）', () => {
    render(
      <ImageWithSkeleton src="/broken.png" alt="テスト画像" width={100} height={100} />
    );

    const img = screen.getByRole('img', { hidden: true });
    fireEvent.error(img);

    const skeleton = img.nextSibling as HTMLElement;
    expect(skeleton).toHaveClass('opacity-0');
  });

  it('呼び出し元のonLoad/onErrorも合わせて呼ばれる', async () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    render(
      <ImageWithSkeleton
        src="/author.png"
        alt="テスト画像"
        width={100}
        height={100}
        onLoad={onLoad}
        onError={onError}
      />
    );

    const img = screen.getByRole('img', { hidden: true });
    fireEvent.load(img);
    fireEvent.error(img);

    // onError は同期的に呼ばれるが、onLoad は img.decode() の Promise 経由で非同期に呼ばれる
    expect(onError).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('wrapperClassName を指定しない場合はラッパー要素を生成しない', () => {
    const { container } = render(
      <div className="relative">
        <ImageWithSkeleton src="/author.png" alt="テスト画像" width={100} height={100} />
      </div>
    );

    // ラッパー span が無いので、直下の子は img とスケルトン span の2つのみ
    expect(container.firstChild?.childNodes).toHaveLength(2);
  });

  it('wrapperClassName を指定すると relative なラッパー要素が生成される', () => {
    const { container } = render(
      <ImageWithSkeleton
        src="/author.png"
        alt="テスト画像"
        width={100}
        height={100}
        wrapperClassName="shrink-0"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe('SPAN');
    expect(wrapper).toHaveClass('relative');
    expect(wrapper).toHaveClass('inline-block');
    expect(wrapper).toHaveClass('shrink-0');
  });

  it('wrapperClassName に空文字列を渡した場合も（undefinedとは異なり）ラッパー要素が生成される', () => {
    // NOTE: ImageWithBlur のデフォルト値や ThumbnailCard の実際の呼び出しがこの空文字列パターンを使っている。
    // undefined の場合とは異なる分岐であることを回帰テストとして固定する。
    const { container } = render(
      <ImageWithSkeleton src="/author.png" alt="テスト画像" width={100} height={100} wrapperClassName="" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe('SPAN');
    expect(wrapper).toHaveClass('relative');
    expect(wrapper).toHaveClass('inline-block');
  });

  it('skeletonClassName で指定したクラス（角丸など）がスケルトンに適用される', () => {
    render(
      <ImageWithSkeleton
        src="/author.png"
        alt="テスト画像"
        width={100}
        height={100}
        skeletonClassName="rounded-full"
      />
    );

    const skeleton = screen.getByRole('img', { hidden: true }).nextSibling as HTMLElement;
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('src が変化すると isLoaded がリセットされ、スケルトンが再表示される', async () => {
    const { rerender } = render(
      <ImageWithSkeleton src="/author.png" alt="テスト画像" width={100} height={100} />
    );

    const img = screen.getByRole('img', { hidden: true });
    fireEvent.load(img);
    const skeleton = img.nextSibling as HTMLElement;
    await waitFor(() => {
      expect(skeleton).toHaveClass('opacity-0');
    });

    // 同一インスタンスのまま src だけ差し替える（key変更による再マウントではないケース）
    rerender(
      <ImageWithSkeleton src="/other.png" alt="テスト画像" width={100} height={100} />
    );

    await waitFor(() => {
      expect(skeleton).toHaveClass('opacity-100');
      expect(skeleton).toHaveClass('animate-pulse');
    });
  });
});
