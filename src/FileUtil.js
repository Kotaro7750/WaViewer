export function constructFilePath(artist, bookTitle) {
  return 'pdf/' + artist + '/' + bookTitle + '.pdf';
}

export function fetchWorkInformationList() {
  const origin = new URL(window.location.href).origin;
  const url = origin + '/pdf/works.json';

  return new Promise((resolve,reject) => {
    fetch(url).then(response => {
      return response.json();
    }).then(json => {
      resolve(json);
    }).catch(e => {
      reject(e);
    })
  });
}
