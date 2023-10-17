import React, { useState } from 'react'
import { Box, Button, Slider } from '@mui/material'
import Cropper from 'react-easy-crop'
import getCroppedImg from './CropImage'

const ImageEditor = ({ avatarImage, setAvatarImage, setCroppedImg, handleClose, setOpen }) => {

  console.log(avatarImage)
  const { name, url } = avatarImage

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = (crop) => {
    setCrop(crop)
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedAreaPixels.width / croppedAreaPixels.height)
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  const saveImg = async () => {
    const croppedImageUrl = await getCroppedImg(url, croppedAreaPixels)
    setCroppedImg(croppedImageUrl)
    setAvatarImage({ name: null, url: null })
    setOpen(false)

  }


  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '180px' }}>
        <Cropper
          image={url}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', position: 'absolute', bottom: 0, height: '180px', alignItems: 'center', justifyContent: 'center', width: '100%' }} >
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => onZoomChange(zoom)}
          classes={{ container: 'slider' }}
          sx={{ width: '50%', mb: 1 }}
        />
        <Box>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveImg}>Save</Button>
        </Box>
      </Box >
    </Box>
  )
}

export default ImageEditor