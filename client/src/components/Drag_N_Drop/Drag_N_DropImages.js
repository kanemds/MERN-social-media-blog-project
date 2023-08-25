import { Input, Box, Paper, IconButton, Button, Icon, Typography, Card, CardMedia } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import './drag_n_drop.css'




const Drag_N_DropImages = ({ setSelectedImage, selectedImage, setOrgImages, orgImages }) => {

  const [data, setData] = useState([])
  const [isClick, setIsClick] = useState(false)
  const [selected, setSelected] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  console.log('selectedImage', selectedImage)
  console.log('orgImages', orgImages)



  const dragItem = useRef(null)
  const dragOver = useRef(null)

  useEffect(() => {

    setIsClick(false)
    if (data?.length) {
      if (selectedImage) {
        setSelectedImage(selectedImage)
      } else {
        setSelectedImage(data[0])
      }
    } else {
      setSelectedImage(null)
    }

  }, [data])


  const onDataSelect = (e) => {
    const files = e.target.files
    // console.log('files', files)
    if (files.length === 0) return
    for (let i = 0;i < files.length;i++) {
      if (files[i].type.split('/')[0] !== 'image') continue
      if (!data?.some((e) => e?.name === files[i]?.name)) {
        setOrgImages(prev => [...prev, files[i]])
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


  // This pattern ensures current state is the most up-to-date and helps to prevent issues related to stale closures.
  // however, this will still re-render
  const onDeleteImage = (e, index) => {
    if (isClick) {
      if (data[index].name === selectedImage.name) {
        setSelectedImage(null)
      }
      setData(prevImages => prevImages?.filter((_, i) => i !== index))
      setOrgImages(prevImages => prevImages?.filter((_, i) => i !== index))

    }
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

  const onDrop = async e => {

    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files

    let arrayFiles = []

    // arrayFiles = Object.entries(files) // [position,file object]
    //  [File, File, File, File, File]
    for (const file of files) {
      arrayFiles.push(file)
    }
    if (data.length + arrayFiles.length <= 4) {
      // No need to modify arrayFiles
    } else if (data.length + arrayFiles.length > 4) {
      arrayFiles = arrayFiles.slice(0, 4 - data.length)
    }

    for (let i = 0;i < arrayFiles.length;i++) {
      if (arrayFiles[i].type.split('/')[0] !== 'image') continue // type: "image/png" into array ['image','png']

      if (!data?.some((e) => e?.name === arrayFiles[i]?.name)) {
        setOrgImages(prev => [...prev, files[i]])
        await setData(prevImages => [
          ...prevImages,
          {
            name: arrayFiles[i]?.name,
            url: URL.createObjectURL(arrayFiles[i])
          }
        ])
      }
    }
  }



  const handleNewOrder = () => {

    // duplicate items 
    let items = [...data]
    let orgs = [...orgImages]

    // remove and save the dragged item
    // splice giving items new list of array
    // draggedItem is the item that remove from also the selected item
    const selectedItem = items.splice(dragItem.current, 1)[0] // selected object 
    const selectedOrg = orgs.splice(dragItem.current, 1)[0]

    // create a new list with new position
    // the selectedItem will be insert to new position
    items.splice(dragOver.current, 0, selectedItem)
    orgs.splice(dragOver.current, 0, selectedOrg)

    // reset position
    dragItem.current = null
    dragOver.current = null

    // update list 
    setData(items)
    setOrgImages(orgs)
  }



  const handleOnDragStart = (e, index) => {

    dragItem.current = index
  }

  const handleSelectImage = (e, image) => {
    e.preventDefault()
    if (!isClick) {
      setSelectedImage(image)
    }
  }





  return (


    <Box className='container' sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
      {!data?.length ? ''
        :


        data?.map((image, index) => {

          return (
            <Box key={index}
              onClick={(e) => handleSelectImage(e, image)}
              className='card'
              component='div'
              sx={{ display: 'flex', width: 120, height: 120, p: 1, position: 'relative' }}
              draggable
              onDragStart={e => handleOnDragStart(e, index)}
              onDragEnter={e => dragOver.current = index}
              onDragEnd={handleNewOrder}
              onDragOver={e => e.preventDefault()}
            >
              <IconButton
                size='small'
                color='primary'
                onClick={(e) => onDeleteImage(e, index)}
                sx={{ position: 'absolute', top: 12, right: 12, zIndex: 20, p: 0 }}
                onMouseOver={() => setIsClick(true)}
                onMouseOut={() => setIsClick(false)}>
                <ClearOutlinedIcon />
              </IconButton>
              <CardMedia
                sx={{ borderRadius: 2, border: selectedImage === null && index === 0 ? '3px solid #1976d2' : selectedImage?.name === image.name ? '3px solid #1976d2' : '2px solid grey' }}
                className='img'
                component="img"
                image={image.url}
                alt={image.name}
              />
            </Box>
          )
        }
        )
      }
      <Box
        sx={{ width: 104, height: 104, m: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed grey', borderRadius: 2, display: data.length < 4 ? '' : 'none' }}
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        disabled={data?.length <= 5 ? false : true}
      >
        {isDragging ? (
          <Button>Drop images here</Button>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} >
            <Typography variant='caption'>Drop Image(s)</Typography>
            <Typography variant='caption'>or</Typography>
            <IconButton color="primary" component="label" onChange={onDataSelect} disabled={data?.length <= 4 ? false : true}>
              <AddPhotoAlternateOutlinedIcon />
              {/* <input type="file" hidden multiple ref={fileInputRef} /> */}
              <input type="file" hidden multiple />

            </IconButton>
          </Box>

        )}
      </Box>

    </Box>


  )
}

export default Drag_N_DropImages