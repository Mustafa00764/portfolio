import React, { JSX, useState } from 'react'
import styles from './TechnologyCard.module.css'

interface TechnologyProps {
  title: string
  text: string
  color: string
  img: string
  icon: JSX.Element
}

const TechnologyCard: React.FC<TechnologyProps> = ({ title, text, color, icon }) => {
  const [isHover, setIsHover] = useState(false)

  const handleMouseEnter = () => {
    setIsHover(true)
  }

  const handleMouseLeave = () => {
    setIsHover(false)
  }

  const boxStyle = {
    border: isHover ? `1px solid ${color}E5` : '',
    color: color
  }

  return (
    <div
      className={styles.technology}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={styles.gradient}
        style={{ background: color, opacity: isHover && title === 'Figma' ? '.9' : '0' }}
      ></div>
      <div
        className={styles.main}
        title={title.toUpperCase()}
        style={{ boxShadow: isHover ? `0px 0px 24px 3px ${color}E5` : '' }}
      >
        <div className={styles.iconBack} style={{ color: color }}>
          {icon}
        </div>
        <div className={styles.icon} style={boxStyle}>
          {icon}
        </div>
        <div className={styles.title} style={{ background: color }}>
          <p>{title}</p>
        </div>
      </div>
      <h4
        className={styles.text}
        title={text.toUpperCase()}
        style={
          title === 'Figma'
            ? { color: 'transparent', backgroundImage: color, backgroundClip: 'text' }
            : { color: color }
        }
      >
        {text}
      </h4>
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
