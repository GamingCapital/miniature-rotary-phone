const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const onlineStatus = document.querySelector('.online');
var receive = new Audio('receive.mp3');
var send = new Audio('send.mp3');
var join = new Audio('join.mp3');
var leave = new Audio('leave.mp3');

const append = (message, position, userType=null) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    switch (position) {
        case 'left':
            receive.play();
        case 'right':
            send.play();
        case 'center':
            if (userType == "join") {
                join.play();
            } else {
                leave.play();
            }
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = ''
    }
})

const name = prompt("Enter your name to join");

socket.emit('new-user-joined', name);

onlineStatus.innerText = `${parseInt(onlineStatus.innerText.replace(' Users online', ''))+1} Users online`

socket.on('user-joined', data => {
    append(`${data.name} joined the chat`, 'center', 'join');
    onlineStatus.innerText = `${data.onlineUsers} Users online`
})

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

socket.on('onlineUsers', data => {
    onlineStatus.innerText = `${data.onlineUsers} Users online`
})

socket.on('left', data => {
    append(`${data.name} left the chat`, 'center', 'leave')
    onlineStatus.innerText = `${data.onlineUsers} Users online`
})