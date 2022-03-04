import React from 'react'
import ReactDOM from 'react-dom'
import 'sweetalert2/dist/sweetalert2.min.css'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route, 
} from "react-router-dom";

import App from './App'

/** Begin Posts */
import Layout from './posts/Layout'
import PostsList from './posts/List'
import PostsCreate from './posts/Create'
import PostsEdit from './posts/Edit'
import PostsShow from './posts/Show'
import PostsDelete from './posts/Delete'
/** End Posts */

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/posts" element={<Layout />}>
          <Route index element={<PostsList />} />
          <Route path="create" element={<PostsCreate />} />
          <Route path=":id/show" element={<PostsShow />} />
          <Route path=":id/edit" element={<PostsEdit />} />
          <Route path=":id/delete" element={<PostsDelete />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
