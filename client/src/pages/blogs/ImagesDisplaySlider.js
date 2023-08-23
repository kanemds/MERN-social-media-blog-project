import { Swiper, SwiperSlide } from 'swiper/react'
import './imagesDisplaySlider.css'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
// import './swiperStyle.css'
import { Box } from '@mui/material'


// import required modules
import { Keyboard, Pagination, Navigation } from 'swiper/modules'

export default function ImagesDisplaySlider({ row }) {

  return (
    < >
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        // loop={true}
        keyboard={{
          enabled: true,
        }}
        pagination={{
          clickable: true,
        }}
        // navigation={true}
        modules={[Keyboard, Pagination, Navigation]}
        className="mySwiper"
      >
        {row?.map((each, index) => {
          return (

            <SwiperSlide key={index}>
              <img src={each} />
            </SwiperSlide>

          )
        })}
      </Swiper>
    </>
  )
}