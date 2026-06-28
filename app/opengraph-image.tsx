import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = "Award Dinner Night 2026 — Computer Science & Cyber Security Class '29"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#060606',
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Radial gold glow behind text */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: '70%',
            height: '120%',
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(201,162,39,0.10) 0%, transparent 65%)',
            display: 'flex',
          }}
        />

        {/* Top gold border line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(to right, transparent, #c9a227 30%, #c9a227 70%, transparent)',
            display: 'flex',
          }}
        />

        {/* Bottom gold border line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(to right, transparent, #c9a227 30%, #c9a227 70%, transparent)',
            display: 'flex',
          }}
        />

        {/* Left — text content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '56px 52px',
            flex: 1,
            zIndex: 10,
          }}
        >
          {/* Org label */}
          <div
            style={{
              color: '#c9a227',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 22,
              display: 'flex',
            }}
          >
            COMPUTER SCIENCE &amp; CYBER SECURITY — CLASS &apos;29
          </div>

          {/* AWARD / DINNER / NIGHT stack */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.88, marginBottom: 38 }}>
            <span
              style={{
                color: '#c9a227',
                fontSize: 106,
                fontWeight: 900,
                letterSpacing: -4,
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              AWARD
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 2 }}>
              <div
                style={{
                  background: '#c9a227',
                  color: '#060606',
                  fontSize: 26,
                  fontWeight: 800,
                  padding: '7px 20px',
                  borderRadius: 6,
                  letterSpacing: 3,
                  display: 'flex',
                }}
              >
                DINNER
              </div>
            </div>

            <span
              style={{
                color: '#ffffff',
                fontSize: 106,
                fontWeight: 900,
                letterSpacing: -4,
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              NIGHT
            </span>
          </div>

          {/* Info pills */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
            {[
              { label: 'DATE', value: '4th JULY' },
              { label: 'RED CARPET', value: '4:00 PM' },
              { label: 'MAIN EVENT', value: '5:00 PM' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'rgba(201,162,39,0.10)',
                  border: '1px solid rgba(201,162,39,0.45)',
                  borderRadius: 8,
                  padding: '10px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span style={{ color: '#c9a227', fontSize: 10, fontWeight: 700, letterSpacing: 1.8 }}>
                  {item.label}
                </span>
                <span style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginTop: 3 }}>
                  {item.value}
                </span>
              </div>
            ))}

            {/* Ticket pill — filled gold */}
            <div
              style={{
                background: '#c9a227',
                borderRadius: 8,
                padding: '10px 18px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ color: '#060606', fontSize: 10, fontWeight: 700, letterSpacing: 1.8 }}>
                TICKET
              </span>
              <span style={{ color: '#060606', fontSize: 17, fontWeight: 800, marginTop: 3 }}>
                5,000
              </span>
            </div>
          </div>

          {/* Venue + dress code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: '#aaa', fontSize: 15, fontWeight: 600, display: 'flex' }}>
              AMBASSADORS
            </span>
            <span style={{ color: 'rgba(201,162,39,0.4)', fontSize: 20, display: 'flex' }}>|</span>
            <span style={{ color: '#666', fontSize: 14, display: 'flex' }}>
              Dress to Kill or Impress
            </span>
          </div>
        </div>

        {/* Right — flyer image with fade */}
        <div
          style={{
            width: 370,
            height: '100%',
            display: 'flex',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {/* Left-edge fade so image blends into black background */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 130,
              height: '100%',
              background: 'linear-gradient(to right, #060606 0%, transparent 100%)',
              zIndex: 2,
              display: 'flex',
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://dinner.eventsnest.xyz/award_night.jpeg"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
