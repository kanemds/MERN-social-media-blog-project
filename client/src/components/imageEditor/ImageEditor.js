import React, { useState } from 'react'
import { Box, Button, Slider, Typography } from '@mui/material'
import Cropper from 'react-easy-crop'
// import getCroppedImg from './CropImage'
import { getCroppedImg, getRotatedImage } from './CropImage'

const ImageEditor = ({ avatarImage, setAvatarImage, setCroppedImg, handleClose, setOpen }) => {

  const { name, url } = avatarImage

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
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

  const onRotationChange = (rotation) => {
    setRotation(rotation)
  }

  const saveImg = async () => {
    const croppedImageUrl = await getCroppedImg(url, croppedAreaPixels, rotation)
    setCroppedImg({ name, url: croppedImageUrl })
    setAvatarImage({ name: null, url: null })
    setOpen(false)
  }

  const zoomPercent = value => {
    return `${Math.round(value * 100)}%`
  }

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '180px', backgroundColor: 'black' }}>
        <Cropper
          image={url}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          cropShape="round"
          showGrid={true}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
          onRotationChange={setRotation}

        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', position: 'absolute', bottom: 0, height: '180px', alignItems: 'center', justifyContent: 'center', width: '100%' }} >
        <Box sx={{ width: '60%', }} textAlign='center'>
          <Typography>{zoomPercent(zoom)}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={{ width: '120px' }}>Zoom:</Typography>
            <Slider
              value={zoom}
              // valueLabelFormat={zoomPercent}
              min={1}
              max={3}
              step={1}
              aria-labelledby="Zoom"
              onChange={(e, zoom) => onZoomChange(zoom)}
              classes={{ container: 'slider' }}
            />
          </Box>
        </Box>
        <Box sx={{ width: '60%', }} textAlign='center'>
          <Typography >{rotation}°</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={{ width: '120px' }}>Rotation:</Typography>
            <Slider
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              onChange={(e, rotation) => onRotationChange(rotation)}
              classes={{ container: 'slider' }}

            />
          </Box>
        </Box>
        <Box>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveImg}>Save</Button>
        </Box>
      </Box >
    </Box>
  )
}

export default ImageEditor