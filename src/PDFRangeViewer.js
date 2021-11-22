import React from 'react';
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
    let pages = [];

    for (let pageNumber = this.props.startPageNumber; pageNumber <= this.props.endPageNumber; pageNumber++) {
      pages.push(
        (<div key={pageNumber} className='svh-100 my-5'>
          <PDFPage filename={this.props.filename} pageNumber={pageNumber} />
        </div>)
      );
    }

    return pages;
  }

  constructFacingPages = () => {
    let pages = [];

    let startPageNumberOfFacingPages;

    // 最初のページを見開きに加えないときには次のページ以降を見開きの対象とする
    if (this.state.isolatedStartPageWhenFacingPages) {
      startPageNumberOfFacingPages = this.props.startPageNumber + 1;

      pages.push(
        (<div key={this.props.startPageNumber} className='svh-100 my-5'>
          <PDFPage filename={this.props.filename} pageNumber={this.props.startPageNumber} align={'center'} />
        </div>)
      );
    } else {
      startPageNumberOfFacingPages = this.props.startPageNumber;
    }

    const numberOfRowsWithFacingPages = Math.floor((this.props.endPageNumber - startPageNumberOfFacingPages + 1) / 2);

    for (let i = 0; i < numberOfRowsWithFacingPages; i++) {
      // 見開きページの左ページ
      const leftPageNumber = startPageNumberOfFacingPages + 2 * i + 1;
      pages.push(
        (<div key={leftPageNumber} className='svh-100 my-5 col-6'>
          <PDFPage filename={this.props.filename} pageNumber={leftPageNumber} align={'right'} />
        </div>)
      );

      // 見開きページの右ページ
      const rightPageNumber = startPageNumberOfFacingPages + 2 * i;
      pages.push(
        (<div key={rightPageNumber} className='svh-100 my-5 col-6'>
          <PDFPage filename={this.props.filename} pageNumber={rightPageNumber} align={'left'} />
        </div>)
      );
    }

    // 最後に1ページだけ余った時の処理
    if (startPageNumberOfFacingPages + 2 * numberOfRowsWithFacingPages - 1 != this.props.endPageNumber) {
      pages.push(
        // 余ったページは中央揃えする
        (<div key={this.props.endPageNumber} className='svh-100 my-5'>
          <PDFPage filename={this.props.filename} pageNumber={this.props.endPageNumber} align={'center'} />
        </div>)
      );
    }

    return pages;
  }
}
