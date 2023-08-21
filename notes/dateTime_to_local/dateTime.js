import React, { useState } from 'react'

const dateTime = () => {

  const [time, setTime] = useState(Date.parse(
    '06/14/2020 4:41:48 PM UTC'))

  const [toLocal, setToLocal] = useState('')


  // time must to use Date.parse before toLocaleString()
  // Date.parse has limitation of accepting date formate( accept new date())
  // Date.parse convert to milliseconds 
  console.log(time) //1592152908000


  const handleClick = (time) => {
    const localTime = new Date(time)
    setToLocal(localTime.toLocaleString())
  }

  return (
    <div>
      <h2>dateTime</h2>
      <p>UTC date and time:
        06/14/2020 4:41:48 PM</p>
      <button onClick={() => handleClick(time)}>To local</button>

      {toLocal ? <p>{toLocal}</p> : ''}
    </div>
  )
}

export default dateTime