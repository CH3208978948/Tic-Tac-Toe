enum Player {
	X = 'x',
	O = 'o'
}

let currentPlayer: Player;

let showPlayer = document.querySelector('#player') as HTMLDivElement;
let board = document.querySelector('#board') as HTMLDivElement;
let cells = document.querySelectorAll('.cell');
let rows = document.querySelectorAll('.row');
let message = document.querySelector('#message') as HTMLDivElement;
let winner = document.querySelector('#winner') as HTMLDivElement;
let restart = document.querySelector('#restart') as HTMLDivElement;
let restart_btn = document.querySelector('#restart_btn') as HTMLDivElement;

// 计步器
let step = 0;

// 移动棋子
let mCell: HTMLDivElement;

load();

restart.onclick = load;
restart_btn.onclick = load;

function load() {
	step = 0;
	hideMsg();
	board.classList.remove(currentPlayer);
	if (Math.random() > 0.5) {
		currentPlayer = Player.X
	} else {
		currentPlayer = Player.O
	}
	showPlayer.innerText = `当前玩家为${currentPlayer}`;
	board.classList.add(currentPlayer);
	rows.forEach((item, fIndex) => {
		let cells = [...item.children];
		cells.forEach((item, sIndex) => {
			let cell = item as HTMLDivElement;
			cell.classList.remove(Player.X, Player.O);
			cell.setAttribute('data-index', `${fIndex}${sIndex}`);
			cell.removeEventListener('click', cellClick);
			cell.addEventListener('click', cellClick, { once: true })
		})
	})
}

function showMsg() {
	message.style.display = 'block';
	message.style.opacity = '1';
	board.style.opacity = '.3';
	winner.innerText = `${currentPlayer} 赢了!`;
	return
}

function hideMsg() {
	message.style.display = 'none';
	message.style.opacity = '0';
	board.style.opacity = '1';
}

function cellClick(event: MouseEvent) {
	step++;
	let cell = event.target as HTMLDivElement;
	cell.classList.add(currentPlayer);
	if (isWin()) {
		showMsg();
		return
	}
	board.classList.remove(currentPlayer);
	currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
	showPlayer.innerText = `当前玩家为${currentPlayer}`;
	if (step == 6) {
		cells.forEach(item => {
			let cell = item as HTMLDivElement;
			cell.removeEventListener('click', cellClick);
			cell.addEventListener('click', moveCell);
		})
		return
	}
	board.classList.add(currentPlayer);
};

let winArrs = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
	[0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖
	[0, 4, 8], [2, 4, 6] // 斜
]

function isWin(): Boolean {
	return winArrs.some(item => {
		let cell1 = cells[item[0]] as HTMLDivElement;
		let cell2 = cells[item[1]] as HTMLDivElement;
		let cell3 = cells[item[2]] as HTMLDivElement;
		return hasClass(cell1) && hasClass(cell2) && hasClass(cell3)
	})
}

function hasClass(ele: Element): Boolean {
	return ele.classList.contains(currentPlayer);
}

function hasClassTwo(ele: Element): Boolean {
	return ele.classList.contains(Player.X) || ele.classList.contains(Player.O);
}

// 移动
function moveCell(event: MouseEvent) {
	let cell = event.target as HTMLDivElement;
	console.log(cell, mCell);
	if (
		mCell // 选中元素存在
		&& !hasClassTwo(cell)
		&& checkCouldMove(cell)
	) {
		console.log(`移动元素为`, mCell)
		// 移动完成
		cell.classList.add(currentPlayer);
		mCell.classList.remove(currentPlayer);
		if (isWin()) {
			showMsg();
		}
		mCell = null;
		currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
		showPlayer.innerText = `当前玩家为${currentPlayer}`;
	} else if (hasClass(cell)) {
		// 获取移动元素
		mCell = cell;
		console.log(`移动元素为`, mCell)
	}
}

// 判断是否可以移动
function checkCouldMove(ele: Element): Boolean {
	let nIndex = parseInt(ele.getAttribute('data-index'));
	let oIndex = parseInt(mCell.getAttribute('data-index'));
	let couldArrs = [oIndex - 1, oIndex + 1, oIndex - 10, oIndex + 10, oIndex - 11, oIndex - 9, oIndex + 9, oIndex + 11];
	return couldArrs.includes(nIndex);
}