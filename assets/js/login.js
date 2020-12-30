$(function () {
  $("#link_reg").on('click', function () {
      $(".login-box").hide()
      $(".reg-box").show()
  })
  $("#link_login").on('click', function () {
      $(".login-box").show()
      $(".reg-box").hide()
  })
  var form = layui.form
  var layer = layui.layer
  form.verify({
      pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
      repwd: function (value) {
          var pwd = $('.reg-box [name=password]').val()
          if (pwd !== value) {
              return '两次输入密码不一致'
          }
      }
  })
  // 监听注册表单的提交事件
  $('#form-reg').on('submit', function (e) {
      e.preventDefault()
      var data = {
          username: $('#form-reg [name=username]').val(),
          password: $('#form-reg [name=password]').val()
      }
      console.log(data);
      $.post('/api/reguser', data, function (res) {
          if (res.status !== 0) {
              return layer.msg(res.message)
          }
          layer.msg('注册成功，请登录')
          // console.log('注册成功');
          $('#link_login').click()
      })
  })
  // 监听登录表单的提交事件
  $('#form-login').submit(function (e) {
      e.preventDefault()
      $.ajax({
          url: '/api/login',
          type: 'POST',
          data: $(this).serialize(),
          success: function (res) {
              if (res.status !== 0) {
                      return layer.msg('登陆失败')
              }
              layer.msg('登陆成功')
              localStorage.setItem('token',res.token)
              location.href = '/index.html'
          }
      })
  })
})
