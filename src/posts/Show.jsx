import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPost } from './api'
import { usePost } from './hooks'
import { ShowLoading } from './Components'

function Show() {
  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState({
    id: 0,
    title: 'TITLE',
    author: 'AUTHOR'
  })
  const params = useParams()
  const { doGetPost } = usePost(params.id, getPost)
  const title = `Show Post #${params.id}`
  useEffect(() => {
    async function init() {
      // document.title = title
      setLoading(true)
      const res = await doGetPost()
      if (res) setPost(res.data)
      setLoading(false)
    }
    init()
  }, [])

  return (
    <main className="p-1 text-center">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ShowLoading loading={loading}>
        <div>
          <h2>Show Post # <span className="text-green-600"> {post.id} </span></h2>
          <div className="mt-3">
            <h3 className="text-2xl font-bold mb-3 tracking-wider"> {post.title} </h3>
            <p className="text-red-500 text-sm" x-text="data.author"> {post.author} </p>
          </div>
        </div>
      </ShowLoading> 
    </main>
  )
}

export default Show