import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {routes} from './routes';

export const Router = () => <RouterProvider router={createBrowserRouter(routes)}/>