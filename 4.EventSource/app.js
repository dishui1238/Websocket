/**
 * 
事件流的对应MIME格式为text/event-stream，而且其基于HTTP长连接。针对HTTP1.1规范默认采用长连接，针对HTTP1.0的服务器需要特殊设置。
event-source必须编码成utf-8的格式，消息的每个字段使用"\n"来做分割，并且需要下面4个规范定义好的字段：
Event: 事件类型
Data: 发送的数据
ID: 每一条事件流的ID
Retry： 告知浏览器在所有的连接丢失之后重新开启新的连接等待的时间，在自动重新连接的过程中，之前收到的最后一个事件流ID会被发送到服务端
 */

let express = require("express");
let app = express();
app.use(express.static(__dirname));
let sendCount = 1;
app.get("/eventSource", function (req, res) {
  res.header("Content-Type", "text/event-stream");
  let timer = setInterval(() => {
    // \n\n 表示整个消息的结束
    res.write(`event:message\nid:${sendCount++}\ndata:${Date.now()}\n\n`);
  }, 1000);

  res.on("close", function () {
    clearInterval(timer);
  });
});
app.listen(8000);
