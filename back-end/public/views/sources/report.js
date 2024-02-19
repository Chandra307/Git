const token = localStorage.getItem('token');

document.getElementById('view').onchange = (e) => {
    const view = e.target.value;
    console.log(view);
    hideElements(view);
}
window.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        window.location.href = 'login.html';
    }
})
document.querySelector('#report').onclick = async (e) => {
    try {

        let prevElement = document.querySelector('#report').previousElementSibling;
        console.log(prevElement.style.display);

        if (prevElement.style.display == 'none') {
            while (prevElement.style.display === 'none') {
                prevElement = prevElement.previousElementSibling;
            }
        }
        console.log(prevElement, prevElement.style.display, prevElement.id, prevElement.value);
        // document.getElementById('daily').innerHTML = `<tr><th>Date</th><th>Description</th>
        //     <th>Category</th><th>Expense <br/>(in ₹)</th></tr>`;
        if (prevElement.id === 'month') {
            const month = prevElement.value;
            const { data: { expenses, amount } } = await axios.get(`/user/monthlyReport?month=${month}`, { headers: { "Authorization": token } });
            console.log(expenses, amount);
            document.getElementById('daily').innerHTML = `<tr><th>Date</th><th>Description</th>
            <th>Category</th><th>Expense (in ₹)</th></tr>`;
            let total = 0;
            expenses.forEach(expense => {
                total += expense.amount;
                document.getElementById('daily').innerHTML += `<tr><th scope='row'>${(expense.date).slice(0, 10)}</th>
                <td>${expense.description}</td><td>${expense.category}</td>
                <td align='right' style='padding-right: 4px;'>${expense.amount}.00</td></tr>`;
            })
            document.getElementById('daily').innerHTML += `<tr><td> </td><td> </td>
            <th scope='row'>Total expenses</th><td align='right'>${total}.00</td></tr>`;
        }
        else if (prevElement.id === 'date') {
            //     while(prevElement.style.display === 'none'){
            //         prevElement = prevElement.previousElementSibling;
            //     }
            //     console.log(prevElement.type, prevElement.value);
            const date = document.getElementById('date').value;
            const { data: { expenses, amount } } = await axios.get(`/user/dailyReport?date=${date}`, { headers: { "Authorization": token } });
            console.log(date, expenses, amount);
            
            document.getElementById('daily').innerHTML = `<tr><th>#</th><th>Description</th>
            <th>Category</th><th>Expense (in ₹)</th></tr>`;
            let total = 0;
            expenses.forEach((expense, index) => {
                total += expense.amount;
                document.getElementById('daily').innerHTML += `<tr><th scope='row'>${index + 1}</th>
                <td>${expense.description}</td><td>${expense.category}</td>
            <td align='right'>${expense.amount}.00</td></tr>`;
            });
            document.getElementById('daily').innerHTML += `<tr><td> </td><td> </td>
            <th scope='row'>Total expenses</th><td align='right'>${total}.00</td></tr>`;
        }
        else {
            const start = document.getElementById('start').value;
            const end = document.getElementById('end').value;
            const { data: { expenses } } = await axios.get(`/user/weeklyReport?start=${start}&end=${end}`, { headers: { "Authorization": token } });
            console.log(expenses);
            document.getElementById('daily').innerHTML = `<tr><th>Date</th><th>Description</th>
            <th>Category</th><th>Expense (in ₹)</th></tr>`;
            let total = 0;
            expenses.forEach(expense => {
                total += expense.amount;
                document.getElementById('daily').innerHTML += `<tr><th scope='row'>${(expense.date).slice(0, 10)}</th>
                <td>${expense.description}</td><td>${expense.category}</td>
                <td align='right'>${expense.amount}.00</td></tr>`;
            })
            document.getElementById('daily').innerHTML += `<tr><td> </td><td> </td>
            <th scope='row'>Total expenses</th><td align='right'>${total}.00</td></tr>`;
        }
    }
    catch (err) {
        console.log(err);
        alert(err.response.data);
    }
}

// document.getElementById('month').oninput = async (e) => {
//     console.log(e.target);
//     try {
//         const month = document.getElementById('month').value;
//         console.log(month);
//         const { data } = await axios.get(`http://localhost:3000/user/monthlyReport?month=${month}`, { headers: { "Authorization": token } });
//         console.log(date);
//     }
//     catch (err) {
//         console.log(err);
//     }
// }

document.getElementById('year').oninput = async (e) => {
    console.log(e.target);
    try {
        const year = document.getElementById('year').value;
        const { data: { expenses } } = await axios.get(`/user/annualReport?year=${year}`, { headers: { "Authorization": token } });
        document.getElementById('annual').innerHTML = `<tr><th>Month</th><th>Expense (in ₹)</th></tr>`;
        let total = 0;
        expenses.forEach(expense => {
            total += expense.amount;
            document.getElementById('annual').innerHTML += `<tr><td>${getMonth(expense._id)}</td>
                <td align='right'>${expense.amount}.00</td></tr>`
        });

        document.getElementById('annual').innerHTML += `<tr><th scope='row'>Total expenses</th>
        <td align='right'>${total}.00</td></tr>`;
    }
    catch (err) {
        console.log(err);
    }
}

document.getElementById('download').onclick = async () => {
    try {
        const { data } = await axios.get('/user/downloadfile', { headers: { "Authorization": token } });
        console.log(data);
        window.print();
        const a = document.createElement('a');
        a.href = data;
        a.download = 'expenses.csv';
        a.click();
        
    }
    catch (err) {
        console.log(err);
    }
}

function hideElements(view) {
    if (view == 'DAILY') {
        document.getElementById('date').removeAttribute('style');
        document.getElementById('month').style.display = 'none';
        document.getElementById('week').style.display = 'none';
    }
    else if (view == 'MONTHLY') {
        console.log('in here');
        document.getElementById('month').removeAttribute('style');
        document.getElementById('date').style.display = 'none';
        document.getElementById('week').style.display = 'none';
    }
    else {
        console.log('in else block');
        document.getElementById('week').removeAttribute('style');
        document.getElementById('date').style.display = 'none';
        document.getElementById('month').style.display = 'none';
    }
}

function getMonth(value) {
    switch (value) {
        case 1:
            return "January";
        case 2:
            return 'February';
        case 3:
            return 'March';
        case 4:
            return 'April';
        case 5:
            return 'May';
        case 6:
            return 'June';
        case 7:
            return 'July';
        case 8:
            return 'August';
        case 9:
            return 'September';
        case 10:
            return 'October';
        case 11:
            return 'November';
        case 12:
            return 'December';
        default:
            return 'nil'
    }
}