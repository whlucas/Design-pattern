let tool = {
    inherit: function(target, origin) {
        // 原型的继承  圣杯模式
        let temp = function() {}; // 这是那个过渡的函数为了让子类不影响父类
        temp.prototype = origin.prototype;
        target.prototype = new temp(); // 子类继承父类
    }
};

