const name = localStorage.getItem("username");
const email = localStorage.getItem("email");

async function showData(){
    const profileapply = await verifyJWT(localStorage.getItem("token"),"mysecret")
    const LocalUserRequest = await(fetch(`${Users_API}/${(await profileapply).payload.id}`))
    const LocalUserDatajson = await(LocalUserRequest.json())
    const Datecreated = document.getElementById("Datecreated")
    Datecreated.textContent=`สมัครเมื่อวันที่ ${LocalUserDatajson.datecreated}`
    if(profileapply.valid){
        document.getElementById("Usernameshow2").textContent = profileapply.payload.username;
        document.getElementById("Emailshow2").textContent = localStorage.getItem("email")
    }
    let points = await getUserPoints(profileapply.payload.username);
    if (points !== null) {
        document.getElementById("Pointshow").innerHTML=`<i class="fa-duotone fa-solid fa-wallet"></i>&nbsp;&nbsp;คงเหลือ : ${points}฿`
    } else {
        document.getElementById("Pointshow").innerHTML=`<i class="fa-duotone fa-solid fa-wallet"></i>&nbsp;&nbsp;คงเหลือ : n/a฿`
    }
}
    document.getElementById("save_edit_password").addEventListener("click",async(param)=>{
        const profileapply = await verifyJWT(localStorage.getItem("token"),"mysecret")
        param.preventDefault();
        var oldPassword = $("#old_password").val();
        var newPassword = $("#new_password").val();
        var confirmPassword = $("#confirm_password").val();
        
        if(!oldPassword || !newPassword || !confirmPassword){
            swal("ข้อผิดพลาด !", "กรุณากรอกข้อมูลให้ครบ", "error", {
                button:{className:'hyper-btn-notoutline-danger'},
                closeOnClickOutside: false,
            });
            return;
        }

        if (!/^[A-Za-z0-9]{8,}$/.test(newPassword)) {
            swal("ข้อผิดพลาด !", "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และห้ามมีอักขระพิเศษ", "error", {
                button:{className:'hyper-btn-notoutline-danger'},
                closeOnClickOutside: false,
            });
            return;
        }
        
        let userData = await fetch(`${Users_API}/${profileapply.payload.id}`);
        let userJson = await userData.json();
        let decryptedOldPassword = await decryptPassword(userJson.password, userJson.salt, userJson.iv,oldPassword);
        if (decryptedOldPassword===null) {
            swal("ข้อผิดพลาด !", "รหัสผ่านเก่าไม่ถูกต้อง", "error", {
                button:{className:'hyper-btn-notoutline-danger'},
                closeOnClickOutside: false,
            });
            return;
        }
        
        if (newPassword === oldPassword) {
            swal("ข้อผิดพลาด !", "รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเก่า", "error", {
                button:{className:'hyper-btn-notoutline-danger'},
                closeOnClickOutside: false,
            });
            return;
        }
        
        if(newPassword !== confirmPassword){
            swal("ข้อผิดพลาด !", "รหัสผ่านใหม่ไม่ตรงกัน", "error", {
                button:{className:'hyper-btn-notoutline-danger'},
                closeOnClickOutside: false,
            });
            return;
        }
        
        let salt1 = generateRandomSalt();
        let { encryptedPassword, iv, salt } = await encryptPassword(newPassword, salt1);
        let response = await fetch(`${Users_API}/${profileapply.payload.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: encryptedPassword,
                iv:iv,
                salt:salt
            }),
        });
        if (response.ok) {
            swal("เสร็จสิ้น !", "เปลี่ยนรหัสผ่านสำเร็จ!", "success", {
                button: false,
                closeOnClickOutside: false,
            });
            setTimeout(function(){
                swal("Information", "กรุณาล็อคอินใหม่ !", "info", {
                    button:false,
                    closeOnClickOutside: false,
                });
                localStorage.removeItem("token")
            },2000)
        } else {
            swal("เกิดข้อผิดพลาด !", "กรุณาลองอีกครั้ง !", "error", {
                button:{className:'hyper-btn-notoutline-danger'},
                closeOnClickOutside: false,
            });
        }
    })
$('#save_edit_email').click(async(param)=>{
    const profileapply = await verifyJWT(localStorage.getItem("token"),"mysecret")
    const newemail=$("#email").val()
    const password=$('#email_password').val()
    let userData = await fetch(`${Users_API}/${profileapply.payload.id}`);
    let userJson = await userData.json();
    let decryptedOldPassword = await decryptPassword(userJson.password, userJson.salt, userJson.iv,password);
    if(!newemail||!password){
        swal("เกิดข้อผิดพลาด !", "กรูณากรอกข้อมูลให้ครบถ้วน !", "error", {
            button:{className:'hyper-btn-notoutline-danger'},
            closeOnClickOutside: false,
        });
        return
    }
    if (decryptedOldPassword===null) {
        swal("ข้อผิดพลาด !", "รหัสผ่านไม่ถูกต้อง", "error", {
            button:{className:'hyper-btn-notoutline-danger'},
            closeOnClickOutside: false,
        });
        return;
    }
    $.ajax({
        type: "PUT",
        url: `${Users_API}/${profileapply.payload.id}`,
        dataType: "json",
        data:{email:newemail},
        beforeSend: function() {
          swal("กำลังอัพเดตข้อมูล กรุณารอสักครู่...", { button: false, closeOnClickOutside: false, timer: 1900 });
        },
        success: function(data) {
          setTimeout(function() {
            swal("Successfully !", "เปลี่ยนอีเมลสำเร็จ !", "success", {
              button: { className: 'hyper-btn-notoutline-danger' },
              closeOnClickOutside: false,
            });
          }, 2000);
          localStorage.setItem("email",newemail)
          window.location.reload()
        },
        error: function(xhr, status, error) {
          console.log("Error:", error);
          swal("เกิดข้อผิดพลาด !", "เปลี่ยนอีเมลไม่สำเร็จ !", "error", {
            button: { className: 'hyper-btn-notoutline-danger' },
            closeOnClickOutside: false,
          });
        }
      });
})
document.getElementById("checktoken")
    .addEventListener("click", async ()=> {
        const token = localStorage.getItem("token");
        if (!token) {
            swal("ข้อผิดพลาด !", "Token Not Found | กรุณาล็อคอินใหม่", "error", {
                button:{className:'hyper-btn-notoutline-danger'},
                closeOnClickOutside: false,
            });
            sleep(2000).then(() => { window.location.href = "../../index.html"; });
            return;
        }
        const result = await verifyJWT(token, "mysecret");
        if (!result.valid) {
            if (result.reason === "Token expired") {
                swal("ข้อผิดพลาด !", "Token Expired | กรุณาล็อคอินใหม่", "error", {
                    button:{className:'hyper-btn-notoutline-danger'},
                    closeOnClickOutside: false,
                });
                localStorage.removeItem("token");
            } else {
                swal("ข้อผิดพลาด !", "Invalid Token | กรุณาล็อคอินใหม่", "error", {
                    button:{className:'hyper-btn-notoutline-danger'},
                    closeOnClickOutside: false,
                });
            }
            sleep(2000).then(() => { window.location.href = "../../index.html"; });
        } else {
            swal("Valid Token !", "ยินดีต้อนรับ | "+result.payload.username, "success", {
                button:{className:'hyper-btn-notoutline-danger'},
                closeOnClickOutside: false,
            });
        }
    });
    $(document).ready(async()=>{
        showData()
        setInterval(chktoken,2000)
    })