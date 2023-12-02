import * as page from "./class.js";

const login = new page.Login();
const mail = new page.Mail();

window.addEventListener("DOMContentLoaded", () => {
    main();
});

function main() {
    hiddenAllPages()
    addEvents()
    isAlreadyLoggedin((data)=>{
        if(data.applicationMessage=="Invalid session token.") {
            appearPage("login_page")
        } else {
            appearPage("home_page")
        }
    })
}

function hiddenAllPages() {
    const pages = document.querySelectorAll(".page_class");
    pages.forEach((page)=>{
        page.classList.add("d-none")
    })
}

function addEvents() {
    document.getElementById("login_btn").addEventListener("click",isLoggin)
    document.getElementById("user_logout_btn").addEventListener("click",userLogout)
    document.getElementById("send_inquiry").addEventListener("click",sendInquiry)
    document.getElementById("create_user_btn").addEventListener("click",isCreateUser)
    document.getElementById("new_register_btn").addEventListener("click",newRegisterUser)
    document.getElementById("go_home_btn").addEventListener("click",goHome)
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
    appearPage("new_register_page")
    hiddenPage("login_page")
}

function goHome() {
    appearPage("login_page")
    hiddenPage("new_register_page")
}

function newRegisterUser() {
    const user = login.user.value;
    const password = login.password.value;

    requestToken(user,password,(data)=>{

    })
}

function isLoggin() {
    const loginuser = login.loginuser.value;
    const loginpassword = login.loginpassword.value;

    isUserRequestFindCheck(loginuser,loginpassword,(data)=>{
        if(data.applicationMessage=="User does not exist") {

        } else {
            hiddenPage("login_page")
            appearPage("home_page")
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
        questionerName: mail.questionerName.value,
        inquiry: mail.inquiry.value
    }
    requestToServer(url,"POST",body,()=>{})
}
