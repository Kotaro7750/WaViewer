import React from 'react';
import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <nav className='navbar navbar-expand navbar-dark bg-dark'>
      <div className='container-fluid'>
        <Link to='/' className='navbar-brand'>NavBar</Link>
        <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className='navbar-toggler-icon' ></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <Link to='/works' className='nav-link'>Works</Link>
            </li>
            <li className='nav-item'>
              <Link to='/' className='nav-link'>Books</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
