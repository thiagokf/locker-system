import {createBrowserRouter} from "react-router-dom";

// pages
import App from "../App.tsx";
import Home from "../pages/Home/Home.tsx";
import Locker from "../pages/Locker/Locker.tsx";
import Lockers from "../pages/Lockers/Lockers.tsx";
import Compartimento from "../pages/Compartimento/Compartimento.tsx";

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
        element: <Lockers />,
      },
      {
        path: "/:id/compartimento",
        element: <Compartimento />
      }
    ]
  }
]);

export default router;