let express = require("express");
let app = express();

app.use(express.static(__dirname));
// 当客户端访问 /clock 返回本地的时间
app.get("/clock", function (req, res) {
  setInterval(function () {
    // send = write + end
    res.write(`
          <script type="text/javascript">
              parent.document.getElementById('clock').innerHTML = "${new Date().toLocaleTimeString()}";
          </script>
      `);
  }, 1000);
});
app.listen(8000);

// 启动 nodemon app.js 可以热更新
