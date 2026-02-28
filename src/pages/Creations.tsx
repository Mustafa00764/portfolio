import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import '@assets/styles/pages/creations.css'
import PortfolioCard from '@/components/layout/cards/PortfolioCard'
import { useState } from 'react'

interface Portfolio {
  id: number
  title: string
  createAt: string
  projectName: string
  description: string
  poster: string
  images: object | null
  link: string
  businessText: string
  businessSubtext: string
}
const Creations = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  const slides: Portfolio[] = [
    {
      id: 1,
      title: 'react website',
      createAt: '3 months ago',
      projectName: 'THE PROJECT NAME',
      description:
        'Build this website. Implement a full react website with multiple routers, UI elements and tricky styling. Make it all work great!',
      poster: '/images/img1.png',
      images: null,
      link: '',
      businessText: 'PROVIDING BUSINESSES',
      businessSubtext: 'one sentence explanation for what the project is.'
    },
    {
      id: 2,
      title: 'react website',
      createAt: '3 months ago',
      projectName: 'THE PROJECT NAME',
      description:
        'b this website. Implement a full react website with multiple routers, UI elements and tricky styling. Make it all work great!',
      poster: '/images/img1.png',
      images: null,
      link: '',
      businessText: 'PROVIDING BUSINESSES',
      businessSubtext: 'one sentence explanation for what the project is.'
    },
    {
      id: 3,
      title: 'react website',
      createAt: '3 months ago',
      projectName: 'THE PROJECT NAME',
      description:
        'a this website. Implement a full react website with multiple routers, UI elements and tricky styling. Make it all work great!',
      poster: '/images/img1.png',
      images: null,
      link: '',
      businessText: 'PROVIDING BUSINESSES',
      businessSubtext: 'one sentence explanation for what the project is.'
    },
    {
      id: 4,
      title: 'react website',
      createAt: '3 months ago',
      projectName: 'THE PROJECT NAME',
      description:
        'm this website. Implement a full react website with multiple routers, UI elements and tricky styling. Make it all work great!',
      poster: '/images/img1.png',
      images: null,
      link: '',
      businessText: 'PROVIDING BUSINESSES',
      businessSubtext: 'one sentence explanation for what the project is.'
    },
    {
      id: 5,
      title: 'react website',
      createAt: '3 months ago',
      projectName: 'THE PROJECT NAME',
      description:
        't this website. Implement a full react website with multiple routers, UI elements and tricky styling. Make it all work great!',
      poster: '/images/img1.png',
      images: null,
      link: '',
      businessText: 'PROVIDING BUSINESSES',
      businessSubtext: 'one sentence explanation for what the project is.'
    },
    {
      id: 6,
      title: 'react website',
      createAt: '3 months ago',
      projectName: 'THE PROJECT NAME',
      description:
        'r this website. Implement a full react website with multiple routers, UI elements and tricky styling. Make it all work great!',
      poster: '/images/img1.png',
      images: null,
      link: '',
      businessText: 'PROVIDING BUSINESSES',
      businessSubtext: 'one sentence explanation for what the project is.'
    }
  ]

  const checkSlide = () => {
    console.log(currentSlide)

    let iterations = 0
    const maxIterations = 5

    const intervalId = setInterval(() => {
      iterations++
      const slide: string | null | undefined = document
        .querySelector('.swiper-slide-fully-visible')
        ?.getAttribute('data-swiper-slide-index')
      setCurrentSlide(Number(slide))

      if (iterations >= maxIterations) {
        clearInterval(intervalId)
      }
    }, 500)
  }

  return (
    <div className="creations" onPointerDown={checkSlide} onPointerUp={checkSlide}>
      <p>Creations</p>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        navigation={true}
        coverflowEffect={{
          rotate: -40,
          stretch: -40,
          depth: 200,
          modifier: 1,
          slideShadows: false
        }}
        loop={true}
        // autoplay={{
        //   delay: 4000,
        //   disableOnInteraction: false
        // }}
        // pagination={{
        //   type: 'fraction'
        // }}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
        {slides.map(slide => {
          return (
            <SwiperSlide key={slide.id}>
              <PortfolioCard portfolio={slide} />
            </SwiperSlide>
          )
        })}
      </Swiper>
      <div className="portfolio-slide-description">
        <p>{String(slides[currentSlide].description)}</p>
        <div className="portfolio-slide-icon">
          <svg
            width="100%"
            height="auto"
            viewBox="0 0 374 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0L4.5 5L368.5 4.87688L374 0V9H0V0Z" fill="currentColor" />
            <path d="M5 12H110" stroke="currentColor" />
            <path d="M369 12L340 12" stroke="currentColor" />
          </svg>
        </div>
      </div>
      <p className='counter'>{currentSlide + 1}/{slides.length}</p>
    </div>
  )
}

export default Creations
