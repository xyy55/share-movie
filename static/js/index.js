const socketClient = io('http://0.0.0.0:233/', {
  reconnection: false
}); //发起连接
const dp = new DPlayer({
  container: document.getElementById('dplayer'),
  danmaku: true,
  live: true,
  apiBackend: {
    read: function (option, callback) {
      console.log('Pretend to connect WebSocket',option);
      option.success();
    },
    send: function (option, callback) {
      socketClient.emit('danmu',option.data)
    },
  },
  video: {
    url: 'https://10848.vcdn.pplive.cn/37850f6d3dc4c60ca25d60ceaa372f9f.mp4?type=tv.android&w=1&k=6e42ef9b186ea02abcfa1fe63e8cf0f2-8f31-1589905420%26segment%3D86e6663d_86e66711_1589891020%26bppcataid%3D94',
    type: 'hls',
  }
});
socketClient.emit('init');
socketClient.on('connected', () => {
  console.log("连接成功")
})
dp.on('play', function () {
  socketClient.emit('play');
});
socketClient.on("set_time",(data)=>{
  console.log(data)
  dp.seek(data/1000);
})
socketClient.on("set_danmu",(data)=>{
  console.log(data)
  dp.danmaku.draw(data);
})