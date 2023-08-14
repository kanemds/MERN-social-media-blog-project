import { Input, Box, Paper, IconButton, Button, Icon, Typography, Card, CardMedia } from '@mui/material'
import React, { useRef, useState } from 'react'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'




const Drag_N_DropImages = () => {

  const [data, setData] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const dragItem = useRef(null)
  const dragOver = useRef(null)

  console.log(data)
  const selectedData = () => {
    fileInputRef.current.click()
  }

  console.log('fileInputRef.current', fileInputRef.current)
  console.log('click', selectedData)

  const onDataSelect = (e) => {
    const files = e.target.files
    console.log('files', files)
    if (files.length === 0) return
    for (let i = 0;i < files.length;i++) {
      if (files[i].type.split('/')[0] !== 'image') continue
      if (!data?.some((e) => e?.name === files[i]?.name)) {
        setData(prevImages => [
          ...prevImages,
          {
            name: files[i]?.name,
            url: URL.createObjectURL(files[i])
          }
        ])
      }
    }
  }

  const onDeleteImage = (index) => {
    setData(prevImages => prevImages?.filter((_, i) => i !== index)
    )
  }

  const onDragOver = e => {
    e.preventDefault()
    setIsDragging(true)
    e.dataTransfer.dropEffect = 'copy'
  }

  const onDragLeave = e => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDrop = e => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    for (let i = 0;i < files.length;i++) {
      if (files[i].type.split('/')[0] !== 'image') continue
      if (!data?.some((e) => e?.name === files[i]?.name)) {
        setData(prevImages => [
          ...prevImages,
          {
            name: files[i]?.name,
            url: URL.createObjectURL(files[i])
          }
        ])
      }
    }
  }

  const uploadImages = () => {
    console.log('images', data)
    alert('file(s) upload')
  }

  const handleNewOrder = () => {
    // duplicate items 
    let items = [...data]

    // remove and save the dragged item
    // splice giving items new list of array
    // draggedItem is the item that remove from also the selected item
    const selectedItem = items.splice(dragItem.current, 1)[0]

    // create a new list with new position
    // the selectedItem will be insert to new position
    items.splice(dragOver.current, 0, selectedItem)

    // reset position
    dragItem.current = null
    dragOver.current = null

    // update list 
    setData(items)
  }

  const handleCursor = image => {
    console.log(image)
    // image.style.cursor = 'grabbing'
  }

  return (
    <Box>




      <Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'flex-start', mt: 10 }}>
        {!data?.length ? ''
          :

          data?.map((image, index) => {

            console.log(image, index)
            console.log(data)
            return (
              <Card key={index}

                sx={{ display: 'flex', width: 120, height: 120, m: 1, position: 'relative' }}
                onPointerDown={e => handleCursor(image)}
                draggable
                onDragStart={e => dragItem.current = index}
                onDragEnter={e => dragOver.current = index}
                onDragEnd={handleNewOrder}
                onDragOver={e => e.preventDefault()}
              >
                <IconButton size='small' color='primary' onClick={() => onDeleteImage(index)} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 20 }}>
                  <ClearOutlinedIcon />
                </IconButton>
                <CardMedia
                  component="img"
                  image={image.url}
                  alt={image.name}
                />
              </Card>
            )
          }
          )
        }
        <Card
          sx={{ width: 120, height: 120, m: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed grey' }}
          onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        >
          {isDragging ? (
            <Button>Drop images here</Button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Typography>Drop Image(s)</Typography>
              <Typography>or</Typography>
              {/* <Button onClick={selectedData} >Browse</Button> */}
              <IconButton color="primary" component="label" onChange={onDataSelect}>
                <AddPhotoAlternateOutlinedIcon />
                {/* <input type="file" hidden multiple ref={fileInputRef} /> */}
                <input type="file" hidden multiple />
              </IconButton>
            </Box>

          )}
        </Card>

      </Box>

    </Box >
  )
}

export default Drag_N_DropImages