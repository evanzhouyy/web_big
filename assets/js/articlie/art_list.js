$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 查询参数对象q，将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
      }
    initTable()
    initCate()

    // 为筛选按钮绑定点击事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        initTable()
    })





    // 定义美化过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 通过代理的形式为删除按钮绑定点击事件函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后需要判断当前这一页中是否还有剩余的数据，如果没有剩余的数据了则让页码值-1之后在重新调用initTable方法
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完毕后，页面上没有任何数据了
                        // 页码值最小是1
                        q.pagenum=q.pagenum==1?1:q.pagenum-1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total,  //总数据条数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum,    //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            // 分页发生切换的时候，触发jump回调
            jump: function (obj, first) {
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到q这个查询参数对象的pagesize中
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
})