
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

function sendInquiry() {
    console.log(document.getElementById("inquiry_name").value)
    console.log(document.getElementById("inquiry_area").value)
}
