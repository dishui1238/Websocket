// Sec-WebSocket-Accept的计算

/**
 * !Sec-WebSocket-Accept根据客户端请求首部的Sec-WebSocket-Key计算出来。 计算公式为：
 * ! 1. 将Sec-WebSocket-Key跟 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 拼接。
 * ! 2. 通过SHA1计算出摘要，并转成base64字符串
 */
// Sec-WebSocket-Key
let key = "7sHbX0gQnO3nluHr9+i4og==";
let CODE = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
let crypto = require("crypto");
let result = crypto
  .createHash("sha1")
  .update(key + CODE)
  .digest("base64");
console.log('result', result)
