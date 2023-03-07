// 设置玩家
enum Player {
    X = 'x',
    O = 'o'
}
let currentPlayer: Player
// 获取游戏面板
let board = document.querySelector('#board') as HTMLDivElement
// 获胜信息面板
let message = document.querySelector('#message') as HTMLDivElement
// 获胜者
let winner = document.querySelector('#winner') as HTMLParagraphElement
// 重新开始按钮
let restart = document.querySelector('#restart')
// 获取格子
let cells = document.querySelectorAll('.cell')


// 重新开始游戏
restart.addEventListener('click', startGame)

startGame()
function startGame() {
    // 初始化下棋步数、下棋类别、下棋提示
    steps = 0
    // 下棋提示 删除
    board.classList.remove(currentPlayer)
    // 下棋提示更换
    if (Math.random() > 0.5) {
        currentPlayer = Player.X
    } else {
        currentPlayer = Player.O
    }
    board.classList.add(currentPlayer)
    // 清除已经下了的棋子
    cells.forEach(function (item) {
        let cell = item as HTMLDivElement
        cell.classList.remove(Player.X, Player.O)
    })
    // 清除事件
    cells.forEach(function (ele) {
        let cell = ele as HTMLDivElement
        cell.removeEventListener('click', clickCell)
    })
    // 绑定事件
    cells.forEach(function (ele) {
        let cell = ele as HTMLDivElement
        cell.addEventListener('click', clickCell, { once: true })
    })
    // 隐藏胜利面板
    message.style.display = 'none'
    message.style.opacity = '0'

    // 将游戏面板样式 初始化
    board.style.opacity = '1'
}

// 平局
let steps: number

// 格子点击事件
function clickCell(event: MouseEvent) {
    let cell = event.target as HTMLDivElement
    // 下棋
    cell.classList.add(currentPlayer)
    steps++
    // 判断是否胜利
    if (isWin()) {
        // 胜利面板
        winner.innerHTML = '<span>' + currentPlayer + '</span> 胜利了!'
        message.style.display = 'block'
        message.style.opacity = '1'

        // 游戏面板效果
        board.style.opacity = '.3'

        // 终止函数（停止游戏）
        return
    } else if (steps === 9) {
        // 平局面板
        winner.innerText = '平局'
        message.style.display = 'block'
        message.style.opacity = '1'

        // 游戏面板效果
        board.style.opacity = '.3'

        // 终止函数（停止游戏）
        return
    }
    // 删除当前玩家 下棋提示
    board.classList.remove(currentPlayer)
    // 切换玩家
    currentPlayer = currentPlayer == Player.X ? Player.O : Player.X
    // 添加当前玩家 下棋提示
    board.classList.add(currentPlayer)
}

// 判赢
// 胜利的情况
let winArrs = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖
    [0, 4, 8], [2, 4, 6]             // 斜
]
// 判赢函数
function isWin(): boolean {
    // 返回 是否胜利
    return winArrs.some(function (item) {
        // 得到每个小数组 且通过伪数组 得到元素
        let cell1 = cells[item[0]]
        let cell2 = cells[item[1]]
        let cell3 = cells[item[2]]
        // 判断三个元素的类 是否都有当前 玩家的类
        if (
            hasClass(cell1, currentPlayer) &&
            hasClass(cell2, currentPlayer) &&
            hasClass(cell3, currentPlayer)
        ) {
            // 如果符合条件 则胜利 终止遍历
            return true
        } else {
            // 未符合条件 继续循环
            return false
        }
    })
}

// 判断 是否有类
function hasClass(ele: Element, player: Player) {
    return ele.classList.contains(player)
}