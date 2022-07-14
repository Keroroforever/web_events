$(function() {
    //点击切换为注册页面
    $('#goRegistor').on('click', function() {
            $('.formLogin').hide()
            $('.login-registor').css('height', '355px')
            $('.formRegistor').css('display', 'flex')
        })
        //点击切换为登录页面
    $('#goLogin').on('click', function() {
        $('.formRegistor').hide()
        $('.login-registor').css('height', '270px')
        $('.formLogin').show()
    })

    //表单验证
    let form = layui.form
    let layer = layui.layer
    form.verify({
            username: function(value) {
                if (!/^[\S]{6,12}/.test(value)) {
                    return '用户名必须6到12位，且不能出现空格'
                }
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
            },
            password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            repassword: function(value) {
                let pwd = $('.formRegistor [name="password"]').val()
                if (pwd !== value) {
                    return '两次输入的密码不一致'
                }
            }
        })
        // 登录
    $('.formLogin').submit(function(e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })

    //注册
    $('.formRegistor').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('.formRegistor [name="username"]').val(),
                password: $('.formRegistor [name="password"]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功')
                $('#goLogin').click()
            }
        })
    })
})