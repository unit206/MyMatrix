// dao 정의 (database access object)

const {pool} = require("../database");

exports.getUserRows = async function(){
    try{
        const connection = await pool.getConnection(async(conn) => conn);
        try {
            const selectUserQuery = "SELECT * FROM Users";
            const [row] = await connection.query(selectUserQuery);
            connection.release(); // 커넥션을 릴리즈를 안하면 과부하나 꼬임이 생긴다.
            return row;
        } catch (err) {
            console.error(" ##### getUserRows Query error #####");
            connection.release();
            return false;
        }
    }catch(err){
        console.error(" ##### getUserRows DB error #####");
        return false;
    }
}

// 일정 추가
exports.insertTodo = async function(userIdx, contents, type){
    try{
        // DB 연결 검사
        const connection = await pool.getConnection(async(conn) => conn);
        try {
            const insertTodoQuery = 
                "insert into Todos(userIdx, contents, type) values(?, ?, ?);";
            const insertTodoParams = [userIdx, contents, type];

            const [row] = await connection.query(insertTodoQuery, insertTodoParams);
            connection.release(); // 커넥션을 릴리즈를 안하면 과부하나 꼬임이 생긴다.
            return row;
        } catch (err) {
            console.error(`##### insertTodo Query error #####  \n ${err}` );
            connection.release();
            return false;
        }
    }catch(err){
        console.error(` ##### insertTodo DB error ##### \n ${err}`);
        return false;
    }
}

// 유저 일정 조회
exports.selectTodoByType = async function(userIdx, type){
    try{
        // DB 연결 검사
        const connection = await pool.getConnection(async(conn) => conn);
        try {
            const selectTodoByTypeQuery = 
                "select todoIdx, contents, status from Todos where userIdx = ? and type = ? and not(status = 'D');";
            const selectTodoByTypeParams = [userIdx, type];

            const [row] = await connection.query(selectTodoByTypeQuery, selectTodoByTypeParams);
            connection.release(); // 커넥션을 릴리즈를 안하면 과부하나 꼬임이 생긴다.
            return row;
        } catch (err) {
            console.error(`##### selectTodoByType Query error #####  \n ${err}` );
            connection.release();
            return false;
        }
    }catch(err){
        console.error(` ##### selectTodoByType DB error ##### \n ${err}`);
        return false;
    }
}

exports.selectValidTodo = async function(userIdx, todoIdx){
    try{
        // DB 연결 검사
        const connection = await pool.getConnection(async(conn) => conn);
        try {
            const selectValidTodoQuery = 
                "select * from Todos where userIdx = ? and todoIdx = ? and not(status = 'D');";
            const selectValidTodoParams = [userIdx, todoIdx];

            const [row] = await connection.query(selectValidTodoQuery, selectValidTodoParams);
            connection.release(); // 커넥션을 릴리즈를 안하면 과부하나 꼬임이 생긴다.
            return row;
        } catch (err) {
            console.error(`##### selectValidTodo Query error #####  \n ${err}` );
            connection.release();
            return false;
        }
    }catch(err){
        console.error(` ##### selectValidTodo DB error ##### \n ${err}`);
        return false;
    }
}

exports.updateTodo = async function(userIdx, todoIdx, contents, status){
    try{
        // DB 연결 검사
        const connection = await pool.getConnection(async(conn) => conn);
        try {
            const updateTodoQuery = 
                "update Todos set contents = ifnull(?, contents), status = ifnull(?, status)  where userIdx = ? and todoIdx = ?;";
            const updateTodoParams = [contents, status, userIdx, todoIdx]; // 쿼리의 순서와 맞게 정렬해야 한다.

            const [row] = await connection.query(updateTodoQuery, updateTodoParams);
            connection.release(); // 커넥션을 릴리즈를 안하면 과부하나 꼬임이 생긴다.
            return row;
        } catch (err) {
            console.error(`##### updateTodo Query error #####  \n ${err}` );
            connection.release();
            return false;
        }
    }catch(err){
        console.error(` ##### updateTodo DB error ##### \n ${err}`);
        return false;
    }
}

// 일정 삭제
exports.deleteTodo = async function(userIdx, todoIdx){
    try{
        // DB 연결 검사
        const connection = await pool.getConnection(async(conn) => conn);
        try {
            const deleteTodoQuery = 
                "update Todos set status = 'D' where userIdx = ? and todoIdx = ?;";
            const deleteTodoParams = [userIdx, todoIdx]; // 쿼리의 순서와 맞게 정렬해야 한다.

            const [row] = await connection.query(deleteTodoQuery, deleteTodoParams);
            connection.release(); // 커넥션을 릴리즈를 안하면 과부하나 꼬임이 생긴다.
            return row;
        } catch (err) {
            console.error(`##### deleteTodo Query error #####  \n ${err}` );
            connection.release();
            return false;
        }
    }catch(err){
        console.error(` ##### deleteTodo DB error ##### \n ${err}`);75
        return false;
    }
}