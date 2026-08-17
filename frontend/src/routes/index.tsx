import {createBrowserRouter} from "react-router-dom";

// pages
import App from "../App.tsx";
import Home from "../pages/Home/Home.tsx";
import Locker from "../pages/Locker/Locker.tsx";
import Lockers from "../pages/Lockers/Lockers.tsx";
import Compartimento from "../pages/Compartimento/Compartimento.tsx";
import Compartimentos from "../pages/Compartimentos/Compartimentos.tsx";
import SelectLocker from "../pages/Entrega/SelectLocker.tsx";
import SelectCompartimento from "../pages/Entrega/SelectCompartimento.tsx";
import ViewEntregas from "../pages/Entregas/viewEntregas.tsx";

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
      },
      {
        path: "/:id/:localizacao/compartimentos",
        element: <Compartimentos />
      },
      {
        path: "/entrega/selectLocker",
        element: <SelectLocker />
      },
      {
        path: "/entrega/selectCompartimento/:id/:tamanho/:status",
        element: <SelectCompartimento />
      },
      {
        path: "/entregas",
        element: <ViewEntregas />
      }
    ]
  }
]);

export default router;