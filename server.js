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
    console.log(Object.keys(io.sockets.sockets).length)
    socket.emit('connected');
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
})

