define(['jquery', 'bootstrap', 'backend', 'table', 'form','hpbundle'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            console.log('adminIds', Config.adminIds);
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'usertemp/index' + location.search,
                    add_url: 'usertemp/add',
                    edit_url: 'usertemp/edit',
                    del_url: 'usertemp/del',
                    multi_url: 'usertemp/multi',
                    import_url: 'usertemp/import',
                    table: 'usertemp',
                }
            });

            var table = $("#table");

            $("#btn-print").click(() => {
                let ids = Table.api.selectedids(table);
                
                console.log('IDS', ids);
                window.top.Fast.api.open('usertemp/print/ids/'+ (ids.length>0? ids[0]: ''), '打印', {
                    area: ["100%", "100%"]
                });
            })

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'weigh',
                columns: [
                    [
                        {checkbox: true},
                        
                        {field: 'name', title: '模板名称', operate:'RANGE'},
                        {field: 'exa_image', title: '模板图片', operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'admin_name', title: '创建人'},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'weigh', title: __('Weigh'), operate: false,visible: false},
                        {field: 'default_data', title: __('Default_data'),visible: false},
                        // {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate},
                        {
                            field: 'buttons',
                            width: "120px",
                            title: __('按钮组'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'print',
                                    text: '打印',
                                    title: '打印',
                                    classname: 'btn btn-xs btn-primary btn-dialog',
                                    icon: 'fa fa-print',
                                    url: 'usertemp/print',
                                    
                                    visible: function (row) {
                                        //返回true时按钮显示,返回false隐藏
                                        return true;
                                    }
                                },
                                
                               
                            ],
                            formatter: Table.api.formatter.buttons
                        }
                    ]
                ]
            });
            

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        recyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'usertemp/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {
                            field: 'deletetime',
                            title: __('Deletetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            width: '130px',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'usertemp/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'usertemp/destroy',
                                    refresh: true
                                }
                            ],
                            formatter: Table.api.formatter.operate
                        }
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
        print: function () {
            console.log('ids', Config.ids);
            console.log('temp', Config.temp);
            // let input_test = {
            //     "panels": [{
            //         "index": 0,
            //         "paperType": "A4",
            //         "height": 297,
            //         "width": 210,
            //         "paperHeader": 43.5,
            //         "paperFooter": 801,
            //         "printElements": [{
            //             "options": {
            //                 "left": 94.5,
            //                 "top": 93,
            //                 "height": 9.75,
            //                 "width": 30,
            //                 "field": "input_test",
            //                 "testData": "测",
                            
            //             },
            //             "printElementType": {
            //                 "type": "text",
            //                 "formatter":function(title,value,options,templateData,target){ 
            //                     return '<input type="text" name="fname">'; 
            //                 }
            //             }
            //         }],
            //         "paperNumberLeft": 565,
            //         "paperNumberTop": 819
            //     }]
            // }
            let input_test = {
                "panels": [{
                    "index": 0,
                    "width": 210,
                    "height": 128,
                    "paperFooter": 362.8346456692914,
                    "paperHeader": 43.5,
                    "printElements": [{
                        "options": {
                            "src": "/uploads/20220520/17b674d0a29616b1107dc9db63a87fc4.jpg",
                            "top": 0,
                            "left": 0,
                            "field": "b-nonprinting",
                            "width": 594,
                            "height": 358.5
                        },
                        "printElementType": {
                            "type": "image"
                        }
                    }, {
                        "options": {
                            "top": 90,
                            "left": 171,
                            "field": "lddw",
                            "fixed": true,
                            "width": 346.5,
                            "height": 9.75,
                            "fontSize": 12,
                            "testData": "立档单位",
                            "fontFamily": "SimSun",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text",
                            "formatter":function(title,value,options,templateData,target){ 
                                return `<input type="text" name="${options.field}" style="width: ${options.width}pt; border-style: none;" value="${value}">`;
                            }
                        }
                    }, {
                        "options": {
                            "top": 123,
                            "left": 291,
                            "field": "fkpz",
                            "fixed": true,
                            "width": 40.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "付款",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text",
                            "formatter":function(title,value,options,templateData,target){ 
                                return `<input type="text" name="${options.field}" style="width: ${options.width}pt; border-style: none;" value="${value}">`;
                            }
                        }
                    }, {
                        "options": {
                            "top": 123,
                            "left": 279,
                            "field": "fk_check",
                            "fixed": true,
                            "width": 15,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "√",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text",
                            "formatter":function(title,value,options,templateData,target){ 
                                return `<input type="checkbox" name="${options.field}" style="width: ${options.width}pt; border-style: none;" value="${value}">`;
                            }
                        }
                    }, {
                        "options": {
                            "top": 123,
                            "left": 390,
                            "field": "zz_check",
                            "fixed": true,
                            "width": 16.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "√",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 123,
                            "left": 181.5,
                            "field": "skpz",
                            "fixed": true,
                            "width": 42,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "收款",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 123,
                            "left": 457.5,
                            "field": "ty_check",
                            "fixed": true,
                            "width": 12,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "√",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 123,
                            "left": 169.5,
                            "field": "sk_check",
                            "fixed": true,
                            "width": 15,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "√",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 151.5,
                            "left": 297,
                            "field": "start_day",
                            "fixed": true,
                            "width": 30,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "18",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 151.5,
                            "left": 364.5,
                            "field": "end_year",
                            "fixed": true,
                            "width": 52.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "2020",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 151.5,
                            "left": 436.5,
                            "field": "end_month",
                            "fixed": true,
                            "width": 27,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "8",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 151.5,
                            "left": 258,
                            "field": "start_month",
                            "fixed": true,
                            "width": 27,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "7",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 151.5,
                            "left": 475.5,
                            "field": "end_day",
                            "fixed": true,
                            "width": 30,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "22",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 151.5,
                            "left": 184.5,
                            "field": "start_year",
                            "fixed": true,
                            "width": 52.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "2018",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 180,
                            "left": 379.5,
                            "field": "ce",
                            "fixed": true,
                            "width": 120,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "1",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 180,
                            "left": 219,
                            "field": "csSum",
                            "fixed": true,
                            "width": 43.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "10",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 207,
                            "left": 376.5,
                            "field": "hsStart",
                            "fixed": true,
                            "width": 39,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "2",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 207,
                            "left": 219,
                            "field": "hsSum",
                            "fixed": true,
                            "width": 43.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "12",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 207,
                            "left": 462,
                            "field": "hsEnd",
                            "fixed": true,
                            "width": 42,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "4",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 232.5,
                            "left": 169.5,
                            "field": "fz",
                            "fixed": true,
                            "width": 346.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "附注",
                            "fontWeight": "600"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 276,
                            "left": 373.5,
                            "field": "案卷号",
                            "fixed": true,
                            "width": 49.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "123",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 276,
                            "left": 261,
                            "field": "mlh",
                            "fixed": true,
                            "width": 49.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "123",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 276,
                            "left": 486,
                            "field": "bgh",
                            "fixed": true,
                            "width": 49.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "123",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 276,
                            "left": 150,
                            "field": "qzh",
                            "fixed": true,
                            "width": 49.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "123",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 307.5,
                            "left": 367.5,
                            "field": "zdr",
                            "fixed": true,
                            "width": 52.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "装订人",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 307.5,
                            "left": 252,
                            "field": "kj",
                            "fixed": true,
                            "width": 66,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "会计",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 307.5,
                            "left": 484.5,
                            "field": "bgnx",
                            "fixed": true,
                            "width": 43.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "3",
                            "textAlign": "center",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }, {
                        "options": {
                            "top": 307.5,
                            "left": 138,
                            "field": "cwzg",
                            "fixed": true,
                            "width": 58.5,
                            "height": 9.75,
                            "fontSize": 11.25,
                            "testData": "主管",
                            "fontWeight": "700"
                        },
                        "printElementType": {
                            "type": "text"
                        }
                    }],
                    "paperNumberTop": 340,
                    "paperNumberLeft": 565
                }]
            }
            let temp = Config.temp;
            let row = Config.row;
            let tempdataObj = JSON.parse(temp['tempdata']);
            let data_tmp = {
                input_test: '555'
            }
            tempdataObj = input_test;
            let fielddataObj = JSON.parse(temp['fielddata']);
            let defaultdataObj = JSON.parse(row['default_data']);
            hiprint.init();
            //初始化模板
            let htemp =  new hiprint.PrintTemplate({template: tempdataObj});

            $('#p_mx1').html(htemp.getHtml({}));
            // $('#p_mx1').html(htemp.getHtml(data_tmp));

            // 字段开始
            let tmp_data = {};
            const changePrintField = () => {
                eleArr.forEach((ele) => {
                    ele = ele['options'];
                    if(Object.hasOwnProperty.call(ele, 'field')){
                        tmp_data[ele.field] = $("#field_"+ele.field).val();
                    }
                })
                $('#p_mx1').html(htemp.getHtml(tmp_data));
            }

            let eleArr = tempdataObj? tempdataObj['panels'][0]['printElements']:[];
            
            eleArr.forEach(ele => {
                ele = ele['options'];
                if(Object.hasOwnProperty.call(ele, 'field')){
                    let title = ele.field;
                    let value = ele['src'] || ele['testData'] || '';
                    if(Object.hasOwnProperty.call(fielddataObj, ele.field)){
                        title = fielddataObj[ele.field];
                    }
                    
                    if(Object.hasOwnProperty.call(defaultdataObj, ele.field)){
                        value = defaultdataObj[ele.field];
                    }
                    
                    let field_div = `
                        <label class="control-label col-xs-12 col-sm-2" style="margin:5px 0px">${title}:</label>
                        <div class="col-xs-12 col-sm-4" style="margin:2px 0px">
                            <input id="field_${ele.field}" class="form-control print_field" name="field_${ele.field}" type="text" value="${value}">
                        </div>
                    `;
                    
                    $("#fieldinfo").append(field_div);
                    changePrintField();
                }
            });
            console.log('tmp_data', tmp_data);
            const saveprintlog = () => {
                $.ajax({
                    async: true,
                    type: "POST",
                    url:"printlog/add",
                    data: {
                        'row[temp_id]': temp['id'],
                        'row[temp_data]': JSON.stringify(tmp_data)
                    },
                    success: function (ret) {
                        if(ret.code ==1){
                            layer.msg(ret.msg);
                        }else layer.msg(ret.msg);
                        
                    }, error: function (e) {
                        Backend.api.toastr.error(e.message);
                    }
                });
            }
            
            $(".print_field").change(changePrintField);
            $("#handleprintmx1").click(function(){
                saveprintlog();
                filterArr = eleArr.filter((e) => {
                    if(!Object.hasOwnProperty.call(e['options'], 'field') || e['options']['field'].split('-').pop()!=='nonprinting'){
                        return e;
                    }
                });
                tempdataObj['panels'][0]['printElements'] = filterArr;
                let print_htemp = new hiprint.PrintTemplate({template: tempdataObj});
                console.log('print_htemp', print_htemp);
                print_htemp.print(tmp_data);
                
            });
            $('#savedefaultdata').click(() => {
                $.ajax({
                    async: false,
                    type: "POST",
                    url:"usertemp/savedefaultdata",
                    data: {
                        id: Config.ids,
                        data: JSON.stringify(tmp_data)
                    },
                    success: function (ret) {
                        if(ret.code ==1){
                            layer.msg(ret.msg);
                        }else layer.msg(ret.msg);
                        
                    }, error: function (e) {
                        Backend.api.toastr.error(e.message);
                    }
                });
            })
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
