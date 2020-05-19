const express = require('express');
const app = express();
let server = require('http'); //创建服务器
server = server.createServer(app);
const io = require('socket.io').listen(server); //socket监听服务器
const port = process.env.PORT || 520;
server.listen(port, function () { //服务器监听端口
  console.log('Server listening at port %d', port);
});
app.use(express.static('./static'));
app.get('/', function (req, res) { //创建主页
  res.sendFile(__dirname + "/" + "index.html");
});

let start_time = ''

io.on('connection', function (socket) {
  socket.on("init", function (data) {
    let user_num = Object.keys(io.sockets.sockets).length
    console.log(user_num)
    socket.emit('connected');
    for(let i in io.sockets.sockets){
      soc = io.sockets.sockets[i]
      soc.emit("update_user_num",user_num)
    }
  });
  socket.on("play",()=>{
    let time = new Date().getTime()
    if(start_time == ''){
      start_time = time
      socket.emit('set_time',0)
    }else{
      let current_time = time - start_time
      socket.emit('set_time',current_time)
    }
  })
  socket.on('danmu',(data) => {
    for(let i in io.sockets.sockets){
      soc = io.sockets.sockets[i]
      if(soc != socket){
        soc.emit("set_danmu",data)
      }
    }
  })
  socket.on('disconnect',()=>{
    let user_num = Object.keys(io.sockets.sockets).length
    for(let i in io.sockets.sockets){
      soc = io.sockets.sockets[i]
      if(soc != socket){
        soc.emit("update_user_num",user_num)
      }
    }
  })
})

