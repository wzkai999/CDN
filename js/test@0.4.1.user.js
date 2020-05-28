// ==UserScript==
// @name         问卷星自动考试
// @version      0.1
// @description 全自动填写问卷星的考试问卷，需要自己导入规定格式的题库
// 已适配题型
// 单选
// 多选
// 填空
// @author       ZainCheung
// @include     *://ks.wjx.top/m/*.aspx
// @include     *://ks.wjx.top/jq/*.aspx
// @grant        GM_xmlhttpRequest
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';
    // 配置填空的答案项,如果不配置,默认填无
    var config = {
        school: "郑州大学",
        yuan: "艺术学院",
        name: "赵无极",
        id: "1705281801"
    };
    var URL = "https://cdn.jsdelivr.net/gh/superBoyJack/CDN/file/library-Liaoning@0.4.1.json";
    var nullArr = [];
    var similarArr = [];
    var kuJson = {};
    var judgeArr = [48,49,50,51,52,53]

    function similar(s, t, f) {
        if (!s || !t) {
            return 0
        }
        var l = s.length > t.length ? s.length : t.length
        var n = s.length
        var m = t.length
        var d = []
        f = f || 3
        var min = function(a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c)
        }
        var i, j, si, tj, cost
        if (n === 0) return m
        if (m === 0) return n
        for (i = 0; i <= n; i++) {
            d[i] = []
            d[i][0] = i
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j
        }
        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1)
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1)
                if (si === tj) {
                    cost = 0
                } else {
                    cost = 1
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
            }
        }
        let res = (1 - d[n][m] / l)
        return res.toFixed(f)
    }

    //答题结束，则打开新的问卷
    (function openNew() {
        var currentURL = window.location.href;
        var pat = /complete\.aspx\?q=(\d+)/;
        var obj = pat.exec(currentURL);
        if (obj) {
            window.location.href = "https://www.wjx.cn/jq/" + obj[1] + ".aspx";
        } else {
            console.log("not pat", obj);
        }
    })();

    var currentURL = window.location.href;
    //自动转为电脑网页版
    (function redirect() {
        try {
            var pat = /(https:\/\/www\.wjx\.cn\/)(jq|m)(.*)/g;
            var obj = pat.exec(currentURL);
            if (obj[2] == "m") {
                console.log("redirect now");
                window.location.href = obj[1] + "jq" + obj[3];
            } else {
                console.log("do!");
            }
        } catch (error) {}
    })();


    /**
     *
     *
     * @param {int} min The minimum value in the range
     * @param {int} max The maxmum value in the range
     * @return {int} Return Returns a random number within this range (both include)
     */
    function randint(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function getRandomArrayElements(arr, count) {
        var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }


    /**
     * @description 该函数用于自动选择
     */
    function RandomChoose() {
        /**
         * @name 单选题
         * @param {object}  subject single subject
         */
        this.singleChoose = function(subject,index) {
            var list = subject.querySelectorAll("li");
            var titleDom = subject.querySelector(".div_title_question");
            var title = titleDom.innerText.replace("（     ）","???").replace("*","").replace("。","");
            //console.log(title);
            var singleKu;
            kuJson.data.forEach(element => {
                if (element.type=='single') {
                    singleKu = element.data;
                }
            });

            var singleAnswer = '';
            for (let index = 0; index < singleKu.length; index++) {
                //var singleTitle = singleKu[index].title;
                var similarValue = similar(title,singleKu[index].title);
                if(similarValue >= 0.7){
                    //console.log(similarValue);
                    singleAnswer = singleKu[index].answer;
                    console.log("正确答案是：" + singleKu[index].answer + "  可信度为：" + similarValue);
                    break;
                }
            }
            //console.log("结束");
            var num = 0;
            for(var i = 0; i < list.length; i++){
                if(list[i].getElementsByTagName("label")!= null){
                    var label = list[i].getElementsByTagName("label")[0].innerText.replace(" ","")
                    if(similar(singleAnswer, label)>=0.9){
                        list[i].click();
                        num = 1
                        break;
                    }
                    //console.log(list[i].getElementsByTagName("label")[0].innerText);
                    //no = i;
                }
            }
            if(num==0){nullArr.push(index)}
        }

        /****
         * @name    多选题
         * @param {object}  subject single subject
         *
         */
        this.multiChoose = function(subject,index) {
            var list = subject.querySelectorAll("li");
            var titleDom = subject.querySelector(".div_title_question");
            var title = titleDom.innerText.replace("（     ）","???").replace("*","").replace("。","");

            var multipleKu;
            kuJson.data.forEach(element => {
                if (element.type=='multiple') {
                    multipleKu = element.data;
                }
            });

            var multipleAnswer = [];
            var num = 0;
            for (let index = 0; index < multipleKu.length; index++) {
                //var singleTitle = multipleKu[index].title;
                var similarValue = similar(title,multipleKu[index].title);
                if(similarValue >= 0.5){
                    //console.log(similarValue);
                    multipleAnswer = multipleKu[index].answer;
                    multipleKu[index].answer.forEach(element => {
                        console.log("正确答案是：" + element);
                    });
                    console.log("  可信度为：" + similarValue);
                    // break;
                    for(var i = 0; i < list.length; i++){
                        if(list[i].getElementsByTagName("label")!= null){
                            var option = list[i].getElementsByTagName("label")[0].innerText.replace(" ","")
                            multipleAnswer.forEach(answer => {
                                if(similar(answer,option)>=0.8){
                                    list[i].click();
                                    num += 1;
                                }
                            });
                        }
                    }
                    if(num!=0){break}
                }
            }
            
            // for(var i = 0; i < list.length; i++){
            //     if(list[i].getElementsByTagName("label")!= null){
            //         var option = list[i].getElementsByTagName("label")[0].innerText.replace(" ","")
            //         multipleAnswer.forEach(answer => {
            //             if(answer==option){
            //                 list[i].click();
            //                 num += 1;
            //             }
            //         });
            //     }
            // }
            if(num==0){nullArr.push(index)}
        }

        /****
         * @name    判断题
         * @param {object}  subject single subject
         *
         */
        this.judgeChoose = function(subject) {
            var list = subject.querySelectorAll("li");
            var titleDom = subject.querySelector(".div_title_question");
            var title = titleDom.innerText.replace("（     ）","???").replace("*","").replace("。","");
            //console.log(title);
            var judgeKu;
            kuJson.data.forEach(element => {
                if (element.type=='judge') {
                    judgeKu = element.data;
                }
            });

            var singleAnswer = '';
            for (let index = 0; index < judgeKu.length; index++) {
                //var singleTitle = judgeKu[index].title;
                var similarValue = similar(title,judgeKu[index].title);
                if(similarValue >= 0.7){
                    //console.log(similarValue);
                    singleAnswer = judgeKu[index].answer;
                    console.log("正确答案是：" + singleAnswer + "  可信度为：" + similarValue);
                    break;
                }
            }
            var judgeStr = '';
            if(singleAnswer=='true'){
                judgeStr = '对';
            }else{judgeStr = '错';}
            for(var i = 0; i < list.length; i++){
                if(list[i].getElementsByTagName("label")!= null){
                    if(judgeStr == list[i].getElementsByTagName("label")[0].innerText){
                        list[i].click();
                    }
                    //console.log(list[i].getElementsByTagName("label")[0].innerText);
                    //no = i;
                }
            }
        }

        /**
         * @name 填空题
         * @param {object}  subject single subject
         */
        this.fillBlank = function(subject) {
            var input = subject.querySelectorAll("input");
            var titleDom = subject.querySelector(".div_title_question");
            var title = titleDom.innerText.split('。')[0].replace(/\s*/g,"");
            console.log(title);
            var blankKu;
            kuJson.data.forEach(element => {
                if (element.type=='analysis') {
                    blankKu = element.data;
                }
            });

            var blankAnswer;
            for (let index = 0; index < blankKu.length; index++) {
                //var singleTitle = blankKu[index].title;
                var similarValue = similar(title,blankKu[index].title);
                if(similarValue >= 0.9){
                    //console.log(similarValue);
                    blankAnswer = blankKu[index].answer;
                    blankKu[index].answer.forEach(element => {
                        console.log("正确答案是：" + element);
                    });
                    console.log("  可信度为：" + similarValue);
                    break;
                }
            }

            for(var i = 0; i < input.length; i++){
                input[i].value = blankAnswer[i];
            }
        }


        //随机排序题
        this.randomSort = function(subject) {
            var list = subject.querySelectorAll("li");
            var arr = new Array();
            for (var i = 0; i < list.length; i++) {
                list[i].querySelectorAll("input")[0].checked = false;
                list[i].querySelectorAll("span")[0].classList.remove("sortnum-sel"); //事实上这个只是一个样式，真正选择在于checkd = true || false
                arr.push(list[i]);
            }
            for (i = 0; i < list.length; i++) {
                var randomChoose = arr.splice(randint(0, arr.length - 1), 1)[0];
                randomChoose.querySelectorAll("input")[0].checked = true;
                randomChoose.querySelectorAll("span")[0].classList.add("sortnum-sel");
                randomChoose.querySelectorAll("span")[0].innerHTML = i + 1;
            }
        }

        //表格单选
        this.martixSingleChoose = function(subject) {
                var tr = subject.querySelectorAll("tbody > tr");
                for (var i = 0; i < tr.length; i++) {
                    var td = tr[i].querySelectorAll("td");
                    td[randint(0, td.length - 1)].click();
                }
            }
            //表格多选
        this.martixMultiChoose = function(subject) {
            var tr = subject.querySelectorAll("tbody > tr");
            for (var i = 0; i < tr.length; i++) {
                var td = tr[i].querySelectorAll("td");
                var arr = new Array();
                for (var j = 0; j < td.length; j++) {
                    td[j].querySelectorAll("input")[0].checked = false;
                    td[j].querySelectorAll("a")[0].classList.remove("jqChecked");
                    arr.push(td[j]);
                }

                var times = randint(3, arr.length - 1); // 多选题选择数量，一般不小于3
                for (var k = 0; k < times; k++) {
                    var randomChoose = arr.splice(randint(0, arr.length - 1), 1)[0];
                    randomChoose.querySelectorAll("input")[0].checked = true;
                    randomChoose.querySelectorAll("a")[0].classList.add("jqChecked");
                }
                console.log(times);
            }
        }
        this.martixStar = function(subject) {
            var tr = subject.querySelectorAll("tbody > tr");
            for (var i = 0; i < tr.length; i++) {
                var list = tr[i].querySelectorAll("li");
                var rnnum = randint(0, list.length - 1);
                list[rnnum].click();
                console.log(i, rnnum);
            }
        }

        this.dropdownSelect = function(subject) {
            var select = subject.querySelectorAll("select")[0];
            var rnnum = randint(1, select.length - 1);
            select.selectedIndex = rnnum;
        }

        this.singleSlider = function(subject) {

            /**
             *
             * @param {int} _value 随机值
             * @param {*} min 可选的最小值
             * @param {*} max 可选的最大值
             * @param {*} subject 题目
             * @description 里面的_coordsX, _Number, getElCoordinate, 方法不用管，这是根据网页的方法复制下来的， 用来反模拟出clientX的值（即鼠标的值）, 因为网页上没有提供js直接修改的value，因此只能模拟鼠标时间来点击拉条，需要参数clientX。
             *
             */
            function getClientX(_value, min, max, subject) {
                var _bar = subject.querySelectorAll(".imageBar1")[0];
                var _slider = subject.querySelectorAll(".imageSlider1")[0]

                function _coordsX(x) {
                    x = _Number(x);
                    x = x <= _slider.offsetLeft ? _slider.offsetLeft : x >= _slider.offsetLeft + _slider.offsetWidth - _bar.offsetWidth ? _slider.offsetLeft + _slider.offsetWidth - _bar.offsetWidth : x;
                    return x;
                }

                function _Number(b) {
                    return isNaN(b) ? 0 : b;
                }

                function getElCoordinate(h) {
                    var e = h.offsetLeft;
                    while (h = h.offsetParent) {
                        e += h.offsetLeft;
                    }
                    return {
                        left: e,
                    };
                }

                var x = (_value - min) * ((_slider.offsetWidth - _bar.offsetWidth) / (max - min));
                x = _coordsX(x);
                var clientX = x + getElCoordinate(_slider).left + (_bar.offsetWidth / 2);
                return Math.round(clientX);
            }

            var max = Number(subject.querySelectorAll(".slider")[0].getAttribute("maxvalue"));
            var min = Number(subject.querySelectorAll(".slider")[0].getAttribute("minvalue"));
            //模拟鼠标点击的事件, 关键参数ClientX
            var evt = new MouseEvent("click", {
                clientX: getClientX(randint(min, max), min, max, subject),
                type: "click",
                __proto__: MouseEvent,
            });
            subject.querySelectorAll(".ruler")[0].dispatchEvent(evt);
        }
        this.singleStar = function(subject) {
            var list = subject.querySelectorAll("li:not([class='notchoice'])");
            list[randint(0, list.length - 1)].click();
        }
    }


    /**
     * @name 智慧树题目类型判断，并随机选择
     */
    function judgeType() {
        //q = $$(".div_question");
        var q = document.getElementsByClassName("div_question");
        var rc = new RandomChoose();
        for (var i = 0; i < q.length; i++) {
            //普通单选 or 多选
            if ((q[i].querySelectorAll(".ulradiocheck")[0]) && (q[i].querySelectorAll("input")[0])) { // 非表格单选或者多选
                var input = q[i].querySelectorAll("input");
                if (input[0].type == 'radio') {
                    var isPan = false;
                    judgeArr.forEach(element => {
                        if(element == i){
                            isPan = true;
                        }
                    });
                    if(isPan){
                        console.log("判断题", i);
                        rc.judgeChoose(q[i]);
                    }else{
                        console.log("单选题", i);
                        rc.singleChoose(q[i],i);
                    }
                } else if (input[0].type == 'checkbox') {
                    console.log("多选题", i);
                    rc.multiChoose(q[i],i);
                }

                //表格
            } else if (q[i].querySelectorAll("table")[0]) {
                if (q[i].querySelectorAll("input")[0]) { // 表格题中包含有单选， 多选
                    input = q[i].querySelectorAll("input");
                    if (input[0].type == 'radio') {
                        console.log("表格单选", i);
                        rc.martixSingleChoose(q[i]);
                    } else if (input[0].type == 'checkbox') {
                        console.log("表格多选", i);
                        rc.martixMultiChoose(q[i]);
                    }
                } else if (!q[i].querySelectorAll("input")[0] && q[i].querySelectorAll("li")[0]) { // 表格中的星星题目，没有Input标签
                    console.log("Martix-Star", i);
                    rc.martixStar(q[i]);
                }
                // 填空题
            } else if (q[i].querySelectorAll("input")[0]) {
                console.log("填空", i);
                rc.fillBlank(q[i]);
            } else if (q[i].querySelectorAll(".slider")[0]) {
                console.log("Slider-Single-line", i);
                rc.singleSlider(q[i]);
            } else if (q[i].querySelectorAll(".notchoice")[0]) {
                console.log("Star-Single-line", i);
                rc.singleStar(q[i]);
            } else if (q[i].querySelectorAll(".lisort")[0]) {
                console.log("li-Sort", i);
                rc.randomSort(q[i]);
            } else if (q[i].querySelectorAll("select")[0]) {
                console.log("Select", i);
                rc.dropdownSelect(q[i]);
            }
        }
    }

    function start() {

        document.querySelector("#divquestion1 > table > tbody > tr:nth-child(1) > td > div > textarea").innerText = config.school;
        document.querySelector("#divquestion1 > table > tbody > tr:nth-child(2) > td > div > textarea").innerText = config.yuan;
        document.querySelector("#divquestion1 > table > tbody > tr:nth-child(3) > td > div > textarea").innerText = config.name;
        document.querySelector("#divquestion1 > table > tbody > tr:nth-child(4) > td > div > textarea").innerText = config.id;

        GM_xmlhttpRequest({
            method: 'GET',
            url: URL,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/atom+xml,application/xml,text/xml',
            },
            onload: function(responseDetails) {
                kuJson = JSON.parse(responseDetails.responseText)
                judgeType();
                if(nullArr.length > 0){
                    console.log("以下题目未作,请前往填写");
                    for (let index = 0; index < nullArr.length; index++) {
                        console.warn("第" + nullArr[index] + "题!!!");
                    }
                }else{console.log("恭喜你,你已答完全部试题,现在你可以交卷了");}
                
            }

        });
    }

    start();



    //滚动到提交按钮处
    try {
        var scrollvalue = document.getElementById("submit_button").offsetParent.offsetParent.offsetTop;
        window.scrollTo({
            top: scrollvalue,
            behavior: "smooth"
        });
    } catch (error) {}

})();
// window.alert = function(str) {
//    location.reload();
//    return ;
// }
// setTimeout(function(){
//     // 延时两秒防止验证
//     document.getElementById("submit_button").click();
//     console.log("答题成功!");
// },2000);
// setTimeout(function(){
//     // 5秒自动刷新,解决验证问题
//     location.reload();
// },5000);
