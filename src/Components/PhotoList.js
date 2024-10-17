import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1); // Track current pagenpm i axios
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (searchQuery) {
          response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { client_id: 'EZXNYt5y78Cie8BWMpoT5WpiIBtZgBNmoLMiv7aI9fQ', query: searchQuery, page, per_page: 10 }
          });
        } else {
          response = await axios.get('https://api.unsplash.com/photos', {
            params: { client_id: 'EZXNYt5y78Cie8BWMpoT5WpiIBtZgBNmoLMiv7aI9fQ', page, per_page: 10 }
          });
        }
        if (searchQuery) {
          setPhotos(response.data.results);
        } else {
          setPhotos(response.data);
        }
        // Extract total pages from headers
        const totalPagesHeader = response.headers['x-total'];
        const perPage = response.config.params.per_page;
        setTotalPages(Math.ceil(totalPagesHeader / perPage));
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchData();
  }, [page, searchQuery]);

  const handleSearch = () => {
    setPage(1); // Reset page to 1 when performing a new search
  };

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="photo-list-container">
      <h2 className='position-relative top-0 start-50 translate-middle'>Photos</h2>
      <div className="search-container d-flex " role='search'>
        <input
         className="form-control me-2 mx-auto" 
          type="search"
          aria-label="Search"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleChange}
        />
        <button onClick={handleSearch} className='btn btn-outline-success' type='submit'>Search</button>
      </div>
      <div className="container my-5  ">
        <div className="row row-cols-2 row-cols-lg-3 g-2 g-lg-3 my-3">
          {photos.map(photo => (
            <div className="col" key={photo.id}>
              <div className="card">
                <img src={photo.urls.small} className="card-img-top" alt={photo.alt_description} />
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1} className={`page-item ${page === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default PhotoList;
