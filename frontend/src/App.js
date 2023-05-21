import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Modal from "../src/Modal"

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [cvv, setCVV] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleExpirationMonthChange = (event) => {
    setExpirationMonth(event.target.value);
  };

  const handleExpirationYearChange = (event) => {
    setExpirationYear(event.target.value);
  };

  const handleCVVChange = (event) => {
    setCVV(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cardNumber || !expirationMonth || !expirationYear || !cvv) {
      setModalMessage("Please fill in all fields.");
      setModalOpen(true);
      return;
    }
    // Create the request body
    const requestBody = {
      number: cardNumber,
      expiration: new Date(expirationYear, expirationMonth - 1, 1),
      cvv: cvv,
    };

    // Send the request to the backend API
    fetch('http://localhost:5000/validate-card', { // Cambia el puerto aquí
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then((response) => response.json())
    .then((data) => {
      setModalMessage(data.message);
      setModalOpen(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalMessage('');
  };


  return (
    <div className="container">
      <h1>Card Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="cardNumber" className="form-label">
            Card Number:
          </label>
          <input
            type="number"
            className="form-control"
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
          />
        </div>
        <div className="row">
          <div className="col-6 mb-3">
            <label htmlFor="expirationMonth" className="form-label">
              Expiration Month:
            </label>
            <select
              className="form-select"
              id="expirationMonth"
              value={expirationMonth}
              onChange={handleExpirationMonthChange}
            >
              <option value="">Select Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="col-6 mb-3">
            <label htmlFor="expirationYear" className="form-label">
              Expiration Year:
            </label>
            <input
              type="number"
              className="form-control"
              id="expirationYear"
              value={expirationYear}
              onChange={handleExpirationYearChange}
              min="1000"
              max="9999"
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="cvv" className="form-label">
            CVV:
          </label>
          <input
            type="number"
            className="form-control"
            id="cvv"
            value={cvv}
            onChange={handleCVVChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {validationMessage && (
        <div className="mt-3">
          <p>{validationMessage}</p>
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} message={modalMessage} />
    </div>
  );
}

export default App;
