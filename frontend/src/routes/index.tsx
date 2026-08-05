import {createBrowserRouter} from "react-router-dom";

// pages
import App from "../App.tsx";
import Home from "../pages/Home/Home.tsx";
import Locker from "../pages/Locker/Locker.tsx";
import Lockers from "../pages/Lockers/Lockers.tsx";
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