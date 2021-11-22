import React from 'react';
import { Thumbnail } from './Thumbnail.js';
import { Pagination } from './Pagination.js';

export class WorkList extends React.Component {
  render() {
    const workInformationList = this.props.workInformationList;

    let workThumbnailList = [];

    workInformationList.forEach(workInformation => {
      workThumbnailList.push(
        <div key={workInformation.id} className='col-xl-3 col-lg-4 col-md-6 col-12'>
          <Thumbnail workInformation={workInformation} />
        </div>
      )
    });

    return (
      <div className='row'>
        <Pagination elementList={workThumbnailList} />
      </div>
    )
  }
}
