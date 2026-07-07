import { describe, it, expect } from 'vitest';
import { thumbnailPlaceholderProps } from '@/util';

describe('thumbnailPlaceholderProps', () => {
  it('blurDataURLがある場合はplaceholder="blur"とblurDataURLを返す', () => {
    const dataUrl = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4TBUAAAAvY8AYAAfQ/4j+B/Cg2f8zLNL/VAA=';
    expect(thumbnailPlaceholderProps(dataUrl)).toEqual({
      placeholder: 'blur',
      blurDataURL: dataUrl,
    });
  });

  it('blurDataURLが無い/空の場合はplaceholder="empty"へフォールバックする（blurDataURL無しのplaceholder="blur"はnext/imageがエラーにするため）', () => {
    expect(thumbnailPlaceholderProps(undefined)).toEqual({ placeholder: 'empty' });
    expect(thumbnailPlaceholderProps('')).toEqual({ placeholder: 'empty' });
  });
});
