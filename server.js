const http = require("http");
const mongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const Crypto = require("crypto");

const RESPONSE_HEADER = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
}

const MONGO_DB_END_POINT = "mongodb://localhost:27017";
const MONGO_DB_DB_NAME = "appDb";
const MONGO_DB_COLLECTIONS = {
    MEMBER_USER: "memberUserCollection",
    SYSTEM: "systemCollection",
    SESSION: "sessionCollection"
}
let server;

const AsyncLock = require("async-lock");
const lock = new AsyncLock({ timeout: 60000 });

function router(url,requestSessionToken,requestBody,response) {
    console.log(url)
    switch(url) {
        case "/":
            getPage(url,requestSessionToken,requestBody,response);
            return;
        case "/isLoggedinCheck":
            apiIsLoggedinCheck(url,requestSessionToken,requestBody,response)
            return;
        case "/index.js":
            getScript(url,requestSessionToken,requestBody,response);
            return;
        case "/css/index.css":
            getCss(url,requestSessionToken,requestBody,response);
            return
        case "/isRegissterToken":
            apiIsRegisterToken(url,requestSessionToken,requestBody,response);
            return;
        case "/isUserFindCheck":
            apiIsUserFindCheck(url,requestSessionToken,requestBody,response);
            return;
    }
}

function apiIsLoggedinCheck(url,requestSessionToken,requestBody,response) {
    console.log(requestBody)
    const responseBody = {
        applicationStatusCode: APPLICATION_STATUS_CODE.SUCCESS,
        applicationMessage: "Success",
        sessionToken: requestSessionToken,
        requestBody: requestBody,
    }
    doResponse(response, 200, RESPONSE_HEADER, responseBody)
}

function getPage(url,requestSessionToken,requestBody,response) {
    const currentDir = process.cwd();
    fs.readFile(`${currentDir}/dest/index.html`,"utf-8",(error,data)=>{
        if(!error) {
            response.writeHead(200, { "Content-Type": "text/html"});
            response.write(data)
            response.end();
        }
    })
}

function getCss(url,requestSessionToken,requestBody,response) {
    const currentDir = process.cwd();
    fs.readFile(`${currentDir}/css/index.css`,"utf-8",(error,data)=>{
        if(!error) {
            response.writeHead(200, { "Content-Type": "text/css"});
            response.write(data)
            response.end();
        }
    })
}

function getScript(url,requestSessionToken,requestBody,response) {
    const currentDir = process.cwd();
    fs.readFile(`${currentDir}/index.js`,"utf-8",(error,data)=>{
        if(!error) {
            response.writeHead(200, { "Content-Type": "text/javascript"});
            response.write(data)
            response.end();
        }
    })
}



async function apiIsRegisterToken(url,requestSessionToken,requestBody,response) {
    console.log(requestBody.user)
    console.log(requestBody.password)

    await dbInsert(MONGO_DB_COLLECTIONS.MEMBER_USER,{
        user:requestBody.user,
        password:requestBody.password
    })
    const responseBody = {
        applicationStatusCode: "Success",
        applicationMessage: "Success",
    };
    doResponse(response, 200, RESPONSE_HEADER, responseBody);
}

async function apiIsUserFindCheck(url,requestSessionToken,requestBody,response) {
    if((await isExistUser(requestBody)) == false) {
        console.log("user not find");
        return;
    }
    const responseHeader = JSON.parse(JSON.stringify(RESPONSE_HEADER));
    responseHeader["Set-Cookie"] = `sessionToken=${await getGenerateSessionToken(requestBody.loginuser)}`;
    const responseBody = {
        applicationStatusCode: "Success",
        applicationMessage: "Success",
    }
    doResponse(response,200,responseHeader,responseBody);
}

async function getGenerateSessionToken(user) {
    return await lock.acquire("generateSessionToken",async()=>{
        await dbUpdate(
            MONGO_DB_COLLECTIONS.SYSTEM,
            {},
            {
                $inc: {
                    sessionCount: 1
                }
            }
        );
        const sessionCount = (await dbGet(MONGO_DB_COLLECTIONS.SYSTEM,{}))[0].sessionCount
        const sessionToken = `sessionToken-${sessionCount}-${getRandomId()}`
        await dbInsert(MONGO_DB_COLLECTIONS.SESSION,{sessionToken:sessionToken,user:user})
        return sessionToken
    })
}

async function isExistUser(requestBody) {
    const result = await dbGet(MONGO_DB_COLLECTIONS.MEMBER_USER,{user:requestBody.loginuser,password:requestBody.loginpassword});
    return result.length != 0;
}

function getRandomId() {
    const func = function() { return Crypto.randomBytes(16).toString("base64").replace(/\W/g, '').substring(0, 16);}
    const id = func()
    while (id.length<16) {id=func()}
    return id;
}

async function dbGet(collection,filter) {
    console.log(filter)
    const res = await db.collection(collection).find(filter).toArray()
    return res;
}

async function dbUpdate(collection,filter, obj, opt = { upsert: true }) {
    const res = await db.collection(collection).updateOne(filter,obj,opt);
    return res;
}

async function dbInsert(collection, obj) {
    //const client = await mongoClient.connect(MONGO_DB_END_POINT);
    const res = await db.collection(collection).insertOne(obj);
    return;
}

function doResponse(response, reponseHttpStatusCode, responseHeader, responseBody) {
    response.writeHead(reponseHttpStatusCode,responseHeader);
    response.end(JSON.stringify(responseBody) + "\n");
}

async function main() {
    function getSessionTokenFromCookie(request) {
        console.log(request.headers.cookie)
        if(request.headers.cookie==undefined) {
            return "";
        }
        const result = request.headers.cookie
        if(result == null) {
            return "";
        }
        return result;
    }
    db = (await mongoClient.connect(MONGO_DB_END_POINT)).db(MONGO_DB_DB_NAME);
    server = http.createServer(
        async (request,response) => {
            let rawData = "";
            request.on("data",(chuck)=>{
                rawData += chuck;
            });
            request.on("end",async ()=>{
                if (rawData=="") {
                    rawData = "{}"
                }
                //console.log(rawData)
                const requestBody = JSON.parse(rawData);
                try {
                router(request.url,getSessionTokenFromCookie(request),requestBody,response);
                } catch (error) {

                }
            });
        }
    )
    server.listen(3000,async ()=>{
        console.log("server listen 3000");
    });
}

main();


