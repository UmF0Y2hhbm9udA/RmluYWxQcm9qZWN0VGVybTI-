const Users_API = 'https://67b4216e392f4aa94fa975c8.mockapi.io/Ratchanont/users';
const UI_API = 'https://67b420f8392f4aa94fa973de.mockapi.io/Ratchanont/UITemplate';
const Script_API = 'https://67b420f8392f4aa94fa973de.mockapi.io/Ratchanont/Scripts';

function validationtk(param){
    var chktk = localStorage.getItem("token");
    if(chktk){
        window.location.href=param
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function base64UrlDecode(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) {
        str += "=";
    }
    return atob(str);
}
function base64UrlEncode(str) {
    return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}
function base64UrlEncodeArrayBuffer(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return base64UrlEncode(binary);
}
async function newjwt(payload, secret, expireinsec = 9999) {
    const encoder = new TextEncoder();
    const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
    const body = JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expireinsec });

    const headerBase64 = base64UrlEncode(header);
    const bodyBase64 = base64UrlEncode(body);

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(`${headerBase64}.${bodyBase64}`)
    );

    const signatureBase64 = base64UrlEncodeArrayBuffer(signature);
    return `${headerBase64}.${bodyBase64}.${signatureBase64}`;
}
async function verifyJWT(token, secret) {
        const [headerB64, bodyB64, signatureB64] = token.split(".");
        if (!headerB64 || !bodyB64 || !signatureB64) {
            return { valid: false, reason: "Invalid token format" };
        }
        const header = JSON.parse(base64UrlDecode(headerB64));
        const body = JSON.parse(base64UrlDecode(bodyB64));
        if (header.alg !== "HS256") {
            return { valid: false, reason: "Invalid algorithm" };
        }
        if (Date.now() / 1000 > body.exp) {
            return { valid: false, reason: "Token expired" };
        }
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        const data = encoder.encode(`${headerB64}.${bodyB64}`);
        const validSignature = await crypto.subtle.sign("HMAC", key, data);
        const validSignatureB64 = base64UrlEncodeArrayBuffer(validSignature);
        if (signatureB64 !== validSignatureB64) {
            return { valid: false, reason: "Invalid signature" };
        }
        return { valid: true, payload: body };
        
}
function showError(msg) {
    swal("ข้อผิดพลาด !", msg + " | กรุณาล็อคอินใหม่", "error", {
        button: { className: 'hyper-btn-notoutline-danger' },
        closeOnClickOutside: false,
    });
    localStorage.removeItem("token");
    sleep(2000).then(() => { window.location.href = "../../index.html"; });
}
async function chktoken() {
    const token = await localStorage.getItem("token");
    if (!token) {
        showError("Token Not Found | กรุณาล็อคอินใหม่");
        return { valid: false };
    }

    const result = await verifyJWT(token, "mysecret");

    if (!result.valid) {
        console.log(result.reason)
        showError(result.reason === "Token expired" ? "Token Expired" : "Invalid Token");
        return { valid: false };
    }
    return { valid: true };
}
async function getUserPoints(username) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(),5000);
        let res = await fetch(API_URL,{signal:controller.signal});
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error("response err");
        let users = await res.json();
        let user = users.find(user => user.username === username);
        return user ? user.points : null;
    } catch (error) {
        console.error("Fetching Error : ", error);
        return null;
    }
}
(function() {
    let CSS = `
             .cursor:after{
               display:inline-block;
               content:"|";
               box-shadow:inset 0 0 0 0;
               opacity:.6;
               transition:margin .2s;
               animation:cursor-fade 1s linear infinite;
             }
             .cursor:not(:empty):after{
               margin-left:.25em;
             }
             @keyframes cursor-fade{
               0%{opacity:1}
               24%{opacity:1}
               26%{opacity:0}
               74%{opacity:0}
               76%{opacity:1}
               100%{opacity:1}
             }
             `
    let style = document.createElement("style");
    style.innerHTML = CSS;
    document.head.append(style);
})();

var nAnimations = nAnimations || (nAnimations = {});

nAnimations.TextTyping = function(el) {
    let texts = el.getAttribute("data-texts").split("|");
    let textIndex = 0,
        textIndent = 0,
        textMove = 1;

    function interval() {
        if (textMove == 1) {
            textIndent += 1;
            el.innerHTML = texts[textIndex].substr(0, textIndent) || "&nbsp;";
            if (textIndent == texts[textIndex].length + 40) {
                textMove = -1;
                textIndent = texts[textIndex].length;
            }
        }
        if (textMove == -1) {
            textIndent -= 1;
            el.innerHTML = texts[textIndex].substr(0, textIndent) || "&nbsp;";
            if (textIndent == -10) {
                textMove = 1;
                textIndex = (textIndex + 1) % texts.length;
            }
        }
    }

    let inter = setInterval(e => {
        interval()
    }, 50)
}

document.addEventListener('DOMContentLoaded', function() {
    Array.from(document.querySelectorAll(".cursor")).forEach(el => {
        nAnimations.TextTyping(el)
    })
})
