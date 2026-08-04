import {createBrowserRouter} from "react-router-dom";

// pages
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import Locker from "../pages/Locker.tsx"
import Lockers from "../pages/Lockers.tsx"
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
      },
      {
        path: "/lockers",
        element: <Lockers />
      }
    ]
  }
]);

export default router;