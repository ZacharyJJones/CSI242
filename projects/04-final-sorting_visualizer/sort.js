const color_red = "#FF0000";
const color_grey = "#AAA";
const timeout = 20;

const canvasWidth = 1000;
const canvasHeight = 600;

let sortSize = 64;
let sortingArray = [];

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

	sortingArray = _initArray(sortSize);
	_drawArray(sortingArray, ctx);

	// Interactive Buttons
	document.getElementById("arr-size-down").addEventListener("click", () => {
		sortSize = sortSize >= 2 ? sortSize / 2 : 1;
		sortingArray = _initArray(sortSize);
		_drawArray(sortingArray, ctx);
	});
	document.getElementById("arr-size-up").addEventListener("click", () => {
		sortSize *= 2;
		sortingArray = _initArray(sortSize);
		_drawArray(sortingArray, ctx);
	});

	document.getElementById("arr-shuffle").addEventListener("click", () => {
		algo_randomize(sortingArray, ctx);
	});
	document.getElementById("arr-gnome").addEventListener("click", () => {
		algo_gnome(sortingArray, ctx);
	});
});

// Callback method for displaying state at each comparison
async function displayFunc(array, ctx, props) {
	// props.activeBounds.min/max
	// props.compareIndex (stays put)
	// props.searchIndex (moves around)

	console.log;
	_drawArray(array, ctx, props);
	await new Promise((resolve) => setTimeout(resolve, timeout));
}

// ====================================

function _drawArray(array, ctx, props) {
	// Basic White Rects
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	array.forEach((x, i) => {
		_drawRectangle(array, ctx, i);
	});

	// If props are given, use them!
	if (props !== undefined) {
		// remember original color
		const originalFillStyle = ctx.fillStyle;

		// Show "Active" area
		ctx.fillStyle = color_grey;
		if (props.activeBounds !== undefined) {
			array.forEach((x, i) => {
				if (i < props.activeBounds.min || props.activeBounds.max < i) {
					_drawRectangle(array, ctx, i);
				}
			});
		}

		// Show compared indices
		ctx.fillStyle = color_red;
		if (props.compareIndex !== undefined)
			_drawRectangle(array, ctx, props.compareIndex);
		if (props.searchIndex !== undefined)
			_drawRectangle(array, ctx, props.searchIndex);

		// return to default
		ctx.fillStyle = originalFillStyle;
	}
}

function _drawRectangle(array, ctx, index) {
	const rectWidth = ctx.canvas.width / array.length;
	const rectHeight = (ctx.canvas.height / array.length) * array[index];

	const canvasHalfWidth = ctx.canvas.width / 2;
	const smallArrayBorderAdjust = array.length < canvasHalfWidth ? 1 : 0;

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

function _initArray(size) {
	let arrayInit = new Array(size);
	for (let i = 0; i < size; i++) {
		arrayInit[i] = i + 1;
	}
	return arrayInit;
}
