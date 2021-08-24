var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('jquery');

app.get('/',function(req,res){
    res.sendFile(__dirname+"/index.html");
}); 

io.on('connection',function(socket){
    console.log("a user has connected");
    socket.on('disconnect',function(){
        console.log('a user has disconneted');
    });
    socket.on('chat message',function(msg){
        console.log('msg:' + msg);
        io.emit('chat message',msg);
    });
});

http.listen(7888, function(){
    console.log("Server has run at localhost:7888");
});