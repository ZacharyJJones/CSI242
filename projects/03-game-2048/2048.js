let board;
let boardSize;

window.addEventListener("load", () => {
	document
		.getElementById("button-up")
		.addEventListener("click", () => move("up"));
	document
		.getElementById("button-down")
		.addEventListener("click", () => move("down"));
	document
		.getElementById("button-left")
		.addEventListener("click", () => move("left"));
	document
		.getElementById("button-right")
		.addEventListener("click", () => move("right"));
	document
		.getElementById("newGame")
		.addEventListener("click", () => _initGame());

	window.addEventListener("keyup", (event) => {
		const key = event.code;
		if (key === "ArrowUp" || key === "KeyW") {
			move("up");
		}
		if (key === "ArrowDown" || key === "KeyS") {
			move("down");
		}
		if (key === "ArrowLeft" || key === "KeyA") {
			move("left");
		}
		if (key === "ArrowRight" || key === "KeyD") {
			move("right");
		}
	});

	_initGame();
});

// ======

function displayState() {
	for (let y = 0; y < boardSize; y++) {
		for (let x = 0; x < boardSize; x++) {
			// edit classes, text, etc. to reflect board variable
			let id = `${x}_${y}`;
			const element = document.getElementById(id);
			const item = board[y][x];

			let className = "piece";
			let text = "";
			if (item !== null) {
				className += ` _${item}`;
				text = item;
			}

			element.className = className;
			element.textContent = text;
		}
	}
}

function move(direction) {
	console.log("move method called:", direction);

	let validMoves = [
		{ direction: "up", vector: { x: 0, y: -1 }, iter: "ascending" },
		{ direction: "down", vector: { x: 0, y: 1 }, iter: "descending" },
		{ direction: "left", vector: { x: -1, y: 0 }, iter: "ascending" },
		{ direction: "right", vector: { x: 1, y: 0 }, iter: "descending" },
	];

	let actualMove = validMoves.find((x) => x.direction === direction);
	if (actualMove === undefined) {
		return;
	}
	console.log("actual move", actualMove);

	//
	/*
		Up:			Row by row, 0->3
		Left:		col by col, 0->3
		Down:		Row by row, 3->0
		Right:	col by col: 3->0
	*/

	let start = actualMove.iter === "ascending" ? 0 : boardSize - 1;
	let iterate = actualMove.iter === "ascending" ? 1 : -1;
	let check =
		actualMove.iter === "ascending"
			? (val) => val < boardSize
			: (val) => val >= 0;

	//
	//
	for (let y = start; check(y); y += iterate) {
		for (let x = start; check(x); x += iterate) {
			let item = board[y][x];
			if (item === null) {
				continue;
			}

			// stop moving when:
			// - hitting edge board
			// - combined with another piece
			let current = { x: x, y: y };
			while (true) {
				// check next position
				let next = _addVectors(current, actualMove.vector);

				// target must be within board
				if (!_indexPosIsWithinBoard(next)) {
					// piece stops "moving", ends at last known good location.
					board[y][x] = null;
					board[current.y][current.x] = item;
					break;
				}

				// check if target position is another piece
				if (board[next.y][next.x] === null) {
					current = next;
					continue;
				}

				// Check for possibility of combination
				if (board[next.y][next.x] === item) {
					board[y][x] = null;
					board[next.y][next.x] = item * 2;
					break;
				} else {
					// piece stops "moving", ends at last known good location.
					board[y][x] = null;
					board[current.y][current.x] = item;
					break;
				}
			}
		}
	}

	_addPieceToBoard();
	displayState();
}

// Utils ==============================

function _initGame() {
	_initBoard(4);
	_addPieceToBoard();
	_addPieceToBoard();
	displayState();
}

function _initBoard(size) {
	boardSize = size;
	board = new Array(size).fill(null);
	for (let i = 0; i < size; i++) {
		board[i] = new Array(size).fill(null);
	}
}

function _addPieceToBoard() {
	if (board.every((row) => row.every((item) => item !== null))) {
		return; // all spaces occupied.
	}

	let value = 2;
	if (Math.random() > 0.65) {
		value *= 2;
	}
	if (Math.random() > 0.95) {
		value *= 2;
	}

	let pos = _getRandomPosInBoard();
	while (board[pos.y][pos.x] !== null) {
		pos = _getRandomPosInBoard();
	}

	board[pos.y][pos.x] = value;
}

function _getRandomPosInBoard() {
	const x = Math.floor(Math.random() * boardSize);
	const y = Math.floor(Math.random() * boardSize);
	return { x: x, y: y };
}

function _indexPosIsWithinBoard({ x, y }) {
	return 0 <= x && x < boardSize && 0 <= y && y < boardSize;
}

function _addVectors(v1, v2) {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y,
	};
}
