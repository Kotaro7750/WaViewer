import React from 'react';

import { CachedPDFjsWrapper } from './CachedPDFjsWrapper.js';

export class PDFPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingPage: true
    }

    this.duringRenderPage = false;
    this.canvasRef = React.createRef();
  }

  render() {
    // ページを左右・真ん中にアラインするためのクラス
    let marginClassName;
    if (this.props.align == 'left') {
      marginClassName = ' me-auto';
    } else if (this.props.align == 'right') {
      marginClassName = ' ms-auto'
    } else {
      marginClassName = ' mx-auto';
    }

    const shadowClassName = this.props.disableShadow ? '' : ' shadow-lg';

    const page_element = this.state.loadingPage
      ? (
        <div className='d-flex justify-content-center'>
          <div className='spinner-border'><span /></div>
        </div>
      )
      : <canvas ref={this.canvasRef} className={'d-block' + marginClassName + shadowClassName} />;

    return (
      <div className='' id={'page-container-body-' + String(this.props.pageNumber)}>
        {page_element}
      </div>
    )
  }

  componentDidMount() {
    this.renderPageAdjustParent();
  }

  componentWillUpdate() {
    // 見開き表示のトグルなどrenderが呼ばれるときにはキャンバスサイズに合わせてページを描画したい
    // 描画ルーチンの内部でstateを書き換えているので無限renderループを防ぐ
    // 親からの再レンダーでは描画し直したいが，描画ルーチンの内部でのstate書き換えでは描画し直してはいけないのでstateとは別の状態を持っておく
    if (this.state.loadingPage == false && this.duringRenderPage == false) {
      this.setState({ loadingPage: true });
      this.renderPageAdjustParent();
    }
  }

  // canvasの親要素やビューポートの大きさに合わせて適切なサイズで描画する
  renderPageAdjustParent = () => {
    // 描画の際のstate変更でこの関数が呼ばれないようにする
    // 一種の排他処理用のロックと見ることもできる
    this.duringRenderPage = true;

    CachedPDFjsWrapper.getPDFPageProxyPromise(this.props.filename, this.props.pageNumber).then(page => {
      this.setState({ loadingPage: false });

      const canvas = this.canvasRef.current;
      const ctx = canvas.getContext('2d');
      const cardBodyContainer = document.getElementById('page-container-body-' + String(this.props.pageNumber));

      const containerComputedStyle = window.getComputedStyle(cardBodyContainer);

      const containerWidth = cardBodyContainer.clientWidth - parseFloat(containerComputedStyle.paddingLeft) - parseFloat(containerComputedStyle.paddingRight);
      const browserViewportHeight = window.innerHeight;

      const scaleAdjustHeight = browserViewportHeight / page.getViewport({ scale: 1.0 }).height;
      const scaleAdjustWidth = containerWidth / page.getViewport({ scale: 1.0 }).width;

      let scale;
      // 幅のみに合わせなければいけないときを除き，幅・高さの制約を両方満たすようにスケールを調整する
      if (this.props.adjustWidth) {
        scale = scaleAdjustWidth;
      } else {
        scale = Math.min(scaleAdjustHeight, scaleAdjustWidth);
      }

      const viewport = page.getViewport({ scale: scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      let renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      CachedPDFjsWrapper.renderPage(renderContext, this.props.filename, page);
      this.duringRenderPage = false;
    });
  }
}
