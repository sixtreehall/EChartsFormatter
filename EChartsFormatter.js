/************************EChartsFormatter************************

author:ukzq blog:https://www.cnblogs.com/ukzq/   
            github:https://github.com/deadzq

this repository:https://github.com/sixtreehall/EChartsFormatter

****************************************************************/

/**
 * 根据传入name和json数据获取指定name的value值数组
 * "create_time"为时间节点,即该条数据时间key字段名(可扩展)
 *
 * @param name 要获取的其中某一个json的key的value数组
 * @param json 控制层返回的json数据如thisData:[{"id":33,"province":"山东","company":"A公司0","s_company":"公司0","softening_point":0.1,"toluene":1,"quinoline":1,"beta_resin":1,"coking_value":1,"ash":1,"today_price":123,"remarks":"备注0","reporter":"张","create_time":"2019-02-20 13:47:52","update_time":"2019-02-20 13:47:52","b_time":null,"e_time":null,"order":null},
 * @returns {Array} 假设传入("company",thisDate),则会获取数组[A公司0,B公司1,C公司2,D公司3] 注意这里的company的数组还不能用于ECharts的维度,因为要设置
 */
function getParamValues(name, json) {
    console.log("name:"+name);
    var ret = [];
    var len = Object.keys(json).length;
    for (var i = 0; i < len; i++) {
        if (name == "create_time") {
            var aDate = formatDateUntilDay(json[i][name]);
            ret.push(aDate);
        }else{
            ret.push(json[i][name]);
        }
        // console.log("json[i][name]:"+json[i][name]);
    }
    return ret;
}

/**
 * 将时间格式转换到直到天 省去时分秒
 * @param date
 */
function formatDateUntilDay(date) {
    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var formatDate = year + "-" + month + "-" + day;
    return formatDate;
    // console.log(format);
}
/**
 * 获取时间节点从json数据中,与getParamValues不同的是这里的时间中有'2019-1-20'单引号加持.
 * 暂时未用该方法
 *
 * @param name 时间字段的名称
 * @param json json数据
 * @returns {Array}
 */
function getCreateTimes(name, json) {
    var ret = [];
    var len = Object.keys(json).length;
    for (var i = 0; i < len; i++) {
        ret.push("'" + json[i][name] + "'");
    }
    return ret;
}


/**
 * 获取json数据中的某一个字段key根据给定value => 数组
 * 假设根据字段获取指定公司的today_price数组:
 * priceArr = getParamValuesByCname("today_price", jsonData, "company", companys[0]);
 * 如:这里传入的要获取的name为"today_price",那么最终return获取到的数据为 数组 [2323,2902,3002,4432]
 *
 * @param name 传入要获取的name(最终是该name的数组)
 * @param json 总体json数据
 * @param key  上方获取时根据该key是否等于下面value为判断依据
 * @param value  上面的key的value等于给定此value时,才被纳入最终获取数组:
 * @returns {Array}  最终获取的数组 { array | json[key]=value & json[name] }
 */
function getParamValuesByCname(name, json, key, value) {
    var ret = [];
    var len = Object.keys(json).length;

    for (var i = 0; i < len; i++) {
        if (json[i][key] == value) {
            ret.push(json[i][name]);
        }
    }
    return ret;
}


/**
 * 数组去重 假设 this=[ 1,1,1,2 ] => [ 1,2 ]
 *
 * @returns {Array}         ↑[ 1,2 ]
 */
Array.prototype.delDuplicate = function () {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (arr.indexOf(this[i]) == -1) {
            arr.push(this[i]);
        }
    }
    return arr.slice(); //slice()转为纯数组
}


// /*数组去重方法版本*/
// function delDuplicateArrayItem(array){
//     var arr = [];
//     for(var i in array){
//         if(arr.indexOf(array[i]) == -1){
//             arr.push(array[i]);
//         }
//     }
//     return arr;
// }


/*遍历js数组*/
// Array.prototype.traversal = function(){
//     var arrStr = '';
//     for(var i=0;i<this.length;i++){
//         arrStr += this[i];
//     }
//     return arrStr;
// }


/**
 * 获取以公司为key的todayprice数组 类似SQL的group by
 * 假设这里要获取公司名后:价格数组 => '公司名':[123,341,212] 并且传入的公司名是一个数组,
 * 最终形式为:'A公司0':[123,211,421,681],'B公司1':[300,421,255,472],'C公司2':[222,231,672,458],'D公司3':[332,425,521,862]
 * 示例: newJson = getJsonResult("today_price", data, "company", companys);
 *
 * @param name 要获取的数组字段名
 * @param json 总数据json
 * @param key  要根据哪个键去进行数组分组,这里示例为公司名字段"company",也可以根据字段"province"或"reporter"
 * @param values 对应key的数组集合,如key为"company",该values即[A公司0,B公司1,C公司2,D公司3],如果key为"province",可以传入如[山东,北京,内蒙古,河北,新疆]
 * @returns {string} 最终获取拼接的字符串 : 对应示例:  newJson:'A公司0':[123,211,421,681],'B公司1':[300,421,255,472],'C公司2':[222,231,672,458],'D公司3':[332,425,521,862]
 */
function getJsonResult(name, json, key, values) {
    var DataJSONStr = '';
    var ret = [];
    var len = Object.keys(json).length;
    for (var j = 0; j < values.length; j++) {
        for (var i = 0; i < len; i++) {
            if (json[i][key] == values[j]) {
                ret.push(json[i][name]);
            }
        }
        if (j != values.length - 1) {
            DataJSONStr += ("'" + values[j] + "':[" + ret + "],");
            ret = [];
        } else {
            DataJSONStr += ("'" + values[j] + "':[" + ret + "]");
            ret = [];
        }
    }
    var jsonStr = DataJSONStr;
    // console.log("jsonStr:" + jsonStr);
    return jsonStr;
}


/**
 * 返回ECharts 中 source中的填充数据: (格式如下):
 *    示例:
 *     'createTimes':['2012', '2013', '2014', '2015'],
 *     'companyName1': [41.1, 30.4, 65.1, 53.3],
 *     'companyName2': [86.5, 92.1, 85.7, 83.1],
 *     'companyName3': [24.1, 67.2, 79.5, 86.4]
 *    或理解为这样:
 *    'createTimes':['2019-02-20 13:47:52','2019-02-23 13:47:52','2019-02-24 13:47:52','2019-02-25 13:47:52'],'A公司0':[123,211,421,681],'B公司1':[300,421,255,472],'C公司2':[222,231,672,458],'D公司3':[332,425,521,862]
 *
 *
 * @param name  与getJsonResult一样
 * @param json  与getJsonResult一样
 * @param key  与getJsonResult一样
 * @param values  与getJsonResult一样
 * @param times  新增参数times为指定的times的字符串名称
 * @returns {stgetJsonResultProring}  查看上示例
 */
function getJsonResultPro(name, json, key, values, times) {
    var DataJSONStr = '';
    var ret = [];
    var len = Object.keys(json).length;
    for (var j = 0; j < values.length; j++) {
        for (var i = 0; i < len; i++) {
            if (json[i][key] == values[j]) {
                ret.push(json[i][name]);
            }
        }
        if (j != values.length - 1) {
            DataJSONStr += ("'" + values[j] + "':[" + ret + "],");
            ret = [];
        } else {
            DataJSONStr += ("'" + values[j] + "':[" + ret + "]");
            ret = [];
        }
    }
    var createTimes = getParamValues("create_time", json).delDuplicate();
    var jsonStr = "'" + times + "'" + ":[" + createTimes + "]," + DataJSONStr;
    return jsonStr;
}


/*size:需要设定几个. typeIn:line,row? . seriesLayout:根据什么排列数据*/
/**
 * 主要用于填充series字段
 * 示例 形式为:
 * [
 *   {"type":"line","seriesLayoutBy":"row"},
 *   {"type":"line","seriesLayoutBy":"row"},
 *   {"type":"line","seriesLayoutBy":"row"},
 *   {"type":"line","seriesLayoutBy":"row"}
 * ]
 *
 * @param size 需要设定几行
 * @param typeIn  展示类型,主要有line(曲线),bar(柱状图), pie(饼图),scatter(散点图)  ^_^||  >饼图,散点图 暂时还支持得不太好~
 * @param seriesLayout  数据的转变形式,一般这里使用"row",还有"column"
 * @returns {Array} 查看上面示例
 */
function getSeriesContent(size, typeIn, seriesLayout) {
    var contentArr = [];
    for (var i = 0; i < size; i++) {
        contentArr.push({type: typeIn, seriesLayoutBy: seriesLayout});
    }
    return contentArr;
}


/**
 * 填充ECharts dataset:source的数据形式
 * 示例:newArr = getArrayResultPro("today_price", data, "company", companys, "createTime",createTimes);
 * 返回:[ <<ret[]
 * timesArr[0]: ['createTimes','2018-06-19 16:00:00','2019-01-20 16:00:00','2019-01-21 16:00:00'],
 * priceStr[1]: ['华联石化',2323,5321,2422],
 * priceStr[2]: ['海油石化',3000,2311,3211],
 * priceStr[3]: ['昌邑石化',2703,1688,2900]
 *     ]<<ret[]
 *
 * console.log形式: createTime,2019-02-20 13:47:52,2019-02-23 13:47:52,2019-02-24 13:47:52,2019-02-25 13:47:52,A公司0,123,211,421,681,B公司1,300,421,255,472,C公司2,222,231,672,458,D公司3,332,425,521,862
 *
 * 示例返回:
 *  [
 *    ['product', '2012', '2013', '2014', '2015'],
 *    ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
 *    ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
 *    ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4],
 *    ['sulfur1',1.4,1.2,1.5,0.5],
 *    ['sulfur2',2.4,3.2,1.5,1.5],
 *    ['sulfur3',2.4,3.2,1.5,1.5],
 *  ]
 *
 *
 * @param name 要获取的展示数据数组(这里主要是价格)
 * @param json 后端返回数据json
 * @param key  数据数组打头要展示的key(这里主要是公司名)
 * @param values  同上,这里是传入要查询的公司名数组
 * @param timeName 时间节点打头占位字符串,这里假设为 'createTimes' (创建时间)
 * @param dataTimeName 节点时间名,传入对应json中的时间节点的名称如"create_time",则获取timeArr
 * @param timeArr  传入的时间节点集合,如果不传入可通过上面参数dataTime内部获取
 * @returns {Array} 返回形式见 示例
 */
function getArrayResultPro(name, json, key, values, timeName, dataTimeName, timeArr) {
    var ret = [];
    if (timeArr == null) {
        console.log("getArrayResultPro:timeArr is Null,execution getParamValues return timeArr.")
        timeArr = getParamValues(dataTimeName, json).delDuplicate();
    }
    var timesArrStr = timeName + "," + timeArr;
    var timesArr = timesArrStr.split(",");
    ret.push(timesArr); //放入首行times集合
    // var price = [];
    var priceStr = '';
    var len = Object.keys(json).length;
    for (var j = 0; j < values.length; j++) {
        for (var i = 0; i < len; i++) {
            if (json[i][key] == values[j]) {
                priceStr += json[i][name] + ",";
            }
        }
        var s = values[j] + "," + priceStr.substring(0, priceStr.length - 1);
        priceStr = '';
        ret.push(s.split(","));//放入公司及价格数组
    }
    return ret;
}

/**
 * 主要用于ECharts中dataset下dimensions的数据填充
 * 将两个数组何为一个,避免形式['createTime',[companyName1,companyName2,companyName3]]
 * 正确形式:['createTime',companyName1,companyName2,companyName3]
 * 如果需要将数组中值变为''单引号加持请使用 array.map(String)
 *
 * @param companys 公司(或需要的)数组
 * @param timeName 时间名称(并非json中的时间key,而是填充时间节点的自定义的timeName),
 *                 如果获取不到时间请查看是否与其它数据设定的时间名称是否一致
 * @returns {Array}  示例: ['createTime',companyName1,companyName2,companyName3]
 */
function twoArrayToOne(companys, timeName) {
    var timeAndcompanyArray = [];
    timeAndcompanyArray.push(timeName);

    for(var i=0;i<companys.length;i++){
        timeAndcompanyArray.push(companys[i]);
    }

    // for (var i in companys) {
    //     // timeAndcompanyArray.push(companys.map(String)[i]);//原加持方式
    // }
    return timeAndcompanyArray;
}








