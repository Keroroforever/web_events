$(function() {
    //获取并渲染用户信息
    getUserMsg()
    let layer = layui.layer
    $('.quit').click(function() {
        layer.confirm('确定要退出登录吗？', { icon: 3, title: '提示' }, function(index) {
            localStorage.removeItem('token')
            location.href = './login.html'
            layer.close(index);
        });
    })


})

function getUserMsg() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            getAvater(res.data)
        },
    })
}
//渲染用户信息
function getAvater(data) {
    let username = data.nickname || data.username
    $('.avater span i').text(username)
    if (!data.user_pic) {
        $('.layui-nav-img').hide()
        let userFirst = username[0].toUpperCase()
        $('.textAvater').text(userFirst).show()
    } else {
        $('.layui-nav-img').attr('src', data.user_pic).show()
        $('.textAvater').hide()
    }
}