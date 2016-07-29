(function($) {
    var defaults = {
        getway: 'each',
        totalHierarchy: 3,
        determineElement: [{
            params: {
                timetag: 0
            }
        }, {
            params: {
                bid: 'uploadValue'
            }
        }, {
            params: {
                sid: 'uploadValue'
            }
        }],
        ajax: [{
            url: 'http://dev.xiaomadada.com/paacitic-js/rest/api/system/brand/get',
            type: 'POST',
            async: false,
            contentType: 'json',
            uploadObj: {
                params: {
                    timetag: 'uploadValue'
                }
            },
            uploadDefault: 0,
            successDetermine: {
                key: 'rc',
                value: 0
            },
            successData: ['brands']

        }, {
            url: 'http://dev.xiaomadada.com/paacitic-js/rest/api/system/series/get',
            type: 'POST',
            async: false,
            contentType: 'json',
            uploadObj: {
                params: {
                    bid: 'uploadValue'
                }
            },
            successDetermine: {
                key: 'rc',
                value: 0
            },
            successData: ['series']
        }, {
            url: 'http://dev.xiaomadada.com/paacitic-js/rest/api/system/model/get',
            type: 'POST',
            async: false,
            contentType: 'json',
            uploadObj: {
                params: {
                    sid: 'uploadValue'
                }
            },
            successDetermine: {
                key: 'rc',
                value: 0
            },
            successData: ['models']
        }],
        renderResponse: {
            dataHierarchy: [
                ['brands'],
                ['series'],
                ['models']
            ],
            renderData: [
                [{ key: 'id', value: 'bid' }, { key: 'logo', value: 'logo' }, { key: 'title', value: 'name' }, { key: 'tag', value: 'tag' }, { key: 'timetag', value: 'timetag' }],
                [{ key: 'id', value: 'sid' }, { key: 'title', value: 'name' }],
                [{ key: 'id', value: 'mid' }, { key: 'title', value: 'name' }, { key: 'price', value: 'price' }]
            ],
        },
        placeholder: ['brand', 'series', 'model']
    };
    var pinyin = new Pinyin(true, 'default');
    var getKeyValue = function(options,Hierarchy,value){
        var o = {};
        for (var i = 0; i < options.renderResponse.renderData[Hierarchy].length; i++) {
            o[options.renderResponse.renderData[Hierarchy][i].key] = value[options.renderResponse.renderData[Hierarchy][i].value]
        }
        return o
    }
    $.fn.cascadeSelect = function(options) {
        function clone(obj, value) {
            var o;
            if (typeof obj == "object") {
                if (obj === null) {
                    o = null;
                } else {
                    if (obj instanceof Array) {
                        o = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            o.push(clone(obj[i], value));
                        }
                    } else {
                        o = {};
                        for (var j in obj) {
                            o[j] = clone(obj[j], value);
                        }
                    }
                }
            } else if (obj == 'uploadValue') {
                o = value;
            } else {
                o = obj;
            }
            return o;
        }
        return this.each(function() {

            options = $.extend({}, defaults, options);
            var totalHierarchy = options.totalHierarchy;
            var $box_obj = $(this);
            var selectizeControls = [];
            for (var i = 0; i < totalHierarchy; i++) {
                $(this).append('<select></select>');
            }
            var selectObj = $box_obj.find('select');

            var clearOptions = function(Hierarchy) {
                for (var i = Hierarchy; i < totalHierarchy; i++) {
                    if (selectizeControls[i]) {
                        selectizeControls[i].clearOptions();
                    }

                }
            }

            var selectRender = function() {

                for (var Hierarchy = 0; Hierarchy < totalHierarchy; Hierarchy++) {
                    (function(temp) {
                        selectizeControls[temp] = $(selectObj[temp]).selectize({
                            valueField: 'id',
                            searchField: ['title', 'py', 'pyf'],
                            labelField: 'title',
                            placeholder: options.placeholder[temp],
                            selectOnTab: true,
                            create: false,
                            optgroupField: 'tag',
                            render: {
                                item: function(item, escape) {
                                    return '<div>' +
                                        (item.logo ? '<img class="selectize-img" src=' + escape(item.logo) + '>' + '</span>' : '') +
                                        (item.title ? '<span>' + escape(item.title) + '</span>' : '') +
                                        '</div>';
                                },
                                option: function(item, escape) {
                                    return '<div class="col-medio-width">' +
                                        (item.logo ? '<img class="selectize-img" src="' + escape(item.logo) + '" >' + '</span>' : '') +
                                        (item.title ? '<span>' + escape(item.title) + '</span>' : '') +
                                        '</div>';
                                },
                                optgroup_header: function(data, escape) {
                                    return '<div class=" optgroup_header">' + escape(data.label) + '系</div>';
                                }
                            },
                            onChange: function(value) {
                                if (value) {
                                    console.log(value,'value');
                                    clearOptions(temp+1);
                                    if (temp + 1 < totalHierarchy) {
                                        optionStart(temp + 1, value, {
                                            url: options.ajax[temp + 1].url,
                                            type: options.ajax[temp + 1].type,
                                            async: options.ajax[temp + 1].async,
                                            contentType: options.ajax[temp + 1].contentType
                                        }, options.ajax[temp + 1].successDetermine, options.ajax[temp + 1].successData);
                                       /*  optionStart(0, options.ajax[0].uploadDefault, {
                    url: options.ajax[0].url,
                    type: options.ajax[0].type,
                    async: options.ajax[0].async,
                    contentType: options.ajax[0].contentType
                }, options.ajax[0].successDetermine, options.ajax[0].successData);*/
                                    }

                                }
                            }
                        })[0].selectize;
                    })(Hierarchy)

                }
            }




            /**
             * ajax获取数据
             * @param      {<number>} Hierarchy         当前请求获取数据的select所属层级
             * @param      {<obj>}    setting           ajax发送请求所需要提交的参数，参数以对象形式提交
             * @param      {<obj>}    successDetermine  The success determine 判定ajax请求成功的返回数据键值对，例如判定请求成功是 respData.rc == 0，则填写对象{key:'rc',value:0}
             * @param      {<arr>}  successData   与上面类似 数组格式 如返回数据在respData.brands 则['brands']
             * @param      {Function}  callback          The callback ajax请求成功后的回调函数
             *
             */
            var ajaxWay = function(Hierarchy, data, setting, successDetermine, successData) {
                $.ajax({
                    url: setting.url,
                    data: data,
                    type: setting.type,
                    async: setting.async,
                    contentType: setting.contentType,
                    success: function(respData, status) {
                        if (respData && respData[successDetermine.key] === successDetermine.value) {
                            console.log('Hierarchy!!!!', Hierarchy);
                            getOptions(Hierarchy, respData, successData);
                        } else {
                            console.log('ajax获取无效');
                            console.log('data', data);
                            console.log('respData', respData);
                        }
                    },
                    error: function(xhr, status, errorThrown) {
                        console.log('error');
                    },
                    complete: function(xhr, status) {
                        if (status === 'timeout') {
                            console.log('timeout');
                        }
                    }

                })

            };
            var getOptions = function(Hierarchy, respData, successData) {
                //这里有问题
                var Data;
                Data = respData[successData[0]];

                $.each(Data, function(key, value) {
                    var obj = getKeyValue(options,Hierarchy,value);
                    var temp_py = pinyin.getCamelChars(value.name);
                    var temp_pyf = pinyin.getFullChars(value.name);
                    console.log('obj',obj);
                    console.log('value',value);
                    var group_temp = null;
                    obj.py = temp_py;
                    obj.pyf = temp_pyf;
                    selectizeControls[Hierarchy].addOption(obj);
                    if (value.tag !== group_temp) {
                        selectizeControls[Hierarchy].addOptionGroup(value.tag, { label: value.tag });
                    }
                })
            };
            var optionStart = function(Hierarchy, value, setting, successDetermine, successData) {
                /*console.log('Hierarchy', Hierarchy);
                console.log(options.ajax[Hierarchy].uploadObj, 'options.ajax[Hierarchy].uploadObj')*/
                var uploadtemp = JSON.stringify(clone(options.ajax[Hierarchy].uploadObj, value));
                console.log('uploadtemp',uploadtemp);
                ajaxWay(Hierarchy, uploadtemp, setting, successDetermine, successData);
            };
            var firstStart = function() {
                optionStart(0, options.ajax[0].uploadDefault, {
                    url: options.ajax[0].url,
                    type: options.ajax[0].type,
                    async: options.ajax[0].async,
                    contentType: options.ajax[0].contentType
                }, options.ajax[0].successDetermine, options.ajax[0].successData);
            }


            selectRender();
            firstStart();

            /* optionStart(value, Hierarchy, {
                 url: options.ajax[Hierarchy].url,
                 data: options.ajax[Hierarchy].data,
                 type: options.ajax[Hierarchy].type,
                 async: options.ajax[Hierarchy].async,
                 contentType: options.ajax[Hierarchy].contentType
             }, successDetermine, successData);*/
        })
    }




})(jQuery);
