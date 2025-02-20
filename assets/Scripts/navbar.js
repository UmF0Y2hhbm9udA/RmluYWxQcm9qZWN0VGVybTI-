async function FetchNavbarData(){
    if(!localStorage.getItem('token')){return}
    const result = verifyJWT(localStorage.getItem("token"), "mysecret");
    const UserRequest = await(fetch(`${Users_API}/${(await result).payload.id}`))
    const LocalUser=await(UserRequest.json())
    document.getElementById("navbar_points").innerHTML=`<i class="fa-duotone fa-solid fa-wallet"></i>&nbsp;&nbsp;คงเหลือ : ${LocalUser.points}฿`
    $('#navbar_username').text(LocalUser.username);
    $('#navbar_email').text(LocalUser.email);
}
$(document).ready(function(){
    FetchNavbarData()
})
$('#logoutbtn').click(function(){
    localStorage.removeItem('token')
    swal("ออกจากระบบ เสร็จสิ้น", "กรุณาล็อคอินใหม่", "info", {
        button: { className: 'hyper-btn-notoutline-danger' },
        closeOnClickOutside: false,
    });
    window.location.href="./index.html"
})