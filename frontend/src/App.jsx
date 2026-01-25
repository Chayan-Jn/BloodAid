import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Donate from './pages/Donate'
import Find from './pages/Find'
import Request from './pages/Request'
import Update from './pages/Update'
import MyRequests from './pages/MyRequests'
import AreaRequests from './pages/AreaRequests'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Landing/>
  },
  {
    path:"/home",
    element:<Home/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/donate",
    element:<Donate/>
  },
  {
    path:"/find",
    element:<Find/>
  },
  {
    path:"/request",
    element:<Request/>
  },
  {
    path:"/profile/edit",
    element:<Update/>
  },
  {
    path:"/my-requests",
    element:<MyRequests/>
  },
  {
    path:"requests-in-area",
    element:<AreaRequests/>
  }
])
const App = ()=>{
  return(
    <RouterProvider router={router}>     
    </RouterProvider>

  )
}

export default App