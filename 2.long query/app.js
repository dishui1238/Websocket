let express = require("express");
let app = express();

app.use(express.static(__dirname));
// 当客户端访问 /clock 返回本地的时间
app.get("/clock", function (req, res) {
  let $timer = setInterval(function () {
    let date = new Date()
    let seconds = date.getSeconds()
    if(seconds%5 === 0){
      res.send(date.toLocaleString())
      clearInterval($timer)
    }
  }, 1000)
  // res.send(new Date().toLocaleString());
});
app.listen(8000);

// 启动 nodemon app.js 可以热更新
