import axios from 'axios'
import Swal from 'sweetalert2'
import { canGoToFirstPage, canGoToLastPage, canGoToNextPage,
  canGoToPage, canGoToPreviousPage, createQueryString,
  defaultLimit } from './utils'

axios.defaults.headers.common = {
  'no-auth': 1
}

axios.defaults.baseURL = 'http://localhost:4000'

export async function getPosts({ 
  search = null, 
  sort = null, 
  order = null,
  page = 1,
  limit = defaultLimit
} = {}) {
  try {
    const res = await axios.get('/posts', {
      params: {
        q: search,
        _sort: sort,
        _order: order,
        _page: page,
        _limit: limit
      }
    })
    const headers = res.headers
    const total = Number(headers['x-total-count'])
    const xpage = page ? Number(page) : 1
    const pages = Math.ceil(total / limit) 
    const array = []
  
    let pBaseUrl = ''
    //const first = '?' + headers['link'].split(',')[0].replace('<', '').replace('>', '').split(';')[0].split('?')[1]
    const createLink = (page) => {
      return `${pBaseUrl}${createQueryString({ search, sort, order, page, limit })}`
    }

    const canFirst = canGoToFirstPage(xpage)
    const first = {
      to: createLink(canFirst ? 1 : xpage), 
      active: canFirst
    }

    const canPrevious = canGoToPreviousPage(xpage)
    const previous = {
      to: createLink(canPrevious ? xpage - 1 : xpage), 
      active: canPrevious
    }

    const canNext = canGoToNextPage(xpage, pages)
    const next = {
      to: createLink(canNext ? xpage + 1 : xpage), 
      active: canNext
    }

    const canLast = canGoToLastPage(xpage, pages)
    const last = {
      to: createLink(canLast ? pages : xpage), 
      active: canLast
    }

    const funcPage = (page) => {
      const canPage =  canGoToPage(page, xpage, pages)
      return {
        value: page,
        to: createLink(canPage ? page : xpage), 
        active: canPage
      }
    }

    for(let i = 0; i < pages; i++) {
      array.push(funcPage(i+1))
    }

    return [
      res.data,
      {
        page: xpage,
        total,
        pages: Math.ceil(total / limit),
        links: {
          pages: array,
          first,
          previous,
          next,
          last
        } 
      }
    ]

  } catch(err) {
    Swal.fire('Error', err.message, 'error')
    console.error(err)
    return [[], null]
  }
}

export async function getPost(id) {
  try {
    const res = await axios.get(`/posts/${id}`)
    return {
      data: res.data
    }
  } catch(err) {
    // Swal.fire('Error', err.message, 'error')
    console.error(err)
    return { data: null, err }
  }
}