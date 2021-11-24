import React from 'react';
import { useWorkInformationList } from './FileUtil.js';
import { WorkList } from './WorkList.js';

export function RandomGallery() {
  const workInformationList = useWorkInformationList();

  const workNumber = 8;
  const extractedWorkInformationList = extractWorkInformationRandomly(workInformationList, workNumber);

  return (
    <WorkList workInformationList={extractedWorkInformationList} />
  )
}


function extractWorkInformationRandomly(workInformationList, n) {
  const workInformationListLength = workInformationList.length;

  // 必要な量よりも少なかった場合には全てを返す
  if (workInformationListLength <= n) {
    return workInformationList;
  }

  let extractedWorkInformationList = [];

  let duplicateCheker = {};
  for (let i = 0; i < n; i++) {
    let randomIndex = Math.floor(Math.random() * workInformationListLength);

    while (randomIndex in duplicateCheker) {
      randomIndex = Math.floor(Math.random() * workInformationListLength);
    }

    extractedWorkInformationList.push(workInformationList[randomIndex]);
    duplicateCheker[randomIndex] = true;
  }

  return extractedWorkInformationList;
}
