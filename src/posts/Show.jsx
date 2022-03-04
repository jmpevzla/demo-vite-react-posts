import {} from 'react'
import { useParams } from 'react-router-dom'

function Show() {
  const params = useParams()
  console.log(params)
  return (
    <h2>Show Posts</h2>
  )
}

export default Show