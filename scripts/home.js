/* eslint-disable no-undef */

const form = document.forms[0];
form.addEventListener('submit', formSubmit);

async function formSubmit(event) {
  event.preventDefault();
  const data = {
    q: document.querySelector('input[type="text"]').value
  };
  try {
    /*const response = await fetch('/', {
      method: 'GET'
    });*/

    // const result = await response.json();
    // if(response.status === 200) {
    document.querySelector('.feedback-html').innerHTML = '[html ]Hai cercato: ' + data.q;
    document.querySelector('.feedback-text').innerText = '[text ]Hai cercato: ' + data.q;
    document.querySelector('#hidden-input').setAttribute('value', data.q);
    document.title = document.title + '| Hai cercato: ' + data.q;
    // }
  } catch (error) {
    document.querySelector('.errors').innerText = 'Something wrong:' + error;
  }
}
