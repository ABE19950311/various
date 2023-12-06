import * as page from "./class.js";

const login = new page.Login();
const mail = new page.Mail();

const pageObj = {
    home_page: { id:"home_page" },
    inquiry_page: { id:"inquiry_page"},
    login_page: { id:"login_page"},
    new_register_page: { id:"new_register_page"}
}

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
    const btnArray = {
        home_page: [],
        inquiry_page: ["send_inquiry"],
        login_page: ["login_btn","go_home_btn"],
        new_register_page: ["create_user_btn"]
    }

    Object.keys(pageObj).forEach((page)=>{
        btnArray[page].forEach((btn)=>{
            document.getElementById(btn).addEventListener("click", { page:pageObj[page],handleEvent: displayPage});
        })
    })
    document.getElementById("login_btn").addEventListener("click", isLoggin)
    document.getElementById("user_logout_btn").addEventListener("click", userLogout)
    document.getElementById("send_inquiry").addEventListener("click", sendInquiry)
    document.getElementById("new_register_btn").addEventListener("click", newRegisterUser)
}

function displayPage(page) {
    if (this.page) { page = this.page; }
    console.log(page.id)
    hiddenAllPages();
    appearPage(page.id);
}

function hiddenPage(page) {
    document.getElementById(page).classList.add("d-none");
}

function appearPage(id) {
    console.log(id)
    document.getElementById(id).classList.remove("d-none");
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
