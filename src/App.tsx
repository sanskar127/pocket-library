import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Watch from "./pages/Watch"

const router = createBrowserRouter([
  {
    path: '/*',
    element: <Home />
  },
  {
    path: 'watch/:videoId',
    element: <Watch />
  }
])

const App = () => <RouterProvider router={router} />

export default App
