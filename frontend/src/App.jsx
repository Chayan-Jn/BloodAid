import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Donate from './pages/Donate'
import Request from './pages/Request'
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
    path:"/request",
    element:<Request/>
  }
])
const App = ()=>{
  return(
    <RouterProvider router={router}>     
    </RouterProvider>

  )
}

export default App