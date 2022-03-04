import { useState } from 'react'

let toggle = 1
export function useReload() {
  const [reload, setReload] = useState(toggle)
  
  function doReload() {
    toggle = toggle === 1 ? 2 : 1
    setReload(toggle) 
  }

  return [reload, doReload]
}