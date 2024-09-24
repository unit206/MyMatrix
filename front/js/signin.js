const buttonSignin = document.getElementById("signin");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
buttonSignin.addEventListener("click", signin);

// 로그인 처리 함수
async function signin(event){
    const currentEmail = inputEmail.value;
    const currentPassword = inputPassword.value;
    console.log(currentEmail);
    console.log(currentPassword);
    if(!currentEmail || !currentPassword){
        return false;
    }

    // 로그인 API 요청
    const config = {
        method: "post",
        url: url + "/sign-in",
        data: {
            email : currentEmail,
            password : currentPassword
        }
    };

    try {
        const res = await axios(config);
        
        if(res.data.code !== 200){
            alert(res.data.message);
            return false;
        }

        localStorage.setItem("x-access-token", res.data.result.token);
        alert(res.data.message);
        location.href = "index.html";
    } catch (err) {
        console.error(err);
    }
    
}