import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchWorkInformationList } from './FileUtil.js';
import { WorkList } from './WorkList.js';

export function WorkGallery() {
  const [workInformationList, setWorkInformationList] = useState([]);

  if (workInformationList.length == 0) {
    fetchWorkInformationList().then(json => {
      setWorkInformationList(json);
    });
  }

  const { search } = useLocation();
  let query = new URLSearchParams(search);

  const filter = constructFilter(query);

  let fileterdWorkInformationList = workInformationList;
  fileterdWorkInformationList = extractByFilter(fileterdWorkInformationList, filter);

  return (
    <div>
      <div className='row'>
        <WorkList workInformationList={fileterdWorkInformationList} />
      </div>
    </div>
  );
}

function constructFilter(query) {
  let filter = {};
  filter.artist = query.get('artist') || '';
  filter.bookTitle = query.get('book_title') || '';

  return filter;
}

function isFilterEmpty(filter) {
  return filter.artist == '' && filter.bookTitle == '';
}

function extractByFilter(workInformationList, filter) {
  if (isFilterEmpty(filter)) {
    return workInformationList;
  }


  let extractedList = [];
  workInformationList.forEach(workInformation => {
    if (isMatchWithFilter(workInformation, filter)) {
      extractedList.push(workInformation);
    }
  });

  return extractedList;
}

function isMatchWithFilter(workInformation, filter) {
  if (filter.artist != '' && workInformation.artist != filter.artist) {
    return false;
  }

  if (filter.bookTitle != '' && workInformation.book_title != filter.bookTitle) {
    return false;
  }

  return true;
}
