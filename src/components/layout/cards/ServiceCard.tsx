import '@assets/styles/components/serviceCard.css'
import React, { useState } from 'react'

type ServiceCard = {
  id: number
  rank: string
  difficulty: string
  title: string
  category: string
  text: string
  description: string
  colors: {
    colorOne: string
    colorTwo: string
  }
  icon: React.ReactNode
}

interface ServiceCardProps {
  service: ServiceCard
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [isHover, setIsHover] = useState(false)

  const handleMouseEnter = () => {
    setIsHover(true)
  }

  const handleMouseLeave = () => {
    setIsHover(false)
  }

  const boxStyle = {
    border: isHover ? `1px solid ${service.colors.colorOne}B2` : 'var(--border-grey-1)'
  }

  const gradient = {
    background: `linear-gradient(
      270deg,
      ${service.colors.colorTwo}26 2.77%,
      ${service.colors.colorTwo}00 50%
    )`,
    backgroundSize: ' 200% 100%',
    backgroundPosition: `${isHover ? '100% 0%' : '0% 0%'}`,
    backgroundRepeat: `no-repeat`,
    transition: `background-position 0.3s ease`
  }

  return (
    <div
      className="service-card"
      style={boxStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="corner left-top"
        style={{ borderColor: service.colors.colorTwo }}
      ></div>
      <div className="corner right-top" style={{ borderColor: service.colors.colorTwo }}></div>
      <div
        className="corner right-bottom"
        style={{ borderColor: service.colors.colorTwo }}
      ></div>
      <div
        className="corner left-bottom"
        style={{ borderColor: service.colors.colorTwo }}
      ></div>

      <div className="service-card-rank" style={{ borderRight: boxStyle.border }}>
        <div className="service-card-icon" style={{ color: service.colors.colorTwo }}>
          {service.icon}
        </div>
        <div
          className="service-card-rank-title"
          style={{
            backgroundColor: `${service.colors.colorTwo}E5`,
            boxShadow: isHover ? `0px 0px 14px 0px ${service.colors.colorTwo}` : ''
          }}
        >
          <p>{service.rank}</p>
        </div>
      </div>
      <div className="service-card-titles" style={gradient}>
        <div className="service-card-title">
          <h3 style={{ color: service.colors.colorTwo }}>{service.title}</h3>
          <p>{service.description}</p>
        </div>
        <div
          className="service-card-info"
          style={{ backgroundColor: `${service.colors.colorTwo}1A` }}
        >
          <p>
            <b>category:</b> <i>{service.text}</i>
          </p>
          {/* <p>
            <b>difficulty:</b> <i>{service.difficulty}</i>
          </p> */}
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
