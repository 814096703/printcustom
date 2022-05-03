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
                        {field: 'jsondata', title: __('Jsondata')},
                        {field: 'exa_image', title: __('Exa_image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'memo', title: __('Memo'), operate: 'LIKE'},
                        {field: 'user_id', title: __('User_id')},
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
        custom: function() {
            var hiprintTemplate;
            $(document).ready(function () {
                hiprint.init({
                    providers: [new customElementTypeProvider()]
                });
                //设置左侧拖拽事件
                hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
                hiprintTemplate = new hiprint.PrintTemplate({
                    template: { "panels": [{ "index": 0, "paperType": "A4", "height": 297, "width": 210, "paperHeader": 43.5, "paperFooter": 801, "printElements": [], "paperNumberLeft": 565, "paperNumberTop": 819 }] },
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
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
