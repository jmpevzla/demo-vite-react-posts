import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useFormik } from 'formik'
import { getPost, editPost } from './api'
import { usePost, useGoBack } from './hooks'
import { ShowLoading, ShowProcessing } from './Components'

function Edit() {
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  
  const [post, setPost] = useState({})
  const formik = useFormik({
    initialValues: {
      id: post.id || 0,
      title: post.title || 'TITLE',
      author: post.author || 'AUTHOR'
    },
    enableReinitialize: true,
    onSubmit: async values => {
      setEditing(true)
      const res = await doEditPost(values)
      setEditing(false)
      if (res) {
        goBack()
      }
    }
  })

  const params = useParams()
  const { doPost: doGetPost } = usePost(getPost, { id: params.id })
  const { doPost: doEditPost } = usePost(editPost, { id: params.id, mode: 'CHANGE' })
  const { goBack } = useGoBack()

  const title = 'Edit Post'

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
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>

          <div className="w-32 mb-2">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <label className="font-bold text-center p-2" htmlFor="pId">ID:</label>
              <input className="border p-2 border-gray-500 bg-gray-300" 
                id="pId" name="id" type="text" disabled 
                value={formik.values.id} />
            </div>
          </div>

          <div className="w-32 mb-2">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <label className="font-bold text-center p-2" htmlFor="title">Title:</label>
              <input className="border p-2 border-gray-500" 
                id="title" name="title" required type="text" 
                value={formik.values.title} onChange={formik.handleChange} />
            </div>
          </div>

          <div className="w-32 mb-2">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <label className="font-bold text-center p-2" htmlFor="author">Author:</label>
              <input className="border p-2 border-gray-500" 
                id="author" name="author" required type="text" 
                value={formik.values.author} onChange={formik.handleChange} />
            </div>
          </div>

          <div className="w-96 mt-3 text-center flex justify-center">
            <ShowProcessing loading={editing}>
              <div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2 text-base">
                  Edit
                </button>
                <button type="reset" className="bg-yellow-500 text-white p-2 rounded mr-2 text-base">
                  Reset
                </button>
                <button type="button" className="bg-gray-500 text-black p-2 rounded text-base"
                  onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </ShowProcessing>
          </div>

        </form>
      </ShowLoading> 
    </main>
  )
}

export default Edit

