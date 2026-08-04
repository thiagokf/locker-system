import {createBrowserRouter} from "react-router-dom";

// pages
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import Locker from "../pages/Locker.tsx"
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/locker",
        element: <Locker />
      }
    ]
  }
]);

export default router;