const pdfjs = require('pdfjs-dist/webpack');

export class CachedPDFjsWrapper {
  static cache = {};

  static renderPage(renderContext, filepath, pdfPageProxy) {
    let renderTask = pdfPageProxy.render(renderContext);

    renderTask.promise.then(() => {
      this.handleRenderCompleted(filepath, pdfPageProxy, renderTask);
    });
  }

  static unsubscribe(filepath) {
    if (filepath in this.cache) {
      this.cache[filepath]['referenceCount']--;

      if (this.cache[filepath]['referenceCount'] == 0) {
        let pdfDocumentProxyPromise = this.cache[filepath]['PDFDocumentProxyPromise'];
        delete this.cache[filepath];

        pdfDocumentProxyPromise.then(pdfDocumentProxy => {
          pdfDocumentProxy.cleanup();
          pdfDocumentProxy.destroy();
        });
      }
    }
  }

  // 参照カウント形式のGCみたいなもの
  static handleRenderCompleted(filepath, pdfPageProxy, renderTask) {
    renderTask.cancel();
    pdfPageProxy.cleanup();

    this.unsubscribe(filepath);
  }

  static getPDFDocumentProxyPromise(filepath) {
    if (filepath in this.cache) {
      this.cache[filepath]['referenceCount']++;
      return this.cache[filepath]['PDFDocumentProxyPromise'];
    }

    let origin = new URL(window.location.href).origin;
    let url = origin + '/' + filepath;

    let loadingTask = pdfjs.getDocument(url);

    this.cache[filepath] = {};
    this.cache[filepath]['referenceCount'] = 1;

    this.cache[filepath]['PDFDocumentProxyPromise'] = new Promise(
      (resolve, reject) => {
        loadingTask.promise.then(pdfDocumentProxy => {
          resolve(pdfDocumentProxy);
        }).catch(e => reject(e));
      }
    );


    return this.cache[filepath]['PDFDocumentProxyPromise'];
  }

  static getPDFPageProxyPromise(filepath, pageNumber) {
    return new Promise((resolve, reject) => {
      this.getPDFDocumentProxyPromise(filepath).then(pdfDocumentProxy => {
        pdfDocumentProxy.getPage(pageNumber).then(pdfPageProxy => {
          resolve(pdfPageProxy);
        }).catch(e => reject(e));
      });
    });
  }
}
