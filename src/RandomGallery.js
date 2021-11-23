import React from 'react';
import { fetchWorkInformationList } from './FileUtil.js';
import { WorkList } from './WorkList.js';

export class RandomGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workInformationList: []
    };

    fetchWorkInformationList().then(json => this.setState({workInformationList:json}));
  }

  render() {
    const workNumber = 8;
    const extractedWorkInformationList = this.extractWorkInformationRandomly(workNumber);

    return (
      <WorkList workInformationList={extractedWorkInformationList} />
    )
  }

  extractWorkInformationRandomly = (n) => {
    const workInformationList = this.state.workInformationList;
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
}
