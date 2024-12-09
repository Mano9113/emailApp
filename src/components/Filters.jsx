import React, {useState} from 'react'

const Filters = ({onFilterChange}) => {
  const [activeFilter, setFilter] = useState('All');

  const handleFilterClick = (filter) => { 
    setFilter(filter);
    onFilterChange(filter);
  }
  return (
    <>  
        <div className='d-flex align-items-center gap-2 m-3'>
            <span>Filter By:</span>
            <button className={`btn ${activeFilter === 'All' ? 'btn-outline-primary' : 'btn-secondary'}`} 
                    onClick={() => handleFilterClick('All')}
                    >All
            </button>
            <button
                className={`btn ${activeFilter === 'Favourite' ? 'btn-outline-primary' : 'btn-secondary'}`}
                onClick={() => handleFilterClick('Favourite')}
              >
                Favourite
              </button>
              <button
                className={`btn ${activeFilter === 'Read' ? 'btn-outline-primary' : 'btn-secondary'}`}
                onClick={() => handleFilterClick('Read')}
              >
                Read
              </button>
              <button
                className={`btn ${activeFilter === 'Unread' ? 'btn-outline-primary' : 'btn-secondary'}`}
                onClick={() => handleFilterClick('Unread')}
              >
                Unread
              </button>
        </div>
    </>
  )
}

export default Filters