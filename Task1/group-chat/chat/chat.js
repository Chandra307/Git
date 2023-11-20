const sendbtn = document.querySelector('button');
const token = localStorage.getItem('token');
const chats = document.querySelector('.chats');

sendbtn.onclick = async () => {
    try {
        const message = document.querySelector('input').value;
        const { data } = await axios.post('http://localhost:5000/user/chat', { message }, { headers: { "Authorization": token } });
        document.querySelector('input').value = '';
        console.log(data);
    }
    catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', displayChats());

const interval = setInterval(displayChats, 1000);
clearInterval(interval);

async function displayChats() {
    try {
        const { data } = await axios.get('http://localhost:5000/user/chats');
        chats.innerHTML = '';
        data.forEach(chat => {
            chats.innerHTML += `<div class="col-8 mb-1">${chat.sender} : ${chat.message}`;
        })
    }
    catch (err) {
        console.log(err);
    }
}