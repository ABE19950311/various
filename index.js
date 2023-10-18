
window.addEventListener("load", async (event) => {
    const logout = document.getElementById("logout");

    logout.addEventListener("click",()=>{
        isLoggout()
    })
    await onCreate();
});

function onCreate() {
    isAlreadyLoggedin((data)=>{
        if(data) {
            document.getElementById("newtouroku").hidden = true;
            document.getElementById("login").hidden = true;
            document.getElementById("home").hidden = false;
        } else {
            document.getElementById("newtouroku").hidden = true;
            document.getElementById("login").hidden = false;
            document.getElementById("home").hidden = true;
        }
    })
}

function isAlreadyLoggedin(callback) {
    let url = "http://localhost:3000/isLoggedinCheck"
    let option = {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        }
    }
    fetch(url,option)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            callback(data)
        })
        .catch(e => {
            console.error(e)
        })
}

function isCreateUser() {
    document.getElementById("newtouroku").hidden = false;
    document.getElementById("login").hidden = true;
    document.getElementById("home").hidden = true;
}

function goHome() {
    document.getElementById("newtouroku").hidden = true;
    document.getElementById("login").hidden = false;
    document.getElementById("home").hidden = true;
}

function isLoggout() {
    console.log("hoge");
}

function getLoginToken() {
    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    requestToken(user,password,(data)=>{

    })
}

function isLoggin() {
    const loginuser = document.getElementById("loginuser").value;
    const loginpassword = document.getElementById("loginpassword").value;

    isUserRequestFindCheck(loginuser,loginpassword,(data)=>{
        if(data) {
            document.getElementById("newtouroku").hidden = true;
            document.getElementById("login").hidden = true;
            document.getElementById("home").hidden = false;
        } else {

        }
    })
}

function isUserRequestFindCheck(loginuser,loginpassword,callback) {
    let url = "http://localhost:3000/isUserFindCheck"
    let option = {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "loginuser":loginuser,
            "loginpassword":loginpassword
        })
    }
    fetch(url,option)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            callback(data);
        })
        .catch(e => {
            console.error(e)
        })
}

function requestToken(user,password,callback) {
    let url = "http://localhost:3000/isRegissterToken"
    let option = {
        method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "user":user,
            "password":password
        })
    }
    fetch(url,option)
        .then(response => response.json())
        .then(data => {
            console.log(`${JSON.stringify(data)}`)
            callback(data)
        })
        .catch(e => {
            console.error(e)
        })
}

function hoge() {
    requestTest((response)=>{
        console.log(response);
    })
}

function requestTest() {
    let url = "http://localhost:3000/test"
    let option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch(url,option)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        })
}

