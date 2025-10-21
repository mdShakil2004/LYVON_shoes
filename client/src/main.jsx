// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import App from './App.jsx'
import AdminRoutes from './admin/AdminRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
     <Routes>
      <Route path="/*" element={<App />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  </BrowserRouter>,
)
