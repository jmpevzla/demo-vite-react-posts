import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <h1 class="sm:text-2xl lg:text-xl text-center">New Vite App</h1>
      <Outlet />
    </div>
  )
}

export default Layout