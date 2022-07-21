$.ajaxPrefilter(function(options) {
    let url = 'http://big-event-api-t.itheima.net'
    options.url = url + options.url

    //判断是否需要携带headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
            //无论是否请求成功都会调用执行
        options.complete = function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token')
                location.href = './login.html'
            }
        }
    }
})