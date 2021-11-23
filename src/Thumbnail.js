import React from 'react';
import { Link } from 'react-router-dom';

import { constructFilePath } from './FileUtil.js';
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
          <Link to={`/works?artist=${workInformation.artist}`} style={{ textDecoration: 'none' }} className='badge bg-primary rounded-pill float-end text-wrap' >
            {workInformation.artist}
          </Link>
        </div>

        <div className='card-body'>
          <Link to={`/works/${workInformation.id}`} state={{ work: workInformation }} >
            <PDFPage filePath={constructFilePath(workInformation.artist, workInformation.book_title)} pageNumber={workInformation.startPageNumber} adjustWidth={true} align='center' disableShadow={true} />
          </Link>
        </div>

        <div className='card-footer fs-5'>
          <Link to={`/works/?artist=${workInformation.artist}&book_title=${workInformation.book_title}`} style={{ textDecoration: 'none' }} className='badge bg-primary rounded-pill text-wrap' >
            {workInformation.book_title}
          </Link>
        </div>
      </div>
    )
  }
}
