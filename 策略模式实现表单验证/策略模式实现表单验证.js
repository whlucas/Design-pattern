// 策略模式支持您在运行时选择算法，把他们一个个封装起来，并且使他们可以相互替换。
// 决定用一个类对象实例来管理规则的校验
// 改对象要能相应的主动添加对规则的相应的处理办法
// 校验数据的时候可以相应的返回相关的信息

// 一个发送网络请求的函数
function Request() {
    console.log('send') // 如果条件满足可以发送就打印一个send
}

// 这个构造函数上面本身有的一些策略
Validator.prototype.strategies = {
    isNonEmpty: function (value, errorMsg) { // 我这个策略需要两个参数,一个是输入框的值,一个是错误信息
        if (value === '') {
            return errorMsg;
        }
        return true;
    },
    maxLength: function (value, length, errorMsg) { // 这里是传三个参数的
        if (value !== '' && value.length > length) {
            return errorMsg;
        }
        return true;
    },
    minLength: function (value, length, errorMsg) {
        if (value !== '' && value.length < length) {
            return errorMsg;
        }
        return true;
    },
};


// 构造函数, 用来实现策略模式的思想

function Validator() {
    this.cache = []; // 用来缓存add添加的方法
    this.warnDom = [] // 用来存放我显示错误信息的dom,方便对错误信息的清除
}

var validator = new Validator();


// 这个里面会有几个方法:

// add 添加校验规则 参数(dom,showDom,[{strategy: 'isNonEmpty', errorMsg: '用户名不能为空'},{strategy: 'maxLength:4', errorMsg: '用户名长度不能超过4'},]) 第一个参数是控制哪一个dom,第二个是错误信息所显示的标签,第三个是很多个对象,每一个对象里面分别是策略和错误信息,每一个dom对象可以有很多个策略

Validator.prototype.add = function (dom, showDom, strategyArr) {
    let self = this; // 因为是实例化出来的对象去调用他,所以这个self指向这个对象
    self.warnDom.push(showDom); // 我在add的时候把所有显示错误信息的dom存起来放到静态属性里面去
    strategyArr.forEach(function (ele, index) {
        // 那么我这个self是可以调用cache的,因为这cache是这个对象上面的一个属性
        self.cache.push(function () { // 往catch上面存东西,对应的是需要执行的策略

            // 我想要的到一个数组里面传的是我想要的参数
            var arr = ele.strategy.split(':') // 用冒号拆分一下,拆分的结果放到arr里面
            // arr => ['isNonEmpty'] ['maxLength']
            var type = arr.shift(); // 把数组的第一位弹出去,第一位给type,如果有第二位,也就是数字位就存到了数组的第一位
            // type => isNonEmpty maxLength
            // arr => [] ['4']
            arr.unshift(dom.value);
            // [dom.value] [dom.value, 4]
            arr.push(ele.errorMsg);
            // [dom.value, errorMsg] [dom.value, 4, errorMsg]

            // 得到参数了执行,执行结果给msg
            var msg = self.strategies[type].apply(self, arr);

            // 执行会返回一个结果,对结果进行判断
            if (msg !== true) {
                showDom.innerText = msg; // 如果错了就往里面添加错误信息
            }
            return msg; // 这个msg作为我往cache里面传的函数的返回值
        })
    })
};

// start 上面添加完规则之后把需要执行的规则放到cache缓存里,当我执行了start方法的时候就可以开始校验了,返回true or false
Validator.prototype.start = function () {
    // 通过他来标记是否能符合规则
    let flag = true;
    this.warnDom.forEach(function (ele) { // 我遍历一下我存显示错误信息的dom的数组
        ele.innerText = ''; // 在开始的时候先全部给他清空,为了上次写错了,下一次写对了的时候可以把提示全部都消除
    });

    this.cache.forEach(function (ele) {
        if (ele() !== true) { // 我去执行我通过add缓存到cache里面的函数,通过他的返回值判断是不是true
            flag = false; // 只要有一个规则不满足就返回就把flag标记为false;
        }
    }); // 这个还是实例出来的对象调用的这个方法所以this可以方位到他的静态属性cache
    return flag;
};


// extend 可以扩展算法{isMail: function() {}}
Validator.prototype.extend = function (config) { // 接收一个对象
    for (let prop in config) {
        Validator.prototype.strategies[prop] = config[prop]; // 我往这个这个原型上面的strategies里面添加方法,添加属性名和属性名对应的属性值
    }
};

// 如何运用这个接口
// 传一个对象,这个对象里面有一个里面可以添加好几个方法
validator.extend({
    isEmail: function (value, errorMsg) {
        if (value != '' && value.indexOf('@') === -1) { // 判断方式简单一点,直接看有没有@符号,如果没有找到@符号的话
            return errorMsg // 不符合规定返回错误信息
        }
        return true; // 否则返回true
    },
    isIphone: function (value, errorMsg) { // 判断是不是手机号
        if (value.length !== 11) { // 如果输入的手机号不是11位的话我就判断他不是手机
            return errorMsg; // 返回错误信息
        }
        return true
    }
});


// 写一个代理
let ProxyRequest = (function () {
    // 当我点击的时候首先添加规则,添加一个用户名的规则,添加一个密码的规则
    validator.add(userDom, showUser, [{strategy: 'isNonEmpty', errorMsg: '用户名不能为空'}, {
        strategy: 'maxLength:4',
        errorMsg: '用户名长度不能超过4'
    },]);
    validator.add(psDom, showPs, [{strategy: 'isNonEmpty', errorMsg: '密码不能为空'}, {
        strategy: 'minLength:6',
        errorMsg: '密码长度不能小于6'
    }]);
    validator.add(emDom, showEm, [{strategy: 'isNonEmpty', errorMsg: '邮箱不能为空'}, {
        strategy: 'isEmail',
        errorMsg: '邮箱格式不正确'
    }]);
    return function () {
        if (validator.start() === true) { //执行校验,判断我这个start的执行结果是不是true
            Request() // 如果是的话就发送请求
        }
    }
})();

// submit.onclick = function () {
//     // 点击的时候直接执行我这个代理
//     ProxyRequest()
// };