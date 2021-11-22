import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { App } from './App.js';
import { NavBar } from './NavBar.js';
import { Work } from './Work.js';
import { WorkGallery } from './WorkGallery.js';

ReactDOM.render(
  <HashRouter>
    <NavBar />
    <div className='container-fluid'>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/works' element={<WorkGallery />} />
        <Route path='/works/:workId' element={<Work />} />
      </Routes>
    </div>
  </HashRouter>,
  document.getElementById('root')
);
