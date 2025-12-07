import { draftMode, cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const contentId = searchParams.get('contentId')
  const draftKey = searchParams.get('draftKey')

  if (!contentId || !draftKey) {
    return redirect('/404')
  }

  // Next.js 16では、draftMode()とcookies()も非同期になった
  const draft = await draftMode();
  draft.enable();
  const cookiesStore = await cookies();
  cookiesStore.set('draftKey', draftKey, { path: '/', httpOnly: true });

  redirect(`/blogs/${contentId}`)
}