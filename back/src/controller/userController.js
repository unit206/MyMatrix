const userDao = require("../dao/userDao");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../secret");


// 회원가입
exports.signup = async function(req, res){
    let {email, password, nickname} = req.body;

    if(!email || !password || !nickname){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "회원가입 입력값을 확인해주세요."
        });
    }
    
    // 이메일 형식 체크
    const isValidEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;	
    if(!isValidEmail.test(email)){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "이메일 형식을 확인해주세요."
        });
    }
    
    // 비밀번호 형식 체크
    const isValidPassword = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/; //  8 ~ 20자 영문, 숫자 조합
    if(!isValidPassword.test(password)){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "비밀번호 형식을 확인해주세요."
        });
    }

    // 닉네임 형식 체크
    if(nickname.length < 2 || nickname.length >= 10){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "닉네임 형식을 확인해주세요. 2~10 글자만 가능합니다."
        });
    }

    // 중복 회원 검사
    const isDuplicatedEmail = await userDao.selectUserByEmail(email);
    if(isDuplicatedEmail.length > 0){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "이미 가입된 회원입니다."
        });
    }

    // DB 입력
    const insertUserRow = await userDao.insertUser(email, password, nickname);
    if(!insertUserRow){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "회원가입 실패, 관리자에게 문의해주세요."
        });
    }

    return res.send({
        isSuccess: true,
        code: 200,
        message: "회원가입 성공"
    });
}

// 로그인
exports.signin = async function(req, res){
    const {email, password} = req.body;

    if(!email || !password){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "회원정보를 입력해주세요."
        });
    }

    // 회원여부 검사
    const isValidUser = await userDao.selectUser(email, password);

    if(!isValidUser){
        return res.send({
            isSuccess: false,
            code: 410,
            message: "DB 에러, 관리자에게 문의해주세요."
        });
    }
    if(isValidUser.length < 1){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "존재하지 않는 회원이거나, 이메일 또는 비밀번호가 틀렸습니다."
        });
    }
    
    // jwt 발급
    const [userInfo] = isValidUser;
    const userIdx = userInfo.userIdx;

    const token = jwt.sign(
        {userIdx: userIdx}, // 페이로드
        jwtSecret // 시크릿 키
    );
    
    return res.send({
        result: {token: token},
        isSuccess: true,
        code: 200,
        message: "로그인 성공"
    });
}

// 로그인 시 자신의 닉네임 뜨게 처리
exports.getNicknameByToken = async function(req, res){
    const {userIdx} = req.verifiedToken;
    const [userInfo] = await userDao.selectNicknameByUserIdx(userIdx);
    const nickname = userInfo.nickname;
    
    return res.send({
        result: {nickname: nickname},
        isSuccess: true,
        code: 200,
        message: "토큰 검증 성공"
    });
}