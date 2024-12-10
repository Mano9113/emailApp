import React from 'react';

const Filters = ({ activeFilter, onFilterChange }) => {
  const filters = ['All', 'Favourite', 'Read', 'Unread'];

  return (
    <div className="d-flex align-items-center gap-2 m-3">
      <span>Filter By:</span>
      {filters.map((filter) => (
        <button
          key={filter}
          className={`btn ${activeFilter === filter ? 'btn-outline-primary' : 'btn-secondary'}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default Filters;
