const sendbtn = document.querySelector('button');
const token = localStorage.getItem('token');

sendbtn.onclick = async () => {
    try {
        const message = document.querySelector('input').value;
        const { data } = await axios.post('http://localhost:5000/user/chat', { message }, { headers: { "Authorization": token } });
        console.log(data);
    }
    catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data } = await axios.get('http://localhost:5000/user/chats');
        console.log(data);
    }
    catch (err) {
        console.log(err);
    }
})