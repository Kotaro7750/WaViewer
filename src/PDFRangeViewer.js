import React from 'react';

import { constructFilePath } from './FileUtil.js';
import { PDFPage } from './PDFPage.js';

export class PDFRangeViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enableFacingPages: false,
      isolatedStartPageWhenFacingPages: false
    }
  }

  render() {
    let pages = [];

    if (this.state.enableFacingPages) {
      pages = this.constructFacingPages();
    } else {
      pages = this.constructSinglePages();
    }

    return (
      <div>
        <div className='form-check form-switch'>
          <label className='form-check-label'>
            Facing Pages
            <input className='form-check-input' type='checkbox' checked={this.state.enableFacingPages} onChange={this.handleToggleFacingPages} />
          </label>
        </div>
        {this.state.enableFacingPages
          ? (
            <div className='form-check form-switch'>
              <label className='form-check-label'>
                Toggle First Page
            <input className='form-check-input' type='checkbox' checked={this.state.isolatedStartPageWhenFacingPages} onChange={this.handleToggleIsolatedStartPage} />
              </label>
            </div>
          )
          : null
        }

        <div className='row'>
          {pages}
        </div>
      </div>
    )
  }

  handleToggleFacingPages = () => {
    this.setState((state) => ({
      enableFacingPages: !state.enableFacingPages
    }));
  }

  handleToggleIsolatedStartPage = () => {
    this.setState((state) => ({
      isolatedStartPageWhenFacingPages: !state.isolatedStartPageWhenFacingPages
    }));
  }

  constructSinglePages = () => {
    const workInformation = this.props.workInformation;
    let pages = [];

    for (let pageNumber = workInformation.startPageNumber; pageNumber <= workInformation.endPageNumber; pageNumber++) {
      pages.push(
        (<div key={pageNumber} className='svh-100 my-5'>
          <PDFPage filePath={constructFilePath(workInformation.artist, workInformation.book_title)} pageNumber={pageNumber} />
        </div>)
      );
    }

    return pages;
  }

  constructFacingPages = () => {
    const workInformation = this.props.workInformation;
    const filePath = constructFilePath(workInformation.artist, workInformation.book_title);
    let pages = [];

    let startPageNumberOfFacingPages;

    // 最初のページを見開きに加えないときには次のページ以降を見開きの対象とする
    if (this.state.isolatedStartPageWhenFacingPages) {
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
}
