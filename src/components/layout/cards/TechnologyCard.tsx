import React from 'react'
import '@assets/styles/components/technology.css'

interface TechnologyProps {
  title: string
  color: string
  img: string
  icon: React.ReactNode
}

const TechnologyCard: React.FC<TechnologyProps> = ({ title, color, icon }) => {
  return (
    <div className="technology">
      <div className="tech-icon-back" style={{ color: color }}>
        {icon}
      </div>
      <div className="tech-icon" style={{ color: color }}>
        {icon}
      </div>
      <p className="tech-title">{title}</p>
    </div>
  )
}

export default TechnologyCard

{
  /* <div className="tech-border">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 52 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id="strokeMask">
              <rect width="100%" height="100%" fill="#000003" />

              <path
                d="M25.2305 0.701355C25.6946 0.433406 26.2664 0.433406 26.7305 0.701355L50.7109 14.5461C51.1749 14.814 51.4608 15.3092 51.4609 15.8449V43.5363C51.4608 44.0721 51.1749 44.5673 50.7109 44.8351L26.7305 58.6799C26.2664 58.9478 25.6946 58.9478 25.2305 58.6799L1.25 44.8351C0.786015 44.5673 0.500144 44.0721 0.5 43.5363V15.8449C0.500144 15.3092 0.786016 14.814 1.25 14.5461L25.2305 0.701355Z"
                stroke="white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
          </defs>

          {img ? (
            <image
              href={img}
              width="50"
              height="80"
              preserveAspectRatio="xMidYMid slice"
              mask="url(#strokeMask)"
              style={{ filter: 'blur(8px)' }}
            />
          ) : (
            <path
              d="M25.2305 0.701355C25.6946 0.433406 26.2664 0.433406 26.7305 0.701355L50.7109 14.5461C51.1749 14.814 51.4608 15.3092 51.4609 15.8449V43.5363C51.4608 44.0721 51.1749 44.5673 50.7109 44.8351L26.7305 58.6799C26.2664 58.9478 25.6946 58.9478 25.2305 58.6799L1.25 44.8351C0.786015 44.5673 0.500144 44.0721 0.5 43.5363V15.8449C0.500144 15.3092 0.786016 14.814 1.25 14.5461L25.2305 0.701355Z"
              stroke={color}
            />
          )}
        </svg>
      </div> */
}
