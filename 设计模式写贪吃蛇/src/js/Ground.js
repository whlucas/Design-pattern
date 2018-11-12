var ground = new Ground(BASE_X_POINT, BASE_Y_POINT, xLen * SQUAREWIDTH, yLen * SQUAREWIDTH);

// 在这个广场上面添加一个初始化方法
ground.init = function () {
    // 渲染广场
    this.viewContent.style.position = 'absolute';
    this.viewContent.style.backgroundColor = '#0ff';
    this.viewContent.style.left = this.x + 'px'; // 我创建这个对象的时候就已经把这个位置信息传进去了
    this.viewContent.style.top = this.y + 'px';
    this.viewContent.style.width = this.width + 'px';
    this.viewContent.style.height = this.height + 'px';
    document.body.appendChild(this.viewContent);


    // 存储存储广场中所有的方块对象
    this.SquareTable = [];
    for (var i = 0; i < yLen; i++){
        this.SquareTable[i] = new Array(xLen) // 创建一个二位数组,大小是横向的系数
        for (var j = 0; j < xLen; j++){ // 我在每一行都加上小方块
            if (j === 0 || i === 0 || j === xLen - 1 || i === yLen - 1) {
                // 创建石头
                var newSquare = SquareFactory.create('Stone', j, i, 'black')
            }else{
                // 创建地板
                var newSquare = SquareFactory.create('Floor', j, i, 'orange')
            }
            // 我把我创建出来的方块存起来
            this.SquareTable[i][j] = newSquare;
            // 再把这个添加到我的广场里面去
            this.viewContent.appendChild(newSquare.viewContent);
        }
    }

};

// 给广场添加一个拆的功能
// 两个方面,一个是在视觉中删掉,一个是从数据中抹去
ground.remove = function(x, y) {
    // 根据坐标来定位方块, 我要真正的找到方块
    let square = this.SquareTable[y][x];
    // 从视觉上抹去 从html结构中抹去
    this.viewContent.removeChild(square.viewContent); // 从地板上面把我找到的小方块删了
    // 从数据上面也删掉
    this.SquareTable[y][x] = null; // 把他设置为null了他就会被浏览器当做垃圾给清除掉
};

// 安装方块
// 因为我在创建方块的时候会传入x,y参数,所以这里只需要传入我需要创建什么样的方块就行了
ground.append = function(square) {
    // 从视觉上添加方块 就是往html结构上面添加方块
    this.viewContent.appendChild(square.viewContent);
    // 从数据上面添加方块
    this.SquareTable[square.y][square.x] = square;
};

ground.init();
