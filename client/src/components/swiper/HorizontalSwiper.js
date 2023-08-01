import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './swiperStyle.css'



// import required modules
import { Keyboard, Pagination, Navigation } from 'swiper/modules'

export default function HorizontalSwiper({ row }) {

  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
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
        {row?.map((each, index) => {
          return (
            <SwiperSlide key={index}>
              <img src={each} />
              <div className="swiper-lazy-preloader"></div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}