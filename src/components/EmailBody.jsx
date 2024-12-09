import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Filters from './Filters';
// import './style.css'; // Add CSS file for styling

const Controller = () => {
  const [list, setList] = useState([]); 
  const [details, setDetails] = useState(null); 
  const [selected, setSelected] = useState(null);  
  const [filteredList, setFilteredList] = useState([]);

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
        setFilteredList(updateList);
      })
      .catch(error => console.error('Error fetching email list:', error));
  }, []);

  const fetchDetails = (id) => {
    // Fetch email details based on the selected ID
    Axios.get(`https://flipkart-email-mock.now.sh/?id=${id}`)
      .then(response => {
        const updatedList = list.map(email =>
          email.id === id ? { ...email, isRead: true } : email 
        );
        setList(updatedList);
        setFilteredList(updatedList);
        const selectedEmail = updatedList.find(email => email.id === id);
        setSelected(selectedEmail);  
        setDetails(response.data);  
      })
      .catch(error => console.error('Error fetching email details:', error));
  };

  const handleFilterChange = (filter) => {
    if (filter === 'All') {
      setFilteredList(list);
    } else if (filter === 'Read') {
      setFilteredList(list.filter(email => email.isRead));
    } else if (filter === 'Unread') {
      setFilteredList(list.filter(email => !email.isRead));
    } else if (filter === 'Favourite') {
      setFilteredList(list.filter(email => email.isFavorite));
    }
  };

  const toggleFavorite = (id) => {
    const updatedList = list.map(email =>
      email.id === id ? { ...email, isFavorite: !email.isFavorite } : email
    );
    setList(updatedList);
    setFilteredList(updatedList);
  };

  return (
    <>
      <Filters onFilterChange={handleFilterChange} />
      <div className="m-3">
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
                  {email.isRead && <span className="badge bg-primary">Read</span>}
                  {email.isFavorite && <span className="badge bg-warning">Favorite</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Email Details */}
          <div className="col-6 email-details d-flex">
            {selected ? (
              <>
                <div className="email-initial" style={{ width: '18rem' }}>
                  {selected.from.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="details-header">
                    <h5>{selected.subject}</h5>
                    <p>{new Date(selected.date).toLocaleString()}</p>
                  </div>
                  {details ? (
                    <div
                      className="details-body"
                      dangerouslySetInnerHTML={{ __html: details.body }}
                    />
                  ) : (
                    <p>Loading email details...</p>
                  )}
                  <button
                    className={`mark-favorite btn ${selected.isFavorite ? 'btn-warning' : 'btn-secondary'}`}
                    onClick={() => toggleFavorite(selected.id)}
                  >
                    {selected.isFavorite ? 'Unmark Favorite' : 'Mark as Favorite'}
                  </button>
                </div>
              </>
            ) : (
              <p className="no-selection">Select an email to view details</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Controller;
