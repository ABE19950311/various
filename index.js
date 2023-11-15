
window.addEventListener("DOMContentLoaded", () => {
    main();
});

function main() {
    hiddenAllPages()
    isAlreadyLoggedin((data)=>{
        if(data.applicationMessage=="Invalid session token.") {
            appearPage("login")
        } else {
            appearPage("home")
        }
    })
}

function hiddenAllPages() {
    const pages = document.querySelectorAll(".page_class");
    pages.forEach((page)=>{
        page.classList.add("d-none")
    })
}

function hiddenPage(page) {
    document.getElementById(page).classList.add("d-none");
}

function appearPage(page) {
    document.getElementById(page).classList.remove("d-none");
}

async function isAlreadyLoggedin(callback) {
    let url = "http://localhost:3000/isLoggedinCheck"
    await requestToServer(url,"POST",null,(response)=>{
        callback(response)
    })
}

function userLogout() {
    console.log(document.cookie)
    document.cookie = "sessionToken=;"
    main()
}

function isCreateUser() {
    appearPage("newtouroku")
    hiddenPage("login")
}

function goHome() {
    appearPage("login")
    hiddenPage("newtouroku")
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
        if(data.applicationMessage=="User does not exist") {

        } else {
            hiddenPage("login")
            appearPage("home")
        }
    })
}

function isUserRequestFindCheck(loginuser,loginpassword,callback) {
    let url = "http://localhost:3000/isUserFindCheck"
    let body = {
        "loginuser":loginuser,
        "loginpassword":loginpassword
    }
    requestToServer(url,"POST",body,(response)=>{
        callback(response)
    })
}

function requestToken(user,password,callback) {
    let url = "http://localhost:3000/isRegissterToken"
    let body = {
        "user":user,
        "password":password
    }
    requestToServer(url,"POST",body,(response)=>{
        callback(response)
    })
}

async function requestToServer(url,method,body,callback) {
    const option = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
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

function sendInquiry() {
    let url = "http://localhost:3000/isSendMail"
    let body = {
        questionerName: document.getElementById("inquiry_name").value,
        inquiry: document.getElementById("inquiry_area").value
    }
    requestToServer(url,"POST",body,()=>{})
}
