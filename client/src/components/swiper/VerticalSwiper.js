import React, { useEffect, useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/mousewheel'
import './swiperStyle.css'


import car from './images/car_travel.jpg'
import people from './images/people.jpg'
import hiking from './images/hiking.jpg'
import notebook from './images/note_book.jpg'

// import required modules
import { Keyboard, Mousewheel, Pagination } from 'swiper/modules'
import HorizontalSwiper from './HorizontalSwiper'
import { useForkRef } from '@mui/material'


export default function VerticalSwiper() {

  const displayImg = [
    [car, notebook],
    [people, hiking]
  ]


  const [swiperPro, setSwiperPro] = useState('')
  const [isAllow, setIsAllow] = useState(false)
  const [scroll, setScroll] = useState(0)
  const contentRef = useRef()

  // console.log(swiperPro)
  // console.log(isAllow)
  // console.log("Vertical Scroll Position: " + scroll)

  useEffect(() => {
    const lastElement = document.querySelector('.lastElement')

    const wheelControl = e => {
      console.log(e.deltaY)
      console.log('swiperPro.mousewheel', swiperPro.mousewheel)

      if (swiperPro.mousewheel === undefined) {
        return console.log('no more image to scroll up')
      } else if (e.deltaY <= 0 && scroll === 0) {
        setIsAllow(false)
        swiperPro.mousewheel.enable()

      } else if (e.deltaY >= 0 && isAllow) {
        swiperPro.mousewheel.disable()
      }
    }

    const handleWindowScroll = () => {
      // Get the current vertical scroll position
      setScroll(window.scrollY)
    }

    lastElement.addEventListener('wheel', wheelControl)
    window.addEventListener("scroll", handleWindowScroll)

    return () => {
      lastElement.removeEventListener('wheel', wheelControl)
      window.removeEventListener("scroll", handleWindowScroll)
    }
  }, [isAllow, scroll])

  const handleReachEnd = (swiper) => {
    console.log('swiper', swiper)
    setSwiperPro(swiper)
    setIsAllow(true)
  }

  console.log(isAllow)

  return (
    <>
      <Swiper
        ref={contentRef}
        direction={'vertical'}
        slidesPerView={1}
        spaceBetween={0}
        mousewheel={true}
        speed={600}
        keyboard={{
          enabled: true,
        }}
        onReachEnd={(swiper) => { handleReachEnd(swiper) }}
        pagination={{
          clickable: true,
        }}
        modules={[Keyboard, Mousewheel, Pagination]}
        className='lastElement'
      >
        {displayImg.map((each, index) =>
          <SwiperSlide key={index} >
            <HorizontalSwiper row={each} loading="lazy" />
          </SwiperSlide>
        )}

      </Swiper>
    </>
  )
}