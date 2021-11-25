import React from 'react';

import { useLocation } from 'react-router-dom';
import { useWorkInformationList } from './FileUtil.js';

import { SearchBox } from './SearchBox.js';
import { WorkList } from './WorkList.js';

export function WorkGallery() {
  const workInformationList = useWorkInformationList();

  const { search } = useLocation();
  let query = new URLSearchParams(search);

  const filter = constructFilter(query);

  let fileterdWorkInformationList = workInformationList;
  fileterdWorkInformationList = extractByFilter(fileterdWorkInformationList, filter);

  return (
    <div>
      <SearchBox />
      <WorkList workInformationList={fileterdWorkInformationList} />
    </div>
  );
}

function constructFilter(query) {
  let filter = {};
  filter.keyword = query.get('keyword') || '';
  filter.artist = query.get('artist') || '';
  filter.bookTitle = query.get('book_title') || '';

  return filter;
}

function isFilterEmpty(filter) {
  return filter.artist == '' && filter.bookTitle == '' && filter.keyword == '';
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
  // 作者と本のタイトルが指定されたときには完全一致
  if (filter.artist != '' && workInformation.artist != filter.artist) {
    return false;
  }

  if (filter.bookTitle != '' && workInformation.book_title != filter.bookTitle) {
    return false;
  }

  if (filter.keyword != '') {
    // 作品の数だけ同じ正規表現が生成されるのでよくない
    const regExp = new RegExp(filter.keyword);
    if (!isKeywordMatch(workInformation, regExp)) {
      return false;
    }
  }

  return true;
}

function isKeywordMatch(workInformation, regExp) {
  if (regExp.test(workInformation.artist) || regExp.test(workInformation.book_title) || regExp.test(workInformation.title)) {
    return true;
  }

  return false;
}
