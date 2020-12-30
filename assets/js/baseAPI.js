$.ajaxPrefilter(function(options){
  options.url='http://ajax.frontend.itheima.net'+options.url
  console.log(options.url);
  


  // 统一为有权限的接口设置headers请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
  }
  }
  
})