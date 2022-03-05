import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

let toggle = 1
export function useReload() {
  const [reload, setReload] = useState(toggle)
  
  function doReload() {
    toggle = toggle === 1 ? 2 : 1
    setReload(toggle) 
  }

  return [reload, doReload]
}

function useGoBack(replace = true) {
  const navigate = useNavigate()

  function goBack() {
    navigate('..', {
      replace
    })
  }

  return {
    goBack
  }
}

const defMessage = 'Post Invalid'
/**
 * 
 * @param {String | Number} id 
 * @param {(id: Number) => Promise<{ data: Object, err?: Object}>} getPost 
 * @param {{errInvalid?: String, err404?: String}} options
 * @returns 
 */
export function usePost(id, getPost, {
  errInvalid = defMessage,
  err404 = defMessage
} = {}) {
  const { goBack } = useGoBack()
  
  async function postInvalid(message) {
    await Swal.fire('Error', message, 'error')
    goBack()
  }

  async function checkPostId(id) {
    const _id = Number(id)
    if (isNaN(_id) || _id < 1) {
      await postInvalid(errInvalid)
      return false
    }
    return true
  }

  async function checkPostResult(res) {
    if (res.data === null) {
      const err = res.err
      if (err.response.status === 404) {
        await postInvalid(err404)
      } else {
        await postInvalid(err.message)
      }
      return false
    }
    return true
  }

  async function doGetPost() {
    if (!await checkPostId(id)) return
    const res = await getPost(id)
    if (!await checkPostResult(res)) return
    return res
  }

  return {
    doGetPost
  }
}