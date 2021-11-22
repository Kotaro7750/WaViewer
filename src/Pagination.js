import React from 'react';

export class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }

  render() {
    const elementList = this.props.elementList;

    const maxElementNumberInPage = 36;
    const totalPageNumber = this.calculateTotalPageNumber(elementList.length, maxElementNumberInPage);

    let paginationNav = undefined;
    if (totalPageNumber > 1) {
      let paginationList = [];
      for (let i = 1; i <= totalPageNumber; ++i) {
        const className = i == this.state.currentPage ? 'page-item active' : 'page-item';
        paginationList.push(<li className={className} key={i}><a className='page-link' onClick={() => this.setState({ currentPage: i })}>{i}</a></li>);
      }

      paginationNav = (
        <nav className='m-5'>
          <ul className='pagination justify-content-center'>
            <li className='page-item'><a className='page-link' onClick={this.handlePrevious}>Previous</a></li>
            {paginationList}
            <li className='page-item'><a className='page-link'>Next</a></li>
          </ul >
        </nav >
      );
    }

    let renderedElement = [];
    for (let i = 0; i < maxElementNumberInPage; ++i) {
      const element = elementList[maxElementNumberInPage * (this.state.currentPage - 1) + i];
      renderedElement.push(element);
    }

    return (
      <div>
        <div className='row gy-5'>
          {renderedElement}
        </div>
        {paginationNav}
      </div>
    )
  }

  calculateTotalPageNumber = (elementListLength, maxElementNumberInPage) => {
    return Math.ceil(elementListLength / maxElementNumberInPage);
  }

  handlePrevious = () => {
    const currentPage = this.state.currentPage;
    let pageNumberAfterMove = currentPage == 1 ? 1 : currentPage - 1;
    this.setState({ currentPage: pageNumberAfterMove });
  }

  handleNext = () => {
    const currentPage = this.state.currentPage;
  }
}
