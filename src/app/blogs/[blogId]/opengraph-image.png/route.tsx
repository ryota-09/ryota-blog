import { getBlogById, getBlogList } from '@/lib/microcms'
import { AUTHOR_NAME } from '@/static/blogs'
import { ImageResponse } from 'next/og'

// Image generation
export const GET = async (_: unknown, { params }: { params: { blogId: string } }) => {
  console.log('params', params)
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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
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
            src="https://images.microcms-assets.io/assets/4626924a681346e9a0fcabe5478eb9fa/26ca0e17cc994976907bb961f367db9e/author.jpg"
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
      width: 1200,
      height: 630,
    }
  )
}