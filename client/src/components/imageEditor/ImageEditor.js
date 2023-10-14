import React from 'react'
import { Slider } from '@mui/material'
import Cropper from 'react-easy-crop'


const ImageEditor = () => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)

  const onCropChange = (crop) => {
    setCrop(crop)
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedAreaPixels.width / croppedAreaPixels.height)
  }

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  return (
    <>
      <div className="crop-container">
        <Cropper
          image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
        />
      </div>
      <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => onZoomChange(zoom)}
          classes={{ container: 'slider' }}
        />
      </div>
    </>
  )
}

export default ImageEditor