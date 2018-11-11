// 用工厂方法模式创建小方块
function SquareFactory () {

}
SquareFactory.create = function (type, x, y, color) {
    if (typeof SquareFactory.prototype[type] === 'undefined'){ // 工厂有没有这个流水线,即有没有我传进来的子类,没有的话就弹出来一个错误,注意typeof判断出来的类型是string类型
        throw 'no this type';
    }
    if (SquareFactory.prototype[type].prototype.__proto__ !== SquareFactory.prototype){
        // 判断一下子类工厂和父类有没有继承关系,没有的话就加上
        SquareFactory.prototype[type].prototype = new SquareFactory();
    }

    var newSquare = new SquareFactory.prototype[type](x, y, color);
    return newSquare;
};

// 我那边定义方块的时候只有位置和宽高信息,我这还想给他初始化一个颜色信息,传入想要初始化的方块和颜色
// 在这个里面把方块的信息添加到dom上面
SquareFactory.prototype.init = function (square, color) {
    console.log(square.x * SQUAREWIDTH);
    square.viewContent.style.position = 'absolute'; //给他定位到父级
    // 由于我这里把square传进来了,那么我在new他的时候给他上面加了一些属性,这里可以直接用它上面的属性
    square.viewContent.style.width = square.width + 'px';
    square.viewContent.style.height = square.height + 'px';
    square.viewContent.style.left = square.x * SQUAREWIDTH; // 他的位置等于他的行列号 + 单位长度
    square.viewContent.style.top = square.y * SQUAREWIDTH;
    square.viewContent.style.backgroundColor = color;
};

SquareFactory.prototype.Floor = function (x, y, color) {
    var floor = new Floor(x, y, SQUAREWIDTH, SQUAREWIDTH) // 这里创建的是我在jsUtil里面创建的子类
    this.init(floor, color); // 由于是我new的时候执行这个操作,且new之前这个对象的原型已经和原来的SquareFactory对象绑定,所以可以直接在这个对象的原型上面找到init方法进行调用
    return floor;
};

SquareFactory.prototype.Stone = function (x, y, color) {
    var stone = new Stone(x, y, SQUAREWIDTH, SQUAREWIDTH);
    this.init(stone, color);
    return stone;
};

SquareFactory.prototype.Food = function (x, y, color) {
    var food = new Food(x, y, SQUAREWIDTH, SQUAREWIDTH);
    this.init(food, color);
    return food;
};

SquareFactory.prototype.SnaleHead = function (x, y, color) {
    var sh = new SnakeHead(x, y, SQUAREWIDTH, SQUAREWIDTH);
    this.init(sh, color);
    return sh;
};

SquareFactory.prototype.SnakeBody = function (x, y, color) {
    var sb = new SnakeBody(x, y, SQUAREWIDTH, SQUAREWIDTH);
    this.init(sb, color);
    return sb;
};





