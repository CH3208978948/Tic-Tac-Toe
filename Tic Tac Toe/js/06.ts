enum Player {
    X = 'x',
    O = 'o'
}
let currentPlayer: Player
let steps: number
let currentCell: HTMLDivElement
let index: number

let playerMsg = document.querySelector('#player') as HTMLDivElement
let board = document.querySelector('#board') as HTMLDivElement
let cells = [...document.querySelectorAll('.cell')]
let rows = [...document.querySelectorAll('.row')]
let message = document.querySelector('#message') as HTMLDivElement
let winner = document.querySelector('#winner') as HTMLParagraphElement
let restart = document.querySelector('#restart') as HTMLButtonElement

restart.addEventListener('click', startGame)

startGame()
function startGame() {
    steps = 0
    board.classList.remove(currentPlayer)
    removeEvent()
    cells.forEach(item => {
        let cell = item as HTMLDivElement
        cell.classList.remove(Player.X, Player.O)
        cell.removeEventListener('click', cellClick)
        cell.addEventListener('click', cellClick, { once: true })
    })
    rows.forEach((item, index) => {
        let row = item as HTMLDivElement
        row.children[0].setAttribute('data-index', parseInt(`${index}0`).toString())
        row.children[1].setAttribute('data-index', parseInt(`${index}1`).toString())
        row.children[2].setAttribute('data-index', parseInt(`${index}2`).toString())
    })
    if (Math.random() > 0.5) {
        currentPlayer = Player.X
        showPlayer()
    } else {
        currentPlayer = Player.O
        showPlayer()
    }
    board.classList.add(currentPlayer)
    message.style.display = 'none'
    message.style.opacity = '0'
    board.style.opacity = '1'
}

function showPlayer() {
    playerMsg.innerText = `当前玩家为${currentPlayer}`
}

function cellClick(event: MouseEvent) {
    let cell = event.target as HTMLDivElement
    cell.classList.add(currentPlayer)
    steps++
    if (isWin()) {
        showMessage()
        winner.innerHTML = '<span>' + currentPlayer + '</span> 赢了!'
        return
    }
    board.classList.remove(currentPlayer)
    currentPlayer = currentPlayer == Player.X ? Player.O : Player.X
    showPlayer()
    if (steps === 6) {
        cells.forEach(item => {
            let cell = item as HTMLDivElement
            cell.removeEventListener('click', cellClick)
        })
        setNewCellsClick()
        return
    }
    board.classList.add(currentPlayer)
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

function showMessage() {
    message.style.display = 'block'
    message.style.opacity = '1'
    winner.innerHTML = '<span>' + currentPlayer + '</span> 赢了!'
    board.style.opacity = '.3'
}

function hasClass(ele: Element, player: Player): boolean {
    return ele.classList.contains(player)
}

// 设置空格点击事件
function empCellsClick(event: MouseEvent) {
    let cell = event.target as HTMLDivElement
    console.log('点击了空格', cell, '现在移动的元素为:', currentCell)
    if (cc(cell)) {
        currentCell.classList.remove(currentPlayer)
        cell.classList.add(currentPlayer)
        removeEvent()
        setNewCellsClick()
        if (isWin()) {
            showMessage()
            return
        }
        currentPlayer = currentPlayer === Player.X ? Player.O : Player.X
        showPlayer()
        console.log('切换后', currentPlayer)
        console.warn('-----------------------------------')

    } else {
        console.log('点击位置不可以使用  点击位置元素及索引', cell, parseInt(cell.getAttribute('data-index')), '移动元素元素及索引', currentCell, index);
        console.warn('-----------------------------------')
    }
}

// 移除所有元素的点击事件
function removeEvent() {
    cells.forEach(item => {
        let cell = item as HTMLDivElement
        cell.removeEventListener('click', newCellsClick)
        cell.removeEventListener('click', empCellsClick)
    })
}

// 已经有的格子 点击事件
function newCellsClick(event: MouseEvent) {
    if (hasClass(event.target as HTMLDivElement, currentPlayer)) {
        currentCell = event.target as HTMLDivElement
        index = parseInt(currentCell.getAttribute('data-index'))
        console.log(`点击了单元格`, currentCell);
        setEmpCellsClick()
    } else {
        console.log('点击的元素并非当前玩家 点击元素及类别', event.target, (event.target as HTMLDivElement).className)
        console.log('当前类别', currentPlayer)
        console.warn('-----------------------------------')
    }
}

// 设置 已经有的格子 点击事件
function setNewCellsClick() {
    let newCells = cells.filter(item => hasClass(item, Player.X) || hasClass(item, Player.O))
    newCells.forEach(item => {
        let cell = item as HTMLDivElement
        console.log('给这个 格子添加了事件', cell);
        cell.addEventListener('click', newCellsClick)
    })
    console.log('现在的玩家是', currentPlayer)
}

// 设置空格点击事件
function setEmpCellsClick() {
    let newEmps = cells.filter(item => !(hasClass(item, Player.X) || hasClass(item, Player.O)))
    newEmps.forEach(item => {
        let cell = item as HTMLDivElement
        cell.addEventListener('click', empCellsClick, { once: true })
    })
}

// 判断点击格子是否是 移动存在的
function cc(ele: Element): boolean {
    let eleIndex = parseInt(ele.getAttribute('data-index'))
    let winIndexArrs = [index - 1, index - 10, index + 1, index + 10, index - 11, index - 9, index + 9, index + 11]
    // console.log(winIndexArrs)
    return winIndexArrs.some(item => item === eleIndex)
}