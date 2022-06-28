/**
// 响应头
HTTP/1.1 101 Switching Protocols/r/n
Upgrade: websocket/r/n
Connection: Upgrade/r/n
Sec-WebSocket-Accept: ZwCU8sRg75zhFKU5EiO/9vXAAEk=/r/n
/r/n

// 请求头
GET ws://localhost:8888/ HTTP/1.1
Host: localhost:8888
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Sec-WebSocket-Key: 5xSlLRQEFBqITdinK5kPiQ==
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
 */

// net 模块用于创建基于流的 TCP 或 IPC 的服务器（net.createServer()）与客户端（net.createConnection()）。

let net = require("net");
let server = net.createServer(function (socket) {
  // once 只执行一次
  socket.once("data", (data) => {
    data = data.toString();
    if (data.match(/Connection: Upgrade/)) {
      let rows = data.split("\r\n");
      rows = rows.slice(1, -2);

      let headers = {};
      rows.forEach((row) => {
        let [key, value] = row.split(": ");
        headers[key] = value;
      });
      // rows.reduce((memo, item) => {
      //   let [key, value] = item.split(': ');
      //   console.log('key-value',key, value, memo);
      //   memo[key] = value;
      // return memo
      // }, headers)

      if (headers["Sec-WebSocket-Version"] == 13) {
        let wsKey = headers["Sec-WebSocket-Key"];
        let CODE = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
        let crypto = require("crypto");
        let acceptKey = crypto
          .createHash("sha1")
          .update(wsKey + CODE)
          .digest("base64");
        let response = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          `Sec-WebSocket-Accept: ${acceptKey}`,
          "Connection: Upgrade",
          "\r\n",
        ].join("\r\n");
        socket.write(response);
        socket.on("data", function (buffers) {
          // data 默认是一个 buffer
          let _fin = (buffers[0] & 0b10000000) === 0b10000000; //判断是否是结束位,第一个bit是不是1
          let _opcode = buffers[0] & 0b00001111; // 操作码 取一个字节的后四位,得到的一个是十进制数
          let _masked = buffers[1] & (0b100000000 === 0b100000000); //第一位是否是1，判断是否进行了掩码
          let _payloadLength = buffers[1] & 0b01111111; // 取得负载数据的长度 后七位
          let _mask = buffers.slice(2, 6); // 掩码键 4 个字节
          let payload = buffers.slice(6); // 负载数据 携带的真实数据

          unmask(payload, _mask); //对数据进行解码处理

          //向客户端响应数据
          let response = Buffer.alloc(2 + payload.length); // 分配多少字节
          response[0] = _opcode | 0b10000000; //1表示发送结束
          response[1] = payload.length; //负载的长度
          payload.copy(response, 2);
          console.log('response', response.toString())
          socket.write(response);
        });
      }
    }
  });

  socket.on("end", function () {
    console.log("end");
  });
  socket.on("close", function () {
    console.log("close");
  });
  socket.on("error", function (error) {
    console.log(error);
  });
});

function unmask(buffer, mask) {
  const length = buffer.length;
  for (let i = 0; i < length; i++) {
    //  等同于 buffer[i] ^= mask[i % 4];
    buffer[i] ^= mask[i & 3];
  }
}
server.listen(9999);
