var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var Player;
(function (Player) {
    Player["X"] = "x";
    Player["O"] = "o";
})(Player || (Player = {}));
var currentPlayer;
var steps;
var currentCell;
var index;
var playerMsg = document.querySelector('#player');
var board = document.querySelector('#board');
var cells = __spreadArray([], document.querySelectorAll('.cell'));
var rows = __spreadArray([], document.querySelectorAll('.row'));
var message = document.querySelector('#message');
var winner = document.querySelector('#winner');
var restart = document.querySelector('#restart');
restart.addEventListener('click', startGame);
startGame();
function startGame() {
    steps = 0;
    board.classList.remove(currentPlayer);
    removeEvent();
    cells.forEach(function (item) {
        var cell = item;
        cell.classList.remove(Player.X, Player.O);
        cell.removeEventListener('click', cellClick);
        cell.addEventListener('click', cellClick, { once: true });
    });
    rows.forEach(function (item, index) {
        var row = item;
        row.children[0].setAttribute('data-index', parseInt(index + "0").toString());
        row.children[1].setAttribute('data-index', parseInt(index + "1").toString());
        row.children[2].setAttribute('data-index', parseInt(index + "2").toString());
    });
    if (Math.random() > 0.5) {
        currentPlayer = Player.X;
        showPlayer();
    }
    else {
        currentPlayer = Player.O;
        showPlayer();
    }
    board.classList.add(currentPlayer);
    message.style.display = 'none';
    message.style.opacity = '0';
    board.style.opacity = '1';
}
function showPlayer() {
    playerMsg.innerText = "\u5F53\u524D\u73A9\u5BB6\u4E3A" + currentPlayer;
}
function cellClick(event) {
    var cell = event.target;
    cell.classList.add(currentPlayer);
    steps++;
    if (isWin()) {
        showMessage();
        winner.innerHTML = '<span>' + currentPlayer + '</span> 赢了!';
        return;
    }
    board.classList.remove(currentPlayer);
    currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
    showPlayer();
    if (steps === 6) {
        cells.forEach(function (item) {
            var cell = item;
            cell.removeEventListener('click', cellClick);
        });
        setNewCellsClick();
        return;
    }
    board.classList.add(currentPlayer);
}
var winArrs = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
function isWin() {
    return winArrs.some(function (item) {
        var cell1 = cells[item[0]];
        var cell2 = cells[item[1]];
        var cell3 = cells[item[2]];
        if (hasClass(cell1, currentPlayer) &&
            hasClass(cell2, currentPlayer) &&
            hasClass(cell3, currentPlayer)) {
            return true;
        }
        return false;
    });
}
function showMessage() {
    message.style.display = 'block';
    message.style.opacity = '1';
    winner.innerHTML = '<span>' + currentPlayer + '</span> 赢了!';
    board.style.opacity = '.3';
}
function hasClass(ele, player) {
    return ele.classList.contains(player);
}
// 设置空格点击事件
function empCellsClick(event) {
    var cell = event.target;
    console.log('点击了空格', cell, '现在移动的元素为:', currentCell);
    if (cc(cell)) {
        currentCell.classList.remove(currentPlayer);
        cell.classList.add(currentPlayer);
        removeEvent();
        setNewCellsClick();
        if (isWin()) {
            showMessage();
            return;
        }
        currentPlayer = currentPlayer === Player.X ? Player.O : Player.X;
        showPlayer();
        console.log('切换后', currentPlayer);
        console.warn('-----------------------------------');
    }
    else {
        console.log('点击位置不可以使用  点击位置元素及索引', cell, parseInt(cell.getAttribute('data-index')), '移动元素元素及索引', currentCell, index);
        console.warn('-----------------------------------');
    }
}
// 移除所有元素的点击事件
function removeEvent() {
    cells.forEach(function (item) {
        var cell = item;
        cell.removeEventListener('click', newCellsClick);
        cell.removeEventListener('click', empCellsClick);
    });
}
// 已经有的格子 点击事件
function newCellsClick(event) {
    if (hasClass(event.target, currentPlayer)) {
        currentCell = event.target;
        index = parseInt(currentCell.getAttribute('data-index'));
        console.log("\u70B9\u51FB\u4E86\u5355\u5143\u683C", currentCell);
        setEmpCellsClick();
    }
    else {
        console.log('点击的元素并非当前玩家 点击元素及类别', event.target, event.target.className);
        console.log('当前类别', currentPlayer);
        console.warn('-----------------------------------');
    }
}
// 设置 已经有的格子 点击事件
function setNewCellsClick() {
    var newCells = cells.filter(function (item) { return hasClass(item, Player.X) || hasClass(item, Player.O); });
    newCells.forEach(function (item) {
        var cell = item;
        console.log('给这个 格子添加了事件', cell);
        cell.addEventListener('click', newCellsClick);
    });
    console.log('现在的玩家是', currentPlayer);
}
// 设置空格点击事件
function setEmpCellsClick() {
    var newEmps = cells.filter(function (item) { return !(hasClass(item, Player.X) || hasClass(item, Player.O)); });
    newEmps.forEach(function (item) {
        var cell = item;
        cell.addEventListener('click', empCellsClick, { once: true });
    });
}
// 判断点击格子是否是 移动存在的
function cc(ele) {
    var eleIndex = parseInt(ele.getAttribute('data-index'));
    var winIndexArrs = [index - 1, index - 10, index + 1, index + 10, index - 11, index - 9, index + 9, index + 11];
    // console.log(winIndexArrs)
    return winIndexArrs.some(function (item) { return item === eleIndex; });
}
