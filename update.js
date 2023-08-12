let ul = document.querySelector('#users');
let button = document.querySelector('.btn');

function displayData(obj) {
    let childHTML = `<li id='${obj._id}'>${obj.Name} - ${obj.Email} - ${obj.Phone}
        <button onclick = deleteUser('${obj._id}')>Delete User</button>
        <button onclick = editUser('${obj._id}','${obj.Name}','${obj.Email}','${obj.Phone}')>Edit User</button>
        
        </li>`;
        ul.innerHTML += childHTML;
    }
function deleteUser(userId) {
    axios
        .delete(`https://crudcrud.com/api/bb4198e946774a28b7ed3b42a60a028e/appointmentData/${userId}`)
        .then(() => document.getElementById(userId).remove())
        .catch(err => console.log(err));
}
function editUser(userId,name,mail,phone) {

    document.getElementById(userId).remove();
    document.getElementById('name').value = name;
    document.getElementById('mail').value = mail;
    document.getElementById('phone').value = phone;

    button.addEventListener('click', (f) => {
        f.preventDefault();
        let obj = {
            
            Name: document.getElementById('name').value,
            Email: document.getElementById('mail').value,
            Phone: document.getElementById('phone').value
        }
        axios
            .put(`https://crudcrud.com/api/bb4198e946774a28b7ed3b42a60a028e/appointmentData/${userId}`, obj)
            .then(() => {
                axios.get(`https://crudcrud.com/api/bb4198e946774a28b7ed3b42a60a028e/appointmentData/${userId}`)
                .then(res => displayData(res.data))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    })

}

window.addEventListener('DOMContentLoaded', () => {
    axios.get(`https://crudcrud.com/api/bb4198e946774a28b7ed3b42a60a028e/appointmentData`)
        .then(response => {
            for (let a = 0; a < response.data.length; a++) {
                displayData(response.data[a]);
            }
        })
        .catch(err => console.log(err));
})
function getDetails(event) {

    event.preventDefault();
    let obj = {
        Name: document.querySelector('#name').value,
        Email: document.querySelector('#mail').value,
        Phone: document.querySelector('#phone').value
    }

    axios
        .post(`https://crudcrud.com/api/bb4198e946774a28b7ed3b42a60a028e/appointmentData`, obj)
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


