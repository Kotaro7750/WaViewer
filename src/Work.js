import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { PDFRangeViewer } from './PDFRangeViewer.js';


export function Work() {
  // Link経由で作品情報を受け取っているが介さない場合にはどうなるのか？
  const location = useLocation();
  let workInformation = location.state.work;

  return (
    <div>
      <div>
        <Link to={`/works?artist=${workInformation.artist}`} style={{ textDecoration: 'none' }} className='badge bg-primary rounded-pill text-wrap' >
          {workInformation.artist}
        </Link>
        <Link to={`/works/?artist=${workInformation.artist}&book_title=${workInformation.book_title}`} style={{ textDecoration: 'none' }} className='badge bg-primary rounded-pill text-wrap' >
          {workInformation.book_title}
        </Link>
      </div>
      <PDFRangeViewer workInformation={workInformation} />
    </div>
  );
}
