import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <h1 className="text-2xl text-center text-gray-600"> 🗲 Posts App 🗲 </h1>
      <div className="flex justify-center">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout