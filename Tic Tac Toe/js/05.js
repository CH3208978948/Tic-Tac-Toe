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
// 当前选中需要移动的棋子 以及索引
var currentCell;
var index;
var board = document.querySelector('#board');
var cells = __spreadArray([], document.querySelectorAll('.cell'));
var rows = __spreadArray([], document.querySelectorAll('.row'));
var message = document.querySelector('#message');
var winner = document.querySelector('#winner');
var restart = document.querySelector('#restart');
var restart_btn = document.querySelector('#restart_btn');
restart.addEventListener('click', startGame);
restart_btn.addEventListener('click', startGame);
startGame();
function startGame() {
    steps = 0;
    board.classList.remove(currentPlayer);
    cells.forEach(function (item, index) {
        var cell = item;
        cell.classList.remove(Player.X, Player.O);
        cell.removeEventListener('click', cellClick);
        cell.addEventListener('click', cellClick, { once: true });
        removeEmpsCellsClick();
        removeOldCellsClick();
    });
    rows.forEach(function (item, index) {
        var row = item;
        row.children[0].setAttribute('data-index', parseInt(index + '0').toString());
        row.children[1].setAttribute('data-index', parseInt(index + '1').toString());
        row.children[2].setAttribute('data-index', parseInt(index + '2').toString());
    });
    if (Math.random() > 0.5) {
        currentPlayer = Player.X;
    }
    else {
        currentPlayer = Player.O;
    }
    board.classList.add(currentPlayer);
    message.style.display = 'none';
    message.style.opacity = '0';
    board.style.opacity = '1';
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
    if (steps != 6)
        board.classList.add(currentPlayer);
    if (steps === 6) {
        cells.forEach(function (item) {
            var cell = item;
            cell.removeEventListener('click', cellClick);
        });
        setNewCellsClick();
        return;
    }
}
function moveCellClick(event) {
    currentCell = event.target;
    index = parseInt(currentCell.getAttribute('data-index'));
    console.log('当前元素', currentCell);
    console.log('是当前玩家', currentPlayer);
    console.log('索引', index);
    setEmpsCellsClick();
}
function showMessage() {
    message.style.display = 'block';
    message.style.opacity = '1';
    board.style.opacity = '.3';
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
function hasClass(ele, player) {
    return ele.classList.contains(player);
}
function hasClass_two(ele) {
    return ele.classList.contains(Player.X) || ele.classList.contains(Player.O);
}
function setNewCellsClick() {
    var newCells = cells.filter(function (item) { return hasClass(item, currentPlayer); });
    newCells.forEach(function (item) {
        var cell = item;
        console.log('设置了格子', cell);
        cell.addEventListener('click', moveCellClick);
    });
}
function removeOldCellsClick() {
    var oldCells = cells.filter(function (item) { return hasClass(item, currentPlayer); });
    oldCells.forEach(function (item) {
        var cell = item;
        console.log('移除了格子', cell);
        cell.removeEventListener('click', moveCellClick);
    });
}
function setEmpsCellsClick() {
    var empCells = cells.filter(function (item) { return !hasClass_two(item); });
    console.log(empCells);
    empCells.forEach(function (item) {
        var cell = item;
        console.log('设置了空格', cell);
        cell.addEventListener('click', checkQ, { once: true });
    });
}
function removeEmpsCellsClick() {
    var empCells = cells.filter(function (item) { return !hasClass_two(item); });
    console.log('空格', empCells);
    empCells.forEach(function (item) {
        var empCell = item;
        console.log('移除了空格', empCell);
        empCell.removeEventListener('click', checkQ);
    });
}
function checkQ(event) {
    var cell = event.target;
    console.log('当前点击的空元素', cell);
    if (cc(cell)) {
        currentCell.classList.remove(currentPlayer);
        cell.classList.add(currentPlayer);
        if (isWin()) {
            showMessage();
            winner.innerHTML = '<span>' + currentPlayer + '</span> 赢了!';
            return;
        }
        removeEmpsCellsClick();
        removeOldCellsClick();
        console.log('当前位置可以移动');
        currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
        console.log('--------------------------------');
        setNewCellsClick();
    }
    else {
        console.log('当前位置不可以移动');
    }
}
// 棋子的位置情况
function cc(ele) {
    var eleIndex = parseInt(ele.getAttribute('data-index'));
    var winIndexArrs = [index - 1, index - 10, index + 1, index + 10, index - 11, index - 9, index + 9, index + 11];
    console.log(winIndexArrs);
    return winIndexArrs.some(function (item) { return item === eleIndex; });
}
