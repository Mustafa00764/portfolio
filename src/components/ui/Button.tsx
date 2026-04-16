import type React from 'react'
import '@/assets/styles/components/button.css'

interface ButtonProps {
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  variant?: 'default' | 'union' | 'blue' | 'border' | 'border-blue' | 'full-blue'
  size?: 'small' | 'medium' | 'large' | 'xl' | '2xl' | 'icon' | '3xl' | '4xl'
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
        <div className="union">
          <svg
            width="194"
            height="23"
            viewBox="0 0 194 23"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="union-1"
          >
            <path
              opacity="1"
              d="M194 1.75H184.388L178.866 11.3135L184.388 20.877H194V23H182.562L183.488 21.3965L177.967 11.833H166.924L161.403 21.3965L162.329 23H0V0H162.503L161.853 1.17871L167.374 10.7422L178.057 10.9502L183.219 1.59473L182.298 0H194V1.75ZM177.39 12.833L182.334 21.3955L181.407 23H163.483L162.558 21.3965L167.501 12.833H177.39ZM194 2.75V19.877H184.965L180.021 11.3135L184.965 2.75H194ZM182.069 1.60449L177.472 9.93848L167.957 9.75293L163.001 1.16797L163.646 0H181.144L182.069 1.60449Z"
              fill="currentColor"
            />
          </svg>

          <svg
            width="362"
            height="33"
            viewBox="0 0 362 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="union-2"
          >
            <path
              d="M362 6.75195H354.427L348.905 16.3154L354.427 25.8789H362V33H349.767L353.527 26.4863L348.006 16.9229H336.963L331.442 26.4863L335.203 33H0V0H335.3L331.892 6.17871L337.413 15.7422L348.096 15.9502L353.258 6.59375L349.451 0H362V6.75195ZM347.429 17.9219L352.373 26.4854L348.611 33H336.357L332.597 26.4854L337.54 17.9219H347.429ZM362 7.75195V24.8779H355.004L350.06 16.3154L355.004 7.75195H362ZM352.108 6.60449L347.511 14.9375L337.996 14.752L333.039 6.16699L336.441 0H348.296L352.108 6.60449Z"
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
