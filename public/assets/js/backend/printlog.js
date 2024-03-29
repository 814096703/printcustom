define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'printlog/index' + location.search,
                    add_url: 'printlog/add',
                    edit_url: 'printlog/edit',
                    del_url: 'printlog/del',
                    multi_url: 'printlog/multi',
                    import_url: 'printlog/import',
                    table: 'printlog',
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
                        
                        {field: 'name', title: '模板'},
                        {field: 'username', title: '打印人'},
                        {field: 'createtime', title: '打印时间', operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        
                        
                        
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
