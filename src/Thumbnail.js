import React from 'react';
import { Link } from 'react-router-dom';

import { PDFPage } from './PDFPage.js';

export class Thumbnail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const workInformation = this.props.workInformation;

    return (
      <div className='card shadow-lg'>
        <div className='card-header fs-3'>
          {workInformation.title}
          <Link to='/' style={{ textDecoration: 'none' }} className='badge bg-primary rounded-pill float-end text-wrap' >
            {workInformation.author}
          </Link>
        </div>

        <div className='card-body'>
          <Link to={`/works/${workInformation.id}`} state={{ work: workInformation }} >
            <PDFPage filename={workInformation.filename} pageNumber={workInformation.startPageNumber} adjustWidth={true} align='center' disableShadow={true}/>
          </Link>
        </div>

        <div className='card-footer fs-5'>
          <Link to='/' style={{ textDecoration: 'none' }} className='badge bg-primary rounded-pill text-wrap' >
            {this.splitBookTitle()}
          </Link>
        </div>
      </div>
    )
  }

  splitBookTitle = () => {
    const filename = this.props.workInformation.filename.split('/').slice(-1)[0];
    return filename.split('.')[0];
  }
}
