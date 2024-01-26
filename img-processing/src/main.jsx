import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Dashbroash from './pages/Dashbroash.jsx'
import ImgProcessingPage from './pages/ImgProcessing.jsx'
import './App.css'
import ErrorsComponent from './components/ImgProcessing/Errors/index.jsx'


const routers = createBrowserRouter([
  {
    path: '/',
    element: <Dashbroash />,
    errorElement: <ErrorsComponent />
  },
  {
    path: '/about',
    element: <div>About</div>
  }, {
    path: '/img-processing',
    element: <ImgProcessingPage />
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={routers} />
  </React.StrictMode>,
)
