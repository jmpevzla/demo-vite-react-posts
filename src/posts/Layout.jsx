import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PostsIcon from './favicon.svg'

function Layout() {
  return (
    <div>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href={PostsIcon} />
      </Helmet>
      <h1 className="text-2xl text-center text-gray-600"> 🗲 Posts App 🗲 </h1>
      <div className="flex justify-center">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout