import { useState, useEffect } from "react"

const usePersist = () => {

  // localStorage can only store string, using JSON.parse and JSON.stringify to convert string  
  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false)

  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist))
  }, [persist])

  return [persist, setPersist]
}

export default usePersist
