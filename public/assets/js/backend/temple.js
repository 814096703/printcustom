define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'hpbundle', 'customElementTypeProvider','customPrintJson'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'temple/index' + location.search,
                    add_url: 'temple/add',
                    edit_url: 'temple/edit',
                    del_url: 'temple/del',
                    multi_url: 'temple/multi',
                    import_url: 'temple/import',
                    table: 'temple',
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
                        {field: 'name', title: __('Name'), operate: 'LIKE'},
                        {field: 'tempdata', title: __('Tempdata'), visible: false},
                        {field: 'fielddata', title: __('Fielddata'), visible: false},
                        {field: 'exa_image', title: __('Exa_image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'memo', title: __('Memo'), operate: 'LIKE'},
                        {field: 'design_admin_id', title: __('Admin_id')},
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
            $('#designTemple').click(function () {
                let tempdata = $("#c-tempdata").val();
                window.sessionStorage.setItem("tempdata", tempdata);
                window.top.Fast.api.open('temple/custom', '模板设计', {
                    area: ["100%", "100%"],
                    callback:function(tempdata){
                        console.log('tempdata', tempdata);
                        $("#c-tempdata").prop('value', tempdata);
                    }
                });
            });

            const changefielddata = () => {
                let fielddataObj = {};

                let tempdata = $("#c-tempdata").val();
                let tempdataObj = tempdata? JSON.parse(tempdata): null;

                let eleArr = tempdataObj? tempdataObj['panels'][0]['printElements']:[];
                eleArr.forEach((ele) => {
                    ele = ele['options'];
                    if(Object.hasOwnProperty.call(ele, 'field')){
                        fielddataObj[ele.field] = $("#field_"+ele.field).val();
                    }
                })
                $("#c-fielddata").prop('value', JSON.stringify(fielddataObj));
            }
            $("#setFielddata").click(() => {
                $("#fieldinfo").empty();
                if($('#fieldTop').css('display')!='none'){
                    $('#fieldTop').hide()
                    $("#fieldinfo").hide();
                    
                    return;
                }
                $('#fieldTop').show()
                $("#fieldinfo").show();

                let fielddata = $("#c-fielddata").val();
                let fielddataObj = fielddata? JSON.parse(fielddata): {};

                let tempdata = $("#c-tempdata").val();
                let tempdataObj = tempdata? JSON.parse(tempdata): null;

                let eleArr = tempdataObj? tempdataObj['panels'][0]['printElements']:[];
                eleArr.forEach(ele => {
                    ele = ele['options'];
                    if(Object.hasOwnProperty.call(ele, 'field')){
                        let value = ele.field;
                        if(Object.hasOwnProperty.call(fielddataObj, ele.field)){
                            value = fielddataObj[ele.field];
                        }
                        let field_div = `
                            <label class="control-label col-xs-12 col-sm-2">${ele.field}:</label>
                            <div class="col-xs-12 col-sm-4" style="margin-top:5px">
                                <input id="field_${ele.field}" class="form-control customfield" name="field_${ele.field}" type="text" value="${value}">
                            </div>
                        `;
                        $("#fieldinfo").append(field_div);
                    }
                });

                $(".customfield").change(changefielddata)
            });

            

            $("#saveFielddata").click(() => {
                changefielddata();
                $('#fieldTop').hide()
                $("#fieldinfo").hide();
                // $("#fieldinfo").empty();
            })
        },
        edit: function () {
            Controller.api.bindevent();
            $('#designTemple').click(function () {
                let tempdata = $("#c-tempdata").val();
                window.sessionStorage.setItem("tempdata", tempdata);
                window.top.Fast.api.open('temple/custom', '模板设计', {
                    area: ["100%", "100%"],
                    callback:function(tempdata){
                        console.log('tempdata', tempdata);
                        $("#c-tempdata").prop('value', tempdata);
                    }
                });
            });
            const changefielddata = () => {
                let fielddataObj = {};

                let tempdata = $("#c-tempdata").val();
                let tempdataObj = tempdata? JSON.parse(tempdata): null;

                let eleArr = tempdataObj? tempdataObj['panels'][0]['printElements']:[];
                eleArr.forEach((ele) => {
                    ele = ele['options'];
                    if(Object.hasOwnProperty.call(ele, 'field')){
                        fielddataObj[ele.field] = $("#field_"+ele.field).val();
                    }
                })
                $("#c-fielddata").prop('value', JSON.stringify(fielddataObj));
            }

            $("#setFielddata").click(() => {
                $("#fieldinfo").empty();
                if($('#fieldTop').css('display')!='none'){
                    $('#fieldTop').hide()
                    $("#fieldinfo").hide();
                    
                    return;
                }
                $('#fieldTop').show()
                $("#fieldinfo").show();

                let fielddata = $("#c-fielddata").val();
                let fielddataObj = fielddata? JSON.parse(fielddata): {};

                let tempdata = $("#c-tempdata").val();
                let tempdataObj = tempdata? JSON.parse(tempdata): null;

                let eleArr = tempdataObj? tempdataObj['panels'][0]['printElements']:[];
                eleArr.forEach(ele => {
                    ele = ele['options'];
                    if(Object.hasOwnProperty.call(ele, 'field')){
                        let value = ele.field;
                        if(Object.hasOwnProperty.call(fielddataObj, ele.field)){
                            value = fielddataObj[ele.field];
                        }
                        let field_div = `
                            <label class="control-label col-xs-12 col-sm-2">${ele.field}:</label>
                            <div class="col-xs-12 col-sm-4" style="margin-top:5px">
                                <input id="field_${ele.field}" class="form-control customfield" name="field_${ele.field}" type="text" value="${value}">
                            </div>
                        `;
                        $("#fieldinfo").append(field_div);
                    }
                });
                $(".customfield").change(changefielddata)
            });

            $("#saveFielddata").click(() => {
                changefielddata();
                $('#fieldTop').hide();
                $("#fieldinfo").hide();
                // $("#fieldinfo").empty();
            })
            
        },
        custom: function() {
            var tempdata = window.sessionStorage.getItem("tempdata");
            window.sessionStorage.removeItem("tempdata");
            
            var hiprintTemplate;
            $(document).ready(function () {
                hiprint.init({
                    providers: [new customElementTypeProvider()]
                });
                let default_temp = { "panels": [{ "index": 0, "paperType": "A4", "height": 297, "width": 210, "paperHeader": 43.5, "paperFooter": 801, "printElements": [], "paperNumberLeft": 565, "paperNumberTop": 819 }] };
                //设置左侧拖拽事件
                hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
                hiprintTemplate = new hiprint.PrintTemplate({
                    template: tempdata? JSON.parse(tempdata): default_temp,
                    settingContainer: '#PrintElementOptionSetting',
                    paginationContainer: '.hiprint-printPagination'
                });
    
                //打印设计
                hiprintTemplate.design('#hiprint-printTemplate');
                var printData = {};

                $('#A4_preview').click(function () {
                    $('#myModal .modal-body .prevViewDiv').html(hiprintTemplate.getHtml(printData));
                    $('#printerlist').html(createPrintHtml(hiprintTemplate.getPrinterList()));
                    $('#myModal').modal('show')
                });
                $('#A4_directPrint').click(function () {
                    hiprintTemplate.print(printData, {});
                });
                hiprintTemplate.on('printSuccess', function (data) {
                    $('#myModal').modal('hide')
                })
                hiprintTemplate.on('printError', function (data) {
    
                })
                $('#A4_printByHtml').click(function () {
    
    
                    hiprintTemplate.print2(printData, { printer: $('#printerlist select').val(),title:'hiprint测试打印' });
                })
                $('#A4_getJson_toTextarea').click(function () {
                    console.log(hiprintTemplate)
                    console.log(hiprintTemplate.getJson())
                    $('#A4_textarea_json').val(JSON.stringify(hiprintTemplate.getJson()))
                    // printData = JSON.stringify(hiprintTemplate.getJson());
                })
                $('#A4_getJson_toDesign').click(function () {
                    hiprintTemplate = new hiprint.PrintTemplate({
                        template: JSON.parse($('#A4_textarea_json').val()),
                        settingContainer: '#PrintElementOptionSetting',
                        paginationContainer: '.hiprint-printPagination'
                    });
                    $('#hiprint-printTemplate').html('');
                    hiprintTemplate.design('#hiprint-printTemplate');
                })
                
                $('#A4_getHtml_toTextarea').click(function () {
                    $('#A4_textarea_html').val(hiprintTemplate.getHtml(printData)[0].outerHTML)
                })
                $('#A4_topdf').click(function () {
                    hiprintTemplate.toPdf(printData, '测试导出pdf');
                })
            })
            
            //调整纸张
            window.setPaper = function (paperTypeOrWidth, height) {
                hiprintTemplate.setPaper(paperTypeOrWidth, height);
            }

            //旋转
            window.rotatePaper = function () {
                hiprintTemplate.rotatePaper();
            }
            window.clearTemplate = function () {
                hiprintTemplate.clear();
            }

            window.createPrintHtml = function (printers) {
                var ul = $('<select></select>');
                $.each(printers, function (index, printer) {
                    ul.append('<option value="' + printer.name + '" ' + (printer.isDefault ? 'selected' : '') + '>' + printer.name + '</option>');
                })
                return ul;
            }

            $("#save").click(function () {
                Fast.api.close(JSON.stringify(hiprintTemplate.getJson()));
            });
        },
        print: function() {
            // console.log('limberList',Config.limberList);
            console.log('detail_list',Config.detail_list);
            console.log('mainInfos',Config.row);
            
            let list = Config.detail_list;
            let mainInfos = Config.row;
            let tb_tmp = [];
            let weight_sum = 0; 
            let count_sum = 0

            let temObj = {};
            list.forEach(el => {
                count_sum+=Number(el['TRN_TPNumber']);
                weight_sum+=Number(el['sum_weight'])*100;
                let k = el['TD_TypeName'];
                console.log('k', k);
                if(!temObj[k]){
                    temObj[k] = [];
                }
                temObj[k].push(el);
            });
            console.log('temObj', temObj)

            for (const key in temObj) {
                let count_tmp = 0;
                let weight_tmp = 0;
                const ele = temObj[key];
                let tmpArr = ele.map((element)=>{
                    count_tmp+=Number(element['TRN_TPNumber']);
                    weight_tmp+=Number(element['sum_weight'])*100;
                    let tmp = {
                        'gth': element['TRN_Project'],
                        'jh': element['TRN_TPNum'],
                        'cz': element['DtMD_sMaterial'],
                        'gg': element['DtMD_sSpecification'],
                        'kd': element['DtMD_fWidth']==null?'':element['DtMD_fWidth'],
                        'cd': element['DtMD_iLength'],
                        'sl': element['TRN_TPNumber'],
                        'dz': element['TRN_TPWeight'],
                        'zl': element['sum_weight'],
                        'bz': element['DtMD_sRemark'],
                    }
                    return tmp;
                });
                //小计
                tmpArr.push({
                    'gth': '塔型：',
                    'jh': key,
                    'cz': '',
                    'gg': '',
                    'kd': '',
                    'cd': '合计：',
                    'sl': count_tmp,
                    'dz': '',
                    'zl': weight_tmp/100,
                    'bz': '',
                })
                tb_tmp = tb_tmp.concat(tmpArr);
            }
            console.log('tb_tmp', tb_tmp)

            let data_tmp={
                kh:mainInfos['Customer_Name'],
                gcmc: mainInfos['t_project'],
                htbh: mainInfos['T_Num'],
                
                beizhu: mainInfos['TRNM_Memo'],
                ggh: mainInfos['old_TypeName'],
                zsl: count_sum,
                zzl: weight_sum/100,
                bjlx: mainInfos['TRNM_Sort'],
                tb:tb_tmp
            };

            let pg_mx= {
                "#p_mx1": 1,
            }; //明细，当前页
            //翻页
            window.pageto=function(id,num){

                let pcount=$(id+' .hiprint-printPanel .hiprint-printPaper').length; //明细，总页数
                let pmx=pg_mx[id];
                pmx=pmx+num;
                $(id).parent().parent().find(".pgnxt").removeClass('disabled');
                $(id).parent().parent().find(".pgpre").removeClass('disabled');
                if(pmx<=1){
                    pmx=1;
                    $(id).parent().parent().find(".pgpre").addClass('disabled');
                }
                if(pmx>=pcount){
                    pmx=pcount;
                    // console.log($(id+" .pgnxt"))
                    $(id).parent().parent().find(".pgnxt").addClass('disabled');
                }
                pg_mx[id]=pmx;

                // console.log(id+' .hiprint-printPanel .hiprint-printPaper',pg_mx1-1)
                // $(id+' .hiprint-printPanel .hiprint-printPaper')[pg_mx1-1].scrollIntoView();

                let mxpage=$(id+' .hiprint-printPanel .hiprint-printPaper');
                for(let v of mxpage){
                    $(v).hide();
                }

                $(mxpage[pmx-1]).show();
                $(id).show();
            };
            
            hiprint.init();
            //初始化模板
            let htemp =  new hiprint.PrintTemplate({template: blddata});

            $('#p_mx1').html(htemp.getHtml(data_tmp));
            $("#handleprintmx1").click(function(){
                htemp.print(data_tmp);
            });
            
            pageto('#p_mx1',0);
            
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
