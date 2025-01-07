import Layout from '@/layouts';
import Home from '@/pages/home';
import Dashboard from '@/pages/dashboard';
import { createBrowserRouter } from 'react-router-dom';
import Error404 from '@/pages/error404';
import Settings from '@/pages/settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
]);

export default router;
