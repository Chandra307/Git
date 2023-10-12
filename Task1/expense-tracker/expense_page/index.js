const ul = document.getElementById('expenses');
const token = localStorage.getItem('token');

document.querySelector('form').onsubmit = async (e) => {
    try {
        e.preventDefault();

        if (document.querySelector('#error')) {
            document.querySelector('#error').remove();
        }

        const expenseDetails = {
            amount: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value
        };
        e.target.reset();
        console.log(expenseDetails);

        const response = await axios.post('http://localhost:3000/expense/addexpense', expenseDetails, { headers: { "Authorization": token } });
        displayExpenses(response.data);
    }
    catch (err) {
        document.querySelector('form').innerHTML += `<p id='error' style='color: red;'>${err}</p>`;
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {

        console.log(token);
        const {data} = await axios.get('http://localhost:3000/expense/getexpenses', { headers: { "Authorization": token } });
        data.expenses.forEach(expense => {
            displayExpenses(expense);
        })
        if (data.premium) {
            
            showLeaderboard();
            document.getElementById('premium').remove();
            document.querySelector('.premium').textContent = 'Premium User';
        }
        else {
            document.getElementById('premium').removeAttribute('style');
            document.getElementById('premium').style.marginLeft = '1rem';
        }
        if(data.files.length){

            data.files.forEach(file => {
                document.querySelector('#downloads').innerHTML += `<li><a href='${file.fileUrl}'>${new Date(file.createdAt).toLocaleString()}</a></li>`;               
            })
        }
    }
    catch (err) {
        console.log(err);
    }
})

document.getElementById('premium').onclick = async (e) => {
    try {
        // e.preventDefault();

        const response = await axios.get('http://localhost:3000/premium/purchase', { headers: { "Authorization": token } });
        var options = {
            "key": response.data.key_id,
            "name": "Pocket Tracker",
            "order_id": response.data.order.id,
            "theme": {
                "color": "#3399cc"
            },
            "handler": async function (result) {
                try {
                    await axios.post('http://localhost:3000/premium/updateStatus', {
                        order_id: options.order_id,
                        payment_id: result.razorpay_payment_id
                    }, { headers: { "Authorization": token } });

                    alert('You are a premium user now!');
                    document.getElementById('premium').remove();
                    showLeaderboard();
                    document.querySelector('.premium').textContent = 'Premium User';
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', async function ({ error: { metadata } }) {
            console.log(metadata, 'failure it is');
            try {
                await axios.post('http://localhost:3000/premium/updateStatus', {
                    status: "failed",
                    order_id: options.order_id,
                    payment_id: metadata.payment_id
                }, { headers: { "Authorization": token } });
                alert('Sorry, payment failed!');
            }
            catch (err) {
                console.log(err);
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}

function displayExpenses(obj) {
    ul.innerHTML += `<li id='${obj.id}'>₹${obj.amount} - ${obj.description} - ${obj.category}
                <button onclick='deleteExpense(${obj.id})'>Delete Expense</button></li>`;    
}

function showLeaderboard() {

    document.getElementById('leader').removeAttribute('style');
    // document.querySelector('#leader').style.marginLeft = '1rem';
    document.getElementById('download').style.marginLeft = '1rem';

    document.querySelector('#leader').onclick = async (e) => {
        try {
            document.getElementById('leaderboard').innerHTML = `<h2 style='font-family: arial;'>Leaderboard</h2>`;

            const response = await axios.get('http://localhost:3000/premium/leaderboard');
            response.data.forEach(detail => {
                document.getElementById('leaderboard').innerHTML += `<li id='${detail.name}' style='font-size: 1.1rem;'>${detail.name} - Total expenses: ₹${Number(detail.totalExpenses)}</li>`;
            });
        }
        catch (err) {
            console.log(err);
        }
    }
}

async function deleteExpense(id) {
    try {

        if (document.querySelector('#error')) {
            document.querySelector('#error').remove();
        }

        const token = localStorage.getItem('token');
        if (confirm('Delete this expense?')) {

            await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`, { headers: { "Authorization": token } });
            document.getElementById(id).remove();
        }
    }
    catch (err) {
        console.log(err);
        ul.innerHTML += `<h3 id='error' style='color: red; font-family: sans-serif;'>${err.response.data}</h3>`;
    }
}

// document.getElementById('report').onclick = ()=>{
//     window.location.href = '../report.html';
// }

document.getElementById('download').onclick = async () => {
    try {
        const { data } = await axios.get('http://localhost:3000/user/download', { headers: { "Authorization": token } });
        console.log(data);
        const a = document.createElement('a');
        a.href = data;
        a.download = 'expenses.csv';
        a.click();
    }
    catch (err) {
        console.log(err);
    }
}
