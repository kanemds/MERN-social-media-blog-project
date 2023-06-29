import React, { useMemo } from 'react'

const MyComponent = ({ a, b }) => {
  const memoizedSum = useMemo(() => {
    console.log('Calculating sum...')
    return a + b
  }, [a, b])

  return (
    <div>
      <p>Sum: {memoizedSum}</p>
    </div>
  )
}

// purpose:  cache the result of a function or expression, preventing unnecessary re-computations

// The memoized value will only be recalculated when the dependencies change: a or b 