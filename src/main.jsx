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
import Layout from './posts/Layout'
import PostsList from './posts/List'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/posts" element={<Layout />}>
          <Route index element={<PostsList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
