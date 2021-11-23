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

      // 親要素の幅とブラウザビューポートの高さに合わせた際のスケールを計算
      const originalViewport = page.getViewport({ scale: 1 });
      const scaleAdjustViewportHeight = browserViewportHeight / originalViewport.height;
      const scaleAdjustParentWidth = containerWidth / originalViewport.width;

      // 幅のみに合わせなければいけないときを除き，幅・高さの制約を両方満たすようにする
      let scaleForCSSPixel;
      if (this.props.adjustWidth) {
        scaleForCSSPixel = scaleAdjustParentWidth;
      } else {
        scaleForCSSPixel = Math.min(scaleAdjustViewportHeight, scaleAdjustParentWidth);
      }

      // DOM要素としてのcanvasのサイズは画面に合わせてサイズを変える必要がある
      // ここでのピクセルの値はCSSピクセル値
      const cssViewport = page.getViewport({ scale: scaleForCSSPixel });
      canvas.style.width = cssViewport.width + 'px';
      canvas.style.height = cssViewport.height + 'px';

      const devicePixelRatio = window.devicePixelRatio;
      // 描画されるページ自体の解像度は極力下げない
      // ここで指定しているのはcanvasの描画バッファのサイズ
      // ここで指定した解像度が実際に描画される際の解像度となる
      canvas.width = cssViewport.width * devicePixelRatio;
      canvas.height = cssViewport.height * devicePixelRatio;

      // 実際のレンダーのやり方としては2種類ある
      // * 描画バッファとオリジナルページのサイズの比をスケールとするビューポート(deviceViewport)をレンダリングする方法
      // * canvasにデバイスピクセル比分のスケールをかけて(ctx.scale(devicePixelRatio,devicePixelRatio))，cssピクセルスケールのビューポート(cssViewport)をレンダリングする方法
      // 少なくとも開発時点では差が分からなかったので前者にした
      const deviceViewport = page.getViewport({ scale: canvas.height / originalViewport.height });

      let renderContext = {
        canvasContext: ctx,
        viewport: deviceViewport
      };

      CachedPDFjsWrapper.renderPage(renderContext, this.props.filename, page);
      this.duringRenderPage = false;
    });
  }
}
