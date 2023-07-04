import "./styles/global.scss";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Assessment } from './pages/Assessment';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Consult } from "./pages/Consult";
import { Validation } from "./pages/Validation";
import { ErrorPage } from "./pages/Error";
import { Login } from "./pages/Login";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { EmployeeProvider } from "./context/EmployeeProvider";
import { QuestionProvider } from "./context/QuestionProvider";
import { AuthProvider } from './context/AuthProvider';

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AuthProvider><ProtectedLayout><Home /></ProtectedLayout></AuthProvider>,
      errorElement: <ErrorPage />
    },
    {
      path: '/Login',
      element: <AuthProvider><Login /></AuthProvider>
    },
    {
      path: '/Register',
      element: <AuthProvider><ProtectedLayout><EmployeeProvider><Register /></EmployeeProvider></ProtectedLayout></AuthProvider>
    },
    {
      path: '/Assessment',
      element: 
      <AuthProvider>
        <ProtectedLayout>
          <EmployeeProvider>
            <QuestionProvider>
              <Assessment />
            </QuestionProvider>
          </EmployeeProvider>
        </ProtectedLayout>
      </AuthProvider>
    },
    {
      path: '/Consult',
      element: <AuthProvider><ProtectedLayout><EmployeeProvider><Consult /></EmployeeProvider></ProtectedLayout></AuthProvider>
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