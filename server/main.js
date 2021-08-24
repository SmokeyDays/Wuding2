var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
require('jquery');
var crypto=require('crypto');

function hash(input){
    return crypto.createHash('md5').update(input).digest('hex');
}

app.use('/', require('express').static(path.join(__dirname, 'client')))

app.get('/',(req,res) => {
    console.log("app.get OK");
    res.sendFile(__dirname+'/client');
});

io.on('connection',(socket) => {
    var isLogin = {IsLogin: 0,UserName: undefined};
    console.log('访客连接服务器');
    socket.on('register req', (info) => {
        MongoClient.connect(url,{useUnifiedTopology: true,useNewUrlParser: true,poolSize: 10},(err,db) => {
            if(err){throw err;}
            var dbase = db.db("WD-db");
            dbase.collection("Users").find({'UserName': info.UserName}).toArray((err,res) => {
                if(err){throw err;}
                console.log(res);
                if(res[0] === undefined){
                    console.log("Isn's Exist.");
                    dbase.collection("Users").insertOne(info, (err,res) => {
                        if(err){throw err;}
                        console.log("User "+info.UserName+" has registered successfully.");
                        socket.emit('register suc');
                        db.close();
                    });
                }else{
                    console.log("User name "+info.UserName+" has been registered.");
                    socket.emit('register failed','用户名已被占用。');
                    db.close();
                }
            });
        });
    });
    socket.on('login req', (info) => {
        if(isLogin.IsLogin){io.emit("login failed", "已经登录一个用户名为 " + info.UserName + " 的账户");return;}
        console.log(info);
        MongoClient.connect(url,(err,db) => {
            if(err){throw err;}
            var dbase = db.db("WD-db");
            dbase.collection("Users").find({'UserName': info.UserName}).toArray((err,res) => {
                if(err){throw err;}
                console.log(res);
                
                if(res[0] === undefined || res[0].Password !== info.Password){
                    console.log("登录失败")
                    io.emit("login failed", "用户名或密码错误。");
                }else{
                    console.log("Login Successfully.");
                    io.emit("login suc");
                    isLogin.IsLogin = 1;
                    isLogin.UserName = info.UserName;
                }
                db.close();
            });
        });
    })
    socket.on('exit req', () => {
        if(!isLogin.IsLogin){io.emit("exit failed", "尚未登录。");console.log(1);return;}
        io.emit("exit suc",isLogin.UserName);
        isLogin = {IsLogin: 0,UserName: undefined};
    })
    socket.on('changePassword req', (info) => {
        if(!isLogin.IsLogin){io.emit("changePassword failed", "尚未登录。");return;}
        console.log(info);
        MongoClient.connect(url,(err,db) => {
            if(err){throw err;}
            var dbase = db.db("WD-db");
            dbase.collection("Users").find({'UserName': isLogin.UserName}).toArray((err,res) => {
                if(err){throw err;}
                console.log(res);
                if(res[0] === undefined || res[0].Password !== info.OldPassword){
                    io.emit("changePassword failed", "原密码错误。");
                    db.close();
                }else{
                    console.log("Change Password Successfully.");
                    io.emit("changePassword suc");
                    dbase.collection("Users").updateOne({'UserName': isLogin.UserName},{$set: {"Password": info.NewPassword}},(err1,res1) =>{
                        if(err1){throw err1;}
                        db.close();
                    });
                }
            });
        });
    })
});

http.listen(8888, () => {
    console.log("server has started at localhost:8888");
});
