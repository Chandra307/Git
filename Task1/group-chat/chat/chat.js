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