$(function() {
    //密码相关验证
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        newPwd: function(value) {
            if (value === $('[name="oldPwd"]').val()) {
                return '新密码不能和旧密码重复！'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name="newPwd"]').val()) {
                return '两次输入的密码不一致！'
            }
        }
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $('.layui-form').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                $('.layui-form')[0].reset()
            }
        })
    })
})