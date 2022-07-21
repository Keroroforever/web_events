$(function() {
    layer = layui.layer
    form = layui.form

    getCatesChoice()

    // 初始化富文本编辑器
    initEditor()

    //获取文章类别
    function getCatesChoice() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！')
                }
                let htmlStr = template('cates-choice', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击选择封面，弹出图片选择框
    $('.choice-cover').click(function() {
            $('.choice-pic').click()
        })
        // 选择图片
    $('.choice-pic').on('change', function(e) {
        if (e.target.files.length === 0) {
            return
        }
        let file = e.target.files[0]
        let newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    let article_state = '已发布'

    $('#btn-draft').click(function() {
        article_state = '草稿'
    })

    $('#issue-article').on('submit', function(e) {
        e.preventDefault()
        let fd = new FormData($(this)[0])
        fd.append('state', article_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                coverPublish(fd)
            })

    })

    function coverPublish(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功！')
                location.href = '/article/article_list.html'
            }
        })
    }
})