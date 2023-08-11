let ul = document.querySelector('#users');
let ID = [];

function deleteUser(email){
    
    document.getElementById(email).remove();
    for( let a = 0; a < ID.length; a++ ){
        if( ID[a].Email === email) {
            axios.delete(`https://crudcrud.com/api/b389c9876b6145edbb24c1ab6e3bda83/appointmentData/${ID[a]._id}`)
            .catch(err => console.log(err))
        }
    }
    
}
function displayData(obj) {
    
    childHTML=`<li id=${obj.Email}>${obj.Name} - ${obj.Email} - ${obj.Phone}
    <button onclick=deleteUser('${obj.Email}')>Delete User</button>
    </li>`;
    ul.innerHTML += childHTML;


    // let li = document.createElement('li');

    // li.appendChild(document
    //     .createTextNode(`${obj.Name} - ${obj.Email} - ${obj.Phone}`));

    //     ul.appendChild(li);
        // li.style.listStyleType = 'disc';
    }
    
    window.addEventListener('DOMContentLoaded', () => {
        axios.get("https://crudcrud.com/api/b389c9876b6145edbb24c1ab6e3bda83/appointmentData")
        .then(response => {
            for (let a = 0; a < response.data.length; a++) {
                displayData(response.data[a]);
                ID.push(response.data[a]);
            }
        })
        .catch(err => console.log(err));
        // console.log(ID);
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
        .post('https://crudcrud.com/api/b389c9876b6145edbb24c1ab6e3bda83/appointmentData', obj)
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


