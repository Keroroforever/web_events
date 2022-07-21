$(function() {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 定义获取文章的列表数据的携带参数
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    renderList()
    getCate()

    //渲染列表数据
    function renderList() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                let htmlStr = template('render-list', res)
                $('tbody').html(htmlStr)
                laypageUI(res.total)
            }
        })
    }
    //时间函数补零
    function zeroPadding(data) {
        return data = data < 10 ? '0' + data : data
    }
    //格式化时间
    template.defaults.imports.Format = function(value) {
        let date = new Date(value)
        let y = zeroPadding(date.getFullYear())
        let m = zeroPadding(date.getMonth() + 1)
        let d = zeroPadding(date.getDate())

        let hh = zeroPadding(date.getHours())
        let mm = zeroPadding(date.getMinutes())
        let ss = zeroPadding(date.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    //获取文章分类并渲染到select
    function getCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                let htmlStr = template('cate-list', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }

    //点击筛选(绑定提交事件)，筛选并重新渲染
    $('#form-filter').on('submit', function(e) {
        e.preventDefault()
        q.cate_id = $('[name="cate_id"]').val()
        q.state = $('[name="state"]').val()
        renderList()
    })

    //分页功能
    function laypageUI(total) {
        layui.use('laypage', function() {
            laypage.render({
                elem: 'test1', //这里的 test1 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                curr: q.pagenum,
                limit: q.pagesize,
                limits: [2, 3, 5, 10],
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                // 触发 jump 回调的方式有两种：
                // 1. 点击页码的时候，会触发 jump 回调
                // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
                jump: function(obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit
                        //首次不执行
                    if (!first) {
                        //do something
                        renderList()
                    }
                }
            });
        });
    }

    //删除功能
    $('tbody').on('click', '#delete', function() {
        let id = $(this).attr('data-id')
        layer.confirm('确定要删除？', { icon: 3, title: '提示' }, function(index) {
            //获取删除按钮的个数
            length = $('#delete').length
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章数据失败！')
                    }
                    //当前分页数据只有一条时，要渲染前一页面的分页数据，
                    //当数据只有一条时，分页不能再-1
                    if (length === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    renderList()
                }
            })
            layer.close(index);
        });
    })

    //编辑功能
    let index = null
    $('tbody').on('click', '#edit-list', function() {
        //根据 Id 获取文章详情
        let id = $(this).attr('data-id')
        index = layer.open({
            type: 2,
            title: '修改文章内容',
            content: '/article/article_list_edit.html',
            area: ['1000px', '600px'],
            success: function(layero, index) {
                //给子页面赋值
                let body = layer.getChildFrame('body', index);
                body.contents().find("#btn-id").val(id)
            }
        });
    })
})