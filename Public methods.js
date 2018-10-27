var jsUtil = {
    // 单例模式通用:传进来一个普通函数使他变成单例模式的函数
    getSingle: function (func) {
        var result = undefined;
        return function () {
            if(!result) {
                result = func.apply(this, arguments);
            }
            return result;
        }
    }
}