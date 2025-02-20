let isProcessing=false;
document.getElementById("register_button").addEventListener("click",async (event)=>{
    event.preventDefault();
    const emailInput = document.getElementById("email");
    if (!emailInput.checkValidity()) {
        swal("สมัครสมาชิก ไม่สำเร็จ!", "กรุณากรอกอีเมลที่ถูกต้อง", "error", {
            button:{className:'hyper-btn-notoutline-danger'},
            closeOnClickOutside: false,
        });
        return;
    }
    if (isProcessing) return;
    isProcessing = true;
    var username = $("#username").val();
    var password = $("#password").val();
    var cpassword = $("#password_confirm").val();
    var email = $("#email").val();
    if (!username||!password||!cpassword||!email) {
        swal("สมัครสมาชิก ไม่สำเร็จ!", "กรุณากรอกรายละเอียดให้ครบ", "error", {
            button:{className:'hyper-btn-notoutline-danger'},
            closeOnClickOutside: false,
        });
        isProcessing = false;
        return;
    }
    let salt1 = generateRandomSalt();
    let res = await fetch(Users_API);
    let users = await res.json();
    if (users.some(user => user.username === username || user.email === email)) {
        swal("สมัครสมาชิก ไม่สำเร็จ!", "Username / Email already exists", "error", {
            button:{className:'hyper-btn-notoutline-danger'},
            closeOnClickOutside: false,
        });
        isProcessing = false;
        return;
    }
    if (username.length === 0) {
        swal("สมัครสมาชิก ไม่สำเร็จ!", "Invalid Username", "error", {
            button:{className:'hyper-btn-notoutline-danger'},
            closeOnClickOutside: false,
        });
        isProcessing = false;
        return;
    }
    if (!/^[A-Za-z0-9]{8,}$/.test(password)) {
        swal("สมัครสมาชิก ไม่สำเร็จ!", "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และห้ามมีอักขระพิเศษ", "error", {
            button:{className:'hyper-btn-notoutline-danger'},
            closeOnClickOutside: false,
        });
        isProcessing = false;
        return;
    }
    if(password!==cpassword){
        swal("สมัครสมาชิก ไม่สำเร็จ!", "Invalid Password Comfirm", "error", {
            button:{className:'hyper-btn-notoutline-danger'},
            closeOnClickOutside: false,
        });
        isProcessing = false;
        return;
    }
    let { encryptedPassword, iv, salt } = await encryptPassword(password, salt1);
    const registerTime = Date.now();
    const readableTime = new Date(registerTime).toLocaleString();
    $.ajax({
        type: "POST",
        url: Users_API,
        dataType: "json",
        data:{ username, password: encryptedPassword, email, iv,points:0, salt,datecreated:readableTime },
        beforeSend: function() {
          swal("กำลังเพิ่มข้อมูล กรุณารอสักครู่...", { button: false, closeOnClickOutside: false, timer: 1900 });
        },
        success: function(data) {
          setTimeout(function() {
            swal("Successfully !", "สมัครสมาชิกสำเร็จ !", "success", {
              button: { className: 'hyper-btn-notoutline-danger' },
              closeOnClickOutside: false,
            });
            setTimeout(function() { window.location.href="./Login.html"; }, 2000);
          }, 2000);
        },
        error: function(xhr, status, error) {
          console.log("Error:", error);
          swal("เกิดข้อผิดพลาด !", "สมัครสมาชิกไม่สำเร็จ !", "error", {
            button: { className: 'hyper-btn-notoutline-danger' },
            closeOnClickOutside: false,
          });
          isProcessing = false;
        }
      });
})
setInterval(function(){
    validationtk("./Homepage.html")
},1000)