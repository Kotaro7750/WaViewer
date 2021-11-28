import React, { useState, useEffect, useRef } from 'react';

import { CachedPDFjsWrapper } from './CachedPDFjsWrapper.js';

export function PDFPage(props) {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const shouldNextRender = useRef(true);
  const isRenderCompleted = useRef(true);

  const canvasRef = useRef(null);

  // 描画ルーチン完了によるrenderの際にレンダー終了判定をする
  if (isLoadingPage == false) {
    isRenderCompleted.current = true;
  }

  // canvasの親要素やビューポートの大きさに合わせて適切なサイズで描画する
  const renderPageAdjustParent = () => {
    // 描画の際のstate変更でこの関数が呼ばれないようにする
    // 一種の排他処理用のロックと見ることもできる
    isRenderCompleted.current = false;

    const filePath = props.filePath;

    CachedPDFjsWrapper.getPDFPageProxyPromise(filePath, props.pageNumber).then(page => {
      setIsLoadingPage(false);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const cardBodyContainer = document.getElementById('page-container-body-' + String(props.pageNumber));
      const containerComputedStyle = window.getComputedStyle(cardBodyContainer);

      const containerWidth = cardBodyContainer.clientWidth - parseFloat(containerComputedStyle.paddingLeft) - parseFloat(containerComputedStyle.paddingRight);
      const browserViewportHeight = window.innerHeight;

      // 親要素の幅とブラウザビューポートの高さに合わせた際のスケールを計算
      const originalViewport = page.getViewport({ scale: 1 });
      const scaleAdjustViewportHeight = browserViewportHeight / originalViewport.height;
      const scaleAdjustParentWidth = containerWidth / originalViewport.width;

      // 幅のみに合わせなければいけないときを除き，幅・高さの制約を両方満たすようにする
      let scaleForCSSPixel;
      if (props.adjustWidth) {
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

      CachedPDFjsWrapper.renderPage(renderContext, filePath, page);
    }).catch(() => {
      CachedPDFjsWrapper.unsubscribe(filePath);
    });
  }

  useEffect(() => {
    // 見開き表示のトグルなどrenderが呼ばれるときにはキャンバスサイズに合わせてページを描画したい
    // 描画ルーチンの内部でstateを書き換えているので無限renderループを防ぐ
    // 親からの再レンダーでは描画し直したいが，描画ルーチンの内部でのstate書き換えでは描画し直してはいけないのでstateとは別の状態を持っておく
    if (shouldNextRender.current) {
      setIsLoadingPage(true);
      shouldNextRender.current = false;

      renderPageAdjustParent();
    }

    // 描画ルーチンで描画した際のstate変更によるrenderの次のrenderで再度描画ルーチンを呼び出す必要がある
    // そのためのラッチのようなもの
    if (isRenderCompleted.current) {
      shouldNextRender.current = true;
    }
  });

  // ページを左右・真ん中にアラインするためのクラス
  let marginClassName;
  if (props.align == 'left') {
    marginClassName = ' me-auto';
  } else if (props.align == 'right') {
    marginClassName = ' ms-auto'
  } else {
    marginClassName = ' mx-auto';
  }

  const shadowClassName = props.disableShadow ? '' : ' shadow-lg';

  const page_element = isLoadingPage
    ? (
      <div className='d-flex justify-content-center'>
        <div className='spinner-border'><span /></div>
      </div>
    )
    : <canvas ref={canvasRef} className={'d-block' + marginClassName + shadowClassName} />;

  return (
    <div className='' id={'page-container-body-' + String(props.pageNumber)}>
      {page_element}
    </div>
  )
}
