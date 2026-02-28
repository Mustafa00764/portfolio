import type React from 'react'
import '@/assets/styles/components/border.css'

interface BorderProps {
  className?: string
  children: React.ReactNode
}

const Border: React.FC<BorderProps> = ({ className = '', children }) => {
  return (
    <div className={`border  ${className}`}>
      <div className="corner left-top"></div>
      <div className="corner right-top"></div>
      <div className="corner right-bottom"></div>
      <div className="corner left-bottom"></div>
      {children}
    </div>
  )
}

export default Border
