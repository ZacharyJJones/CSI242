const color_red = "#FF0000";
const color_grey = "#AAA";
const color_blue = "#6495ED";
const color_orange = "#FFBF00";
const color_green = "#50C878";

//

let sortingArray = [];

const settings = {
	displayType: "Bars",
	colorType: "Monochrome",
	randomizeType: "Shuffle",
	arraySizePow: 6, // 2^6 == 64
	displaySpeed: 1, // only 1 in every n frames are shown.
	displayTimeout: 50, // timeout between drawing
};
const settingsDefault = { ...settings };

// ==========================

function _setDisplayType(type) {
	settings["displayType"] = type;
	document.getElementById("set-displayType").innerText = type;
}

function _setColorType(type) {
	settings["colorType"] = type;
	document.getElementById("set-colorType").innerText = type;
}

// function _setRandomizeType(type) {
// 	settings["randomizeType"] = type;
// 	document.getElementById("set-randomize").innerText = type;
// }

function _setArraySizePow(pow) {
	settings["arraySizePow"] = clampNum(pow, 0, 31);
	const displayText = `2^${pow} | ${Math.pow(2, pow)}`;
	document.getElementById("set-arraySize").innerText = displayText;
}

function _setDisplaySpeed(speed) {
	const value = Math.max(1, speed);
	settings["displaySpeed"] = value;
	document.getElementById("set-displaySpeed").innerText = `${value}x`;
}

function _setDisplayTimeout(timeout) {
	const value = Math.max(0, timeout);
	settings["displayTimeout"] = value;
	document.getElementById("set-displayTimeout").innerText = `${value}ms`;
}

// ==========================

window.addEventListener("load", () => {
	_setDisplayType(settingsDefault["displayType"]);
	_setColorType(settingsDefault["colorType"]);
	// _setRandomizeType(settingsDefault["randomizeType"]);
	_setArraySizePow(settingsDefault["arraySizePow"]);
	_setDisplaySpeed(settingsDefault["displaySpeed"]);
	_setDisplayTimeout(settingsDefault["displayTimeout"]);

	const canvas = document.getElementById("sort-display");
	_refreshSortingArray(canvas);
	_initButtons(canvas);
});

function _initButtons(canvas) {
	//

	// Display Type
	const displays = [
		"vis-bars",
		"vis-pyramid",
		"vis-points",
		"vis-circle",
		"vis-circle-spiral",
		"vis-circle-slices",
		"vis-circle-slices-spiral",
	];
	displays.forEach((displayTypeId) => {
		const element = document.getElementById(displayTypeId);
		element.addEventListener("click", () => {
			_setDisplayType(element.innerText);
			display(sortingArray, canvas, { show: true });
		});
	});

	// Display Color
	const colors = ["vis-color-mono", "vis-color-rgb"];
	colors.forEach((colorTypeId) => {
		const element = document.getElementById(colorTypeId);
		element.addEventListener("click", () => {
			_setColorType(element.innerText);
			display(sortingArray, canvas, { show: true });
		});
	});

	// Array Size
	document.getElementById("arr-size-down").addEventListener("click", () => {
		_setArraySizePow(settings["arraySizePow"] - 1);
		_refreshSortingArray(canvas);
	});
	document.getElementById("arr-size-up").addEventListener("click", () => {
		_setArraySizePow(settings["arraySizePow"] + 1);
		_refreshSortingArray(canvas);
	});
	document.getElementById("arr-refresh").addEventListener("click", () => {
		_refreshSortingArray(canvas);
	});

	// Speed Mult
	document.getElementById("set-spd-reset").addEventListener("click", () => {
		_setDisplaySpeed(settingsDefault["displaySpeed"]);
	});
	document.getElementById("set-spd-up").addEventListener("click", () => {
		_setDisplaySpeed(settings["displaySpeed"] * 2);
	});

	// Display Delay
	document.getElementById("set-timeout-down").addEventListener("click", () => {
		_setDisplayTimeout(settings["displayTimeout"] - 10);
	});
	document.getElementById("set-timeout-reset").addEventListener("click", () => {
		_setDisplayTimeout(settingsDefault["displayTimeout"]);
	});
	document.getElementById("set-timeout-up").addEventListener("click", () => {
		_setDisplayTimeout(settings["displayTimeout"] + 10);
	});

	// Sorts
	const sorts = [
		// Slow -- O(n^2) or more
		// { key: "sort-slow", val: algo_slowsort }, // too slow
		// { key: "sort-stooge", val: algo_stooge }, // too slow
		{ key: "sort-selection", val: algo_selection },
		{ key: "sort-gnome", val: algo_gnome },

		// Middle -- Somewhere Between
		{ key: "sort-insertion", val: algo_insertion }, // slightly better than other n^2 sorts

		// Fast -- O(n log n)
		{ key: "sort-merge", val: algo_mergesort },
		{ key: "sort-quick", val: algo_quicksort },
	];
	sorts.forEach((sort) => {
		document.getElementById(sort.key).addEventListener("click", () => {
			_invokeSort(sortingArray, canvas, sort.val);
		});
	});

	//
}

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
	sortingArray = _initArray(Math.pow(2, settings["arraySizePow"]));
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
