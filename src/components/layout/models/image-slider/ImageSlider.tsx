import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import styles from './ImageSlider.module.css'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { useModal } from '@/hooks/useModal'

interface ImageSliderProps {
  images?: string[]
}

const ImageSlider = ({}: ImageSliderProps) => {
  const { closeModal } = useModal()
  const [close, setClose] = useState<boolean>(false)

  const [currentSlide, setCurrentSlide] = useState<number>(1)

  const getCurrentSlide = () => {
    const current = document.querySelector('.swiper-pagination-current')?.innerHTML
    setCurrentSlide(Number(current) || 1)
  }

  const handleClose = () => {
    closeModal()
    setClose(true)
  }

  useEffect(() => {
    const prev = document.querySelector('.swiper-button-prev')
    const next = document.querySelector('.swiper-button-next')

    prev?.addEventListener('click', getCurrentSlide)

    next?.addEventListener('click', getCurrentSlide)
  })

  return (
    <div className={`${styles.imageSlider} ${close ? styles.animation : ''}`} onClick={handleClose}>
      <div className={styles.model} onClick={e => e.stopPropagation()}>
        <div className={styles.titles}>
          <p>previewing images from</p>
          <h1>portfolio design</h1>
        </div>
        <div className={styles.slider}>
          <Swiper
            modules={[Navigation, Pagination, EffectFade]}
            effect={'fade'}
            spaceBetween={85}
            slidesPerView={1}
            navigation
            loop
            onTouchStart={getCurrentSlide}
            onTouchEnd={getCurrentSlide}
            onClick={getCurrentSlide}
            pagination={{
              type: 'fraction'
            }}
            scrollbar={{ draggable: true }}
            className={`${styles.swiper} swiper`}
          >
            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.card}>
                <img src="/images/gorillas.png" alt="gorillas" />
              </div>
            </SwiperSlide>
            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.card}>
                <img src="/images/img1.png" alt="gorillas" />
              </div>
            </SwiperSlide>{' '}
            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.card}>
                <img src="/images/gorillas.png" alt="gorillas" />
              </div>
            </SwiperSlide>{' '}
            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.card}>
                <img src="/images/img1.png" alt="gorillas" />
              </div>
            </SwiperSlide>{' '}
            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.card}>
                <img src="/images/gain-life.png" alt="gorillas" />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className={styles.buttons}>
          <Button variant="full-blue" size="3xl">
            view project live
          </Button>
          <h4>
            {currentSlide} of {'5'}
          </h4>
          <Button variant="border" size="2xl" onClick={handleClose}>
            close [esc]
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ImageSlider
