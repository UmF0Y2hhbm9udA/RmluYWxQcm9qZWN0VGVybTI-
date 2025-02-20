var edit_ui_modal = new bootstrap.Modal(document.getElementById("edit_ui_modal"));
var edit_script_modal = new bootstrap.Modal(document.getElementById("edit_script_modal"))
function closeUiEdit(){
    edit_ui_modal.hide();
}
function closeScriptEdit(){
    edit_script_modal.hide()
}
async function fetchdata(){
    const response = await fetch(UI_API);
    const scriptreq=await(fetch(Script_API))
    const scriptjson=await(scriptreq.json())
    const games = await response.json();
    const gameContainer = document.getElementById("ui-list-product");
    const ScriptContainer=document.getElementById("script-list-product");
    ScriptContainer.innerHTML="";
    gameContainer.innerHTML = "";
    games.forEach(game => {
        gameContainer.innerHTML += `
                        <tr>
                            <td class="p-0" data-order="1">
                                <div class="d-flex justify-content-between p-0 m-0">
                                    <div class="mx-0 mb-0 mb-lg-2 mt-0 p-0" style="width: 100% !important;">
                                        <div class="d-flex justify-content-start align-items-start align-items-lg-center mt-1 p-0">
                                            <h6 class="d    -flex justify-content-center align-items-center border mx-2 my-0 p-0" style="min-width: 100px; min-height: 35px; max-width: 75px; max-height: 75px; border-radius: 10px;">${game.id}</h6>
                                            <div class="col-10 col-lg-12 row justify-content-center justify-content-lg-start align-items-center">
                                                <div class="col-12 col-lg-6 row justify-content-center">
                                                    <p class="col-12 text-theme text-center m-0 p-0">ชื่อ</p>
                                                    <p class="col-12 text-main text-center m-0 p-0">${game.name}</p>
                                                </div>
                                                <div class="col-12 col-lg-6 mt-1 mt-lg-0 row justify-content-center">
                                                    <p class="col-12 text-theme text-center m-0 p-0">ราคา</p>
                                                    <p class="col-12 text-main text-center m-0 p-0">${game.price} บาท</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row justify-content-center justify-content-lg-between align-items-end me-3 pb-2">
                                    <div class="col-12 col-lg-12 d-flex justify-content-end p-0 m-0">
                                        <button class="btn btn-info btn-data-table py-1 px-2 me-2" onclick="EditUitemplate(${game.id},'${game.name}',${game.price},'${game.imageurl}')">แก้ไข&nbsp;&nbsp;<i class='fa-duotone fa-solid fa-hammer'></i></button>
                                        <button class="btn btn-warning btn-data-table py-1 px-2 me-2" onclick="removeItem('${UI_API}',${game.id})">ลบ&nbsp;&nbsp;<i class="fa-duotone fa-solid fa-clock-rotate-left"></i></button>
                                    </div>
                                </div>
                            </td>
                        </tr>
        `;
    });
    scriptjson.forEach(game=>{
        ScriptContainer.innerHTML+=`
                        <tr>
                            <td class="p-0" data-order="1">
                                <div class="d-flex justify-content-between p-0 m-0">
                                    <div class="mx-0 mb-0 mb-lg-2 mt-0 p-0" style="width: 100% !important;">
                                        <div class="d-flex justify-content-start align-items-start align-items-lg-center mt-1 p-0">
                                            <h6 class="d    -flex justify-content-center align-items-center border mx-2 my-0 p-0" style="min-width: 100px; min-height: 35px; max-width: 75px; max-height: 75px; border-radius: 10px;">${game.id}</h6>
                                            <div class="col-10 col-lg-12 row justify-content-center justify-content-lg-start align-items-center">
                                                <div class="col-12 col-lg-6 row justify-content-center">
                                                    <p class="col-12 text-theme text-center m-0 p-0">ชื่อ</p>
                                                    <p class="col-12 text-main text-center m-0 p-0">${game.name}</p>
                                                </div>
                                                <div class="col-12 col-lg-6 mt-1 mt-lg-0 row justify-content-center">
                                                    <p class="col-12 text-theme text-center m-0 p-0">ราคา</p>
                                                    <p class="col-12 text-main text-center m-0 p-0">${game.price} บาท</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row justify-content-center justify-content-lg-between align-items-end me-3 pb-2">
                                    <div class="col-12 col-lg-12 d-flex justify-content-end p-0 m-0">
                                        <button class="btn btn-info btn-data-table py-1 px-2 me-2" onclick="EditScripttemplate(${game.id},'${game.name}',${game.price},'${game.imageurl}')">แก้ไข&nbsp;&nbsp;<i class='fa-duotone fa-solid fa-hammer'></i></button>
                                        <button class="btn btn-warning btn-data-table py-1 px-2 me-2" onclick="removeItem('${Script_API}',${game.id})">ลบ&nbsp;&nbsp;<i class="fa-duotone fa-solid fa-clock-rotate-left"></i></button>
                                    </div>
                                </div>
                            </td>
                        </tr>
        `;
    })
}
async function removeItem(target,id){
    if(!id) return;
    swal({
        title: "Are you sure?",
        text: "การกระทำนี้ไม่สามารถกู้คืนได้ !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((result) => {
        if (result) {
            $.ajax({
                type: "DELETE",
                url: `${target}/${id}`,
                beforeSend: function() {
                  swal("กำลังลบข้อมูล กรุณารอสักครู่...", { button: false, closeOnClickOutside: false, timer: 1900 });
                },
                success: function(data) {
                  setTimeout(function() {
                    swal("Successfully !", "ลบสำเร็จ !", "success", {
                      button: { className: 'hyper-btn-notoutline-danger' },
                      closeOnClickOutside: false,
                    });
                  }, 2000);
                  window.location.reload()
                },
                error: function(xhr, status, error) {
                  console.log("Error:", error);
                  swal("เกิดข้อผิดพลาด !", "ลบไม่สำเร็จ !", "error", {
                    button: { className: 'hyper-btn-notoutline-danger' },
                    closeOnClickOutside: false,
                  });
                }
              });
        }
      });
}
async function EditUitemplate(id,name,price,image){
    $('#modal_edit_ui_name').val(name)
    $('#modal_edit_ui_price').val(price)
    $('#modal_edit_ui_image').val(image)
    $("#edit_UiTemplate").click(async(param)=>{
        $.ajax({
            type: "PUT",
            url: `${UI_API}/${id}`,
            dataType: "json",
            data:{
                name:$('#modal_edit_ui_name').val(),
                price:$('#modal_edit_ui_price').val(),
                imageurl:$('#modal_edit_ui_image').val()
            },
            beforeSend: function() {
              swal("กำลังอัพเดตข้อมูล กรุณารอสักครู่...", { button: false, closeOnClickOutside: false, timer: 1900 });
            },
            success: function(data) {
            swal("Successfully !", "แก้ไขสำเร็จ !", "success", {
                button: { className: 'hyper-btn-notoutline-danger' },
                closeOnClickOutside: false,
                timer:2000
            });
              window.location.reload()
            },
            error: function(xhr, status, error) {
              console.log("Error:", error);
              swal("เกิดข้อผิดพลาด !", "แก้ไขไม่สำเร็จ !", "error", {
                button: { className: 'hyper-btn-notoutline-danger' },
                closeOnClickOutside: false,
              });
            }
          });
    })
    edit_ui_modal.show();
}
async function EditScripttemplate(id,name,price,image){
    $('#modal_edit_script_name').val(name)
    $('#modal_edit_script_price').val(price)
    $('#modal_edit_script_image').val(image)
    $("#edit_scriptTemplate").click(async(param)=>{
        $.ajax({
            type: "PUT",
            url: `${Script_API}/${id}`,
            dataType: "json",
            data:{
                name:$('#modal_edit_script_name').val(),
                price:$('#modal_edit_script_price').val(),
                imageurl:$('#modal_edit_script_image').val()
            },
            beforeSend: function() {
              swal("กำลังอัพเดตข้อมูล กรุณารอสักครู่...", { button: false, closeOnClickOutside: false, timer: 1900 });
            },
            success: function(data) {
            swal("Successfully !", "แก้ไขสำเร็จ !", "success", {
                button: { className: 'hyper-btn-notoutline-danger' },
                closeOnClickOutside: false,
                timer:2000
            });
              window.location.reload()
            },
            error: function(xhr, status, error) {
              console.log("Error:", error);
              swal("เกิดข้อผิดพลาด !", "แก้ไขไม่สำเร็จ !", "error", {
                button: { className: 'hyper-btn-notoutline-danger' },
                closeOnClickOutside: false,
              });
            }
          });
    })
    edit_script_modal.show();
}
let newuiprocess = false;
let newscriptprocess = false;
$('#new_UiTemplate').click(async(param)=>{
    if(newuiprocess) return
    newuiprocess=true;
    const name=$('#new_ui_name').val()
    const price=$('#new_ui_price').val();
    const imageurl=$('#new_ui_image').val()
    if(!name||!price||!imageurl){
        swal("เกิดข้อผิดพลาด !", "กรอกให้ครบ !", "error", {
            button: { className: 'hyper-btn-notoutline-danger' },
            closeOnClickOutside: false,
        });
        newuiprocess=false
        return
    }
    $.ajax({
        type: "POST",
        url: `${UI_API}`,
        dataType: "json",
        data:{name,price,imageurl},
        beforeSend: function() {
          swal("กำลังเพิ่มข้อมูล กรุณารอสักครู่...", { button: false, closeOnClickOutside: false, timer: 1900 });
        },
        success: function(data) {
        swal("Successfully !", "เพิ่มสำเร็จ !", "success", {
            button: { className: 'hyper-btn-notoutline-danger' },
            closeOnClickOutside: false,
            timer:2000
        });
          window.location.reload()
        },
        error: function(xhr, status, error) {
          console.log("Error:", error);
          swal("เกิดข้อผิดพลาด !", "เพิ่มไม่สำเร็จ !", "error", {
            button: { className: 'hyper-btn-notoutline-danger' },
            closeOnClickOutside: false,
          });
        }
      });
})
$('#new_scriptTemplate').click(async(param)=>{
    if(newuiprocess) return
    newuiprocess=true;
    const name=$('#new_script_name').val()
    const price=$('#new_script_price').val();
    const imageurl=$('#new_script_image').val()
    if(!name||!price||!imageurl){
        swal("เกิดข้อผิดพลาด !", "กรอกให้ครบ !", "error", {
            button: { className: 'hyper-btn-notoutline-danger' },
            closeOnClickOutside: false,
        });
        newuiprocess=false
        return
    }
    $.ajax({
        type: "POST",
        url: `${Script_API}`,
        dataType: "json",
        data:{name,price,imageurl},
        beforeSend: function() {
          swal("กำลังเพิ่มข้อมูล กรุณารอสักครู่...", { button: false, closeOnClickOutside: false, timer: 1900 });
        },
        success: function(data) {
        swal("Successfully !", "เพิ่มสำเร็จ !", "success", {
            button: { className: 'hyper-btn-notoutline-danger' },
            closeOnClickOutside: false,
            timer:2000
        });
          window.location.reload()
        },
        error: function(xhr, status, error) {
          console.log("Error:", error);
          swal("เกิดข้อผิดพลาด !", "เพิ่มไม่สำเร็จ !", "error", {
            button: { className: 'hyper-btn-notoutline-danger' },
            closeOnClickOutside: false,
          });
        }
      });
})

$(document).ready(async()=>{
    fetchdata()
    setInterval(chktoken,2000)
})
