import React, { useEffect, useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import isMobile from 'is-mobile'

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
import { Keyboard, Mousewheel, Pagination, FreeMode, Scrollbar, } from 'swiper/modules'
import HorizontalSwiper from './HorizontalSwiper'
import { useForkRef } from '@mui/material'


export default function VerticalSwiper() {


  const disableMouseDrag = isMobile()

  const displayImg = [
    [car, notebook],
    [people, hiking]
  ]


  const [swiperPro, setSwiperPro] = useState('')
  const [isAllow, setIsAllow] = useState(false)
  const [scroll, setScroll] = useState(0)
  const contentRef = useRef()
  const [swiperState, setSwiperState] = useState(null)

  // console.log(swiperPro)
  // console.log(isAllow)
  // console.log("Vertical Scroll Position: " + scroll)

  // useEffect(() => {
  //   const lastElement = document.querySelector('.lastElement')
  //   const wheelControl = e => {
  //     if (swiperPro.mousewheel === undefined) {
  //       return console.log('no more image to scroll up')
  //     } else if (e.deltaY <= 0 && scroll === 0) {
  //       setIsAllow(false)
  //       swiperPro.mousewheel.enable()

  //     } else if (e.deltaY >= 0 && isAllow) {
  //       swiperPro.mousewheel.disable()
  //     }
  //   }

  //   const handleWindowScroll = () => {
  //     // Get the current vertical scroll position
  //     setScroll(window.scrollY)
  //   }

  //   lastElement.addEventListener('wheel', wheelControl)
  //   window.addEventListener("scroll", handleWindowScroll)


  //   return () => {
  //     lastElement.removeEventListener('wheel', wheelControl)
  //     window.removeEventListener("scroll", handleWindowScroll)
  //   }
  // }, [isAllow, scroll])

  // const handleReachEnd = (swiper) => {
  //   // console.log(swiper)
  //   setSwiperPro(swiper)
  //   setIsAllow(true)
  //   swiper.allowSlidePrev = true
  //   swiper.allowSlideNext = false
  // }

  // const handleReachBeginning = (swiper) => {
  //   // console.log(swiper)
  //   setSwiperPro(swiper)
  //   swiper.allowSlidePrev = false
  //   swiper.allowSlideNext = true
  // }

  // function handleTouchStart(e) {
  //   const touch = e.touches[0] // Get the first touch in the list of touches

  //   const touchX = touch.clientX // X coordinate of the touch point relative to the viewport
  //   const touchY = touch.clientY // Y coordinate of the touch point relative to the viewport

  //   console.log(`Touch Start - X: ${touchX}, Y: ${touchY}`)
  // }

  // function handleTouchMove(e) {
  //   const touch = e.touches[0]

  //   const touchX = touch.clientX
  //   const touchY = touch.clientY

  //   console.log(`Touch Move - X: ${touchX}, Y: ${touchY}`)
  // }

  // // Add event listeners to an element (e.g., document)
  // document.addEventListener('touchstart', handleTouchStart)
  // document.addEventListener('touchmove', handleTouchMove)


  useEffect(() => {
    console.log(swiperState)
  }, [swiperState])




  return (
    <>
      <Swiper
        cssMode={true}
        mousewheel={true}
        freeMode={true}
        scrollbar={true}
        // ref={contentRef}
        direction={'vertical'}
        // simulateTouch={false} // disable mouse drag
        slidesPerView={1}
        // spaceBetween={0}
        // mousewheel={true}
        // speed={8000}
        keyboard={{
          enabled: true,
        }}
        // onReachBeginning={(swiper) => { handleReachBeginning(swiper) }}
        // onReachEnd={(swiper) => { handleReachEnd(swiper) }}
        onSwiper={setSwiperState}

        modules={[Pagination, Mousewheel, Keyboard, FreeMode, Scrollbar,]}
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