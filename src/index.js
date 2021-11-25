import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { App } from './App.js';
import { Work } from './Work.js';
import { RandomGallery } from './RandomGallery.js';
import { WorkGallery } from './WorkGallery.js';

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path='/' element={<App />} >
        <Route path='/' element={<RandomGallery />} />
        <Route path='/works' element={<WorkGallery />} />
        <Route path='/works/:workId' element={<Work />} />
      </Route>
    </Routes>
  </HashRouter>,
  document.getElementById('root')
);
