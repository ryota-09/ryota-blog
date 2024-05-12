import { getBlogById } from '@/lib/microcms'
import { AUTHOR_NAME, SITE_TITLE } from '@/static/blogs'
import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function Image() {

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
          alignItems: 'center',
          border: '32px solid rgb(59 172 182)',
          borderRadius: '16px',
          fontSize: '48px',
          fontWeight: 'bold'
        }}
      >
        <div style={{ margin: "20px" }}>{SITE_TITLE}</div>
        <div style={{
          position: 'absolute',
          right: '20px',
          bottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <p>{AUTHOR_NAME}</p>
          <img
            src="/icon.jpg"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%'
            }}
            alt="Icon"
          />
        </div>
      </div>
    ),
    {
      ...size
    }
  )
}