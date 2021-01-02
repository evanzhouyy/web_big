$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: '1',
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        })
    })



    // 通过代理的形式为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.mag('新增分类失败')
                }
                initArtCateList()
                layer.msg('新增分类成功')
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式为btn-edit绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function () {
        // 弹出一个修改文章分类的层

        indexEdit = layer.open({
            type: '1',
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })


    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改失败')
                }

                layer.msg('修改成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })


    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function () {
        var id = $(this).attr('data-id')
        // 询问用户是否要删除
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtCateList()
                }
            })

        });
    })






    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);''
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

})