# EChartsFormatter

2019-1-28 现只支持曲线,柱状图的更改. 数据形式为格式化后的json,即写死的数据通过格式化可以动态更改.
          还需要写几个方法根据用户的点击或是用户的会员等级展示不同数量,时限的数据.除了后端去做一些设置,大部分还是想通过js来设定.
可以关注这篇[微信文章](https://mp.weixin.qq.com/s?__biz=MzI0NDg2MTc2Ng==&mid=2247483786&idx=1&sn=f9f94f3f6d0d5ccd02f23af23e651de8&chksm=e9561fa3de2196b5d2a5413233f62c265f311ae67e0bcc4b6d137e44f5be2ad8ff2744cfa4dd&mpshare=1&scene=1&srcid=0128OkDu1uqwSlxIeIKYoDk0#rd)留言或微信343840681留下您的github账号来共同维护这个插件

A ECharts Data Formatter
```
    //获取展示形式如:
    var newJson2 = null;
    var newArr = [];
    var companys = null;
    var today_price = null; //今日价格汇总
    var createTimes = null; //创建时间
    var allData = null;
    myChart.showLoading();
    //TODO 测试echart数据
    $.ajax({
        url: "/petroleumCoke/selectAll", //获取所有石油焦数据list
        type: "POST",
        success: function (data) {
            myChart.hideLoading(); //数据data加载后隐藏loading
            // alert(JSON.stringify(data.petroleumCokes)); OK
            // petroleumCokesJson = JSON.stringify(data); OK
            //石油焦json数据
            // petroleumCokesJson = data; //OK
            // console.log("JSON.stringify(data):" + JSON.stringify(data));
            console.log(">>data:" + JSON.stringify(data));
            allData = data;
            //获取去重复后的公司名称数组
            companys = getParamValues("company", data).delDuplicate();
            console.log("companys:" + companys);
            console.log("companys.length:" + companys.length);
            console.log("companys.length:" + companys.length);
            console.log("companys[0]:" + companys[0]);
            // company[0]的所有历史价格
            // 根据字段获取指定公司的today_price数组
            price0 = getParamValuesByCname("today_price", data, "company", companys[0]);
            console.log("price0:" + price0);
            //根据公司名查询历史价格 -> (数组)
            /*newJson:{'华联石化':[2323,5321],'海油石化':[3000,2311],'昌邑石化':[2703,1688]}*/
            newJson = getJsonResult("today_price", data, "company", companys);
            console.log("newJson:" + newJson);
            today_price = getParamValues("today_price", data); //OK
            console.log(today_price); //OK
            // alert(today_price); //OK
            createTimes = getParamValues("create_time", data).delDuplicate();
            console.log("createTimes:" + createTimes);
            newJson2 = getJsonResultPro("today_price", data, "company", companys, "createTimes");
            console.log("newJson2:" + newJson2);

            newArr = getArrayResultPro("today_price", data, "company", companys, "createTime");
            console.log("newArr:" + newArr);
            var seriesContent = getSeriesContent(companys.length, "line", "row");
            console.log(seriesContent);

            myChart.setOption({
                legend: {
                    data: companys
                },
                tooltip: {},
                // dataset:{
                //     source:
                //     newJson2
                // },
                dataset: {
                    //Array形式
                    source: newArr,
                    dimensions: [
                        'createTime',
                        '华联石化',
                        '海油石化',
                        '昌邑石化',
                        // 'sulfur1',
                        // 'sulfur2',
                        // 'sulfur3',
                        // '2012',
                    ]
                    // source:

                    // [newJson2]
                    // 'createTimes':['2018-06-19 16:00:00','2019-01-20 16:00:00','2019-01-21 16:00:00'],'华联石化':[2323,5321,2422],'海油石化':[3000,2311,3211],'昌邑石化':[2703,1688,2900]

                    // newJson2
                    // {newJson2}
                    //     newJson2
                    // source: companyNameAndPriceArr,
                    // source:
                    //     {
                    //         'createTimes': ['2018-06-20 06:05:48', '2018-06-20 07:31:00', '2018-06-20 08:32:00', '2019-01-21 03:33:01', '2019-01-21 03:34:01', '2019-01-21 03:35:01', '2019-01-22 03:15:01'],
                    //         '华联石化': [2323, 5321, 2323, 5321, 2323, 5321, 2422],
                    //         '海油石化': [3000, 2311, 3000, 2311, 3000, 2311, 3211],
                    //         '昌邑石化': [2703, 1688, 2703, 1688, 2703, 1688, 2900]
                    //     }
                    // {
                    // 'product': ['2012', '2013', '2014', '2015','2016'], 'Matcha Latte': [41.1, 30.4,
                    //         65.1, 53.3],'Milk Tea': [86.5, 92.1, 85.7,
                    //         83.1],
                    // 'Cheese Cocoa': [24.1, 67.2, 79.5, 86.4]
                    // // 'createTime': create_time,
                    // //     newJson,
                    // //get company price by group
                    // // 'Matcha Latte': [41.1, 30.4, 65.1, 53.3],
                    // // 'Milk Tea': [86.5, 92.1, 85.7, 83.1],
                    // // 'Cheese Cocoa': [24.1, 67.2, 79.5, 86.4]
                    // }
                    // source:
                    // createTimes,
                    // newJson,
                },

                xAxis: [
                    {
                        type: 'category', gridIndex: 0, axisLabel: {
                            rotate: 50, interval: 0
                        }
                    }
                    // {gridIndex: 0},
                    // {
                    //     type: 'category',
                    //
                    //     // data:createTimes,
                    //     // axisLabel: {
                    //     //    rotate: 50, interval: 0
                    //     // }
                    // },
                    // {type: 'category', gridIndex: 1}
                ],
                yAxis:
                    [
                        {type: 'value', gridIndex: 0}
                        // {gridIndex: 0},
                        //
                        // {
                        //     // type:'value',
                        //     // gridIndex: 0, axisLabel: {
                        //     //     rotate: 0, interval: 0,
                        //     //     // formatter: function (value) {
                        //     //     //     return value + '元'
                        //     //     // }
                        //     // }
                        // },
                        // {gridIndex: 1}
                    ],
                grid:
                    [
                        {bottom: '55%'},
                        {top: '55%'}
                    ],
                series:
                seriesContent
            });
        }
        // renderLayer04Right(newJson2);
    });
```

![](https://i.imgur.com/qsPR6dd.png)
