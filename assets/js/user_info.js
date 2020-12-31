$(function () {
  var form = layui.form
  var layer = layui.layer
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })
  intiUserInfo()

  $('#btnReset').on('click', function (e) {
    e.preventDefault()
    intiUserInfo()
    // console.log();
  })

  $('.layui-form').submit(function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败')
        }
        layer.msg('更新用户信息成功!')
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }
    })
  })

  // 初始化用户信息
  function intiUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        console.log(res)
        form.val('formUserInfo', res.data)
      }
    })
  }
})