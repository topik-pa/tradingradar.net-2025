/* eslint-disable no-undef */

const form = document.forms[0];
form.addEventListener('submit', formSubmit);

async function formSubmit(event) {
  event.preventDefault();
  const data = {
    email: document.querySelector('input[type="email"]').value,
    password: document.querySelector('input[type="password"]').value
  };
  try {
    const response = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    if(response.status === 200) {
      document.location = '/';
      return;
    }
    document.querySelector('.errors').innerText = result.error;
  } catch (error) {
    document.querySelector('.errors').innerText = 'Something wrong';
  }
}