import { createBrowserRouter, RouterProvider } from "react-router";
import Watch from "./pages/Watch";
import Home from "./pages/Home";
import View from "./pages/View";
// import DeviceNotSupported from "./components/common/DeviceNotSupported";

const router = createBrowserRouter([
  {
    path: "*",
    Component: Home
  },
  {
    path: "watch/:id",
    Component: Watch
  },
  {
    path: "view/:id",
    Component: View
  }
])

const App = () => {
  // if (window.innerWidth < 1280) return <DeviceNotSupported />
  return <RouterProvider router={router} />
};

export default App;
