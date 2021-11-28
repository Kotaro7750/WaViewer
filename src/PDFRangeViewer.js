import React, { useState } from 'react';

import { constructFilePath } from './FileUtil.js';
import { PDFPage } from './PDFPage.js';

export function PDFRangeViewer(props) {
  const [enableFacingPages, setEnableFacingPages] = useState(false);
  const [isolatedStartPageWhenFacingPages, setIsolatedStartPageWhenFacingPages] = useState(false);

  // --- 各ページコンポーネント生成用関数 ---
  const workInformation = props.workInformation;
  const filePath = constructFilePath(workInformation.artist, workInformation.book_title);

  const constructSinglePages = () => {
    let pages = [];

    for (let pageNumber = workInformation.startPageNumber; pageNumber <= workInformation.endPageNumber; pageNumber++) {
      pages.push(
        (<div key={pageNumber} className='svh-100 my-5'>
          <PDFPage filePath={filePath} pageNumber={pageNumber} />
        </div>)
      );
    }

    return pages;
  }

  const constructFacingPages = () => {
    let pages = [];

    let startPageNumberOfFacingPages;

    // 最初のページを見開きに加えないときには次のページ以降を見開きの対象とする
    if (isolatedStartPageWhenFacingPages) {
      startPageNumberOfFacingPages = workInformation.startPageNumber + 1;

      pages.push(
        (<div key={workInformation.startPageNumber} className='svh-100 my-5'>
          <PDFPage filePath={filePath} pageNumber={workInformation.startPageNumber} align={'center'} />
        </div>)
      );
    } else {
      startPageNumberOfFacingPages = workInformation.startPageNumber;
    }

    const numberOfRowsWithFacingPages = Math.floor((workInformation.endPageNumber - startPageNumberOfFacingPages + 1) / 2);

    for (let i = 0; i < numberOfRowsWithFacingPages; i++) {
      // 見開きページの左ページ
      const leftPageNumber = startPageNumberOfFacingPages + 2 * i + 1;
      pages.push(
        (<div key={leftPageNumber} className='svh-100 my-5 col-6'>
          <PDFPage filePath={filePath} pageNumber={leftPageNumber} align={'right'} />
        </div>)
      );

      // 見開きページの右ページ
      const rightPageNumber = startPageNumberOfFacingPages + 2 * i;
      pages.push(
        (<div key={rightPageNumber} className='svh-100 my-5 col-6'>
          <PDFPage filePath={filePath} pageNumber={rightPageNumber} align={'left'} />
        </div>)
      );
    }

    // 最後に1ページだけ余った時の処理
    if (startPageNumberOfFacingPages + 2 * numberOfRowsWithFacingPages - 1 != workInformation.endPageNumber) {
      pages.push(
        // 余ったページは中央揃えする
        (<div key={workInformation.endPageNumber} className='svh-100 my-5'>
          <PDFPage filePath={filePath} pageNumber={workInformation.endPageNumber} align={'center'} />
        </div>)
      );
    }

    return pages;
  }

  // --- トグルボタンハンドラ ----
  const handleToggleFacingPages = () => {
    setEnableFacingPages(prev => !prev);
  }

  const handleToggleIsolatedStartPage = () => {
    setIsolatedStartPageWhenFacingPages(prev => !prev);
  }

  // --- render処理 ---
  let pages = [];

  if (enableFacingPages) {
    pages = constructFacingPages();
  } else {
    pages = constructSinglePages();
  }

  return (
    <div>
      <div className='form-check form-switch'>
        <label className='form-check-label'>
          Facing Pages
            <input className='form-check-input' type='checkbox' checked={enableFacingPages} onChange={handleToggleFacingPages} />
        </label>
      </div>
      {enableFacingPages
        ? (
          <div className='form-check form-switch'>
            <label className='form-check-label'>
              Toggle First Page
            <input className='form-check-input' type='checkbox' checked={isolatedStartPageWhenFacingPages} onChange={handleToggleIsolatedStartPage} />
            </label>
          </div>
        )
        : null
      }

      <div className='row'>
        {pages}
      </div>
    </div>
  );
}
