enum Player {
    X = 'x',
    O = 'o'
}
let currentPlayer: Player
let steps: number

let board = document.querySelector('#board') as HTMLDivElement
let cells = [...document.querySelectorAll('.cell')]
let rows = document.querySelectorAll('.row')
let message = document.querySelector('#message') as HTMLDivElement
let winner = document.querySelector('#winner') as HTMLParagraphElement
let restart = document.querySelector('#restart') as HTMLButtonElement
let restart_btn = document.querySelector('#restart_btn')

restart.addEventListener('click', startGame)
restart_btn.addEventListener('click', startGame)

// 添加索引
rows.forEach(item => {
    item.children[0].setAttribute('data-index', '0')
    item.children[1].setAttribute('data-index', '1')
    item.children[2].setAttribute('data-index', '2')
})

startGame()
function startGame() {
    steps = 0
    board.classList.remove(currentPlayer)
    cells.forEach(item => {
        let cell = item as HTMLDivElement
        cell.classList.remove(Player.X, Player.O)
        cell.removeEventListener('click', cellClick)
        cell.removeEventListener('click', cellClick)
        cell.addEventListener('click', cellClick, { once: true })
    })
    if (Math.random() > 0.5) {
        currentPlayer = Player.X
    } else {
        currentPlayer = Player.O
    }
    board.classList.add(currentPlayer)

    message.style.display = 'none'
    message.style.opacity = '0'
    board.style.opacity = '1'
}

function cellClick(event: MouseEvent) {
    let cell = event.target as HTMLDivElement
    cell.classList.add(currentPlayer)
    steps++
    if (isWin()) {
        showMessage()
    }
    board.classList.remove(currentPlayer)
    currentPlayer = currentPlayer == Player.X ? Player.O : Player.X
    if (steps != 6) {
        board.classList.add(currentPlayer)
    }
    if (steps === 6) {
        // 给所有格子解除点击事件
        cells.forEach(item => {
            let cell = item as HTMLDivElement
            cell.removeEventListener('click', cellClick)
        })

        // 给当前玩家添加点击移动事件
        letCurrentEleAddEvent()
        return
    }
}

function showMessage() {
    board.style.opacity = '.3'
    message.style.display = 'block'
    message.style.opacity = '1'
    winner.innerHTML = `<span>${currentPlayer}</span> 赢了!`
}

let winArrs = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

function isWin(): boolean {
    return winArrs.some(item => {
        let cell1 = cells[item[0]] as HTMLDivElement
        let cell2 = cells[item[1]] as HTMLDivElement
        let cell3 = cells[item[2]] as HTMLDivElement
        if (
            hasClass(cell1, currentPlayer) &&
            hasClass(cell2, currentPlayer) &&
            hasClass(cell3, currentPlayer)) {
            return true
        }
        return false
    })
}

// 左上右下 37 - 40  z(左下)90  m(右下)77  q(左上)81  p(右上) 80
let keyArrs = [37, 38, 39, 40, 90, 77, 81, 80]
let lrArrs = [37, 39]
let upArrs = [38, 81, 80]
let downArrs = [40, 90, 77]
function keyEvent(ele: Element, event: KeyboardEvent) {
    let c = event.keyCode
    // console.log(ele);
    if (keyArrs.some(item => c === item)) {
        ele.classList.remove(currentPlayer)
        let index = ele.getAttribute('data-index')

        if (lrArrs.some(item => c === item)) {
            switch (c) {
                // 左
                case 37:
                    let leftEle = ele.previousElementSibling as HTMLDivElement
                    checkQ(ele, leftEle)
                    break
                // 右
                case 39:
                    let rightEle = ele.nextElementSibling as HTMLDivElement
                    checkQ(ele, rightEle)
                    break
            }
        } else if (upArrs.some(item => c === item)) {
            let upRow = ele.parentElement.previousElementSibling as HTMLDivElement
            if (upRow) {
                switch (c) {
                    // 上
                    case 38:
                        checkQ(ele, upRow.children[index])
                        console.log('当前移动元素为', ele, '移动目的地', upRow.children[index])
                        break
                    // 左上
                    case 81:
                        let upLeft = upRow.children[index].previousElementSibling as HTMLDivElement
                        checkQ(ele, upLeft)
                        break
                    // 右上
                    case 80:
                        let upRight = upRow.children[index].nextElementSibling as HTMLDivElement
                        checkQ(ele, upRight)
                        break
                }
            } else {
                setEventAga(ele)

            }
        } else if (downArrs.some(item => c === item)) {
            let downRow = ele.parentElement.nextElementSibling as HTMLDivElement
            if (downRow) {
                switch (c) {
                    // 下
                    case 40:
                        checkQ(ele, downRow.children[index] as HTMLDivElement)
                        break
                    // 左下
                    case 90:
                        let downLeft = downRow.children[index].previousElementSibling as HTMLDivElement
                        checkQ(ele, downLeft)
                        break
                    // 右下
                    case 77:
                        let downRight = downRow.children[index].nextElementSibling as HTMLDivElement
                        checkQ(ele, downRight)
                        break
                }
            } else {
                setEventAga(ele)
            }
        }
    } else {
        setKeyEvent(ele)
    }
}

// 检测是否有类
function hasClass(ele: Element, player: Player): boolean {
    return ele.classList.contains(player)
}

// 检测移动后的位子是否已经有棋子了
function hasClass_two(ele: Element): boolean {
    return ele.classList.contains(Player.X) || ele.classList.contains(Player.O)
}

// 得到已经下了的棋子并且 绑定点击事件
function letCurrentEleAddEvent() {
    // 得到当前玩家的所有棋子
    let newCells = cells.filter(item => {
        return hasClass_two(item)
    })
    // console.log(newCells)

    // 当前玩家绑定事件
    newCells.forEach(item => {
        console.log('给', item, '绑定了移动事件')
        setKeyEvent(item)
    })
}

// 重新绑定事件
function setEventAga(ele: Element) {
    ele.classList.add(currentPlayer)
    setKeyEvent(ele)
}

// 给元素添加点击绑定移动事件
function setKeyEvent(ele: Element) {
    ele.addEventListener('click', () => {
        if (hasClass(ele, currentPlayer)) {
            console.log('给', ele, '绑定了移动事件', '当前玩家为', currentPlayer)
            document.documentElement.removeEventListener('keydown', function (event) {
                keyEvent(ele, event)
            })
            document.documentElement.addEventListener('keydown', function (event) {
                keyEvent(ele, event)
            }, { once: true })
        } else {
            console.log(ele, '不是当前玩家')
            setKeyEvent(ele);
        }
    }, { once: true })
}

// 检测棋子
function checkQ(oldEle: Element, ele: Element) {
    console.log('当前元素为', ele)
    if (ele != null) {
        if (hasClass_two(ele)) {
            console.log(ele, '元素存在但是有棋子了')
            // 如果已经有棋子了就不更新玩家绑定
            setEventAga(oldEle)
            // console.log(ele)
        } else {
            console.log('给', ele, '绑定了点击事件')
            // 更新玩家
            ele.classList.add(currentPlayer)
            if (isWin()) {
                showMessage()
            }
            currentPlayer = currentPlayer == Player.X ? Player.O : Player.X
            setKeyEvent(ele)
        }
    } else {
        console.log(ele, '不存在')
        setEventAga(oldEle)
    }
}