import React, { useState, useEffect } from 'react';

export function constructFilePath(artist, bookTitle) {
  return 'pdf/' + artist + '/' + bookTitle + '.pdf';
}

export function useWorkInformationList() {
  const [workInformationList, setWorkInformationList] = useState([]);

  useEffect(() => {
    if (workInformationList.length == 0) {
      fetchWorkInformationList().then(json => setWorkInformationList(json));
    }
  });

  return workInformationList;
}

function fetchWorkInformationList() {
  const origin = new URL(window.location.href).origin;
  const url = origin + '/pdf/works.json';

  return new Promise((resolve, reject) => {
    fetch(url).then(response => {
      return response.json();
    }).then(json => {
      resolve(json);
    }).catch(e => {
      reject(e);
    })
  });
}
