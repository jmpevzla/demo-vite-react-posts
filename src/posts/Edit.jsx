import {} from 'react'
import { useParams } from 'react-router-dom'

function Edit() {
  const params = useParams()
  console.log(params)
  return (
    <h2>Edit Posts</h2>
  )
}

export default Edit

