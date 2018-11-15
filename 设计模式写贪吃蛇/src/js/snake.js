let snake = new Snake();

// 我想用两个静态属性记录我的蛇头和蛇尾
snake.head = null;
snake.tail = null;


// 方向的枚举
let DIRECTIONNUM = {
    LEFT:　{
        x: -1,
        y: 0
    },
    RIGHT: {
        x: 1,
        y: 0
    },
    UP: {
        x: 0,
        y: -1
    },
    DOWN: {
        x: 0,
        y: 1
    }
};

snake.init = function (ground) { // 初始化整条蛇,需要把广场拿进来拆地板
    // 创建蛇身 蛇头 渲染出来
    let SnakeHead = SquareFactory.create('SnakeHead', 3, 1, 'red');
    let SnakeBody1 = SquareFactory.create('SnakeBody', 2, 1, 'blue');
    let SnakeBody2 = SquareFactory.create('SnakeBody', 1, 1, 'blue');

    // 我想要把蛇整个关联起来,用链表来实现
    // 这里用的是双向链表,过来可以查回去也可以查
    SnakeHead.next = SnakeBody1;
    SnakeHead.last = null;

    SnakeBody1.next = SnakeBody2;
    SnakeBody1.last = SnakeHead;

    SnakeBody2.next = null;
    SnakeBody2.last = SnakeBody1;

    // 记录
    this.head = SnakeHead;
    this.tail = SnakeBody2;

    // 渲染
    ground.remove(SnakeHead.x, SnakeHead.y);
    ground.append(SnakeHead);

    ground.remove(SnakeBody1.x, SnakeBody1.y);
    ground.append(SnakeBody1);

    ground.remove(SnakeBody2.x, SnakeBody2.y);
    ground.append(SnakeBody2);

    // 默认方向
    snake.direction = DIRECTIONNUM.RIGHT;
};

// 引入策略处理
// 我这个蛇拥有这么多的策略,之后多的策略可以之后再加
snake.strategies = {
    MOVE: function (snake, square, ground, fromEat) {
        // 实现移动
        // 由于我下面没有人去调用我这个方法,所以我这个里面的this是指向window的,所以我这里需要传一个this,或者在下面执行这个函数的时候我apply(this,[])一下,在括号里面传参数
        // 这里直接把这个snake传进来也行

        // 新建蛇身
        // 首先在蛇头的位置上面创建一个蛇身
        let newBody = SquareFactory.create('SnakeBody', snake.head.x, snake.head.y, 'blue');

        // 把这个新蛇身和后面的蛇身接起来,注意往上面加时候是先链接上,再断开,如果先断开就找不到了
        newBody.next = snake.head.next;

        // 后面的那个蛇身的last指向这个新的蛇身
        newBody.next.last = newBody;

        newBody.last = null; // 先让他暂时为空,之后再指向我的新的蛇头

        // 把这个我创建出来的蛇身出现
        ground.remove(snake.head.x, snake.head.y);
        ground.append(newBody);

        // 新建蛇头
        // 因为我蛇头是一个单例,所以我在新建的时候除了type是蛇头之外,我后面传什么参数都无所谓
        // 但是我们希望他能够根据我传的坐标进行修改,所以我在创建单例的蛇头哪里做了修改
        // 我让这个蛇头出现在我的下一个方块的位置上
        let newHead = SquareFactory.create('SnakeHead', square.x, square.y, 'red');
        newHead.next = newBody; // 蛇头的上一个指向新的蛇身
        newHead.last = null; // 蛇头的下一个为空
        newBody.last = newHead; // 新蛇身的下一个是新蛇头

        // 让蛇头出现
        // 虽然由于是单例的原因原来的蛇头已经变了位置,但是还是要在数据上删除和添加一下
        ground.remove(newHead.x, newHead.y);
        ground.append(newHead);

        // 更新一下蛇头,其实这里不写也行,因为蛇头是单例,所以这个head记录的一直是同一个head
        snake.head = newHead;

        // 删除蛇尾
        // 需不需要删除蛇尾我需要一个判断
        if(!fromEat){ // 如果我这个MOVE调用不是从吃的地方来的就删除蛇尾
            // 因为我把蛇尾删了还的拿地板补上,所以要创建一个地板
            let floor = SquareFactory.create('Floor', snake.tail.x, snake.tail.y, 'orange');
            ground.remove(snake.tail.x, snake.tail.y);
            ground.append(floor);

            // 更新蛇尾巴,让蛇尾巴等于上一个蛇身
            snake.tail = snake.tail.last
        }

    },
    EAT: function (snake, square, ground) {
        // 实现吃
        // 利用我前面写的move来实现吃
        this.MOVE(snake, square, ground, true); // 这个true带表我这个MOVE执行的时候是从吃来的
        game.score++;
        createFood(ground);
    },
    DIE: function () {
        // game over
        game.over();
    }
};

// 这个移动的函数需要做一个预判,判断这个蛇会移动到哪一个方块
snake.move = function (ground) {
    // 我拿到蛇头的坐标,然后在拿到下一个方向,就可以判断出来下一个方块是什么
    // 因为我这个ground里面的数组记录着我的所有的方块,所以利用它在里面的位置上面找
    // 这个square就是下一个方块
    let square = ground.SquareTable[this.head.y + this.direction.y][this.head.x + this.direction.x];
    if (typeof square.touch === 'function') { // 如果我这个方块有touch功能
        this.strategies[square.touch()](this, square, ground); // 我就拿到我要执行的策略去执行,这个this就是这个蛇, square是下一个方块我需要把他起开, 我还得需要ground里面的方法来帮我起方块虽然他是一个全局变量,不传的话也能找到,但是沿着作用域链去找的话比较的耗性能,所以干脆就传进来
    }
};

snake.init(ground);