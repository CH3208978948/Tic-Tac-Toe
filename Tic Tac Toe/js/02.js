// 设置玩家
var Player;
(function (Player) {
    Player["X"] = "x";
    Player["O"] = "o";
})(Player || (Player = {}));
var currentPlayer;
// 获取游戏面板
var board = document.querySelector('#board');
// 获胜信息面板
var message = document.querySelector('#message');
// 获胜者
var winner = document.querySelector('#winner');
// 重新开始按钮
var restart = document.querySelector('#restart');
// 获取格子
var cells = document.querySelectorAll('.cell');
// 重新开始游戏
restart.addEventListener('click', startGame);
startGame();
function startGame() {
    // 初始化下棋步数、下棋类别、下棋提示
    steps = 0;
    // 下棋提示 删除
    board.classList.remove(currentPlayer);
    // 下棋提示更换
    if (Math.random() > 0.5) {
        currentPlayer = Player.X;
    }
    else {
        currentPlayer = Player.O;
    }
    board.classList.add(currentPlayer);
    // 清除已经下了的棋子
    cells.forEach(function (item) {
        var cell = item;
        cell.classList.remove(Player.X, Player.O);
    });
    // 清除事件
    cells.forEach(function (ele) {
        var cell = ele;
        cell.removeEventListener('click', clickCell);
    });
    // 绑定事件
    cells.forEach(function (ele) {
        var cell = ele;
        cell.addEventListener('click', clickCell, { once: true });
    });
    // 隐藏胜利面板
    message.style.display = 'none';
    message.style.opacity = '0';
    // 将游戏面板样式 初始化
    board.style.opacity = '1';
}
// 平局
var steps;
// 格子点击事件
function clickCell(event) {
    var cell = event.target;
    // 下棋
    cell.classList.add(currentPlayer);
    steps++;
    // 判断是否胜利
    if (isWin()) {
        // 胜利面板
        winner.innerHTML = '<span>' + currentPlayer + '</span> 胜利了!';
        message.style.display = 'block';
        message.style.opacity = '1';
        // 游戏面板效果
        board.style.opacity = '.3';
        // 终止函数（停止游戏）
        return;
    }
    else if (steps === 9) {
        // 平局面板
        winner.innerText = '平局';
        message.style.display = 'block';
        message.style.opacity = '1';
        // 游戏面板效果
        board.style.opacity = '.3';
        // 终止函数（停止游戏）
        return;
    }
    // 删除当前玩家 下棋提示
    board.classList.remove(currentPlayer);
    // 切换玩家
    currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
    // 添加当前玩家 下棋提示
    board.classList.add(currentPlayer);
}
// 判赢
// 胜利的情况
var winArrs = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6] // 斜
];
// 判赢函数
function isWin() {
    // 返回 是否胜利
    return winArrs.some(function (item) {
        // 得到每个小数组 且通过伪数组 得到元素
        var cell1 = cells[item[0]];
        var cell2 = cells[item[1]];
        var cell3 = cells[item[2]];
        // 判断三个元素的类 是否都有当前 玩家的类
        if (hasClass(cell1, currentPlayer) &&
            hasClass(cell2, currentPlayer) &&
            hasClass(cell3, currentPlayer)) {
            // 如果符合条件 则胜利 终止遍历
            return true;
        }
        else {
            // 未符合条件 继续循环
            return false;
        }
    });
}
// 判断 是否有类
function hasClass(ele, player) {
    return ele.classList.contains(player);
}
