$(function() {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })
    initUserInfo()
        //初始化表单信息
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取用户信息失败')
                    //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                    // "name": "value"
                form.val("formTest", res.data);
            }
        })
    }

    //提交表单更新数据
    $('#btnSubmit').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $('#btnSubmit').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                window.parent.getUserMsg()
            }
        })
    })

    //重置表单信息
    $('button[type="reset"]').click(function(e) {
        e.preventDefault()
        initUserInfo()
    })
})