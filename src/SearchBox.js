import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SearchBox(props) {
  const navigate = useNavigate();
  const [artist, setArtist] = useState('');
  const [bookTitle, setBookTitle] = useState('');

  const constructURLParam = () => {
    let urlSearchParam = new URLSearchParams('');

    if (artist != '') {
      urlSearchParam.append('artist', artist);
    }

    if (bookTitle != '') {
      urlSearchParam.append('book_title', bookTitle);
    }

    return '?' + urlSearchParam.toString();
  }

  return (
    <div>
      <div>
        <label className='form-label'>
          Artist
        <input type='text' className='form-control' value={artist} onChange={e => setArtist(e.target.value)} />
        </label>
      </div>

      <div>
        <label className='form-label'>
          Book Title
          <input type='text' className='form-control' value={bookTitle} onChange={e => setBookTitle(e.target.value)} />
        </label>
      </div>
      <button className='btn btn-primary' onClick={() => navigate(constructURLParam())}>Search</button>
    </div>
  );
}
