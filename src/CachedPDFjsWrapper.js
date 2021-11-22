const pdfjs = require('pdfjs-dist/webpack');

export class CachedPDFjsWrapper {
  static cache = {};

  static renderPage(renderContext, filename, pdfPageProxy) {
    let renderTask = pdfPageProxy.render(renderContext);

    renderTask.promise.then(() => {
      this.handleRenderCompleted(filename, pdfPageProxy, renderTask);
    });
  }

  // 参照カウント形式のGCみたいなもの
  static handleRenderCompleted(filename, pdfPageProxy, renderTask) {
    renderTask.cancel();
    pdfPageProxy.cleanup();

    if (filename in this.cache) {
      this.cache[filename]['referenceCount']--;

      if (this.cache[filename]['referenceCount'] == 0) {
        let pdfDocumentProxyPromise = this.cache[filename]['PDFDocumentProxyPromise'];
        delete this.cache[filename];

        pdfDocumentProxyPromise.then(pdfDocumentProxy => {
          pdfDocumentProxy.cleanup();
          pdfDocumentProxy.destroy();
        });
      }
    }
  }

  static getPDFDocumentProxyPromise(filename) {
    if (filename in this.cache) {
      this.cache[filename]['referenceCount']++;
      return this.cache[filename]['PDFDocumentProxyPromise'];
    }

    let origin = new URL(window.location.href).origin;
    let url = origin + '/' + filename;

    let loadingTask = pdfjs.getDocument(url);

    this.cache[filename] = {};
    this.cache[filename]['referenceCount'] = 1;

    this.cache[filename]['PDFDocumentProxyPromise'] = new Promise(
      (resolve, reject) => {
        loadingTask.promise.then(pdfDocumentProxy => {
          resolve(pdfDocumentProxy);
        }).catch(e => reject(e));
      }
    );


    return this.cache[filename]['PDFDocumentProxyPromise'];
  }

  static getPDFPageProxyPromise(filename, pageNumber) {
    return new Promise((resolve, reject) => {
      this.getPDFDocumentProxyPromise(filename).then(pdfDocumentProxy => {
        pdfDocumentProxy.getPage(pageNumber).then(pdfPageProxy => {
          resolve(pdfPageProxy);
        }).catch(e => reject(e));
      });
    });
  }
}
