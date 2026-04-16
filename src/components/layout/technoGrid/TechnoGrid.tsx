import React, { JSX } from 'react'
import TechnologyCard from '../cards/technology-card/TechnologyCard'
import styles from './TechnoGrid.module.css'

interface Technology {
  id: number
  title: string
  text: string
  color: string
  img: string
  icon: JSX.Element
}

interface TechnoGridProps {
  technologies: Technology[]
  rows?: number
}

const TechnoGrid: React.FC<TechnoGridProps> = ({ technologies }) => {
  return (
    <div className={styles.technoGrid}>
      {technologies.map(tech => {
        return (
          <TechnologyCard
            key={tech.id}
            title={tech.title}
            text={tech.text}
            icon={tech.icon}
            color={tech.color}
            img={tech.img}
          />
        )
      })}
    </div>
  )
}

export default TechnoGrid

// let isDragging = false;
// let dragStartX = undefined;
// let dragStartY = undefined;

// let previousAnimationTimestamp = undefined;
// let animationFrameRequestID = undefined;
// let delayTimeoutID = undefined;

// let simulationMode = false;
// let simulationImpact = {};