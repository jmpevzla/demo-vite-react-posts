import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useFormik } from 'formik'
import { createPost } from './api'
import { usePost, useGoBack } from './hooks'
import { ShowProcessing } from './Components'
import { useChangeTitleCtx } from './Context'

function Create() {
  const changeTitleCtx = useChangeTitleCtx()
  const [creating, setCreating] = useState(false)
  
  const formik = useFormik({
    initialValues: {
      title: '',
      author: ''
    },
    onSubmit: async values => {
      setCreating(true)
      const res = await doCreatePost(values)
      setCreating(false)
      if (res) {
        changeTitleCtx(values.title)
        goBack()
      }
    }
  })

  const params = useParams()
  const { doPost: doCreatePost } = usePost(createPost, { mode: 'CREATE' })
  const { goBack } = useGoBack()

  const title = 'Create a Post'

  const onCancel = async () => {
    goBack(false)
  }

  useEffect(() => {
    changeTitleCtx('')
  }, [])

  return (
    <main className="p-1 text-center">
      <Helmet>
        <title>{`${title}`}</title>
      </Helmet>
      
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>

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
          <ShowProcessing loading={creating}>
            <div>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2 text-base">
                Create
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
      
    </main>
  )
}

export default Create

