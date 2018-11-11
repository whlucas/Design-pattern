var tool = {
    // 继承的方法
    inherit: function(target, origin) {
        // 原型的继承  圣杯模式
        var temp = function() {}; // 这是那个过渡的函数为了让子类不影响父类
        temp.prototype = origin.prototype;
        target.prototype = new temp(); // 子类继承父类
        target.prototype.constructor = target; // 他自己的构造器指向他自己,不设置的话他就会指向origin
    },

    // 另外一个继承的方法
    // 我传入一个基类,返回一个继承这个基类的函数
    // 不但继承他原型上面的东西,还继承他的私有属性
    extends: function(origin) {
        var result = function() {
            origin.apply(this, arguments) // 当我new的时候实际上new的就是我返回的这个result,所以这个this就是他自己,把他自己传进去让这个origin执行一下,参数是我new的时候传入的argument数组
            // 这样的话就在自己的里面生成了和origin一样的静态属性
        };
        this.inherit(result, origin); // 让我新生成的对象和我传进来的origin之间产生继承
        return result;
    },

    // 创建单例模式的方法
    single: function (origin) {
        var singleResult = (function () {
            var instance;  // 函数外面放一个变量等待被返回
            return function () { // 返回一个函数,这个函数被new的时候就执行下面的创建单一对象的操作
                if(typeof instance === 'object'){
                    return instance;
                }
                instance = this; // 这个里面的this是new的时候自己创建的this,设置完属性之后让这个把这个this放到函数外面的instance里面去
                origin && origin.apply(this, arguments); // 如果传进来了一个基类origin就把这个上面的静态属性复制下来放到这里,这里把他放到后面也可以,因为是引用值
                return instance;
            }
        })();
        // 这个外面的this就是这个tool了,这里还是判断一下有没有这个基类,有的话就让这个函数继承这个基类
        origin && this.inherit(singleResult, origin);
        return singleResult;
    }
};

// 假如我传进去的origin函数是这个
// function Square (x, y, width, height) {
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     this.height = height;
// }
// // 调用extends方法
// var food = tool.extends(Square); // 生成一个继承了Squire的函数
// var of = new food(10,20,50,50); // 用这个函数产生一个对象
//
// // 这个新生成的对象就可以继承原先Spuare的私有属性
// // 比如就可以oF.x,oF.y,oF.width等等
// console.log(of.x,of.y,of.width,of.height);

// 调用创建单例对象的方法
// var Food = tool.single(Square);
// var Of = new Food(10, 20, 40, 50);
// console.log(Of.x,Of.y,Of.width,Of.height);