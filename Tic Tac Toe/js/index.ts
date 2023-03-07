// 思路模块：
/* 
    单元格点击:

    1. 获取到所有的单元格列表
    2. 遍历单元格列表，给每一个单元格添加点击事件
    3. 给当前被点击的单元格添加类名 x
*/

/*
    切换玩家：

    1. 创建一个存储当前玩家的变量（currentPlayer），默认值为 'x'
    2. 将添加单元格时 写死的类名 x ，替换为变量（currentPlayer）
    3. 切换到另一个玩家：在添加类名（下棋完成一步）后，根据
*/

/* 
    判赢：
    1. 声明函数（checkWin），指定参数（player），类型注解为：Player枚举
    2. 指定返回值：现在函数中写死返回 true或false
    3. 在给单元格添加类名后（下棋后），调动函数 checkWin，拿到函数返回值
    4. 判断函数返回值是否为true，如果是，说明当前玩家获胜了
*/

/* 
    实现判赢函数：
    1. 使用 some 方法遍历数组，并将 some 方法的返回值作为判赢函数的返回结果
    2. 在 some 方法的回调函数中，获取每种获胜情况对应的 3 个单元格
    3. 判断这 3 个单元格是否同时包含当前玩家的类名
    4. 如果包含（玩家获胜），就在回调函数中返回 true 停止循环；否则，返回 false，继续下一次循环
*/

/* 
    优化：
    1. 去掉判赢函数的中间变量（isWin、cell1、cell2、cell3）
    2. 封装函数（hasClass）：判断 DOM 元素是否包含某个类名
*/

/* 
    判断平局：
    1. 创建变量（steps），默认值为0
    2. 在玩家下棋后，让 step 加 1
    3. 在判赢的代码后面，判断 step 是否等于 9
    4. 如果等于 9 说明是平局，游戏结束
       就直接 return，不在执行后续代码
*/

/* 
    重新游戏：
    1. 获取到重新开始按钮（restart），并绑定点击事件
    2. 在点击事件中，重置游戏数据
    3. 隐藏获胜信息、清空棋盘、移除单元格点击事件、重新给单元格添加点击事件
    4. 重置下棋次数、重置默认玩家为 x、重置下棋提示为 x
*/

/* 
    优化重新游戏功能：
    1. 将重新开始按钮的事件处理程序修改为：函数声明形式（startGame）
    2. 直接调用函数（startGame），来开始游戏
    3. 移除变量 steps、currentPlayer 的默认值，并添加明确的类型注解
    4. 移除给单元格绑定事件的代码
*/



// 切换玩家 变量
enum Player {
    X = 'x',
    O = 'o'
}

// 游戏面板
let gameBoard = document.querySelector('.game-board') as HTMLDivElement
// 获胜信息面板
let gameMessage = document.querySelector('.game-message') as HTMLDivElement
// 获胜者
let winner = document.querySelector('#winner') as HTMLParagraphElement
// 重新开始 按钮
let restart = document.querySelector('#restart') as HTMLButtonElement
// 单元格列表
let cells = document.querySelectorAll('.cell')
// 当前玩家
let currentPlayer: Player
// 记录已下棋的次数
let steps: number

// // 绑定单元格点击事件
// cell.forEach(function (item) {
//     let cell = item as HTMLDivElement
//     cell.addEventListener('click', clickcell, { once: true })
// })

// 重新开始游戏
restart.addEventListener('click', startGame)
startGame()
function startGame() {
    // location.reload()

    // 修改游戏面板
    gameBoard.style.opacity = '1'
    // 隐藏获胜信息模板
    gameMessage.style.display = 'none'
    gameMessage.style.opacity = '1'
    // 重置下棋次数
    steps = 0
    // 重置默认玩家为 
    currentPlayer = Player.X
    // x重置下棋提示为x
    gameBoard.classList.remove(Player.X, Player.O)
    gameBoard.classList.add(Player.X)
    cells.forEach(function (item) {
        let cell = item as HTMLDivElement
        cell.classList.remove(Player.X, Player.O)
        cell.removeEventListener('click', clickcell)
        cell.addEventListener('click', clickcell, { once: true })
    })
}

// 棋盘中单元格的click事件处理程序
function clickcell(event: MouseEvent) {
    // console.log('click', event.target);
    let target = event.target as HTMLDivElement
    // 点击添加类
    target.classList.add(currentPlayer)
    // 调用判赢函数判断是否获胜
    let isWin = checkWin(currentPlayer)

    // 获胜(平局)信息面版
    if (isWin) {
        gameMessage.style.display = 'block'
        gameMessage.style.opacity = '1'
        gameBoard.style.opacity = '.3'
        winner.innerHTML = '<span>' + currentPlayer + '</span>' + ' 赢了！'
        // 因为游戏已经结束，所以，此处直接 return
        // 来刻意阻止后续代码执行
        return
    } else {
        steps++
        // 判断平局
        if (steps === 9) {
            gameMessage.style.display = 'block'
            gameMessage.style.opacity = '1'
            gameBoard.style.opacity = '.3'
            winner.innerHTML = '平局'
            // 因为游戏已经结束，所以，此处直接 return
            // 来刻意阻止后续代码执行
            return
        }
    }
    // 关键点:
    // 根据当前玩家，得到另外一个玩家
    gameBoard.classList.remove(currentPlayer)
    currentPlayer = currentPlayer === Player.X ? Player.O : Player.X
    // 处理下一步提示
    gameBoard.classList.add(currentPlayer)
}

// 封装判赢函数：
// 判赢数组
let winArrs = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖
    [0, 4, 8], [2, 4, 6]             // 斜
]
function checkWin(player: Player): boolean {
    // console.log('参数', player)

    // 获取到每种获胜情况对应的 3 个单元格元素
    return winArrs.some(function (item) {

        // 1. 先拿到每种获胜情况的三个索引
        // console.log(item)
        // let cellIndex1 = item[0]
        // let cellIndex2 = item[1]
        // let cellIndex3 = item[2]
        // console.log(cellIndex1, cellIndex2, cellIndex3);

        // 2. 通过这三个索引从cell中获取到对应的单元元素
        // let cell1 = cell[item[0]]
        // let cell2 = cell[item[1]]
        // let cell3 = cell[item[2]]
        // console.log(cell1, cell2, cell3);

        // 3. 判断这 3 个单元格是否同时包含当前玩家的类名
        // 重点：
        //   1. 元素是否包含类名 classList.contains()
        //   2. 同时包含（第一个包含 并且 第二个包含 并且 第三个包含）
        //      逻辑运算符 && 逻辑与

        // 优化后
        if (
            // cell[item[0]].classList.contains(player) &&
            // cell[item[1]].classList.contains(player) &&
            // cell[item[2]].classList.contains(player)

            hasClass(cells[item[0]], player) &&
            hasClass(cells[item[1]], player) &&
            hasClass(cells[item[2]], player)
        ) {
            return true
        }
        return false
    })
}

// 封装 hasClass 函数：判断 DOM 元素是否包含某个类名
function hasClass(el: Element, name: string) {
    return el.classList.contains(name)
}