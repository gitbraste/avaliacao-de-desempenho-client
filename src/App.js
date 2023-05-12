import "./styles/global.scss";
import { useState } from "react";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Assessment } from './pages/Assessment';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Consult } from "./pages/Consult";
import { Validation } from "./pages/Validation";
import { ErrorPage } from "./pages/Error";

export default function App() {
  const [manager, setManager] = useState([]);
  const [selectEmployee, setSelectEmployee] = useState([]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <ErrorPage />
    },
    {
      path: '/Register',
      element: <Register
        manager={manager}
        onSetManager={setManager}
        selectEmployee={selectEmployee}
        onSetSelectEmployee={setSelectEmployee}
      />
    },
    {
      path: '/Assessment',
      element: <Assessment
        manager={manager}
        selectEmployee={selectEmployee}
      />
    },
    {
      path: '/Consult',
      element: <Consult
        manager={manager}
        onSetManager={setManager}
      />
    },
    {
      path: '/Validation/:code',
      element: <Validation />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}