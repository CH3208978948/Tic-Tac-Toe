enum Player {
    X = 'x',
    O = 'o'
}
let currentPlayer: Player
let steps: number

// 当前选中需要移动的棋子 以及索引
let currentCell: HTMLDivElement
let index

let board = document.querySelector('#board') as HTMLDivElement
let cells = [...document.querySelectorAll('.cell')]
let rows = [...document.querySelectorAll('.row')]
let message = document.querySelector('#message') as HTMLDivElement
let winner = document.querySelector('#winner') as HTMLParagraphElement
let restart = document.querySelector('#restart') as HTMLButtonElement
let restart_btn = document.querySelector('#restart_btn') as HTMLButtonElement

restart.addEventListener('click', startGame)
restart_btn.addEventListener('click', startGame)

startGame()
function startGame() {
    steps = 0
    board.classList.remove(currentPlayer)
    cells.forEach((item, index) => {
        let cell = item as HTMLDivElement
        cell.classList.remove(Player.X, Player.O)
        cell.removeEventListener('click', cellClick)
        cell.addEventListener('click', cellClick, { once: true })
        removeEmpsCellsClick()
        removeOldCellsClick()
    })
    rows.forEach((item, index) => {
        let row = item as HTMLDivElement
        row.children[0].setAttribute('data-index', parseInt(index + '0').toString())
        row.children[1].setAttribute('data-index', parseInt(index + '1').toString())
        row.children[2].setAttribute('data-index', parseInt(index + '2').toString())
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
        winner.innerHTML = '<span>' + currentPlayer + '</span> 赢了!'
        return
    }
    board.classList.remove(currentPlayer)
    currentPlayer = currentPlayer == Player.X ? Player.O : Player.X
    if (steps != 6) board.classList.add(currentPlayer)
    if (steps === 6) {
        cells.forEach(item => {
            let cell = item as HTMLDivElement
            cell.removeEventListener('click', cellClick)
        })
        setNewCellsClick()
        return
    }
}

function moveCellClick(event: MouseEvent) {
    currentCell = event.target as HTMLDivElement
    index = parseInt(currentCell.getAttribute('data-index'))
    console.log('当前元素', currentCell)
    console.log('是当前玩家', currentPlayer)
    console.log('索引', index)
    setEmpsCellsClick()
}

function showMessage() {
    message.style.display = 'block'
    message.style.opacity = '1'
    board.style.opacity = '.3'
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

function hasClass(ele: Element, player: Player): boolean {
    return ele.classList.contains(player)
}

function hasClass_two(ele: Element): boolean {
    return ele.classList.contains(Player.X) || ele.classList.contains(Player.O)
}

function setNewCellsClick() {
    let newCells = cells.filter(item => hasClass(item, currentPlayer))
    newCells.forEach(item => {
        let cell = item as HTMLDivElement
        console.log('设置了格子', cell);
        cell.addEventListener('click', moveCellClick)
    })
}

function removeOldCellsClick() {
    let oldCells = cells.filter(item => hasClass(item, currentPlayer))
    oldCells.forEach(item => {
        let cell = item as HTMLDivElement
        console.log('移除了格子', cell);
        cell.removeEventListener('click', moveCellClick)
    })
}

function setEmpsCellsClick() {
    let empCells = cells.filter(item => !hasClass_two(item))
    console.log(empCells)
    empCells.forEach(item => {
        let cell = item as HTMLDivElement
        console.log('设置了空格', cell);
        cell.addEventListener('click', checkQ, { once: true })
    })
}

function removeEmpsCellsClick() {
    let empCells = cells.filter(item => !hasClass_two(item))
    console.log('空格', empCells);
    empCells.forEach(item => {
        let empCell = item as HTMLDivElement
        console.log('移除了空格', empCell);
        empCell.removeEventListener('click', checkQ)
    })
}

function checkQ(event: MouseEvent) {
    let cell = event.target as HTMLDivElement
    console.log('当前点击的空元素', cell)
    if (cc(cell)) {
        currentCell.classList.remove(currentPlayer)
        cell.classList.add(currentPlayer)
        if (isWin()) {
            showMessage()
            winner.innerHTML = '<span>' + currentPlayer + '</span> 赢了!'
            return
        }
        removeEmpsCellsClick()
        removeOldCellsClick()

        console.log('当前位置可以移动');
        currentPlayer = currentPlayer == Player.X ? Player.O : Player.X
        console.log('--------------------------------')
        setNewCellsClick()
    } else {
        console.log('当前位置不可以移动');
    }
}

// 棋子的位置情况
function cc(ele: Element): boolean {
    let eleIndex = parseInt(ele.getAttribute('data-index'))
    let winIndexArrs = [index - 1, index - 10, index + 1, index + 10, index - 11, index - 9, index + 9, index + 11]
    console.log(winIndexArrs)
    return winIndexArrs.some(item => item === eleIndex)
}