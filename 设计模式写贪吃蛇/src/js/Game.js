let game = new Game();
game.timer = null;
game.speed = 400;
game.score = 0;

game.init = function() {
    ground.init();
    snake.init(ground);
    // 绑定事件 监控
    document.onkeydown = function (e) {
        // e.which:  37 left; 38 top; 39 right; 40 down;
        if (e.which === 37 && snake.direction !== DIRECTIONNUM.RIGHT){
            snake.direction = DIRECTIONNUM.LEFT;
        }else if(e.which === 38 && snake.direction !== DIRECTIONNUM.DOWN){
            snake.direction = DIRECTIONNUM.UP;
        }else if(e.which === 39 && snake.direction !== DIRECTIONNUM.LEFT){
            snake.direction = DIRECTIONNUM.RIGHT;
        }else if(e.which === 40 && snake.direction !== DIRECTIONNUM.UP) {
            snake.direction = DIRECTIONNUM.DOWN;
        }
    }
};

game.start = function() {
    clearInterval(game.timer);
    game.timer = setInterval(function() {
        snake.move(ground);
    }, game.speed)
};

// 设置一个死了的处理方式,在死的策略里面调用这个就可以了
game.over = function() {
    clearInterval(game.timer);
    alert(game.score)
};
game.init();

function createFood (ground) {
    let x = null;
    let y = null;
    let flag = true;
    let ok = true; // 用于判断食物有没有创建到蛇的身上
    while (flag) {
        x = 1 + parseInt(Math.random() * 28); // 生成一个1到28的随机数
        y = 1 + parseInt(Math.random() * 28); // 生成一个1到28的随机数
        for (let node = snake.head; node; node = node.next) { // 让node等于蛇头,如果弄的存在的话,就让node等于下一个
            if (x === node.x && y === node.y){ //如果我创建的坐标等于蛇的身体的话
                ok = false;
                break; // 有一个相等了就退出来
            }
            if(ok){ //如果ok是true说明创建成功了,循环停止
                flag = false;
            }

        }
    }
    let food = SquareFactory.create('Food', x, y, 'green') //依据坐标来创建食物
    ground.remove(food.x, food.y);
    ground.append(food);
}
createFood(ground);