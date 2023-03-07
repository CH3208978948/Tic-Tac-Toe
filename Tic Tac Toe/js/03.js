var Player;
(function (Player) {
    Player["X"] = "x";
    Player["O"] = "o";
})(Player || (Player = {}));
var currentPlayer;
var steps;
var board = document.querySelector('#board');
var cells = document.querySelectorAll('.cell');
var message = document.querySelector('#message');
var winner = document.querySelector('#winner');
var restart = document.querySelector('#restart');
restart.addEventListener('click', startGame);
startGame();
function startGame() {
    steps = 0;
    board.classList.remove(currentPlayer);
    cells.forEach(function (item) {
        var cell = item;
        cell.classList.remove(Player.X, Player.O);
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
        message.style.display = 'block';
        message.style.opacity = '1';
        board.style.opacity = '.3';
        winner.innerHTML = '<span>' + currentPlayer + '</span> 赢了!';
        return;
    }
    else if (steps == 9) {
        message.style.display = 'block';
        message.style.opacity = '1';
        board.style.opacity = '.3';
        winner.innerText = '平局';
        return;
    }
    board.classList.remove(currentPlayer);
    currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
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
function hasClass(ele, player) {
    return ele.classList.contains(player);
}
