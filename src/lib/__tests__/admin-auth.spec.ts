import { describe, expect, it } from 'vitest'

import { isAdminPath, verifyBasicAuth } from '../admin-auth'

describe('isAdminPath', () => {
  it.each([
    '/ja/admin',
    '/ja/admin/ai-access',
    '/en/admin/ai-access',
  ])('管理者ページ %s を検出する', (pathname) => {
    expect(isAdminPath(pathname)).toBe(true)
  })

  it.each([
    '/ja/%61dmin/ai-access', // a をエンコード
    '/ja/adm%69n/ai-access', // i をエンコード
    '/ja/%61%64%6d%69%6e/ai-access', // 全文字エンコード
    '/ja/%2561dmin/ai-access', // 二重エンコード
    '/ja%2Fadmin/ai-access', // 区切り文字のエンコード
    '/ja/admin/%61i-access', // 後続セグメントのエンコード
  ])('エンコードされた管理者パス %s も検出する', (pathname) => {
    expect(isAdminPath(pathname)).toBe(true)
  })

  it.each([
    '/',
    '/ja',
    '/ja/blogs',
    '/ja/blogs/python/aiembic-materialized-view',
    '/ja/about',
    '/ja/administrator', // admin で始まるだけの別セグメントは対象外
    '/ja/blogs/admin', // 記事カテゴリ配下のadminは対象外
  ])('管理者ページ以外 %s は検出しない', (pathname) => {
    expect(isAdminPath(pathname)).toBe(false)
  })

  it('不正な%エンコードでも例外を投げない', () => {
    expect(() => isAdminPath('/ja/%E0%A4%A/admin')).not.toThrow()
    expect(isAdminPath('/ja/blogs/100%')).toBe(false)
  })
})

describe('verifyBasicAuth', () => {
  const header = (user: string, password: string) => `Basic ${btoa(`${user}:${password}`)}`

  it('正しい認証情報を許可する', () => {
    expect(verifyBasicAuth(header('admin', 'secret'), 'admin', 'secret')).toBe(true)
  })

  it('パスワードにコロンを含んでも許可する', () => {
    expect(verifyBasicAuth(header('admin', 'se:cret'), 'admin', 'se:cret')).toBe(true)
  })

  it('誤った認証情報を拒否する', () => {
    expect(verifyBasicAuth(header('admin', 'wrong'), 'admin', 'secret')).toBe(false)
    expect(verifyBasicAuth(header('other', 'secret'), 'admin', 'secret')).toBe(false)
  })

  it('ヘッダー欠落・Basic以外のスキームを拒否する', () => {
    expect(verifyBasicAuth(null, 'admin', 'secret')).toBe(false)
    expect(verifyBasicAuth(undefined, 'admin', 'secret')).toBe(false)
    expect(verifyBasicAuth('Bearer token', 'admin', 'secret')).toBe(false)
  })

  it('不正なbase64やコロン無しでも例外を投げず拒否する', () => {
    expect(() => verifyBasicAuth('Basic !!!not-base64!!!', 'admin', 'secret')).not.toThrow()
    expect(verifyBasicAuth('Basic !!!not-base64!!!', 'admin', 'secret')).toBe(false)
    expect(verifyBasicAuth(`Basic ${btoa('nocolon')}`, 'admin', 'secret')).toBe(false)
  })

  it('期待値が未設定ならフェイルクローズで拒否する', () => {
    expect(verifyBasicAuth(header('', ''), '', '')).toBe(false)
    expect(verifyBasicAuth(header('admin', 'secret'), undefined, undefined)).toBe(false)
  })
})
