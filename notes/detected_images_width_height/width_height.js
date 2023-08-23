import React, { useState } from 'react'

const width_height = () => {

  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)

  useEffect(() => {
    // Create a new image element
    const img = new Image()

    // Set the src attribute to the URL of the image you want to detect
    img.src = images

    // Add an event listener for when the image has loaded
    img.onload = () => {
      // Access the width and height properties of the image
      const imageWidth = img.width
      const imageHeight = img.height

      // Update state with the width and height
      setWidth(imageWidth)
      setHeight(imageHeight)
    }
  }, [])



  return (
    <div>
      {console.log('width', width)}
      {console.log('height', height)}
      {console.log('isClick', isClick)}
    </div>
  )
}

export default width_height