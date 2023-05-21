const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Function to check if a credit card number is valid using Luhn's algorithm
function isCardNumberValid(cardNumber) {
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// Validate the expiration date
function validateExpirationDate(expirationDate) {  
  const currentDate = new Date();
  return expirationDate > currentDate;
}

// Validate the CVV length based on the card type
function validateCvvLength(cardNumber, cvv) {
  const isAmericanExpress = cardNumber.startsWith('34') || cardNumber.startsWith('37');
  const requiredCvvLength = isAmericanExpress ? 4 : 3;
  return cvv.length === requiredCvvLength;
}

// Validate the PAN (card number) length
function validatePanLength(cardNumber) {
  const panLength = cardNumber.replace(/\s/g, '').length;
  return panLength >= 16 && panLength <= 19;
}

app.post('/validate-card', (req, res) => {
  // Get the credit card data from the request body
  const { number, expiration, cvv } = req.body;
  // Validate the PAN (card number) length
  if (!validatePanLength(number)) {
    return res.status(400).json({ message: 'Invalid card number length' });
  }

  // Validate the PAN (card number) using Luhn's algorithm
  const cardNumber = number.replace(/\s/g, ''); // Remove whitespace from the card number
  if (!isCardNumberValid(cardNumber)) {
    return res.status(400).json({ message: 'Invalid card number' });
  }
  // Validate the expiration date
  if (!validateExpirationDate(new Date(expiration))) {
    return res.status(400).json({ message: 'The card has expired' });
  }

  // Validate the CVV length based on the card type
  if (!validateCvvLength(number, cvv)) {
    return res.status(400).json({ message: 'Invalid CVV length' });
  }

  // If everything is successful, return a success response
  res.json({ message: 'Valid card' });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
