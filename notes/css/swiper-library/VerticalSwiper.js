import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'


// import required modules
import { Keyboard, Mousewheel, Pagination } from 'swiper/modules'

export default function VerticalSwiper() {
  return (
    <>
      <Swiper
        direction={'vertical'}
        slidesPerView={1}
        spaceBetween={30}
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
        <SwiperSlide><p>Slide 1</p></SwiperSlide>
        <SwiperSlide><p>Slide 2</p></SwiperSlide>
        <SwiperSlide><p>Slide 3</p></SwiperSlide>
        <SwiperSlide><p>Slide 4</p></SwiperSlide>
      </Swiper>
    </>
  )
}