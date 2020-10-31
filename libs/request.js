// 授权登录
// asdadasdasdasdasd
const appid = '';
const url =
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=" +
    location
    .href
    .split('#')[0] + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
/**
 * @method WechatLogin() 授权登录;
 * @param {object} window 页面信息;
 *   
 */
function WechatLogin(window) {
    return new Promise((resolve, reject) => { 
        if (sessionStorage.getItem('tokens')) {
            resolve(1)
        } else {
            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            };
            var code = getUrlParam("code");
            var data = getUrlParam('data');
            if (code) {
                resolve(code)
            } else {
                sessionStorage.setItem('useData',data)
                window.location = url;
            }
        }
    })
};

const http = 'http://cunbao.1565.com.cn';
/**get请求 方法
 * 
 * @param {*} url 请求路径
 * @param {*} data 请求数据
 */
function requestGet(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: http + url,
            data,
            type: "GET",
            headers: {
                tokens: sessionStorage.getItem('tokens')
            },
            success: (res) => {
                if (res.code) {
                    resolve(res)
                } else {
                    reject(res)
                }
            }
        })
    })
};

// post 请求
function requestPost(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: http + url,
            data,
            type: "POST",
            headers: {
                tokens: sessionStorage.getItem('tokens'),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            success: (res) => {
                if (res.code) {
                    resolve(res)
                } else {
                    reject(res)
                }
            }
        })
    })
};

// 关于我们
(function about() {
    var data = {};
    $.ajax({
        url: http + '/api.php?s=/user/info',
        data,
        type: "GET",
        headers: {
            tokens: sessionStorage.getItem('tokens')
        },
        success: (res) => {
            if (res.code) {
                sessionStorage.setItem('about', JSON.stringify(res.data))
            } else {
                console.log(res)
            }
        }
    });
    let isPageHide = false;
    window.addEventListener('pageshow', function () {
        if (isPageHide) {
            window.location.reload();
        }
    });
    window.addEventListener('pagehide', function () {
        isPageHide = true;
    });
})();

// async 
const updateResturant = data => $.ajax({
    url: http + '/api.php?s=/user/info',
    data,
    type: "GET",
    headers: {
        tokens: sessionStorage.getItem('tokens')
    },
    success: (res) => {
        if (res.code) {
            sessionStorage.setItem('about', JSON.stringify(res.data))
        } else {
            console.log(res)
        }
    }
});