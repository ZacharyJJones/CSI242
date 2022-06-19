const color_red = "#FF0000";
const color_grey = "#AAA";
const color_blue = "#6495ED";
const color_orange = "#FFBF00";
const color_green = "#50C878";

const canvasWidth = 1000;
const canvasHeight = 600;

const sortSizeMaxPow = 8;
const timeout = 100;

let sortSize = 48;
let sortingArray = [];

// ==========================

window.addEventListener("load", () => {
	let { ctx } = _initCanvasAndContext(
		"sort-display",
		"2d",
		canvasWidth,
		canvasHeight
	);

	sortingArray = _initArray(sortSize);
	_drawArray(sortingArray, ctx);

	// Interactive Buttons
	document.getElementById("arr-size-down").addEventListener("click", () => {
		sortSize = Math.max(sortSize / 2, 1);
		sortingArray = _initArray(sortSize);
		_drawArray(sortingArray, ctx);
	});
	document.getElementById("arr-size-up").addEventListener("click", () => {
		sortSize = Math.min(sortSize * 2, Math.pow(2, sortSizeMaxPow));
		sortingArray = _initArray(sortSize);
		_drawArray(sortingArray, ctx);
	});
	document.getElementById("arr-refresh").addEventListener("click", () => {
		sortingArray = _initArray(sortSize);
		_drawArray(sortingArray, ctx);
	});

	document.getElementById("arr-shuffle").addEventListener("click", () => {
		algo_shuffle(sortingArray, ctx);
	});
	document.getElementById("arr-random").addEventListener("click", () => {
		algo_randomize(sortingArray, ctx);
	});

	document.getElementById("sort-gnome").addEventListener("click", () => {
		algo_gnome(sortingArray, ctx);
	});
	document.getElementById("sort-stalin").addEventListener("click", () => {
		algo_stalin(sortingArray, ctx);
	});
	document.getElementById("sort-quick").addEventListener("click", () => {
		algo_quicksort(sortingArray, ctx);
	});
});

// ====================================

function _initArray(size) {
	let arrayInit = new Array(size);
	for (let i = 0; i < size; i++) {
		arrayInit[i] = i + 1;
	}
	return arrayInit;
}
