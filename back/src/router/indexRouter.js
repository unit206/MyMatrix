// 라우터 분리, 클라이언트에서 오는 요청을 처리
const indexController = require("../controller/indexController");
const {jwtMiddleware} = require("../jwtMiddleware");

exports.indexRouter = function(app){
    // 일정 CRUD API
    app.post("/todo", jwtMiddleware, indexController.createTodo); // create
    app.get("/todos", jwtMiddleware, indexController.readTodo); // read, n번 유저의 일정 조회
    app.patch("/todo", jwtMiddleware, indexController.updateTodo); // update
    app.delete("/todo/:todoIdx", jwtMiddleware, indexController.deleteTodo); // delete
    app.get(
        "/dummy",
        function (req, res, next) {
          console.log(1);
          next();
        },
        function (req, res, next) {
          console.log(2);
        //   next();
        },
        function (req, res) {
          console.log(3);
        }
      );
}