async function fetchdata(){
    const AllUsersRequest = await(fetch(Users_API))
    const AllUsersjson = await(AllUsersRequest.json())
    const Uireq = await(fetch(UI_API))
    const Uijson = await(Uireq.json())
    const Scriptreq=await(fetch(Script_API))
    const scriptjson=await(Scriptreq.json())
    $('#Show_users').html(`${AllUsersjson.length}<span style="font-size: 18px;">&nbsp;คน</span>`)
    $('#uiamout').html(`${Uijson.length}<span style="font-size: 18px;">&nbsp;ชิ้น</span>`)
    $('#scriptamout').html(`${scriptjson.length}<span style="font-size: 18px;">&nbsp;สคริปต์</span>`)
    $('#allshow').html(`${Uijson.length+scriptjson.length}<span style="font-size: 18px;">&nbsp;ชิ้น</span>`)
    $("#uiamout2").html(`0 หมวดหมู่&nbsp;&nbsp;&nbsp;${Uijson.length} สินค้า`)
    $('#scriptamout2').html(`0 หมวดหมู่&nbsp;&nbsp;&nbsp;${scriptjson.length} สินค้า`)
}
$(document).ready(function(){
    fetchdata()
})