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
                        {field: 'overdue_days', title: '可用天数', operate:'RANGE'},

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
                                    text: '购买续期',
                                    title: '购买续期',
                                    classname: 'btn btn-xs btn-primary btn-dialog',
                                    icon: 'fa fa-underline',
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
            let row = Config.row;
            const tempdata = JSON.parse(row.tempdata);
            const fielddata = JSON.parse(row.fielddata);
            const printElements = tempdata.panels[0]['printElements'];

            // 展示字段信息
            window.showFieldInfo=(field)=>{
                // console.log('fieldInfo', fieldInfo);
                let ele = fielddata.find(e=>e.field==field)
                $("#fieldinfo").empty();
                let headDiv = `
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-3" style="text-align: left;">组件名</label>
                    <label class="control-label col-xs-12 col-sm-3" style="text-align: left;">默认值</label>
                    <label class="control-label col-xs-12 col-sm-3" style="text-align: left;">使用默认值</label>
                    <label class="control-label col-xs-12 col-sm-3" style="text-align: left;">隐藏</label> 
                </div> 
                `;
                $("#fieldinfo").append(headDiv);
                let default_value_html = (ele.field.split('-').pop()=='checkbox')
                    ? `<input id="default_value_${ele.field}" class="customfield" name="default_value_${ele.field}" type="checkbox" ${ele.default_value? "checked": ""} >`
                    : `<input id="default_value_${ele.field}" class="form-control customfield" name="default_value_${ele.field}" type="text" value="${ele.default_value}">`;
                let field_div = `
                <div class="row">
                    <div class="col-xs-12 col-sm-3">
                        <label style="text-align: left;">${ele.name}</label> 
                       
                    </div>
                    <div class="col-xs-12 col-sm-3">
                        `+default_value_html+`
                    </div>
                    <div class="col-xs-12 col-sm-3">
                        <input type="checkbox" id="use_default_${ele.field}" class="customfield" name="use_default_${ele.field}" ${ele.use_default? "checked": ""}>
                    </div>
                    <div class="col-xs-12 col-sm-3">
                        <input type="checkbox" id="hidden_${ele.field}" class="customfield" name="hidden_${ele.field}" ${ele.hidden? "checked": ""}>
                    </div>
               
                </div>
                `;
                $("#fieldinfo").append(field_div);

                let printElement = printElements.find(e=>e.options.field==field);
                console.log('printElement', printElement);
                let cssDiv = `
                <hr/>
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: right;">宽度</label>
                    <div class="col-xs-12 col-sm-4">
                        <input type="text" class="customfield" value='${printElement.options.width}' }>
                    </div>
                </div> 
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: right;">水平位置</label>
                    <div class="col-xs-12 col-sm-4">
                        <input type="text" class="customfield" value='${printElement.options.left}' }>
                    </div>
                </div>
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: right;">垂直位置</label>
                    <div class="col-xs-12 col-sm-4">
                        <input type="text" class="customfield" value='${printElement.options.top}' }>
                    </div>
                </div>
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: right;">字体大小</label>
                    <div class="col-xs-12 col-sm-4">
                        <input type="text" class="customfield" value='${printElement.options.fontSize}' }>
                    </div>
                </div>
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: right;">字体</label>
                    <div class="col-xs-12 col-sm-4">
                        <input type="text" class="customfield" value='${printElement.options.fontFamily}' }>
                    </div>
                </div>
                `;
                $("#fieldinfo").append(cssDiv);
            }

            let tempdataForInput = JSON.parse(row.tempdata);
            let printElementsForInput = printElements.map(ele=>{
                let field = ele['options']['field'];
                if(ele['printElementType']['type']=='text'){
                    
                    // let fieldInfo = JSON.stringify(fielddata.find(e=>e.field==field));
                    // console.log('fieldInfo', fieldInfo);
                    if(field.split('-').pop()=='checkbox'){
                        ele['printElementType']['formatter'] = (title,value,options,templateData,target)=>{ 
                            return `<input type="checkbox" id="input_${options.field}" name="${options.field}" style="width: ${options.width}pt;" ${value? 'checked': ''} onfocus=showFieldInfo('${field}')>`;
                        }
                        
                    }else{
                        ele['printElementType']['formatter'] = (title,value,options,templateData,target)=>{ 
                            return `<input type="text" id="input_${options.field}" name="${options.field}" style="width: ${options.width}pt; border-style: none;" value="${value}" onfocus=showFieldInfo('${field}')>`;
                        }
                    }
                    
                }

                return ele;
            });

            tempdataForInput.panels[0]['printElements']=printElementsForInput;

            let data_tmp = {};
            fielddata.forEach(ele=>{
                if(ele.field.split('-').pop()=='checkbox'){
                    data_tmp[ele.field] = ele.use_default? (ele.default_value? "√": ""): "";
                }else{
                    data_tmp[ele.field] = ele.use_default?ele.default_value: "";
                }
                
            })
            
            
            
            // let fielddataObj = JSON.parse(temp['fielddata']);
            // let defaultdataObj = JSON.parse(row['default_data']);
            hiprint.init();
            //初始化模板
            let htempForInput =  new hiprint.PrintTemplate({template: tempdataForInput});

            $('#p_mx1').html(htempForInput.getHtml(data_tmp));

            $("#handleprintmx1").click(function(){
               
                let htempForPrint = new hiprint.PrintTemplate({template: tempdata});
                
                htempForPrint.print(data_tmp);
                
            });

            // 字段开始
            // let tmp_data = {};
            // const changePrintField = () => {
            //     eleArr.forEach((ele) => {
            //         ele = ele['options'];
            //         if(Object.hasOwnProperty.call(ele, 'field')){
            //             tmp_data[ele.field] = $("#field_"+ele.field).val();
            //         }
            //     })
            //     $('#p_mx1').html(htemp.getHtml(tmp_data));
            // }

            // let eleArr = tempdataObj? tempdataObj['panels'][0]['printElements']:[];
            
            // eleArr.forEach(ele => {
            //     ele = ele['options'];
            //     if(Object.hasOwnProperty.call(ele, 'field')){
            //         let title = ele.field;
            //         let value = ele['src'] || ele['testData'] || '';
            //         if(Object.hasOwnProperty.call(fielddataObj, ele.field)){
            //             title = fielddataObj[ele.field];
            //         }
                    
            //         if(Object.hasOwnProperty.call(defaultdataObj, ele.field)){
            //             value = defaultdataObj[ele.field];
            //         }
                    
            //         let field_div = `
            //             <label class="control-label col-xs-12 col-sm-2" style="margin:5px 0px">${title}:</label>
            //             <div class="col-xs-12 col-sm-4" style="margin:2px 0px">
            //                 <input id="field_${ele.field}" class="form-control print_field" name="field_${ele.field}" type="text" value="${value}">
            //             </div>
            //         `;
                    
            //         $("#fieldinfo").append(field_div);
            //         changePrintField();
            //     }
            // });
            // console.log('tmp_data', tmp_data);
            // const saveprintlog = () => {
            //     $.ajax({
            //         async: true,
            //         type: "POST",
            //         url:"printlog/add",
            //         data: {
            //             'row[temp_id]': temp['id'],
            //             'row[temp_data]': JSON.stringify(tmp_data)
            //         },
            //         success: function (ret) {
            //             if(ret.code ==1){
            //                 layer.msg(ret.msg);
            //             }else layer.msg(ret.msg);
                        
            //         }, error: function (e) {
            //             Backend.api.toastr.error(e.message);
            //         }
            //     });
            // }
            
            // $(".print_field").change(changePrintField);
            // $("#handleprintmx1").click(function(){
            //     saveprintlog();
            //     filterArr = eleArr.filter((e) => {
            //         if(!Object.hasOwnProperty.call(e['options'], 'field') || e['options']['field'].split('-').pop()!=='nonprinting'){
            //             return e;
            //         }
            //     });
            //     tempdataObj['panels'][0]['printElements'] = filterArr;
            //     let print_htemp = new hiprint.PrintTemplate({template: tempdataObj});
            //     console.log('print_htemp', print_htemp);
            //     print_htemp.print(tmp_data);
                
            // });
            // $('#savedefaultdata').click(() => {
            //     $.ajax({
            //         async: false,
            //         type: "POST",
            //         url:"usertemp/savedefaultdata",
            //         data: {
            //             id: Config.ids,
            //             data: JSON.stringify(tmp_data)
            //         },
            //         success: function (ret) {
            //             if(ret.code ==1){
            //                 layer.msg(ret.msg);
            //             }else layer.msg(ret.msg);
                        
            //         }, error: function (e) {
            //             Backend.api.toastr.error(e.message);
            //         }
            //     });
            // })
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            },

        }
    };
    return Controller;
});
