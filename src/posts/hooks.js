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

export function useGoBack() {
  const navigate = useNavigate()

  function goBack(replace = true) {
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
 * @param {(id: Number, data?: Object) => Promise<{ data: Object, err?: Object}>} apiPost 
 * @param {{data?: Object, mode: 'GET' | 'CHANGE', errInvalid?: String, err404?: String}} options
 * @returns 
 */
export function usePost(id, apiPost, {
  data,
  mode = 'GET',
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
      switch(err.response.status) {
        case 404:
          await postInvalid(err404)
          break;
        default:
          switch(mode) {
            case 'GET':
              await postInvalid(err.message)
              break;
            case 'CHANGE':
              await Swal.fire('Error', err.message, 'error')
              break;
          }  
      }
      return false
    }
    return true
  }

  async function doPost() {
    if (!await checkPostId(id)) return
    const res = await apiPost(id, data)
    if (!await checkPostResult(res)) return
    return res
  }

  return {
    doPost
  }
}