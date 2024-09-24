// 컨트롤러, 비즈니스 로직을 처리하는 부분
// dao에서 정의된 다양한 모듈을 컨트롤러에서 사용

const indexDao = require("../dao/indexDao");

// 일정 생성
exports.createTodo = async function(req, res){
    const {userIdx} = req.verifiedToken;
    const {contents, type} = req.body;

    if(!userIdx || !contents || !type){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "입력값이 누락되었습니다."
        });
    };

    // contents 20글자 초과 불가
    if(contents.length >= 20){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "컨텐츠는 20글자 이하로 설정해주세요."
        });
    };

    // type : do, decide, delete, delegate
    const validTypes = ["do", "decide", "delete", "delegate"];
    if(!validTypes.includes(type)){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "유효한 타입이 아닙니다."
        });
    };

    const insertTodoRow = await indexDao.insertTodo(userIdx, contents, type);
    if(!insertTodoRow){
        return res.send({
            isSuccess: false,
            code: 403,
            message: "요청에 실패했습니다. 관리자에게 문의해주세요."
        });
    };
    
    return res.send({
        isSuccess: true,
        code: 200,
        message: "일정 생성 성공"
    });
};

// 타입별 일정조회
exports.readTodo = async function (req, res){
    const {userIdx} = req.verifiedToken;
    const todos = {};
    const types = ["do", "decide", "delegate", "delete"];
    
    for(let type of types){
        let selectTodoByTypeRows = await indexDao.selectTodoByType(userIdx, type);

        if(!selectTodoByTypeRows){
            return res.send({
                isSuccess: true,
                code: 400,
                message: "일정 조회 실패, 관리자에게 문의해주세요."
            });
        };

        todos[type] = selectTodoByTypeRows
    };

    return res.send({
        result: todos,
        isSuccess: true,
        code: 200,
        message: "일정 조회 성공"
    });
}

// 일정 수정
exports.updateTodo = async function(req, res){
    const {userIdx} = req.verifiedToken;
    let {todoIdx, contents, status} = req.body;

    if(!userIdx || !todoIdx){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "userIdx와 todoIdx를 보내주세요."
        });
    };

    if(!contents){
        contens = null;
    };

    if(!status){
        status = null;
    };

    const isValidTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);
    if(isValidTodoRow.length < 1){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "유효한 요청이 아닙니다. userIdx와 todoIdx를 확인해주세요."
        });
    };
    
    const updateTodoRow = await indexDao.updateTodo(
        userIdx, todoIdx, contents, status
    );

    if(!updateTodoRow){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "수정 실패, 관리자에게 문의해주세요."
        });
    }

    return res.send({
        isSuccess: true,
        code: 200,
        message: "수정 성공"
    });
};

// 일정 삭제
exports.deleteTodo = async function (req, res){
    const {userIdx} = req.verifiedToken;
    const {todoIdx} = req.params;

    if(!userIdx || !todoIdx){
        return res.send({
            isSuccess: true,
            code: 400,
            message: "userIdx와 todoIdx를 보내주세요."
        });
    };

    const isValidTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);
    if(isValidTodoRow.length < 1){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "유효한 요청이 아닙니다. userIdx와 todoIdx를 확인해주세요."
        });
    };

    const deleteTodoRow = await indexDao.deleteTodo(userIdx, todoIdx);
    if(!deleteTodoRow){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "삭제 실패, 관리자에게 문의해주세요."
        });
    }

    return res.send({
        isSuccess: true,
        code: 200,
        message: "삭제 성공"
    });
}