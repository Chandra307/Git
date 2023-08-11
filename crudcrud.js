function getDetails(event) {
  event.preventDefault();

  let Name = document.querySelector('#name').value;
  let Email = document.querySelector('#mail').value;
  let Phone = document.querySelector('#phone').value;
  let ul = document.querySelector('#users');

  function displayData(obj) {

    let li = document.createElement('li');

    li.appendChild(document
      .createTextNode(`${obj.Name} - ${obj.Email} - ${obj.Phone}`));

    ul.appendChild(li);
    li.style.listStyleType = 'disc';
  }

  let obj = {
    Name,
    Email,
    Phone
  }

  axios
    .post('https://crudcrud.com/api/e278d2279049467c9386814127fc000/appointmentData', obj)
    .then(response => {

      displayData(response.data); 
           
    })
    .catch(err => {
      document.body.innerHTML += '<h4>Something went wrong.</h4>';
      console.log(err);
    })

    document.querySelector('#name').value = '';
    document.querySelector('#mail').value = '';
    document.querySelector('#phone').value = '';
}
