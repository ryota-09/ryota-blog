import { getCloudflareContext } from '@opennextjs/cloudflare'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { verifyBasicAuth } from '@/lib/admin-auth'

/**
 * 管理者ページのサーバー側認可(二次防御)。
 * middlewareのパス判定をすり抜けた場合でも、ページ描画前に必ずBasic認証を検証する。
 * 未認証の場合は存在を隠すため404を返す(middlewareを通った正規アクセスは401で先に弾かれている)。
 */
export const assertAdminAuthorized = async (): Promise<void> => {
  let expectedUser: string | undefined
  let expectedPassword: string | undefined
  try {
    const { env } = await getCloudflareContext({ async: true })
    expectedUser = env.ADMIN_BASIC_AUTH_USER
    expectedPassword = env.ADMIN_BASIC_AUTH_PASSWORD
  } catch {
    // ローカル開発(next dev)ではCloudflareランタイムが存在せず取得に失敗するため、middlewareと同様にスキップする
    return
  }

  const requestHeaders = await headers()
  if (!verifyBasicAuth(requestHeaders.get('authorization'), expectedUser, expectedPassword)) {
    notFound()
  }
}
