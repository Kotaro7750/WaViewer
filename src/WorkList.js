import React, { useState } from 'react';
import { Thumbnail } from './Thumbnail.js';

export function WorkList(props) {
  const [currentPage, setCurrentPage] = useState(1);

  const workInformationList = props.workInformationList;

  const maxElementNumberInPage = 36;
  const totalPageNumber = calculateTotalPageNumber(workInformationList.length, maxElementNumberInPage);

  let paginationNav = undefined;
  if (totalPageNumber > 1) {
    let paginationList = [];
    for (let i = 1; i <= totalPageNumber; ++i) {
      const className = i == currentPage ? 'page-item active' : 'page-item';
      paginationList.push(<li className={className} key={i}><a className='page-link' onClick={() => setCurrentPage(i)}>{i}</a></li>);
    }

    paginationNav = (
      <nav className='m-5'>
        <ul className='pagination justify-content-center'>
          <li className='page-item'><a className='page-link' onClick={() => handlePrevious(currentPage, setCurrentPage)}>Previous</a></li>
          {paginationList}
          <li className='page-item'><a className='page-link'>Next</a></li>
        </ul >
      </nav >
    );
  }

  let workThumbnailList = [];

  workInformationList.filter((_, i) => {
    return ((maxElementNumberInPage * (currentPage - 1)) <= i) && (i < maxElementNumberInPage * currentPage);
  }).forEach(workInformation => {
    workThumbnailList.push(
      <div key={workInformation.id} className='col-xl-3 col-lg-4 col-md-6 col-12'>
        <Thumbnail workInformation={workInformation} />
      </div>
    );
  });

  return (
    <div>
      <div className='row gy-5'>
        {workThumbnailList}
      </div>
      {paginationNav}
    </div>
  )
}

function calculateTotalPageNumber(elementListLength, maxElementNumberInPage) {
  return Math.ceil(elementListLength / maxElementNumberInPage);
}

function handlePrevious(currentPage, setCurrentPage) {
  const pageNumberAfterMove = currentPage == 1 ? 1 : currentPage - 1;

  setCurrentPage(pageNumberAfterMove);
}
