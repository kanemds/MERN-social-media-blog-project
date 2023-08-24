import { Swiper, SwiperSlide } from 'swiper/react'
import './imagesDisplaySlider.css'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/zoom'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
// import './swiperStyle.css'
import { Box, Button, IconButton } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { pink } from '@mui/material/colors'


// import required modules
import { Keyboard, Pagination, Navigation } from 'swiper/modules'
import { useEffect, useState } from 'react'

export default function ImagesDisplaySlider({ row, handleClose, on }) {


  const [isOpen, setIsOpen] = useState(on)

  return (
    <>
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
              <img className='contain' src={each} />
            </SwiperSlide>
          )
        })}
        {isOpen ? <IconButton color='primary' sx={{ position: 'fixed', zIndex: 9999, top: '10%', right: '10%' }} size='large' onClick={handleClose} ><ClearIcon sx={{ width: 40, height: 40 }} /></IconButton> : ''}
      </Swiper >
    </>
  )
}