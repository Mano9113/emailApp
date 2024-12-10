import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Filters from './Filters';

const Controller = () => {
  const [list, setList] = useState([]); 
  const [details, setDetails] = useState(null); 
  const [selected, setSelected] = useState(null);  
  const [filteredList, setFilteredList] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All'); // Track the active filter

  useEffect(() => {
    // Fetch the email list on component mount
    Axios.get('https://flipkart-email-mock.now.sh/')
      .then((response) => {
        const updateList = response.data.list.map(email => ({
          ...email,
          isRead: false,
          isFavorite: false,
        }));
        setList(updateList);
        setFilteredList(updateList); // Default to all emails
      })
      .catch(error => console.error('Error fetching email list:', error));
  }, []);

  const fetchDetails = (id) => {
    // Fetch email details based on the selected ID
    Axios.get(`https://flipkart-email-mock.now.sh/?id=${id}`)
      .then(response => {
        const updatedList = list.map(email =>
          email.id === id ? { ...email, isRead: true } : email // Mark email as read
        );
        setList(updatedList);
        setFilteredList(
          updatedList.filter((email) => filterEmail(email, activeFilter)) // Reapply filter
        );
        setSelected(id); // Track the selected email ID
        setDetails(response.data);
      })
      .catch(error => console.error('Error fetching email details:', error));
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter); // Update active filter
    setFilteredList(list.filter((email) => filterEmail(email, filter)));
  };

  // Helper function to apply filter conditions
  const filterEmail = (email, filter) => {
    if (filter === 'All') return true;
    if (filter === 'Read') return email.isRead;
    if (filter === 'Unread') return !email.isRead;
    if (filter === 'Favourite') return email.isFavorite;
    return false;
  };

  const toggleFavorite = (id) => {
    const updatedList = list.map(email =>
      email.id === id ? { ...email, isFavorite: !email.isFavorite } : email
    );
    setList(updatedList);
    setFilteredList(
      updatedList.filter((email) => filterEmail(email, activeFilter)) // Reapply filter
    );
  };

  return (
    <>
      <Filters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      <div className="row">
        {/* Email List */}
        <div className="col-6 email-list">
          {filteredList.map(email => (
            <div
              className={`email-box d-flex ${selected === email.id ? 'selected' : ''}`}
              key={email.id}
              onClick={() => fetchDetails(email.id)}
            >
              <div className="email-initial">
                {email.from.email.charAt(0).toUpperCase()}
              </div>
              <div className="email-info">
                <p><strong>From:</strong> {email.from.email}</p>
                <p><strong>Subject:</strong> {email.subject}</p>
                <p>{email.short_description}</p>
                <p>{new Date(email.date).toLocaleString()}</p>
                {email.isRead && <span className="badge bg-primary me-2">Read</span>}
                {email.isFavorite && <span className="badge bg-warning">Favorite</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Email Details */}
        <div className="col-6 email-details">
          {selected ? (
            <>
              <div className="email-initial">
                {list.find(email => email.id === selected).from.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="details-header d-flex justify-content-between align-items-baseline">
                  <div>
                  <h5>{list.find(email => email.id === selected).subject}</h5>
                  <p>{new Date(list.find(email => email.id === selected).date).toLocaleString()}</p>
                  </div>
                  <div>

                  <button
                  className={`mark-favorite btn btn-sm ${list.find(email => email.id === selected).isFavorite ? 'btn-warning' : 'btn-secondary'}`}
                  onClick={() => toggleFavorite(selected)}
                >
                  {list.find(email => email.id === selected).isFavorite ? 'Unmark Favorite' : 'Mark as Favorite'}
                </button>
                </div>

                </div>
                {details ? (
                  <div
                    className="details-body"
                    dangerouslySetInnerHTML={{ __html: details.body }}
                  />
                ) : (
                  <p>Loading email details...</p>
                )}

              </div>
            </>
          ) : (
            <p className="no-selection">Select an email to view details</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Controller;
