import React from 'react';
import { useLocation } from 'react-router-dom';
import { PDFRangeViewer } from './PDFRangeViewer.js';


export function Work(props) {
  // Link経由で作品情報を受け取っているが介さない場合にはどうなるのか？
  const location = useLocation();
  let work = location.state.work;

  return (
    <div>
      <PDFRangeViewer filename={work.filename} startPageNumber={work.startPageNumber} endPageNumber={work.endPageNumber} />
    </div>
  );
}
