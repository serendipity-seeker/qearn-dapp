import Layout from '@/layouts';
import Home from '@/pages/home';
import Dashboard from '@/pages/dashboard';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/admin',
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
