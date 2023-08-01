import React, { useEffect } from 'react'

const useWheelEvent = (element) => {

  useEffect(() => {
    const lastElement = document.querySelector(element)

    console.log(lastElement)

    const wheelControl = e => {
      if (e.deltaY < 0) {

        console.log("Scrolling Up")
      } else if (e.deltaY > 0) {

        console.log("Scrolling Down")
      }
    }


    lastElement.addEventListener('wheel', wheelControl)

    return () => {
      lastElement.removeEventListener('wheel', wheelControl)
    }
  }, [])
}
export default useWheelEvent