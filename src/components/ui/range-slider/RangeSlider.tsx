import React, { ChangeEvent, useEffect, useRef } from 'react'
import styles from './RangeSlider.module.css'

interface RangeSliderProps {
  img?: string
  title?: string
  texts?: {
    title: string
    number: number
    unit?: string
  }[]
  step?: number
  minSize: number
  maxSize: number
  val?: any
  onChange?: any
  className?: string
  sliderClassName?: string
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  img,
  title,
  texts,
  step = 1,
  minSize,
  maxSize,
  val = 1,
  onChange,
  className,
  sliderClassName
}) => {
  const sliderRef = useRef<HTMLInputElement>(null)

  const getBackground = () => {
    const slider = sliderRef.current
    if (!slider) return ''

    const min = Number(slider.min) || 0
    const max = Number(slider.max) || 100

    console.log(slider.value)

    const percent = ((val - min) / (max - min)) * 100

    return `linear-gradient(to right, var(--blue-transparent-6) 0%, var(--blue-transparent-6) ${percent}%, var(--color-dark) ${percent}%, var(--color-dark) 100%)`
  }

  useEffect(() => {
    getBackground()
  }, [val])

  return (
    <div className={`${styles.rangeSlider} `}>
      <div className={styles.titles}>
        <h3>{title}</h3>
        <div className={styles.texts}>
          {texts?.map((text, index) => {
            return (
              <p key={index}>
                {text.title}:{' '}
                <span>
                  {text.number}
                  {text.unit || ''}
                </span>
              </p>
            )
          })}
        </div>
      </div>
      <div
        className={`${styles.inputContainer} ${className}`}
        style={{
          background:
            getBackground() ||
            `linear-gradient(to right, var(--blue-transparent-6) 0%, var(--blue-transparent-6) ${(val - minSize) / ((maxSize - minSize) / 100)}%, var(--color-dark) ${(val - minSize) / ((maxSize - minSize) / 100)}%, var(--color-dark) 100%)`
        }}
      >
        <input
          ref={sliderRef}
          type="range"
          min={minSize}
          max={maxSize}
          step={step}
          value={val}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value))}
          className={`${styles.slider} ${sliderClassName}`}
          style={{
            ['--thumb-image' as any]: `url(${img})`
          }}
        />
      </div>
    </div>
  )
}

export default RangeSlider
