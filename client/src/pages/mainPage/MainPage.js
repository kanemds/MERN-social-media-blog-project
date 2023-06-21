import React from 'react'

const MainPage = () => {

  const date = new Date()

  const currentDay = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

  return (
    <>
      <div>K-Blog</div>
      {currentDay}
    </>

  )
}

export default MainPage