import React from 'react';
import { useLocation } from 'react-router-dom';
import { PDFRangeViewer } from './PDFRangeViewer.js';


export function Work(props) {
  // Link経由で作品情報を受け取っているが介さない場合にはどうなるのか？
  const location = useLocation();
  let workInformation = location.state.work;

  return (
    <div>
      <PDFRangeViewer workInformation={workInformation} />
    </div>
  );
}
