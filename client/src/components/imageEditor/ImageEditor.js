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
    const { file, cropped } = await getCroppedImg(url, name, croppedAreaPixels, rotation)
    setCroppedImg({ file, url: cropped })
    setAvatarImage({ name: null, url: null })
    setOpen(false)
  }

  const zoomPercent = value => {
    return `${Math.round(value * 100)}%`
  }

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 40, left: 40, right: 40, bottom: '180px', backgroundColor: 'black' }}>
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
        <Box sx={{ width: '60%', maxWidth: '400px', minWidth: '220px' }} textAlign='center'>
          <Typography>{zoomPercent(zoom)}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box sx={{ width: '100px', display: 'flex', justifyContent: 'flex-start', mr: 2 }}>
              <Typography >Zoom:</Typography>
            </Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
              <Slider
                value={zoom}
                // valueLabelFormat={zoomPercent}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => onZoomChange(zoom)}
                classes={{ container: 'slider' }}
              />
            </Box>

          </Box>
        </Box>
        <Box sx={{ width: '60%', maxWidth: '400px', minWidth: '220px' }} textAlign='center'>
          <Typography >{rotation}°</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box sx={{ width: '100px', display: 'flex', justifyContent: 'flex-start', mr: 2 }}>
              <Typography >Rotation:</Typography>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
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
        </Box>
        <Box>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveImg}>Save</Button>
        </Box>
      </Box >
    </Box >
  )
}

export default ImageEditor