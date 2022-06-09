const canvasWidth = 1000;
const canvasHeight = 600;

let arrSize = 512;

/*
	Array flow:
	1) Random Value Initialization*
		* perhaps ensure that arrays have 1 value
	2) 
*/

window.addEventListener("load", () => {
	let { canvas, ctx } = _initCanvasAndContext(
		"sort-display",
		"2d",
		canvasWidth,
		canvasHeight
	);

	_temp_drawArray(arrSize, ctx);
	// Interactive Buttons

	document.getElementById("arr-shuffle").addEventListener("click", () => {
		_temp_drawArray(arrSize, ctx);
	});
	document.getElementById("arr-size-down").addEventListener("click", () => {
		arrSize /= 2;
		if (arrSize < 1) {
			arrSize = 1;
		}
		_temp_drawArray(arrSize, ctx);
	});
	document.getElementById("arr-size-up").addEventListener("click", () => {
		arrSize *= 2;
		_temp_drawArray(arrSize, ctx);
	});
});

function _temp_drawArray(size, ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	let array = _getRandValueArray(arrSize);
	array.forEach((element, i) => {
		_drawRectangle(ctx, array, i);
	});
}

// ====================================

function _getRandValueArray(arrayLength) {
	let array = new Array(arrayLength);
	for (let i = 0; i < arrayLength; i++) {
		array[i] = Math.ceil(Math.random() * arrayLength);
	}
	return array;
}

function _drawRectangle(ctx, array, index) {
	const rectWidth = ctx.canvas.width / array.length;
	const rectHeight = (ctx.canvas.height / array.length) * array[index];

	const halfWidth = ctx.canvas.width / 2;
	const smallArrayBorderAdjust = array.length < halfWidth ? 1 : 0;

	ctx.fillRect(
		rectWidth * index,
		0,
		rectWidth - smallArrayBorderAdjust,
		rectHeight - smallArrayBorderAdjust
	);
}

function _initCanvasAndContext(canvasID, ctx, width, height) {
	let canvas = document.getElementById(canvasID);
	canvas.setAttribute("width", `${width}px`);
	canvas.setAttribute("height", `${height}px`);

	// Setting up color and ref point
	let context = canvas.getContext(ctx);
	context.fillStyle = "#FFF";
	context.translate(0, canvas.height);
	context.scale(1, -1);

	return {
		canvas: canvas,
		ctx: context,
		width: width,
		height: height,
	};
}
