const express = require('express')
const morse = require('morse');
const path = require('path')
const app = express();
const port = process.env.PORT || 5000;
process.env.DEBUG = true

const publicPath = path.resolve(__dirname, 'public')
console.log(`static files path: ${publicPath}`)
app.use(express.static(publicPath));

const io = require('socket.io').listen(app.listen(port));
console.log('Listening on port ' + port);

io.sockets.on('connection', function (socket)
{
    socket.on('room', function(room)
    {
        socket.join(room);
    });
    socket.on('send', function (data)
    {
        data.message = '<span class="red">' + data.message + ':</span> ' + morse.encode(data.message).replace(/\.\.\.\.\.\.\./g, '   ');
        io.sockets.in(data.room).emit('message', data); // to other users + self
    });
    socket.on('beep', function(data)
    {
        socket.broadcast.to(data.room).emit('beep', data.len);
    });
});