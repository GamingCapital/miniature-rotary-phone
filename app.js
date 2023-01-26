const express = require('express');
const app = express();
var fs = require('fs');
var html = fs.readFileSync('index.html');

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.header('Content-Type', 'text/html');
    res.send(html);
});

server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Success! Your application is running on port ${process.env.PORT || 8080}.`);
});

const io = require('socket.io')(server)

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', { name: name, onlineUsers: Object.keys(users).length });
    });

    setInterval(function () {
        socket.broadcast.emit('onlineUsers', { onlineUsers: Object.keys(users).length })
    }, 50);

    socket.on('send', message => {
        console.log(`New message from ${users[socket.id]} : ${message}`)
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    socket.on('disconnect', () => {
        console.log(`${users[socket.id]} got disconnect!`)
        socket.broadcast.emit('left', { name: users[socket.id], onlineUsers: Object.keys(users).length })
        delete users[socket.id]
    });
})