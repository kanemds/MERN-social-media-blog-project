import { useEffect, useRef, useState } from "react"



const demo = () => {
  const [count, setCount] = useState(0)
  // const countRef = useRef(0)

  const handleIncrement = () => {
    setCount(count + 1)
    // countRef.current++

    console.log("State:", count) // this count is the previous count due to 
    // console.log("Ref:", countRef.current)
  }

  return (
    <div className="tutorial">
      Count: {count}
      <button onClick={handleIncrement}>Increment</button>
    </div>
  )
}


const demo2 = () => {
  // const [count, setCount] = useState(0)
  const countRef = useRef(0)

  const handleIncrement = () => {
    // setCount(count + 1)
    countRef.current++

    // console.log("State:", count)
    console.log("Ref:", countRef.current)
  }

  return (
    <div className="tutorial">
      {/* due to the useRef() will not cause any re-render, it won't display the actual value */}
      {/* while if refresh the page it will back to initial state */}

      Count: {countRef.current}
      <button onClick={handleIncrement}>Increment</button>
    </div>
  )
}

const Demo3 = () => {
  const inputRef = useRef < HTMLInputElement | null > (null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="tutorial">
      <input ref={inputRef} type="text" placeholder="Type something..." />
    </div>
  )
}