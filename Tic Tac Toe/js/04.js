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
var board = document.querySelector('#board');
var cells = __spreadArray([], document.querySelectorAll('.cell'));
var rows = document.querySelectorAll('.row');
var message = document.querySelector('#message');
var winner = document.querySelector('#winner');
var restart = document.querySelector('#restart');
var restart_btn = document.querySelector('#restart_btn');
restart.addEventListener('click', startGame);
restart_btn.addEventListener('click', startGame);
// 添加索引
rows.forEach(function (item) {
    item.children[0].setAttribute('data-index', '0');
    item.children[1].setAttribute('data-index', '1');
    item.children[2].setAttribute('data-index', '2');
});
startGame();
function startGame() {
    steps = 0;
    board.classList.remove(currentPlayer);
    cells.forEach(function (item) {
        var cell = item;
        cell.classList.remove(Player.X, Player.O);
        cell.removeEventListener('click', cellClick);
        cell.removeEventListener('click', cellClick);
        cell.addEventListener('click', cellClick, { once: true });
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
    }
    board.classList.remove(currentPlayer);
    currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
    if (steps != 6) {
        board.classList.add(currentPlayer);
    }
    if (steps === 6) {
        // 给所有格子解除点击事件
        cells.forEach(function (item) {
            var cell = item;
            cell.removeEventListener('click', cellClick);
        });
        // 给当前玩家添加点击移动事件
        letCurrentEleAddEvent();
        return;
    }
}
function showMessage() {
    board.style.opacity = '.3';
    message.style.display = 'block';
    message.style.opacity = '1';
    winner.innerHTML = "<span>" + currentPlayer + "</span> \u8D62\u4E86!";
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
// 左上右下 37 - 40  z(左下)90  m(右下)77  q(左上)81  p(右上) 80
var keyArrs = [37, 38, 39, 40, 90, 77, 81, 80];
var lrArrs = [37, 39];
var upArrs = [38, 81, 80];
var downArrs = [40, 90, 77];
function keyEvent(ele, event) {
    var c = event.keyCode;
    // console.log(ele);
    if (keyArrs.some(function (item) { return c === item; })) {
        ele.classList.remove(currentPlayer);
        var index = ele.getAttribute('data-index');
        if (lrArrs.some(function (item) { return c === item; })) {
            switch (c) {
                // 左
                case 37:
                    var leftEle = ele.previousElementSibling;
                    checkQ(ele, leftEle);
                    break;
                // 右
                case 39:
                    var rightEle = ele.nextElementSibling;
                    checkQ(ele, rightEle);
                    break;
            }
        }
        else if (upArrs.some(function (item) { return c === item; })) {
            var upRow = ele.parentElement.previousElementSibling;
            if (upRow) {
                switch (c) {
                    // 上
                    case 38:
                        checkQ(ele, upRow.children[index]);
                        console.log('当前移动元素为', ele, '移动目的地', upRow.children[index]);
                        break;
                    // 左上
                    case 81:
                        var upLeft = upRow.children[index].previousElementSibling;
                        checkQ(ele, upLeft);
                        break;
                    // 右上
                    case 80:
                        var upRight = upRow.children[index].nextElementSibling;
                        checkQ(ele, upRight);
                        break;
                }
            }
            else {
                setEventAga(ele);
            }
        }
        else if (downArrs.some(function (item) { return c === item; })) {
            var downRow = ele.parentElement.nextElementSibling;
            if (downRow) {
                switch (c) {
                    // 下
                    case 40:
                        checkQ(ele, downRow.children[index]);
                        break;
                    // 左下
                    case 90:
                        var downLeft = downRow.children[index].previousElementSibling;
                        checkQ(ele, downLeft);
                        break;
                    // 右下
                    case 77:
                        var downRight = downRow.children[index].nextElementSibling;
                        checkQ(ele, downRight);
                        break;
                }
            }
            else {
                setEventAga(ele);
            }
        }
    }
    else {
        setKeyEvent(ele);
    }
}
// 检测是否有类
function hasClass(ele, player) {
    return ele.classList.contains(player);
}
// 检测移动后的位子是否已经有棋子了
function hasClass_two(ele) {
    return ele.classList.contains(Player.X) || ele.classList.contains(Player.O);
}
// 得到已经下了的棋子并且 绑定点击事件
function letCurrentEleAddEvent() {
    // 得到当前玩家的所有棋子
    var newCells = cells.filter(function (item) {
        return hasClass_two(item);
    });
    // console.log(newCells)
    // 当前玩家绑定事件
    newCells.forEach(function (item) {
        console.log('给', item, '绑定了移动事件');
        setKeyEvent(item);
    });
}
// 重新绑定事件
function setEventAga(ele) {
    ele.classList.add(currentPlayer);
    setKeyEvent(ele);
}
// 给元素添加点击绑定移动事件
function setKeyEvent(ele) {
    ele.addEventListener('click', function () {
        if (hasClass(ele, currentPlayer)) {
            console.log('给', ele, '绑定了移动事件', '当前玩家为', currentPlayer);
            document.documentElement.removeEventListener('keydown', function (event) {
                keyEvent(ele, event);
            });
            document.documentElement.addEventListener('keydown', function (event) {
                keyEvent(ele, event);
            }, { once: true });
        }
        else {
            console.log(ele, '不是当前玩家');
            setKeyEvent(ele);
        }
    }, { once: true });
}
// 检测棋子
function checkQ(oldEle, ele) {
    console.log('当前元素为', ele);
    if (ele != null) {
        if (hasClass_two(ele)) {
            console.log(ele, '元素存在但是有棋子了');
            // 如果已经有棋子了就不更新玩家绑定
            setEventAga(oldEle);
            // console.log(ele)
        }
        else {
            console.log('给', ele, '绑定了点击事件');
            // 更新玩家
            ele.classList.add(currentPlayer);
            if (isWin()) {
                showMessage();
            }
            currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
            setKeyEvent(ele);
        }
    }
    else {
        console.log(ele, '不存在');
        setEventAga(oldEle);
    }
}
