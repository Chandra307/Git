const form = document.querySelector('form');

form.onsubmit = async (e) => {
    try {
        e.preventDefault();
        const email = e.target.mail.value;
        const password = e.target.password.value;
        const loginData = { email, password };
        const { data } = await axios.post('http://localhost:3000/user/login', loginData);
        console.log(data);
    }
    catch (err) {
        console.log(err);
        const messedUp = document.createElement('div');
        messedUp.className = '';
    }
}