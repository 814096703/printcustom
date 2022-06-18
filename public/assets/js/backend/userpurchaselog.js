define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'userpurchaselog/index' + location.search,
                    add_url: 'userpurchaselog/add',
                    edit_url: 'userpurchaselog/edit',
                    del_url: 'userpurchaselog/del',
                    multi_url: 'userpurchaselog/multi',
                    import_url: 'userpurchaselog/import',
                    table: 'userpurchaselog',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'), searchable: false, visible: false},
                        {field: 'ispay', title: '订单状态', operate: 'LIKE', searchList: {1:__('支付完成'),0:__('待支付')}, formatter: Table.api.formatter.status },
                        {field: 'p_name', title: '商品', operate: 'LIKE'},
                        {field: 'purchase_price', title: '购买价格', operate:'BETWEEN'},
                        {field: 'admin_name', title: '购买人', operate: 'LIKE'},
                        {field: 'createtime', title: '购买时间', operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
