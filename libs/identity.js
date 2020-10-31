// 所有身份端的js 逻辑 通用
;$(function () {
    new Vue({
        el: "#app",
        data() {
            return {
                /**
                 *@param {Boolean}   loading 加载数据状态;drawer 显示身份列表
                  @param {string}   info 当前身份type; 
                  @param {object}  statusList 可用的身份列表 syData 收益数据,userData 当前用户信息;
                 */
                loading: true,
                drawer: false,
                userData: {},
                syData: {},
                info: {},
                statusList: [],
                name:""
            }
        },
        created() {
            let that = this;
            // 获取sessionStorage缓存 获取当前身份type; 
            that.info = JSON.parse(sessionStorage.getItem('status')).type;
            that.name = JSON.parse(sessionStorage.getItem('status')).str;
        },

        mounted() {
            let that = this;
            that.userInfo();
            that.profit();
        },
        methods: {
            //  selectUser  levelfun 两个可以优化成一个方法；
            /**
             * @method 选择身份 点击事件触发;
             * @param {*} type 当前身份type状态 接口返回; 
             * @param {*} index 当前身份在数据的下标位置;
             * @param {obejct} statusList 用户所有身份列表;
             */
            selectUser(type, index) {
                let that = this;
                sessionStorage.setItem('level', type == 'manager' ? 1 : type == 'spread' ? 2 : type ==
                    'site_manager' ? 3 : type == 'action' ? 4 : type == 'admin' ? 5 : 6);
                sessionStorage.setItem('status', JSON.stringify(that.statusList[index]))
                that.navigator();
            },
            /**
             * @method navigator 判断身份跳转;
             * @param {string} url 根据身份判断需要调整的页面;
             * @level {number,string} level 当前用户身份;
             */
            navigator() {
                let that = this,
                    url = 'my.html',
                    level = sessionStorage.getItem('level');
                if (level == 6) {
                    window.location.href = 'my.html'
                };
                level == 1 ? url = 'my_jingli.html' : level == 2 ? url = 'my_jiameng.html' : level == 3 ? url =
                    'my_caiwu.html' : level == 4 ? url = 'my_caozuo.html' : level == 5 ? url = 'my_yunying.html' :
                    sessionStorage.setItem('level', 6);
                window.location.href = url;
            },
            /**
             * @method userInfo 获取用户信息;
             * @param {string} url = '请求的url' 必传;
             * @param {object} 传参 封装的方法 必传 没有数据传空{}; 有数据按需传参 {data,id}/{data:data,id:xxx};
             * @callback {object} then => res => that.userData 请求返回数据 ; catch => err 错误处理;
             */
            userInfo() {
                let that = this,
                    url = '/api.php?s=/user/info',
                    data = {};
                requestGet(url, data).then((res) => {
                    // 赋值用户信息;
                    that.userData = res.data;
                    let data = res.data,
                        i = -1, //i 获取当前身份列表的位置下标;
                        shenfen = []; //局部变量 保存用户身份,用来取值判断;
                    that.statusList = data.identity; //身份列表;
                    // 用户有身份判断进入相应的页面;
                    if (data.identity.length) {
                        for (let item of data.identity) {
                            i++;
                            shenfen.push(item.type);
                            if (item.type == that.info) {
                                that.levelfun(i, -1)
                                console.log(i, data.identity[i], sessionStorage.getItem('level'));
                            }
                        };
                        // 判断用户当前有没有这个身份,没有刷新页面进入当前身份的第一个;
                        if (shenfen.indexOf(that.info) == -1) {
                            that.levelfun(0, 1);
                        }
                    } else {
                        window.location.href = 'my.html'
                    }
                    that.loading = false;
                }).catch((err) => {
                    // 错误处理
                })
            },
            /**
             * @method levelfun 用户身份权限; 
             * @param {*} i 身份下标;
             * @param {*} status = 1更改身份不做调整(缓存与当前身份一致) || = -1 与当前身份不一致需要调整;
             * @param {number,string} level == 1 总经理 == 2 加盟商 == 3 场所经理 == 4 操作员 == 5 admin == 6 普通用户;  
             */
            levelfun(i, status) {
                let that = this;
                var type = that.statusList[i].type;
                sessionStorage.setItem('level', type == 'manager' ? 1 : type == 'spread' ? 2 : type ==
                    'site_manager' ? 3 : type == 'action' ? 4 : type == 'admin' ? 5 : 6);
                sessionStorage.setItem('status', JSON.stringify(that.statusList[i]));
                if (status == 1) {
                    that.navigator();
                }
            },
            /**
             * @method profit();收益(总经理,场所经理,admin,加盟商);
             * @param {string} url = '请求的url' 必传;
             * @param {object} 传参 封装的方法 必传 没有数据传空{}; 有数据按需传参 {data,id}/{data:data,id:xxx};
             * @callback {object} then => res=>that.syData 请求返回数据 ; catch => err 错误处理;
             */
            profit() {
                let that = this,
                    url = '/api.php?s=/UserCommission/profit',
                    data = {
                        type: JSON.parse(sessionStorage.getItem('status')).type
                    };
                requestPost(url, data).then((res) => {
                    that.syData = res.data;
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    })
})