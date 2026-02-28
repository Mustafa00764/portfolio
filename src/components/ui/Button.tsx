import type React from 'react'
import '@/assets/styles/components/button.css'

interface ButtonProps {
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  variant?: 'default' | 'union' | 'blue' | 'border' | 'border-blue' | 'full-blue'
  size?: 'small' | 'medium' | 'large' | 'xl' | '2xl' | 'icon' | '3xl'
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  variant = 'default',
  size = 'small',
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled}
    >
      {variant === 'union' ? (
        <div className='union'>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 194 23"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M194 1.75H184.388L178.866 11.3135L184.388 20.877H194V23H182.562L183.488 21.3965L177.967 11.833H166.924L161.403 21.3965L162.329 23H0V0H162.503L161.853 1.17871L167.374 10.7422L178.057 10.9502L183.219 1.59473L182.298 0H194V1.75ZM177.39 12.833L182.334 21.3955L181.407 23H163.483L162.558 21.3965L167.501 12.833H177.39ZM194 2.75V19.877H184.965L180.021 11.3135L184.965 2.75H194ZM182.069 1.60449L177.472 9.93848L167.957 9.75293L163.001 1.16797L163.646 0H181.144L182.069 1.60449Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ) : (
        ''
      )}
      {children}
    </button>
  )
}

export default Button
