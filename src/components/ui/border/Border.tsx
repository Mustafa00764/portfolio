import type React from 'react'
import styles from './Border.module.css'

interface BorderProps {
  className?: string
  children: React.ReactNode
}

const Border: React.FC<BorderProps> = ({ className = '', children }) => {
  return (
    <div className={`${styles.border}  ${className} border`}>
      <div className={`${styles.corner} ${styles.leftTop}`}></div>
      <div className={`${styles.corner} ${styles.rightTop}`}></div>
      <div className={`${styles.corner} ${styles.rightBottom}`}></div>
      <div className={`${styles.corner} ${styles.leftBottom}`}></div>
      {children}
    </div>
  )
}

export default Border
