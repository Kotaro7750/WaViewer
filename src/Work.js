import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useWorkInformationList } from './FileUtil.js';
import { PDFRangeViewer } from './PDFRangeViewer.js';
import { Thumbnail } from './Thumbnail.js';


export function Work() {
  // Link経由で作品情報を受け取っているが介さない場合にはどうなるのか？
  const location = useLocation();
  let workInformation = location.state.work;

  const workInformationList = useWorkInformationList();
  const prevWorkInformation = workInformationList[workInformation.prevWorkId];
  const nextWorkInformation = workInformationList[workInformation.nextWorkId];

  const prevThumbnail = prevWorkInformation && <Thumbnail workInformation={prevWorkInformation} />
  const nextThumbnail = nextWorkInformation && <Thumbnail workInformation={nextWorkInformation} />

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

      <div className='row'>
        <div className='col-xl-2 col-lg-4 col-md-6'>
          {prevThumbnail}
        </div>

        <div className='col-xl-2 offset-xl-8 col-lg-4 offset-lg-4 col-md-6'>
          {nextThumbnail}
        </div>
      </div>
    </div>
  );
}
