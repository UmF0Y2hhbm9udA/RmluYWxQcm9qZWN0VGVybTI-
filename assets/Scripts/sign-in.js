function InputCheck(param){
    if(param==='password'){
        const password = document.getElementById("password").value.trim()
        if(password.length<8){
            document.getElementById("errorPassword").hidden=false
        }else{
            document.getElementById("errorPassword").hidden=true
        }
    }
}
let process = false;
document.getElementById("login_button").addEventListener("click", async (event) => {
    event.preventDefault()
    if (process) return;
    process=true;
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    if (!username || !password) {
        swal("ล็อคอิน ไม่สำเร็จ!", "กรุณากรอกรายละเอียดให้ครบ", "error", {
            button:{className:'hyper-btn-notoutline-danger'},
            closeOnClickOutside: false,
        });
        process = false;
        return;
    }
    try{
        let res = await fetch(Users_API);
        let users = await res.json();
        let user = users.find(user => user.username === username);
        if (!user) {
            swal("ล็อคอิน ไม่สำเร็จ", "User not found", "error", {
                button:{className:'hyper-btn-notoutline-danger'},
                closeOnClickOutside: false,
            });
            process = false;
            return;
        }
        let decryptedPassword = await decryptPassword(user.password, user.salt, user.iv, password);
        if (decryptedPassword !== password) {
            swal("ล็อคอิน ไม่สำเร็จ", "รหัสผ่านไม่ถูกต้อง !", "error", {
                button:{className:'hyper-btn-notoutline-danger'},
                closeOnClickOutside: false,
            });
            process = false;
            return;
        }
        const token = await newjwt({username:user.username,id:user.id}, "mysecret", 9999)
        localStorage.setItem("token", token)
        localStorage.setItem("username", user.username)
        localStorage.setItem("email", user.email)
        swal("ล็อคอิน สำเร็จ!", "Loading Home Page . . .", "success", {
            button: true,
            closeOnClickOutside: false,
        });
        sleep(2000).then(() => {window.location.href="./Homepage.html"; });
    } catch (error) {
        swal("ล็อคอิน ไม่สำเร็จ", "กรุณาลองอีกครั้ง หรือ กรอกรหัสที่ถูกต้อง !", "error", {
            button:{className:'hyper-btn-notoutline-danger'},
            closeOnClickOutside: false,
        });
        process=false;
    }
});
setInterval(function(){
    validationtk("./Homepage.html")
},2000)