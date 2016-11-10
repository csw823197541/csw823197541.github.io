/**
 * Created by Badger on 16/7/27.
 */

function TableGen() {
}

TableGen.prototype.setTable = function (inTable) {

}

TableGen.prototype.tableID;
TableGen.prototype.modalID;
TableGen.prototype.editFields = new Array();
TableGen.prototype.apiName;
TableGen.prototype.table;

//
TableGen.prototype.bind = function () {
    window.onload = this.init();
    this.setTable(this.table);
    this.loadData();
}

//初始化Table的主函数
TableGen.prototype.init = function () {
    var $table = $('#' + this.tableID);
    this.table = $table;
    var $remove = $('#remove');
    var $add = $("#add");

    //重设表格高度
    setTimeout(function () {
        $table.bootstrapTable('resetView');
    }, 200);

    //选中记录时，改变删除按钮的状态
    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function () {
        $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
    });

    //'删除已选'按钮操作
    $remove.click(function () {
        var ids = getIdSelections();
        bootbox.setLocale("zh_CN");
        bootbox.confirm({
            size: 'small',
            message: "确认删除已选记录吗？",
            callback: function (result) {
                if (result) {
                    for (var idx in ids) {
                        deleteItem(apiObjUrl, ids[idx]);
                    }
                    $table.bootstrapTable('remove', {
                        field: 'id',
                        values: ids
                    });
                    $remove.prop('disabled', !getIdSelections().length);
                }
            }
        });
    });

    //'添加'按钮操作，清除模态框内的数据
    $add.click(function () {
        //清除form表单中原来的数据
        $(':input', '#myForm')
            .not(':button, :submit')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
    });

    //当窗口大小被调整时，调整table高度
    $(window).resize(function () {
        $table.bootstrapTable('resetView', {
            height: $(window).height()
        });
    });

    //得到当前选中行的id字段值(多行被选中时，返回是数组)
    function getIdSelections() {
        return $.map($table.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
    }
};

//初始化编辑事件显示形式
TableGen.prototype.operateFormatter = function (value, row, index) {
    return [
        '<a class="edit" href="javascript:void(0)" title="修改">',
        '<i class="glyphicon glyphicon-edit"></i>',
        '</a>&nbsp;&nbsp;&nbsp;',
        '<a class="remove" href="javascript:void(0)" title="删除">',
        '<i class="glyphicon glyphicon-remove"></i>',
        '</a>'
    ].join('');
};

//密码隐藏显示方法
TableGen.prototype.pwdFormatter = function (value, row, index) {
    return ['<i class="fa fa-key fa-fw"></i>'].join('');
};

//隐藏单元格多余的内容
TableGen.prototype.formatTableCell = function (value, row, index) {
    //以css样式来隐藏多余内容
    return {classes: "tableCell"};
};

//编辑事件处理方法
TableGen.prototype.operationEvent = function () {
    var $modal = $('#' + this.modalID);
    var fields = this.editFields;
    window.operateEvents = {
        'click .edit': function (e, value, row, index) {
            for (var item in fields) {//将选中记录赋值给modal框
                $('#' + fields[item]).val(row[fields[item]]);
            }
            $modal.modal('show');
            $modal.draggable({
                handle: ".modal-header",
                cursor: 'move',
                refreshPositions: false
            });
        },
        'click .remove': function (e, value, row, index) {
            var id = [row.id];
            bootbox.setLocale("zh_CN");
            bootbox.confirm({
                size: 'small',
                message: "确认删除已选记录吗？",
                callback: function (result) {
                    if (result) {
                        deleteItem(apiObjUrl, id);
                    }
                }
            });
        }
    };
    return window.operateEvents;
};


TableGen.prototype.loadData = function () {
    $.ajax({
        url: apiObjUrl,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $.cookie('author_code'));
        },
        success: function (data) {
            tableGen.table.bootstrapTable('load', data);
        },
        error: function (err) {
        }
    });
};

//刷新数据的方法
function refreshData(url) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $.cookie('author_code'));
        },
        success: function (data) {
            tableGen.table.bootstrapTable('load', data);
        },
        error: function (err) {
        }
    });
}

//删除一条记录的方法
function deleteItem(apiUrl, id) {
    var url = apiUrl + "/" + id;
    $.ajax({
        url: url,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $.cookie('author_code'));
        },
        success: function (data, state, result) {
            console.log("state: " + state + ", status:" + result.status + ", statusText:" + result.statusText);
            console.log("success data:" + JSON.stringify(data));
            if (state == 'success') {
                tableGen.table.bootstrapTable('remove', {
                    field: 'id',
                    values: id
                });
                alertTip("success");
            }
        },
        error: function (result, state) {
            console.log("state: " + state + ", status: " + result.status + ", statusText: " + result.statusText);
            alertTip("error");
        }
    });
}
