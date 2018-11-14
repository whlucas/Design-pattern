// 提前去定义一下某一些变量
// 场景 == 广场
var xLen = 30; // 横向系数
var yLen = 30; // 纵向系数

// 每个方块的宽高
// 用大写的来区分是因为我们希望这个游戏跑起来之后就不要变了,跑起来之前可以变所以不用const
var SQUAREWIDTH= 20;

// 广场 位置

var BASE_X_POINT = 200;
var BASE_Y_POINT = 200;

// 定义基类
function Square (x, y, width, height, viewContent){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.viewContent = viewContent || document.createElement('div') // 我把这个格子创建到哪个dom上面,如果没传我就自己创建一个dom
}

// 因为我在创建蛇头的时候蛇头是单例模式,所以我在创建时候没法更新这个蛇头的坐标,所以我在这里强行的给他来一个修改蛇头属性的方法
Square.prototype.update = function (x, y){
    this.x = x;
    this.y = y;
    this.viewContent.style.left = x * SQUAREWIDTH + 'px';
    this.viewContent.style.top = y * SQUAREWIDTH + 'px';
};

// 定义子类
// 用我定义方法中的extends()来定义,这样就可以继承父类的属性信息
var Floor = tool.extends(Square);

var Stone = tool.extends(Square);

var Food = tool.single(Square);

let Snake = tool.single(); // 他就是一个抽象的蛇不需要坐标,所以不需要继承,如果我只有一条蛇就写成单例,如果有好几条蛇就直接 = function () {};

var SnakeHead = tool.single(Square);

var SnakeBody = tool.extends(Square);

var Ground = tool.single(Square);

var Game = tool.single(Square);

// 用一个对象集合所有的策略消息,策略枚举,因为我这个方块在出厂的时候还没有引入snake.js,上面没法直接绑定策略,所以就在这里定定一个可以放回策略名的东西,然后在出厂的时候在touch方法上面来调用这个对象
let STRATEGYNUM = {
    move: 'MOVE',
    eat: 'EAT',
    die: 'DIE'
};



