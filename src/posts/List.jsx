import React, { useEffect, useState, useCallback, useContext } from "react"
import { useNavigate, Link } from 'react-router-dom'
import classNames from "classnames"
import { debounce } from 'lodash'
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2'
import { ShowLoading } from './Components'
import { useReload } from './hooks'
import { createQueryString, defaultLimit } from './utils'
import { getPosts } from "./api"
import { Context } from './Context'

function List() {
  const navigate = useNavigate()
  const [ctx, setCtx] = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState({
    sort: '',
    order: '',
    sortDir: ''
  })
  const [limit, setLimit] = useState(defaultLimit)
  const [info, setInfo] = useState({
    data: [],
    metadata: {
      page: 1,
      total: 0,
      pages: 0,
      links: {
        first: {},
        previous: {},
        pages: [],
        next: {},
        last: {}
      }
    }
  })
  
  const [reload, doReload] = useReload()

  function setQueryString({
    xsearch = search,
    xsort = sortOrder.sort,
    xorder = sortOrder.order,
    xpage = 1,
    xlimit = limit
  } = {}) {
    
    const strParams = createQueryString({
      search: xsearch,
      sort: xsort,
      order: xorder,
      page: xpage,
      limit: xlimit
    })
    
    navigate(`${strParams}`, {
      replace: true
    })
    //window.history.replaceState({}, '', `${window.location.pathname}${strParams}`)
  }

  async function handleDebounceFn(xsearch, xSortOrder, xlimit) {
    setQueryString({
      xsearch,
      xsort: xSortOrder.sort,
      xorder: xSortOrder.order,
      xlimit
    })
    doReload()
  }

  const debounceFn = useCallback(debounce(handleDebounceFn, 500), []);

  function onSearch(ev) {
    const xsearch = ev.target.value
    setSearch(xsearch)
    debounceFn(xsearch, sortOrder, limit)
  }

  function onSort(sort) {
    let xsort, xorder

    if (sortOrder.sort !== sort) {
      xsort = sort
      xorder = 'asc'
    } else if (sortOrder.order === 'asc') {
      xsort = sort
      xorder = 'desc'
    } else if (sortOrder.order === 'desc') {
      xsort = ''
      xorder = ''
    }

    setQueryString({
      xsort,
      xorder,
      xpage: info.metadata.page
    })
    doReload()
  } 

  function onClickLink(ev, active) {
    if (!active) {
      return ev.preventDefault()
    }
    doReload()
  }

  function createClassNames(active) {
    return classNames({
      'text-blue-400': active,
      'text-black cursor-default': !active,
    })
  }

  function onChangeLimit(ev) {
    const value = Number(ev.target.value)
    setLimit(value) 
    if (value <= info.metadata.total) {
      setQueryString({
        xlimit: value
      })
      doReload()
    }
  }

  async function load() {
    setLoading(true)
    const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    const search = params.get('q') || ''
    setSearch(search)
    
    const sort = params.get('sort')
    const order = params.get('order')
    let sortDir = ''
    order === 'asc'
      ? sortDir = '▴'
      : order === 'desc'
        ? sortDir = '▾'
        : sortDir = '' 
    
    setSortOrder({
      sort,
      order,
      sortDir
    })

    let page = Number(params.get('page'))
    page = isNaN(page) || page < 1 ? 1 : page 

    let limit = Number(params.get('limit'))
    limit = isNaN(limit) || limit < 1 || limit > 30 ? defaultLimit : limit 

    setLimit(limit)

    const [data, metadata, err] = await getPosts({
      limit,
      search,
      sort,
      order,
      page
    })
    setLoading(false)
    if (err) {
      await Swal.fire('Error', err.message, 'error')
      return
    }
    
    setInfo({ data, metadata })
        
  }

  useEffect(() => {
    load()
  }, [reload])

  return (
    <div>
      <Helmet>
        <title>My Posts!</title>
      </Helmet>
      <div className="mt-5 flex justify-center">
        <ShowLoading loading={loading}>
          <div>
            <header className="text-right">
              {ctx.lastPost.title !== '' && 
                <p className="inline mr-3">
                  Last Post: <span className="font-bold">{ctx.lastPost.title}</span>
                </p>
              }
              <button
                className="
                bg-gray-600 text-white p-3 
                  rounded hover:bg-gray-400 mr-3
                  leading-5
                "
                onClick={load}
              >
                ↻
              </button>
              <Link
                className="
                bg-blue-600 text-white p-3 
                  rounded hover:bg-blue-400
                "
                to="create"
              >
                Create a Post
              </Link>
            </header>

            <div className="mt-3">
              <div className="mb-2">
                <label htmlFor="search" className="font-bold">
                  Search:
                </label>
                <input
                  className="border p-2 border-gray-500 w-full"
                  id="search"
                  type="text"
                  value={search}
                  onInput={onSearch}
                />
              </div>

              {info.data.length > 0 && (
                <table className="border-2 border-black">
                  <thead>
                    <tr className="border border-gray-700">
                      <th
                        className="border p-2 cursor-pointer"
                        onClick={() => onSort("id")}
                      >
                        <span>ID</span>
                        {sortOrder.sort === "id" && (
                          <span>{sortOrder.sortDir}</span>
                        )}
                      </th>
                      <th
                        className="border p-2 cursor-pointer"
                        onClick={() => onSort("title")}
                      >
                        <span>Title</span>
                        {sortOrder.sort === "title" && (
                          <span>{sortOrder.sortDir}</span>
                        )}
                      </th>
                      <th
                        className="border p-2 cursor-pointer"
                        onClick={() => onSort("author")}
                      >
                        <span>Author</span>
                        {sortOrder.sort === "author" && (
                          <span>{sortOrder.sortDir}</span>
                        )}
                      </th>
                      <th className="border p-2 text-center" colSpan="2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {info.data.map((post) => (
                      <tr key={post.id}>
                        <td className="p-2 border text-gray-600 text-center">
                          {post.id}
                        </td>
                        <td className="p-2 border">
                          <Link
                            className="text-blue-400"
                            to={`${post.id}/show`}
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="p-2 border">{post.author}</td>
                        <td className="p-2 border">
                          <Link
                            className="bg-yellow-500 text-white p-2 rounded"
                            to={`${post.id}/edit`}
                          >
                            Edit
                          </Link>
                        </td>
                        <td className="p-2 border">
                          <Link
                            className="bg-red-500 text-white p-2 rounded"
                            to={`${post.id}/delete`}
                          >
                            Delete
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {info.metadata && info.metadata.total > 0 && (
                <div>
                  <div className="mt-2 flex flex-row justify-center">
                    <Link
                      onClick={(ev) =>
                        onClickLink(ev, info.metadata.links.first.active)
                      }
                      className={createClassNames(
                        info.metadata.links.first.active
                      )}
                      to={info.metadata.links.first.to}
                    >
                      &lt;&lt; First
                    </Link>{" "}
                    |
                    <Link
                      onClick={(ev) =>
                        onClickLink(ev, info.metadata.links.previous.active)
                      }
                      className={createClassNames(
                        info.metadata.links.previous.active
                      )}
                      to={info.metadata.links.previous.to}
                    >
                      &lt; Previous
                    </Link>{" "}
                    |
                    {info.metadata.links.pages.map((page) => (
                      <div key={page.value}>
                        <Link
                          onClick={(ev) => onClickLink(ev, page.active)}
                          className={createClassNames(page.active)}
                          to={page.to}
                        >
                          {" "}
                          {page.value}{" "}
                        </Link>{" "}
                        |
                      </div>
                    ))}
                    <Link
                      onClick={(ev) =>
                        onClickLink(ev, info.metadata.links.next.active)
                      }
                      className={createClassNames(
                        info.metadata.links.next.active
                      )}
                      to={info.metadata.links.next.to}
                    >
                      Next &gt;
                    </Link>{" "}
                    |
                    <Link
                      onClick={(ev) =>
                        onClickLink(ev, info.metadata.links.last.active)
                      }
                      className={createClassNames(
                        info.metadata.links.last.active
                      )}
                      to={info.metadata.links.last.to}
                    >
                      Last &gt;&gt;
                    </Link>
                  </div>
                  <div className="mt-2 flex flex-row justify-center items-center">
                    <label htmlFor="inputLimit" className="font-medium mr-3">
                      Posts per page:
                    </label>
                    <input
                      id="inputLimit"
                      className="border p-2 border-gray-500 w-16"
                      type="number"
                      min={1}
                      max={30}
                      value={limit}
                      onInput={onChangeLimit}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </ShowLoading>
      </div>
    </div>
  );
}

export default List;