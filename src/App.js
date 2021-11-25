import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.js';

export function App() {
  return (
    <div>
      <NavBar />
      <div className='container-fluid'>
        <Outlet />
      </div>
    </div>
  )
}
