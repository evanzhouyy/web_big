$(function () {
    // 调用用户基本信息
    getUserInfo()

    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地存储中的token
            localStorage.removeItem('token')
            location.href = '/login.html'
            // 关闭弹出框
            layer.close(index);
        });
    })
})


// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            console.log(res);
            // 调用 renderAvatar 渲染用户的头像
            if (res.status !== 0) return
            renderAvatar(res.data)
        },
    })
}


function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}