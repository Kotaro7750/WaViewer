import React from 'react';
import { RandomGallery } from './RandomGallery.js';

export class App extends React.Component {
  render() {
    return (
      <div className='container-fluid'>
        <RandomGallery />
      </div>
    )
  }
}
