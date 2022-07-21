$(function() {
    let layer = layui.layer
    let form = layui.form
    let index = null

    renderTable()
        //渲染文章表格
    function renderTable() {
        //获取文章分类列表
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                let htmlStr = template('render_list', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //添加类别弹出框
    $('#add-cate').click(function() {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#layer-cate').html(),
        });
    })


    //添加文章分类
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败！')
                }
                renderTable()
                layer.msg('添加文章分类成功！')
                layer.close(index);
            }
        })
    })

    //编辑类别弹出框
    $('tbody').on('click', '#edit', function() {
        index = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#layer-cate-edit').html(),
        });
        // 初始化编辑框
        let id = $(this).prev().text()
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                form.val("form-edit", res.data);
            }
        })
    })

    //编辑文章类别， 修改内容后提交数据更新内容
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                renderTable()
                layer.msg('更新分类信息成功！')
                layer.close(index)
            }
        })
    })

    //删除一个文章类别
    $('tbody').on('click', '#delete', function() {
        let id = $(this).prev().prev().text()
        layer.confirm('确定要删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    renderTable()
                    layer.msg('删除分类成功！')
                    layer.close(index);
                }
            })
        });

    })
})