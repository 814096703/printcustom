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
                        {field: 'overdue_date', title: '到期时间', operate:'RANGE'},
                        {
                            field: 'shop_link',
                            title: '续期',
                            formatter:(value, row, index) => {
                                return `<a href="${value}" target="_blank">去购买</a>`;
                            }
                        },
                        {field: 'name', title: '模板名称', operate:'RANGE'},
                        {field: 'exa_image', title: '模板图片', operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'admin_name', title: '创建人'},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'weigh', title: __('Weigh'), operate: false,visible: false},
                        {field: 'default_data', title: __('Default_data'),visible: false},
                        // {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate},
                        
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
            // 根据默认值初始化数据
            let data_tmp = {};
            fielddata.forEach(ele=>{
                if(ele.field.split('-').pop()=='checkbox'){
                    data_tmp[ele.field] = ele.use_default? (ele.default_value? "√": ""): "";
                }else{
                    data_tmp[ele.field] = ele.use_default?ele.default_value: "";
                }
            })

            // 展示字段信息
            window.showFieldInfo=(field)=>{
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
                let field_div = `<div class="row">
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
                            
                                </div>`;
                $("#fieldinfo").append(field_div);

                let printElement = printElements.find(e=>e.options.field==field);
                
                let cssDiv = `
                <hr/>
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: right;">宽度</label>
                    <div class="col-xs-12 col-sm-4">
                        <input type="text" id="css_width" class="customfield" value='${printElement.options.width}' }>
                    </div>
                </div> 
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: right;">水平位置</label>
                    <div class="col-xs-12 col-sm-4">
                        <input type="text" id="css_left" class="customfield" value='${printElement.options.left}' }>
                    </div>
                </div>
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: right;">垂直位置</label>
                    <div class="col-xs-12 col-sm-4">
                        <input type="text" id="css_top" class="customfield" value='${printElement.options.top}' }>
                    </div>
                </div>
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: right;">字体大小</label>
                    <div class="col-xs-12 col-sm-4">
                        <input type="text" id="css_fontSize" class="customfield" value='${printElement.options.fontSize}' }>
                    </div>
                </div>
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: right;">字体</label>
                    <div class="col-xs-12 col-sm-4">
                        <input type="text" id="css_fontFamily" class="customfield" value='${printElement.options.fontFamily?printElement.options.fontFamily:""}' }>
                    </div>
                </div>
                `;
                $("#fieldinfo").append(cssDiv);

                let buttonDiv = `
                <hr/>
                <div class="row">
                    <div class="col-xs-12 col-sm-12" style="text-align: center">
                        <a id="btn_ok" class="btn btn-warning" href="#" role="button" onclick="updateTemp('${field}')">修改</a>
                        <a id="btn_pre" class="btn btn-warning" href="#" role="button" onclick="preTemp()">预览</a>
                        <a id="btn_cancle" class="btn btn-warning" href="#" role="button" onclick="editTemp()">编辑</a>
                    </div>
                    
                </div>
                `;
                $("#fieldinfo").append(buttonDiv);

            }

            // 替换可编辑的字段为input
            const transPrintElements = () => {
                let printElementsForInput = JSON.parse(JSON.stringify(printElements)).map(ele=>{
                    let field = ele['options']['field'];
                    let fieldOpt = fielddata.find(e=>e.field==field);
                    
                    // 存在field可编辑，不是非打印数据，没有选择隐藏
                    // if(field!=undefined && field.split('-').pop()!='nonprinting' && !fieldOpt.hidden){
                    if(field.split('-').pop()!='nonprinting' && fieldOpt && !fieldOpt.hidden){
                        if(field.split('-').pop()=='checkbox'){
                            ele['printElementType']['formatter'] = (title,value,options,templateData,target)=>{ 
                                return `<input type="checkbox" id="input_${options.field}" name="${options.field}" style="width: ${options.width}pt;" ${value? 'checked': ''} onfocus=showFieldInfo('${field}') onblur='changeDataTmp()'>`;
                            }
                            
                        }else{
                            ele['printElementType']['formatter'] = (title,value,options,templateData,target)=>{ 
                                return `<input type="text" id="input_${options.field}" name="${options.field}" style="width: ${options.width}pt; border-style: none;" value="${value}" onfocus=showFieldInfo('${field}') onblur='changeDataTmp()'>`;
                            }
                        }
                        
                    }
    
                    return ele;
                });
                
                return printElementsForInput;
            }
            let printElementsForInput = transPrintElements();
            
            
            hiprint.init();
            //初始化模板
            tempdata.panels[0]['printElements']=printElementsForInput;
            let htempForInput =  new hiprint.PrintTemplate({template: tempdata});

            $('#p_mx1').html(htempForInput.getHtml(data_tmp));

            // 保存打印数据
            const saveprintlog = () => {
                $.ajax({
                    async: true,
                    type: "POST",
                    url:"printlog/add",
                    data: {
                        'row[temp_id]': row['id'],
                        'row[temp_data]': JSON.stringify(data_tmp)
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

            $("#handleprintmx1").click(function(){
                tempdata.panels[0]['printElements'] = printElements.filter((e) => {
                    if(!Object.hasOwnProperty.call(e['options'], 'field') || e['options']['field'].split('-').pop()!=='nonprinting'){
                        return e;
                    }
                })
                let htempForPrint = new hiprint.PrintTemplate({template: tempdata});
                saveprintlog();
                htempForPrint.print(data_tmp);
            });

            $('#setFielddata').click(() => {
                setFielddata();
            })

            

            // 更新模板数据
            window.updateTemp=(field) => {
                
                printElements.forEach(ele=>{
                    if(ele.options.field==field){
                        ele.options.width = Number($('#css_width').val())
                        ele.options.left = Number($('#css_left').val())
                        ele.options.top = Number($('#css_top').val())
                        ele.options.fontSize = Number($('#css_fontSize').val())
                    }
                })
                // printElementsForInput.forEach(ele=>{
                //     if(ele.options.field==field){
                //         ele.options.width = Number($('#css_width').val())
                //         ele.options.left = Number($('#css_left').val())
                //         ele.options.top = Number($('#css_top').val())
                //         ele.options.fontSize = Number($('#css_fontSize').val())
                //     }
                // })
                fielddata.forEach(ele => {
                    if(ele.field==field){
                        let field = ele.field;
                        ele.default_value=(field.split('-').pop()=='checkbox')? $('#default_value_'+field).is(':checked'): $('#default_value_'+field).val();
                        ele.use_default=$('#use_default_'+field).is(':checked');
                        ele.hidden=$('#hidden_'+field).is(':checked');
                    }
                })

                printElementsForInput = transPrintElements();
                
                editTemp();

                $.ajax({
                    async: false,
                    type: "POST",
                    url:"usertemp/savedefaultdata",
                    data: {
                        id: Config.ids,
                        tempdata: JSON.stringify(tempdata),
                        fielddata: JSON.stringify(fielddata)
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
            // 修改打印数据
            window.changeDataTmp=() => {
                for (const field in data_tmp) {
                    
                    if (field.split('-').pop()!='nonprinting') {
                        data_tmp[field] = (field.split('-').pop()=='checkbox')
                                        ? ($('#input_'+field).is(':checked')? "√": "")
                                        : $('#input_'+field).val();
                    }
                }
            }
            // 预览模板
            window.preTemp= () => {
                tempdata.panels[0]['printElements']=printElements;
                let htempForInput =  new hiprint.PrintTemplate({template: tempdata});
                $('#p_mx1').html(htempForInput.getHtml(data_tmp));
            }
            // 编辑模板
            window.editTemp= () => {
                tempdata.panels[0]['printElements']=printElementsForInput;
                let htempForInput =  new hiprint.PrintTemplate({template: tempdata});
                $('#p_mx1').html(htempForInput.getHtml(data_tmp));
            }

            // 设置全部模板字段
            window.setFielddata= () => {
                $("#fieldinfo").empty();
                
                let headDiv = `
                <div class="row">
                    <label class="control-label col-xs-12 col-sm-2" style="text-align: left;">组件名</label>
                    <label class="control-label col-xs-12 col-sm-4" style="text-align: left;">默认值</label>
                    <label class="control-label col-xs-12 col-sm-2" style="text-align: left;">使用默认值</label>
                    <label class="control-label col-xs-12 col-sm-2" style="text-align: left;">隐藏</label> 
                    <label class="control-label col-xs-12 col-sm-2" style="text-align: left;">排序</label> 
                </div> 
                `;
                $("#fieldinfo").append(headDiv);

                fielddata.sort((a, b) => a.sort_num-b.sort_num);
                
                fielddata.forEach(ele => {
                    let default_value_html = (ele.field.split('-').pop()=='checkbox')
                    ? `<input id="default_value_${ele.field}" class="customfield" name="default_value_${ele.field}" type="checkbox" ${ele.default_value? "checked": ""} >`
                    : `<input id="default_value_${ele.field}" class="form-control customfield" name="default_value_${ele.field}" type="text" value="${ele.default_value}">`;
                    let field_div = `
                    <div class="row">
                    <label class="control-label col-xs-12 col-sm-2">${ele.name}:</label>
                    
                    <div class="col-xs-12 col-sm-4">
                        `+default_value_html+`
                    </div>
                    <div class="col-xs-12 col-sm-2">
                        <input type="checkbox" id="use_default_${ele.field}" class="customfield" name="use_default_${ele.field}" ${ele.use_default? "checked": ""}>
                    </div>
                    <div class="col-xs-12 col-sm-2">
                        <input type="checkbox" id="hidden_${ele.field}" class="customfield" name="hidden_${ele.field}" ${ele.hidden? "checked": ""}>
                    </div>
                    <div class="col-xs-12 col-sm-2">
                        <input type="text" id="sort_num_${ele.field}" class="form-control customfield" name="sort_num_${ele.field}" value="${ele.sort_num}">
                    </div>
                    </div>
                    `;
                    $("#fieldinfo").append(field_div);
                })
                let buttonDiv = `
                <hr/>
                <div class="row">
                    <div class="col-xs-12 col-sm-12" style="text-align: center">
                        <a id="btn_ok" class="btn btn-warning" href="#" role="button" onclick="saveFielddata()">保存</a>
                    </div>
                    
                </div>
                `;
                $("#fieldinfo").append(buttonDiv);
                
            }
            
            // 保存模板字段
            window.saveFielddata= () => {
                
                fielddata.forEach(ele => {
                    let field = ele.field;
                    ele.default_value=(field.split('-').pop()=='checkbox')? $('#default_value_'+field).is(':checked'): $('#default_value_'+field).val();
                    ele.use_default=$('#use_default_'+field).is(':checked');
                    ele.hidden=$('#hidden_'+field).is(':checked');
                    ele.sort_num = $('#sort_num_'+field).val();
                })
                printElementsForInput = transPrintElements();
                editTemp();
                $.ajax({
                    async: false,
                    type: "POST",
                    url:"usertemp/savedefaultdata",
                    data: {
                        id: Config.ids,
                        tempdata: JSON.stringify(tempdata),
                        fielddata: JSON.stringify(fielddata)
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
