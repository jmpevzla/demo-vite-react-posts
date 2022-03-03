import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route, 
} from "react-router-dom";

import Layout from './Layout'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
