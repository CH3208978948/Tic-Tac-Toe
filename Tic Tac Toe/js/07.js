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
var showPlayer = document.querySelector('#player');
var board = document.querySelector('#board');
var cells = document.querySelectorAll('.cell');
var rows = document.querySelectorAll('.row');
var message = document.querySelector('#message');
var winner = document.querySelector('#winner');
var restart = document.querySelector('#restart');
var restart_btn = document.querySelector('#restart_btn');
// 计步器
var step = 0;
// 移动棋子
var mCell;
load();
restart.onclick = load;
restart_btn.onclick = load;
function load() {
    step = 0;
    hideMsg();
    board.classList.remove(currentPlayer);
    if (Math.random() > 0.5) {
        currentPlayer = Player.X;
    }
    else {
        currentPlayer = Player.O;
    }
    showPlayer.innerText = "\u5F53\u524D\u73A9\u5BB6\u4E3A" + currentPlayer;
    board.classList.add(currentPlayer);
    rows.forEach(function (item, fIndex) {
        var cells = __spreadArray([], item.children);
        cells.forEach(function (item, sIndex) {
            var cell = item;
            cell.classList.remove(Player.X, Player.O);
            cell.setAttribute('data-index', "" + fIndex + sIndex);
            cell.removeEventListener('click', cellClick);
            cell.addEventListener('click', cellClick, { once: true });
        });
    });
}
function showMsg() {
    message.style.display = 'block';
    message.style.opacity = '1';
    board.style.opacity = '.3';
    winner.innerText = currentPlayer + " \u8D62\u4E86!";
}
function hideMsg() {
    message.style.display = 'none';
    message.style.opacity = '0';
    board.style.opacity = '1';
}
function cellClick(event) {
    step++;
    var cell = event.target;
    cell.classList.add(currentPlayer);
    if (isWin()) {
        showMsg();
        return;
    }
    board.classList.remove(currentPlayer);
    currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
    showPlayer.innerText = "\u5F53\u524D\u73A9\u5BB6\u4E3A" + currentPlayer;
    if (step == 6) {
        cells.forEach(function (item) {
            var cell = item;
            cell.removeEventListener('click', cellClick);
            cell.addEventListener('click', moveCell);
        });
        return;
    }
    board.classList.add(currentPlayer);
}
;
var winArrs = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6] // 斜
];
function isWin() {
    return winArrs.some(function (item) {
        var cell1 = cells[item[0]];
        var cell2 = cells[item[1]];
        var cell3 = cells[item[2]];
        return hasClass(cell1) && hasClass(cell2) && hasClass(cell3);
    });
}
function hasClass(ele) {
    return ele.classList.contains(currentPlayer);
}
function hasClassTwo(ele) {
    return ele.classList.contains(Player.X) || ele.classList.contains(Player.O);
}
// 移动
function moveCell(event) {
    var cell = event.target;
    console.log(cell, mCell);
    if (mCell // 选中元素存在
        && !hasClassTwo(cell)
        && checkCouldMove(cell)) {
        console.log("\u79FB\u52A8\u5143\u7D20\u4E3A", mCell);
        // 移动完成
        cell.classList.add(currentPlayer);
        mCell.classList.remove(currentPlayer);
        if (isWin()) {
            showMsg();
            return;
        }
        mCell = null;
        currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
        showPlayer.innerText = "\u5F53\u524D\u73A9\u5BB6\u4E3A" + currentPlayer;
    }
    else if (hasClass(cell)) {
        // 获取移动元素
        mCell = cell;
        console.log("\u79FB\u52A8\u5143\u7D20\u4E3A", mCell);
    }
}
// 判断是否可以移动
function checkCouldMove(ele) {
    var nIndex = parseInt(ele.getAttribute('data-index'));
    var oIndex = parseInt(mCell.getAttribute('data-index'));
    var couldArrs = [oIndex - 1, oIndex + 1, oIndex - 10, oIndex + 10, oIndex - 11, oIndex - 9, oIndex + 9, oIndex + 11];
    return couldArrs.includes(nIndex);
}
