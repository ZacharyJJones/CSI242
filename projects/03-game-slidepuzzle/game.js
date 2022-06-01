let board;

window.addEventListener("load", (event) => {
	let width = 16;
	let height = 16;

	console.log("loaded");
	_initBoard(width, height);
	console.log(board);

	let root = document.getElementById("root");
	for (let y = 0; y < height; y++) {
		const row = document.createElement("div");
		row.className = "display-row";
		root.appendChild(row);
		for (let x = 0; x < width; x++) {
			const item = document.createElement("div");
			item.className = "display-item";
			if (board[y][x] === null) {
				item.innerText = "empty";
			} else {
				item.innerText = `(${x}, ${y})`;
			}
			row.appendChild(item);
		}
	}
});

// =====================================

function _initBoard(width, height) {
	let workingBoard = [];
	for (let y = 0; y < height; y++) {
		let row = [];
		for (let x = 0; x < width; x++) {
			let element = {
				x: x,
				y: y,
			};
			row.push(element);
		}
		workingBoard.push(row);
	}
	workingBoard[height - 1][width - 1] = null;
	board = workingBoard;
}

// =====================================

function isBoardSolved(board) {
	let result = board.every((row) =>
		row.every((piece) => _isPieceInCorrectPosition(board, piece))
	);

	return result;
}
function _isPieceInCorrectPosition(board, piece) {
	if (piece === null) {
		return true;
	}

	let destination = board[piece.y][piece.x];

	if (destination === null) {
		return false;
	}

	if (destination.x !== piece.x) {
		return false;
	}

	if (destination.y !== piece.y) {
		return false;
	}

	return true;
}

function setImageToUploaded(event) {
	console.log("event method called!");
	let imageOutputTag = document.getElementById("imageDisplay");
	imageOutputTag.src = URL.createObjectURL(event.target.files[0]);

	sliceImage(imageOutputTag, 3, 3);
}

// https://stackoverflow.com/questions/8912917/cutting-an-image-into-pieces-through-javascript
function sliceImage(image, numColumns, numRows) {
	console.log("Piece Width: " + image.width, "Piece Height: " + image.height);

	const pieceWidth = Math.floor(image.width / numColumns);
	const pieceHeight = Math.floor(image.height / numRows);

	console.log("Piece Width: " + pieceWidth, "Piece Height: " + pieceHeight);

	var slices = [];
	for (let col = 0; col < numColumns; col++) {
		for (let row = 0; row < numRows; row++) {
			let canvas = document.createElement("canvas");
			canvas.width = pieceWidth;
			canvas.height = pieceHeight;
			var canvasContext = canvas.getContext("2d");

			console.log(
				image,
				col * pieceWidth,
				row * pieceHeight,
				pieceWidth,
				pieceHeight
			);
			canvasContext.drawImage(
				image,
				col * pieceWidth,
				row * pieceHeight,
				pieceWidth,
				pieceHeight
			);
			/*
			canvasContext.drawImage(
				image,
				col * pieceWidth, // sx -- x coord for reference point to start drawing from
				row * pieceHeight, // sy -- y coord for reference point to start drawing from
				pieceWidth, // sWidth -- width of image to draw
				pieceHeight, // sHeight -- height of image to draw
				0, // dx -- custom reference point (instead of top left of canvas)
				0, // dy -- custom reference point (instead of top left of canvas)
				canvas.width, // dw -- allows for scaling of width
				canvas.height // dh -- allows for scaling of height
			);
			*/
			const dataUrl = canvas.toDataURL();
			console.log(dataUrl);
			slices.push(dataUrl);
		}
	}

	const divRoot = document.getElementById("set");
	slices.forEach((imgSrcUrl) => {
		let img = new Image();
		img.src = imgSrcUrl;
		divRoot.appendChild(img);
	});
}

// function Game() {
// 	return (
// 		<div className="bg" id="set">
// 			<div className="flex-center">
// 				<input
// 					type="file"
// 					accept="image/*"
// 					id="imageUpload"
// 					onChange={setImageToUploaded}
// 				></input>
// 			</div>
// 			<div className="flex-center">
// 				<img id="imageDisplay" width="80%" alt="Your Upload" />
// 			</div>
// 			<div className="flex-center"></div>
// 			<div className="flex-center"></div>
// 			<br></br>
// 		</div>
// 	);
// }
