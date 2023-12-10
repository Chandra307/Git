const sendbtn = document.querySelector('#sendMsg');
const token = localStorage.getItem('token');
const cancelBtn = document.getElementById('cancel');
const chatBox = document.querySelector('.chats');
let exisChats = [];
let lastId = localStorage.getItem('lastId');
const oldChatsExist = localStorage.getItem('oldChatsExist');
const form = document.querySelector('form');
const form2 = document.getElementById('send');
const userList = document.querySelector('#userList');
// import FormData from "form-data";

const socket = io();
socket.on('connect', async _ => {
    try {
        await axios.post(`http://localhost:5000/user/update`, { connectionId: socket.id }, { headers: { "Authorization": token } });
        console.log(`connected with ${socket.id}`)
    } catch (err) {
        socket.disconnect();
        console.log(err, 'please reload the page');
    }
});
socket.on('member-added', (group, groupId) => {
    document.getElementById('grpList').innerHTML += `<li class='list-group-item' id='${group}' onclick='fetchChats(${groupId}, event)'>
        <div class='d-flex'><span class='h5 ms-3 me-4'><i class='bi bi-people'></i></span><h4>${group}</h4></div></li>`;
    socket.emit('join-group', groupId);
})
socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
})
socket.on('sent-msgs', (content) => {
    console.log(content);
    if (chatBox.id == content.groupId) {

        if (content.format === 'image/jpeg') {
            chatBox.innerHTML += `<div class="col-8 my-1">${content.sender}<div class="mt-1 mb-3"><img src="${content.message}" alt="alt" width="300" height="300" class="img-fluid rounded" /></div></div>`;
        } else {
            chatBox.innerHTML += `<div class="col-8 my-1">${content.sender} : ${content.message}`;
        }
    }
});

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
console.log(parseJwt(token));

async function sendMsg(grpId, e) {
    try {
        const message = document.querySelector('#comment').value;
        const files = document.getElementById('files').files;
        const formData = new FormData();
        console.log(files);
        for (let a = 0; a < files.length; a++) {
            formData.append('files', files[a]);
        }
        formData.set('message', message);
        const headers = {
            headers: {
                "Authorization": token,
                "Content-Type": "multipart/form-data"
            }
        };
        const { data } = await axios.post(`http://localhost:5000/group/newMsg?id=${grpId}`, formData, headers);
        document.querySelector('#comment').value = '';
        document.getElementById('files').value = '';
        console.log(data);
        data.forEach(chat => {
            socket.emit('new-msg', chat);
            // socket.emit('new-msg', data);
            let HTMLContent = `<div class="col-8 my-1">You : ${chat.message}`;
            if (chat.format === 'image/jpeg') {
                HTMLContent = `<div class="col-8 my-1">You<div class="mt-1 mb-3"><img src="${chat.message}" alt="alt" width="300" height="300" class="img-fluid rounded" /></div></div>`;
            }
            chatBox.innerHTML += HTMLContent;
        })
    }
    catch (err) {
        console.log(err);
    }
}
async function fetchGrpList() {
    try {
        const { data } = await axios.get('http://localhost:5000/user/groups', { headers: { "Authorization": token } });
        console.log(data);
        document.getElementById('grpList').innerHTML = '';
        data.groups.forEach(group => {
            socket.emit('join-group', group.id);
            document.getElementById('grpList').innerHTML += `<li class='list-group-item' id='${group.name}' onclick='fetchChats(${group.id}, event)'>
        <div class='d-flex'><span class='h5 ms-3 me-4'><i class='bi bi-people'></i></span><h4>${group.name}</h4></div></li>`;
        });
    }
    catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {

    // if (localStorage.getItem('chats')) {
    //     exisChats = localStorage.getItem('chats');

    // if (oldChatsExist) {
    //     chats.innerHTML = `<div class="d-flex justify-content-center mb-3"><button class='btn btn-warning btn-sm'>Load older messages</button></div>`;
    // }
    // exisChats = JSON.parse(exisChats);
    // exisChats.forEach(chat => {
    //     chats.innerHTML += `<div class="col-8 mb-1">${chat.sender} : ${chat.message}`;
    // });
    // lastId = exisChats[exisChats.length - 1].id;
    //     console.log(exisChats);
    //     displayChats(exisChats, oldChatsExist);
    // }
    // else {
    //     fetchChats(lastId);
    // }
    if (!token) {
        window.location.href = '../login/login.html';
    }
    // const { data } = await axios.get('http://localhost:5000/user/groups', { headers: { "Authorization": token } });
    // console.log(data);
    // data.groups.forEach(group => {
    //     document.getElementById('grpList').innerHTML += `<li class='list-group-item' id='${group.name}' onclick='fetchChats(${group.id}, event)'>
    //     <div class='d-flex'><span class='h5 ms-3 me-4'><i class='bi bi-people'></i></span><h4>${group.name}</h4></div></li>`;
    // });
    else {
        fetchGrpList();
    }
});

const interval = setInterval(
    () => {
        lastId = localStorage.getItem('lastId');
        fetchChats(lastId);
    }, 5000);
clearInterval(interval);

async function fetchChats(groupId, e) {
    try {
        const { data, data: { chats, oldChats } } = await axios.get(`http://localhost:5000/group/chats?id=${groupId}`, { headers: { "Authorization": token } });
        console.log(data.group);
        document.querySelector('.right').classList.remove('d-none');
        document.getElementById('grpName').textContent = data.group;
        chatBox.innerHTML = '';
        let sender = parseJwt(token).userName;
        console.log(sender);
        chatBox.id = groupId;
        // console.log(chats[0].createdAt, new Date(chats[0].createdAt).toDateString());
        chats.forEach(chat => {
            let user = chat.sender;
            if (chat.sender === sender) {
                user = 'You';
            }
            let HTMLContent = `<div class="col-8 my-1">${user} : ${chat.message}</div>`;
            if (chat.format.indexOf('image') >= 0) {
                HTMLContent = `<div class='col-8 my-1'>${user}<div class="mt-1 mb-3"><img src="${chat.message}" alt="alt" width="300" height="300" class="img-fluid rounded" /></div></div>`;
            }
            console.log(user);
            console.log(HTMLContent);
            chatBox.innerHTML += HTMLContent;
            // else {
            //     chatBox.innerHTML += `<div class="col-8 mb-1">${chat.sender} : ${chat.message}`;
            // }
            exisChats.push(chat);
        });
        sendbtn.setAttribute('onclick', `sendMsg(${groupId}, event)`);


        // localStorage.setItem('chats', JSON.stringify(exisChats));
        // localStorage.setItem('lastId', exisChats[exisChats.length - 1].id);
        // localStorage.setItem('oldChatsExist', oldChats);
        // displayChats(JSON.stringify(exisChats), oldChats);
        console.log(lastId, localStorage.getItem('lastId'));
    }
    catch (err) {
        console.log(err);
    }
}
function displayChats(chats, oldChatsExist) {
    console.log(oldChatsExist);
    if (oldChatsExist) {
        console.log(oldChatsExist);
        chatBox.innerHTML = `<div class="d-flex justify-content-center mb-3"><button class='btn btn-warning btn-sm'>Load older messages</button></div>`;
    }
    exisChats = JSON.parse(chats);
    console.log(exisChats);
    exisChats.forEach(chat => {
        chatBox.innerHTML += `<div class="col-8 my-1">${chat.sender} : ${chat.message}`;
    });
}

document.getElementById('createGrp').onclick = async () => {
    try {

        const { data } = await axios.get('http://localhost:5000/user/allusers', { headers: { "Authorization": token } });
        console.log(data);
        document.querySelector('.chatList').classList.toggle('d-none');
        document.querySelector('.group').classList.toggle('d-none');


        data.forEach((user, index) => {
            userList.innerHTML += `<li class="list-group-item createGrp"><div class="form-check">
            <input class="form-check-input" type="checkbox" name="participant" id="${user.id}" value="${user.id}">
            <label class="form-check-label" for="${user.id}">${user.name}</label>
            <div class="d-none">${user.phone}<div class="grandChild">${user.email}</div></div></div></li>`;
        })
    }
    catch (err) {
        console.log(err);
    }
}
cancelBtn.onclick = (e) => {
    userList.innerHTML = '';
    document.querySelector('.group').classList.toggle('d-none');
    document.querySelector('.chatList').classList.toggle('d-none');
}
const searchField = document.getElementById('searchUser');
searchField.oninput = () => {
    console.log(document.querySelectorAll('.createGrp'));
    document.querySelectorAll('.createGrp').forEach(li => {
        console.log(li.textContent.toLowerCase(), searchField.value);
        console.log(li.textContent.toLowerCase().indexOf(searchField.value.toLowerCase()) < 0);
        if (li.textContent.toLowerCase().indexOf(searchField.value.toLowerCase()) < 0) {
            li.classList.add('d-none');
        } else {
            li.classList.remove('d-none');
        }
    })
}
form.onsubmit = async (e) => {
    try {

        e.preventDefault();
        console.log(e.target);
        const name = e.target.name.value;
        const participants = [];
        let list = form.querySelectorAll('input[type="checkbox"]');
        console.log(list);
        list.forEach(item => { if (item.checked) participants.push(item.value); });
        console.log(participants);
        if (!participants.length) {
            alert('Please select atleast one participant to proceed!');
        }
        else {
            const groupDetails = {
                name, participants
            }
            const { data } = await axios.post('http://localhost:5000/group/participants', groupDetails, { headers: { "Authorization": token } });
            console.log(data);
            data.connections.forEach(connection => {
                console.log(data.details[0][0]);
                socket.emit('add-member', connection, data.details[0][0].group, data.details[0][0].groupId);
            })
            document.querySelector('.group').classList.toggle('d-none');

            document.querySelector('.chatList').classList.toggle('d-none');
            fetchGrpList();

        }
    }
    catch (err) {
        console.log(err);
    }
}
document.getElementById('bye').onclick = () => {
    window.location.href = '../login/login.html';
    localStorage.removeItem('token');
}