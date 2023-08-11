let ul = document.querySelector('#users');
function displayData(obj) {

    let li = document.createElement('li');

    li.appendChild(document
        .createTextNode(`${obj.Name} - ${obj.Email} - ${obj.Phone}`));

        ul.appendChild(li);
        li.style.listStyleType = 'disc';
    }
    
    window.addEventListener('DOMContentLoaded', () => {
        axios.get("https://crudcrud.com/api/e278d2279049467c9386814127fcc000/appointmentData")
        .then(response => {
            for (let a = 0; a < response.data.length; a++) {
                displayData(response.data[a]);
            }
        })
        .catch(err => console.log(err))
    })
    function getDetails(event) {
        event.preventDefault();
        
        let Name = document.querySelector('#name').value;
        let Email = document.querySelector('#mail').value;
        let Phone = document.querySelector('#phone').value;
        
        
        let obj = {
            Name,
        Email,
        Phone
    }

    axios
        .post('https://crudcrud.com/api/e278d2279049467c9386814127fcc000/appointmentData', obj)
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


