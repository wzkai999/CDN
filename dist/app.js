var Main = {
    data() {
        return {
            menuShow: false,
            likeSwitch: 0,
            likeCustom: 0,
            likeWordNumber: "",
            likeReadNumber: "",
            likeDate: "",
            commentSwitch: 0,
            commentCustom: 0,
            commentWordRangeSwitch: 0,
            commentWordRange: [100,2000],
            commentWordNumberSwitch: 0,
            commentWordNumber: 0,
            commentReadNumberSwitch: 0,
            commentReadNumber: 0,
            commentDateSwitch: 0,
            commentDate: "",
            commentDialog: {
                visible: false,
                title: "默认标题",
                text: "",
                new: true,
                source: "",
                index: ""
            },
            currentPage: {
                R: 1,
                S: 1,
                M: 1,
                L: 1
            },
            dateOptions: [{
                value: this.getDateOption(0),
                label: '今天'
                }, {
                value: this.getDateOption(3600 * 1000 * 24 * 7),
                label: '一周内'
                }, {
                value: this.getDateOption(3600 * 1000 * 24 * 30),
                label: '一月内'
                }, {
                value: this.getDateOption(3600 * 1000 * 24 * 30 * 12),
                label: '一年内'
                }, {
                value: this.getDateOption(3600 * 1000 * 24 * 30 * 12 * 2),
                label: '两年内'
                }, {
                value: this.getDateOption(3600 * 1000 * 24 * 30 * 12 * 5),
                label: '五年内'
                }, {
                value: this.getDateOption(3600 * 1000 * 24 * 30 * 12 * 10),
                label: '十年内'
                }, {
                value: '1999-12-01',
                label: '不限'
                }
            ],
            // dateOptions: {
            //     disabledDate(time) {
            //         return time.getTime() > Date.now();
            //     },
            //     shortcuts: [{
            //         text: "今天",
            //         onClick(picker) {
            //         picker.$emit("pick", new Date());
            //         }
            //     },this.getDateShortcut("一周内",3600 * 1000 * 24 * 7),
            //     this.getDateShortcut("一月内",3600 * 1000 * 24 * 30),
            //     this.getDateShortcut("一年内",3600 * 1000 * 24 * 30 * 12),
            //     this.getDateShortcut("两年内",3600 * 1000 * 24 * 30 * 12 * 2),
            //     this.getDateShortcut("五年内",3600 * 1000 * 24 * 30 * 12 * 5),
            //     this.getDateShortcut("十年内",3600 * 1000 * 24 * 30 * 12 * 10),
            //     {
            //         text: "不限",
            //         onClick(picker) {
            //         const date = new Date();
            //         date.setTime(943977600 * 1000);
            //         picker.$emit("pick", date);
            //         }
            //     }]
            // },
            commentList: {
                R: [
                    {text: "0写的不错哦,欢迎回访我的博客哦"},
                    {text: "1前排支持一下,可以的话来我博客看看吧"},
                    {text: "2我在大佬的评论区瑟瑟发抖,希望能引起注意并回访我的博客哈哈我在大佬的评论区瑟瑟发抖,希望能引起注意并回访我的博客哈哈"},
                    {text: "3膜拜技术大佬,来我博客指点江山吧"},
                    {text: "4写的不错哦,欢迎回访我的博客哦"},
                    {text: "5前排支持一下,可以的话来我博客看看吧"},
                    {text: "6我在大佬的评论区瑟瑟发抖,希望能引起注意并回访我的博客哈哈我在大佬的评论区瑟瑟发抖,希望能引起注意并回访我的博客哈哈"},
                    {text: "7膜拜技术大佬,来我博客指点江山吧"},
                    {text: "8写的不错哦,欢迎回访我的博客哦"},
                    {text: "9前排支持一下,可以的话来我博客看看吧"},
                    {text: "10我在大佬的评论区瑟瑟发抖,希望能引起注意并回访我的博客哈哈我在大佬的评论区瑟瑟发抖,希望能引起注意并回访我的博客哈哈"},
                    {text: "11膜拜技术大佬,来我博客指点江山吧"}
                ],
                S: [
                    "虽然字数不多,但是写的非常棒!欢迎回访我的博客"
                ],
                M: [
                    "写的不错,活到老,学到老!欢迎回访我的博客"
                ],
                L: [
                    "写了这么多字,手动码字一定很累吧!欢迎回访我的博客"
                ]
            },
        };
    },
    // computed: {
    //     timeDefault() {
    //         var date = new Date();
    //         var s1 = (date.getFullYear()-2) + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
    //         return s1;
    //     }
    // },
    mounted() {
        this.initItem("likeSwitch",0);
        this.initItem("likeCustom",0);
        this.initItem("likeWordNumber",100);
        this.initItem("likeReadNumber",100);
        this.initItem("likeDate",this.getDateOption(3600 * 1000 * 24 * 30 * 12));

        if(!localStorage.today){
            var date = new Date();
            localStorage.today = date.getDate();
        }

    },
    methods: {
        /* 初始化localStorage */
        initItem(item,value){
            if (localStorage[item]) {
                this[item] = localStorage[item];
            }else{
                this[item] = localStorage[item] = value;
            }
        },
        /**
         *评论类别码
         * 0:随机评论
         * 1:少字数评论
         * 2:中等字数评论
         * 3:多字数评论
         * */
        getCommentType(type){
            var str;
            switch (type) {
                case 0:
                    str = "R";
                    break;
                case 1:
                    str = "S";
                    break;
                case 2:
                    str = "M";
                    break;
                case 3:
                    str = "L";
                    break;
                default:
                    break;
            }
            return str;
        },
        // getDateShortcut(text,time){
        //     var short = {
        //         text: text,
        //         onClick(picker) {
        //             const date = new Date();
        //             date.setTime(date.getTime() - time);
        //             picker.$emit("pick", date);
        //         }
        //     };
        //     return short;
        // },
        /* 负责日期选择器的日期格式化:时间戳减去多少毫秒之前 */
        getDateOption(time){
            var date = new Date();
            date.setTime(date.getTime() - time);
            return (date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        },
        /* 新建评论 */
        commentNew(type){
            this.commentDialog.new = true;
            this.commentDialog.title = "新建评论";
            this.commentDialog.source = this.getCommentType(type);
            this.commentDialog.text = "";
            this.commentDialog.visible = true;
        },
        /* 编辑评论 */
        commentEdit(index, row, type) {
            this.commentDialog.new = false;
            this.commentDialog.title = "编辑评论";
            this.commentDialog.source = this.getCommentType(type);
            this.commentDialog.text = this.commentList[this.getCommentType(type)][index+((this.currentPage.R-1)*5)].text;
            this.commentDialog.index = index;
            this.commentDialog.visible = true;
        },
        /* 删除评论 */
        commentDelete(index, row, type) {
            this.commentList[this.getCommentType(type)].splice(index+((this.currentPage.R-1)*5),1);
        },
        /* 以下4个负责监控分页的变化并实时反馈 */
        currentPageChange_R(page){
            this.currentPage.R = page;
        },
        currentPageChange_S(page){
            this.currentPage.S = page;
        },
        currentPageChange_M(page){
            this.currentPage.M = page;
        },
        currentPageChange_L(page){
            this.currentPage.L = page;
        },
        postComment(){
            var comment = {text:this.commentDialog.text}
            if(this.commentDialog.new){
                // console.log(this.commentList[this.commentDialog.source]);
                this.commentList[this.commentDialog.source].push(comment);
            }else{
                // console.log(this.commentDialog.index);
                // console.log(this.commentDialog.source);
                // console.log(this.commentList[this.commentDialog.source][this.commentDialog.index]);
                this.commentList[this.commentDialog.source][this.commentDialog.index] = comment;
            }
            this.commentDialog.visible = false;
        },
        postChange(){
            localStorage.likeSwitch = this.likeSwitch;
            localStorage.likeCustom = this.likeCustom;
            localStorage.likeWordNumber = this.likeWordNumber;
            localStorage.likeReadNumber = this.likeReadNumber;
            var date = new Date(this.likeDate);
            localStorage.likeDate = (date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
            this.menuShow = false;
        },
        
    }
};
var Ctor = Vue.extend(Main);
var ctor = new Ctor();
ctor.$mount("#app");