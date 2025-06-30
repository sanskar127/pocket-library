import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Navbar from './components/Navbar'
import Home from "./pages/Home"
import Watch from "./pages/Watch"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: 'watch/:title',
        element: <Watch/>
    }
])

const App = () => {
  return (
    <div>
      <Navbar/>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
