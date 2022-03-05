import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPost } from './api'
import { usePost } from './hooks'
import { ShowLoading, PostContent } from './Components'

function Show() {
  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState({
    id: 0,
    title: 'TITLE',
    author: 'AUTHOR'
  })
  const params = useParams()
  const { doPost: doGetPost } = usePost(getPost, {
    id: params.id
  })
  const title = `Show Post`
  useEffect(() => {
    async function init() {
      // document.title = title
      setLoading(true)
      const res = await doGetPost()
      if (res) {
        setPost(res.data)
        setLoading(false)
      }
    }
    init()
  }, [])

  return (
    <main className="p-1 text-center">
      <Helmet>
        <title>{`${title} # ${params.id}`}</title>
      </Helmet>
      <ShowLoading loading={loading}>
        <PostContent title={title} post={post} />
      </ShowLoading> 
    </main>
  )
}

export default Show