$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //点击上传按钮更换图片
    $('#upPic').click(function() {
            $('#file').click()

        })
        //为文件选择框绑定change事件
    $('#file').change(function(e) {
            if (e.target.files.length !== 0) {
                let file = e.target.files[0]
                let newImgURL = URL.createObjectURL(file)
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
        //确定，更换头像
    $('#confirm').click(function() {
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png,image/jpeg') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更换头像失败！')
                }
                window.parent.getUserMsg()
                layui.layer.msg('更换头像成功！')
            }
        })
    })
})