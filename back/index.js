const compression = require('compression');
const cors = require("cors");
const {indexRouter} = require("./src/router/indexRouter");
const {userRouter} = require("./src/router/userRouter");
const express = require('express');
const app = express();
const port = 3000;

/* express 미들웨어 설정 */

// 정적파일 제공
app.use(express.static("front"));

// cors 설정
app.use(cors());

// body json 파싱
app.use(express.json());

// HTTP 요청 압축
app.use(compression());

// 라우터 분리
indexRouter(app);
userRouter(app);

// app.post("/users", function(req, res){
//     const name = req.body.name;
//     return res.send(name);
// }); 
// req(리퀘스트): 클라이언트에서 서버로 요청을 해오는 것과 관련된 객체
// res(리스폰스): 서버가 클라이언트한테 응답을 해줄 때와 관련된 객체

app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`)
})
