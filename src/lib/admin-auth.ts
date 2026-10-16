// 管理者ページ(/{locale}/admin 配下)のBasic認証まわりの共通ロジック。
// middleware(一次防御)とサーバーコンポーネント(二次防御)の両方から使う。
// middlewareだけに認可を頼ると、パスの解釈差(%エンコード等)で迂回されるため二重化している。

// 管理者ページのcanonical URL: /{locale}/admin(/...)
const ADMIN_PATH_PATTERN = /^\/[^/]+\/admin(\/.*)?$/

// 不正な%エンコードでdecodeURIComponentが例外を投げても処理を止めず、元の文字列を返す
const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * 管理者ページ宛てのパスかどうかを判定する。
 * Next.js/OpenNextのルーティングはデコード後のパスでページを解決するため、
 * `/ja/%61dmin/...` のようなエンコード済みパスも管理者ページとして扱う。
 * 二重エンコード(%2561dmin)も取りこぼさないよう、値が変化しなくなるまで(最大3回)デコードして各段階で判定する。
 */
export const isAdminPath = (pathname: string): boolean => {
  let current = pathname
  for (let i = 0; i < 4; i++) {
    if (ADMIN_PATH_PATTERN.test(current)) return true
    // /ja%2Fadmin のように区切り文字を%エンコードした細工も、デコード後に判定できる
    const decoded = safeDecode(current)
    if (decoded === current) return false
    current = decoded
  }
  // 4回デコードしても収束しない異常なパスは、安全側(管理者ページ扱い)に倒す
  return true
}

// タイミング攻撃を避けるため、長さに依存せず全文字を比較する
const timingSafeEqual = (a: string, b: string): boolean => {
  const length = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return diff === 0
}

/**
 * AuthorizationヘッダーのBasic認証情報が期待値と一致するか検証する。
 * 認証情報が未設定、ヘッダー欠落、base64不正のいずれも false(フェイルクローズ)。
 */
export const verifyBasicAuth = (
  authHeader: string | null | undefined,
  expectedUser: string | undefined,
  expectedPassword: string | undefined,
): boolean => {
  if (!expectedUser || !expectedPassword) return false
  if (!authHeader?.startsWith('Basic ')) return false

  let decoded: string
  try {
    decoded = atob(authHeader.slice('Basic '.length))
  } catch {
    // 不正なbase64でatobが例外を投げた場合に500にならないよう、認証失敗として扱う
    return false
  }

  const separatorIndex = decoded.indexOf(':')
  if (separatorIndex < 0) return false
  const user = decoded.slice(0, separatorIndex)
  const password = decoded.slice(separatorIndex + 1)

  // 両方を必ず評価してから結合する(短絡評価による時間差を避ける)
  const userMatches = timingSafeEqual(user, expectedUser)
  const passwordMatches = timingSafeEqual(password, expectedPassword)
  return userMatches && passwordMatches
}
