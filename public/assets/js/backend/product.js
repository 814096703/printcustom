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
                        {field: 'p_name', title: '商品名称', operate: 'LIKE'},
                        {field: 'p_image', title: '商品封面', operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'price', title: '商品价格', operate:'BETWEEN'},
                        {field: 'name', title: '模板名称', operate: 'LIKE'},
                        {field: 'exa_image', title: '模板图片', operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'createtime', title: '创建时间', operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'updatetime', title: '更新时间', operate:'RANGE', addclass:'datetimerange', autocomplete:false},
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
                    url:"product/getTempByPid/id/"+id,
                    success:function(result){
                        // console.log('res', result);
                        
                        let tempdata = (result && result['tempdata'])? JSON.parse(result['tempdata']): {};
                        let fielddata = (result && result['fielddata'])? JSON.parse(result['fielddata']): [];
                        
                        let htemp = new hiprint.PrintTemplate({template: tempdata});

                        let data_tmp = {};
                        fielddata.forEach(ele=>{
                            if(ele.field.split('-').pop()=='checkbox'){
                                data_tmp[ele.field] = ele.use_default? (ele.default_value? "√": ""): "";
                            }else{
                                data_tmp[ele.field] = ele.use_default?ele.default_value: "";
                            }
                        })
                        // console.log('data_tmp', data_tmp);
                    
                        $("#A4_printByHtml").click(function(){
                            htemp.print(data_tmp);
                        });
                        $('#myModal .modal-body .prevViewDiv').html(htemp.getHtml(data_tmp));
                        
                        $('#myModal').modal('show')
                    
                    }
                });
               
            }
            window.buy=function(id, price){
                if(Number(price)>0){
                    window.top.Fast.api.open("product/buy/id/"+id, '支付', {
                        area: ["100%", "100%"],
                        cancel:function(){
                            // console.log('baidu');
                            $.ajax({
                                async: false,
                                url:"product/ispay/id/"+id,
                                success: function (ret) {
                                    if(ret.code ==1){
                                        
                                        layer.msg(ret.msg);
            
                                    }else layer.msg(ret.msg);
                                    
                                }, error: function (e) {
                                    Backend.api.toastr.error(e.message);
                                }
                            });
                        }
                    })
                }else{
                    $.ajax({
                        url:"product/buy/id/"+id,
                        success: function (ret) {
                            if(ret.code ==1){
                                layer.msg(ret.msg);
                            }else layer.msg(ret.msg);
                        }, error: function (e) {
                            Backend.api.toastr.error(e.message);
                        }
                    });
                }
                
               
            }
           
            Controller.api.bindevent();
        },
        buy: function () {
            setTimeout(()=>{
                window.open(Config.pay_url, '_blank');
            }, 2000)
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
