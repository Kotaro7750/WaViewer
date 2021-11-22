import React from 'react';
import { WorkList } from './WorkList.js';

export class WorkGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workInformationList: []
    }

    this.fetchWorkInformationList();
  }

  render() {
    return (
      <div>
        <div className='row'>
          <WorkList workInformationList={this.state.workInformationList} />
        </div>
      </div>
    )
  }

  fetchWorkInformationList = () => {
    const origin = new URL(window.location.href).origin;
    const url = origin + '/works.json';

    fetch(url).then(response => {
      return response.json();
    }).then(json => {
      this.setState({ workInformationList: json });
    });
  }
}
