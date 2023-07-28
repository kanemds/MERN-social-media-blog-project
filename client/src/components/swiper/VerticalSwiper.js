import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import './swiperStyle.css'

import car from './images/car_travel.jpg'
import map from './images/world_map.jpg'
import pics from './images/pics_camera.jpg'
import notebook from './images/note_book.jpg'

// import required modules
import { Keyboard, Mousewheel, Pagination } from 'swiper/modules'
import HorizontalSwiper from './HorizontalSwiper'

export default function VerticalSwiper() {

  const displayImg = [
    [car, map],
    [pics, notebook]
  ]

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
        pagination={{
          clickable: true,
        }}
        modules={[Keyboard, Mousewheel, Pagination]}

        className="mySwiper"
      >
        {displayImg.map((each, index) =>
          <SwiperSlide key={index}>
            <HorizontalSwiper row={each} loading="lazy" />
          </SwiperSlide>
        )}



      </Swiper>
    </>
  )
}