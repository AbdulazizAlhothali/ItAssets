import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
  Route
} from 'react-router-dom'
import Navbar from './compenents/Navbar';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/dashboard',
    element: <Dashboard/>
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div>
    <Navbar></Navbar>
      <RouterProvider router={router}/>
    </div>
    
  </React.StrictMode>
);