import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const clearFilters = () => {
    const cleared = { query: '', category: '' };
    setSearchParams(cleared);
    onSearch(cleared);
  };

  return (
    <div className="bg-dark p-4 rounded mb-4">
      <form onSubmit={handleSearch}>
        <div className="row g-3">

          {/* Search Query */}
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search items..."
              value={searchParams.query}
              onChange={(e) =>
                setSearchParams({ ...searchParams, query: e.target.value })
              }
            />
          </div>

          {/* Category Filter */}
          <div className="col-md-3">
            <select
              className="form-select"
              value={searchParams.category}
              onChange={(e) =>
                setSearchParams({ ...searchParams, category: e.target.value })
              }
            >
              <option value="">All Categories</option>
              <option value="stationery">Stationery</option>
              <option value="calculators">Calculators</option>
              <option value="lab-equipment">Lab Equipment</option>
              <option value="textbooks">Textbooks</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-md-3">
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1">
                Search
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
