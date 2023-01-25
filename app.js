const express = require('express');
const app = express();
var fs = require('fs');
var html = fs.readFileSync('index.html');

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", function(req, res) {
	res.header('Content-Type', 'text/html' );
	res.send(html);
});

server = app.listen(3000);

const io = require('socket.io')(server)

const users = {};

io.on('connection', socket =>{
    socket.on( 'new-user-joined', name =>{
        console.log("New user",name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: user[socket.id]})
    });
})
