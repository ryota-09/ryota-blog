import { draftMode, cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const contentId = searchParams.get('contentId')
  const draftKey = searchParams.get('draftKey')

  if (!contentId || !draftKey) {
    return redirect('/404')
  }

  draftMode().enable()
  cookies().set('draftKey', draftKey, { path: '/', httpOnly: true });

  redirect(`/blogs/${contentId}`)
}