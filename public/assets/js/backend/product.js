define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'hpbundle', 'customElementTypeProvider'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'product/index' + location.search,
                    add_url: 'product/add',
                    edit_url: 'product/edit',
                    del_url: 'product/del',
                    multi_url: 'product/multi',
                    import_url: 'product/import',
                    table: 'product',
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
                        {field: 'id', title: __('Id')},
                        {field: 'p_name', title: __('P_name'), operate: 'LIKE'},
                        {field: 'p_image', title: __('P_image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'price', title: __('Price'), operate:'BETWEEN'},
                        {field: 'temp_id', title: __('Temp_id')},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
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
        shop: function () {
            // 样式相关
            $gitem = $(".goods-item");
            // 商品鼠标经过样式
            $gitem.hover(function(){
                $(this).addClass("item-active");
            },function(){
                $(this).removeClass("item-active");
            })
            
            // 预览 
            hiprint.init();
            window.pre=function(id){
                
                $.ajax({
                    async: false,
                    url:"product/getTempByPid/id/"+id,
                    success:function(result){
                        // console.log('res', result);
                        
                        let tempdata = (result && result['tempdata'])? JSON.parse(result['tempdata']):{};
                        
                        let htemp = new hiprint.PrintTemplate({template: tempdata});
                    
                        $("#A4_printByHtml").click(function(){
                            htemp.print({});
                        });
                        $('#myModal .modal-body .prevViewDiv').html(htemp.getHtml({}));
                        
                        $('#myModal').modal('show')
                    
                    }
                });
               
            }
            
           
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
