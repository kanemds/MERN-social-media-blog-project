import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'



// import required modules
import { Keyboard, Pagination, Navigation } from 'swiper/modules'

export default function HorizontalSwiper() {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        keyboard={{
          enabled: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Keyboard, Pagination, Navigation]}
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