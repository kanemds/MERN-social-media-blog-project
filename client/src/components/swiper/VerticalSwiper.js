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


export default function VerticalSwiper() {

  const displayImg = [
    [car, notebook],
    [people, hiking]
  ]

  const [isLast, setIsLast] = useState('')
  const [isAllow, setIsAllow] = useState(false)

  console.log(isLast)
  console.log(isAllow)


  useEffect(() => {
    const lastElement = document.querySelector('.lastElement')

    console.log(lastElement)

    const wheelControl = e => {


      if (e.deltaY < 0) {
        setIsAllow(false)
        isLast.enable()
        console.log("Scrolling Up")
      } else if (e.deltaY > 0 && isAllow) {
        isLast.disable()
        console.log("Scrolling Down")
      }
    }

    lastElement.addEventListener('wheel', wheelControl)

    return () => {
      lastElement.removeEventListener('wheel', wheelControl)
    }
  }, [isAllow])

  const handleReachEnd = (swiper) => {
    console.log('reachEnd')
    setIsLast(swiper)
    setIsAllow(true)
  }



  return (
    <>
      <Swiper
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