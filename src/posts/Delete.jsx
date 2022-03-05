import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPost, deletePost } from './api'
import { usePost, useGoBack } from './hooks'
import { PostContent, ShowLoading, ShowProcessing } from './Components'

function Delete() {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [post, setPost] = useState({
    id: 0,
    title: 'TITLE',
    author: 'AUTHOR'
  })
  const params = useParams()
  const { doPost: doGetPost } = usePost(params.id, getPost)
  const { doPost: doDeletePost } = usePost(params.id, deletePost, { mode: 'CHANGE' })
  const { goBack } = useGoBack()

  const title = 'Delete Post'

  const onDelete = async () => {
    setDeleting(true)
    const res = await doDeletePost()
    setDeleting(false)
    if (res) {
      goBack()
    }
  }

  const onCancel = async () => {
    goBack(false)
  }

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
        <>
          <PostContent title={title} post={post} />
          <div className="flex justify-center">
            <ShowProcessing loading={deleting}>
              <div className="mt-2">
                <button className="bg-red-500 text-white p-2 rounded mr-2"
                  onClick={onDelete}>
                  Delete this?
                </button>
                <button className="bg-gray-500 text-black p-2 rounded"
                  onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </ShowProcessing>
          </div>
        </>
      </ShowLoading> 
    </main>
  )
}

export default Delete