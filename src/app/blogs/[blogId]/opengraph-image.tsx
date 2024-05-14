import { getBlogById } from '@/lib/microcms'
import { AUTHOR_NAME } from '@/static/blogs'
import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({ params }: { params: { blogId: string } }) {
  const blogId = params.blogId
  const data = await getBlogById(blogId, { fields: "title" })

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          background: 'white',
          color: 'black',
          width: '100%',
          height: '100%',
          border: '32px solid rgb(59 172 182)',
          borderRadius: '16px',
          fontSize: '48px',
          fontWeight: 'bold'
        }}
      >
        <div style={{ margin: "20px" }}>{data.title}</div>
        <div style={{
          position: 'absolute',
          right: '20px',
          bottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <img
            src="/icon.jpg"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%'
            }}
            alt="Icon"
          />
          <p>{AUTHOR_NAME}</p>
        </div>
      </div>
    ),
    {
      ...size
    }
  )
}