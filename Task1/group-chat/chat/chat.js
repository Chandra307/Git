const sendbtn = document.querySelector('button');
const token = localStorage.getItem('token');
const chats = document.querySelector('.chats');
let exisChats = [];
let lastId = localStorage.getItem('lastId');

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

window.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem('chats')) {
        exisChats = localStorage.getItem('chats');
    }
    console.log(exisChats, typeof exisChats);
    chats.innerHTML = `<div class="d-flex justify-content-center mb-3"><button class='btn btn-warning btn-sm'>Load older messages</button></div>`;
    if (exisChats.length) {

        exisChats = JSON.parse(exisChats);
        exisChats.forEach(chat => {
            chats.innerHTML += `<div class="col-8 mb-1">${chat.sender} : ${chat.message}`;
        });
        lastId = exisChats[exisChats.length - 1].id;
    }
    console.log(lastId);
    displayChats(lastId);
});

const interval =
    setInterval(() => {
        lastId = localStorage.getItem('lastId');
        displayChats(lastId);
    }, 1000);
clearInterval(interval);

async function displayChats(lastId) {
    try {
        const { data } = await axios.get(`http://localhost:5000/user/chats?id=${lastId}`);
        console.log(exisChats, typeof exisChats);
        data.forEach(chat => {
            chats.innerHTML += `<div class="col-8 mb-1">${chat.sender} : ${chat.message}`;
            exisChats.push(chat);
        });
        console.log(exisChats.length);
        if (exisChats.length > 10) {
            exisChats = exisChats.filter((chat, index) => index > (exisChats.length - 11) );
        }
        localStorage.setItem('chats', JSON.stringify(exisChats));
        localStorage.setItem('lastId', exisChats[exisChats.length - 1].id);
        console.log(lastId, localStorage.getItem('lastId'));

    }
    catch (err) {
        console.log(err);
    }
}