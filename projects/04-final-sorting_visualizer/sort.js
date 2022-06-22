const color_red = "#FF0000";
const color_grey = "#AAA";
const color_blue = "#6495ED";
const color_orange = "#FFBF00";
const color_green = "#50C878";

// const canvasWidth = 1000;
// const canvasHeight = 600;

const timeout = 0;

let sortSize = 64;
let sortingArray = [];

const settings = {
	displayType: "Bars", // can also be "Points"
	randomizeType: "Shuffle", // Can also be "Randomize"
};

// ==========================

window.addEventListener("load", () => {
	const canvas = document.getElementById("sort-display");
	_setArraySize(sortSize);
	_refreshSortingArray(canvas);

	// =============
	// Button Hookup
	// =============

	//

	document.getElementById("vis-bars").addEventListener("click", () => {
		_setDisplayType(document.getElementById("vis-bars").innerText);
		display(array, canvas);
	});
	document.getElementById("vis-points").addEventListener("click", () => {
		_setDisplayType(document.getElementById("vis-points").innerText);
		display(array, canvas);
	});

	//

	document.getElementById("arr-size-down").addEventListener("click", () => {
		_setArraySize(sortSize / 2);
		_refreshSortingArray(canvas);
	});
	document.getElementById("arr-size-up").addEventListener("click", () => {
		_setArraySize(sortSize * 2);
		_refreshSortingArray(canvas);
	});
	document.getElementById("arr-refresh").addEventListener("click", () => {
		_refreshSortingArray(canvas);
	});

	//

	document.getElementById("arr-shuffle").addEventListener("click", () => {
		algo_shuffle(sortingArray, canvas);
	});
	document.getElementById("arr-random").addEventListener("click", () => {
		algo_randomize(sortingArray, canvas);
	});

	//

	const sorts = [
		{ key: "sort-slow", val: algo_slowsort },
		// { key: "sort-stooge", val: algo_stooge }, // too slow
		{ key: "sort-selection", val: algo_selection },
		{ key: "sort-gnome", val: algo_gnome },
		{ key: "sort-insertion", val: algo_insertion },
		{ key: "sort-quick", val: algo_quicksort },
	];
	sorts.forEach((sort) => {
		document.getElementById(sort.key).addEventListener("click", () => {
			_invokeSort(sortingArray, canvas, sort.val);
		});
	});
});

// ====================================

async function _invokeSort(array, canvas, sortMethod) {
	// if (await algo_validate(array, canvas)) {
	// 	return;
	// }
	await algo_shuffle(array, canvas);

	await sortMethod(array, canvas);

	await algo_validate(array, canvas);
}

function _refreshSortingArray(canvas) {
	sortingArray = _initArray(sortSize);
	display(sortingArray, canvas);
}

function _initArray(size) {
	let arrayInit = new Array(size);
	for (let i = 0; i < size; i++) {
		arrayInit[i] = i + 1;
	}
	return arrayInit;
}

// ====================================

function _setArraySize(size) {
	sortSize = clampNum(size, 1, Math.pow(2, 12));
}

function _setDisplayType(type) {
	settings["displayType"] = type;
	document.getElementById("set-displayType").innerText = type;
}
