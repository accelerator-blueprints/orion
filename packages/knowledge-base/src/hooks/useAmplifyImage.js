import { useEffect, useState } from 'react'
import { Storage } from 'aws-amplify'

export default function useAmplifyImage(path, options) {
  const [imageURL, setImageURL] = useState()
  useEffect(() => {
    if (path) {
      Storage.get(path, { level: 'public' }).then(setImageURL)
    } else {
      setImageURL(null)
    }
  }, [path])

  return imageURL
}
