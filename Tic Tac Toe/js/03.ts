enum Player {
    X = 'x',
    O = 'o'
}
let currentPlayer: Player
let steps: number

let board = document.querySelector('#board') as HTMLDivElement
let cells = document.querySelectorAll('.cell')
let message = document.querySelector('#message') as HTMLDivElement
let winner = document.querySelector('#winner') as HTMLParagraphElement
let restart = document.querySelector('#restart') as HTMLButtonElement

restart.addEventListener('click', startGame)

startGame()
function startGame() {
    steps = 0
    board.classList.remove(currentPlayer)
    cells.forEach(item => {
        let cell = item as HTMLDivElement
        cell.classList.remove(Player.X, Player.O)
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
        message.style.display = 'block'
        message.style.opacity = '1'
        board.style.opacity = '.3'
        winner.innerHTML = '<span>' + currentPlayer + '</span> 赢了!'
        return
    } else if (steps == 9) {
        message.style.display = 'block'
        message.style.opacity = '1'
        board.style.opacity = '.3'
        winner.innerText = '平局'
        return
    }
    board.classList.remove(currentPlayer)
    currentPlayer = currentPlayer == Player.X ? Player.O : Player.X
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

function hasClass(ele: Element, player: Player): boolean {
    return ele.classList.contains(player)
}