const color_red = "#FF0000";
const color_grey = "#AAA";
const color_blue = "#6495ED";
const color_orange = "#FFBF00";
const color_green = "#50C878";

const timeout = 0;

let sortSize = 64;
let sortingArray = [];

const settings = {
	displayType: "Bars", // can also be "Points"
	randomizeType: "Shuffle", // Can also be "Randomize"
	arraySizePow: 6,
	displaySpeed: 1,
	displayTimeout: 10,
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
		display(sortingArray, canvas, { show: true });
	});
	document.getElementById("vis-points").addEventListener("click", () => {
		_setDisplayType(document.getElementById("vis-points").innerText);
		display(sortingArray, canvas, { show: true });
	});

	//

	// document.getElementById("arr-shuffle").addEventListener("click", () => {
	// 	_setRandomizeType(document.getElementById("arr-shuffle").innerText);
	// });
	// document.getElementById("arr-random").addEventListener("click", () => {
	// 	_setRandomizeType(document.getElementById("arr-random").innerText);
	// });

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
	jumpToId(canvas.id);
	await _preSortRandomize(array, canvas);

	await sortMethod(array, canvas);

	await algo_validate(array, canvas);
}

async function _preSortRandomize(array, canvas) {
	const setting = settings["randomizeType"];
	let mixupFunction;
	if (setting === "Randomize") {
		mixupFunction = algo_util_randomize;
	} else {
		mixupFunction = algo_util_shuffle;
	}

	await mixupFunction(array, canvas);
}

function _refreshSortingArray(canvas) {
	sortingArray = _initArray(sortSize);
	display(sortingArray, canvas, { show: true });
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
	settings[""];
}

function _setDisplayType(type) {
	settings["displayType"] = type;
	document.getElementById("set-displayType").innerText = type;
}

function _setRandomizeType(type) {
	settings["randomizeType"] = type;
	document.getElementById("set-randomize").innerText = type;
}
