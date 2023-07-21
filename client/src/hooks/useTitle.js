import { useEffect } from 'react'

const useTitle = title => {

  useEffect(() => {
    const preTitle = document.title
    document.title = title

    return () => document.title = preTitle
  }, [title])
}

export default useTitle