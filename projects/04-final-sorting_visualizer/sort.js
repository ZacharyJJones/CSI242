const color_red = "#FF0000";
const color_grey = "#AAA";
const color_blue = "#6495ED";
const color_orange = "#FFBF00";
const color_green = "#50C878";

//

let sortingArray = [];
const settings = {
	arraySizePow: 6,
	displaySpeed: 1,
	displayTimeout: 50,
	displayType: "vis-bars",
	sortAlgo: "sort-insertion",

	// not done via url, to avoid troll-ability.
	muted: false,
	volume: 0.3,
};
const settingsDefault = { ...settings };

// ==========================

const displays = {
	"vis-bars": "Bars",
	"vis-pyramid": "Pyramid",
	"vis-points": "Points",

	"vis-circle": "Circle",
	"vis-spiral": "Spiral",
	"vis-circle-slices": "Circle-Slices",
	"vis-spiral-slices": "Spiral-Slices",
};

const sorts = {
	// Slow -- O(n^2) or worse
	"sort-stooge": algo_stooge, // too slow
	"sort-slow": algo_slowsort, // too slow

	"sort-gnome": algo_gnome,
	"sort-selection": algo_selection,
	"sort-selection-double": algo_selection_double,
	"sort-bubble": algo_bubble,
	"sort-cocktail": algo_cocktail,
	"sort-comb": algo_comb,
	"sort-shell": algo_shell,
	"sort-gravity": algo_gravity,

	// Middle -- Somewhere Between
	"sort-oddEven": algo_oddeven,
	"sort-insertion": algo_insertion,
	"sort-batcher-oddEven": algo_batcher_oddeven,
	"sort-bitonic": algo_bitonic,

	// Fast -- O(n log n)
	"sort-radix-10": algo_radix_lsd_base10,
	"sort-radix-4": algo_radix_lsd_base4,
	"sort-radix-2": algo_radix_lsd_base2,
	"sort-insertion-binary": algo_insertion_binary,
	"sort-heap": algo_heap,
	"sort-merge": algo_mergesort,
	"sort-quick": algo_quicksort,
};
// ==========================

function _setDisplayType(displayKey) {
	if (Object.keys(displays).some((x) => x === displayKey)) {
		settings["displayType"] = displayKey;
		document.getElementById("set-displayType").innerText = displays[displayKey];
	}
}

function _setArraySizePow(pow) {
	const clampedPow = clampNum(pow, 0, 16);

	settings["arraySizePow"] = clampedPow;
	const displayText = `2^${clampedPow} | ${Math.pow(2, clampedPow)}`;
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

function _setSortAlgo(algoKey) {
	if (Object.keys(sorts).some((x) => x === algoKey)) {
		settings["sortAlgo"] = algoKey;
		document.getElementById("sort-name").innerText = algoKey;
	}
}

function _setMuted(yesNo) {
	settings["muted"] = yesNo == true; // truthy for fun
	_displayAudioState();
}
function _setVolume(vol) {
	const setVol = clampNum(vol, 0.0, 1.0);
	settings["volume"] = setVol;
	_displayAudioState();
}
function _displayAudioState() {
	const display = document.getElementById("audio-display");
	if (settings["muted"]) {
		display.innerText = "Muted";
	} else {
		display.innerText = Math.floor(100 * settings["volume"]).toString() + "%";
	}

	const slider = document.getElementById("vol-slider");
	slider.value = settings["volume"];
}

// ==========================

window.addEventListener("load", () => {
	const canvas = document.getElementById("sort-display");

	const displaySortImmediately = _initSettings();
	_refreshSortingArray(canvas);
	_initButtons(canvas);

	if (displaySortImmediately) {
		_invokeSort(sortingArray, canvas);
	}
});

function _initSettings() {
	// Standard first, to make sure things get displayed
	_setArraySizePow(settingsDefault["arraySizePow"]);
	_setDisplaySpeed(settingsDefault["displaySpeed"]);
	_setDisplayTimeout(settingsDefault["displayTimeout"]);
	_setDisplayType(settingsDefault["displayType"]);
	_setSortAlgo(settingsDefault["sortAlgo"]);
	_setMuted(settingsDefault["muted"]);
	_setVolume(settingsDefault["volume"]);

	// Override as needed
	const urlParams = new URLSearchParams(window.location.search);
	let displaySortImmediately = false;
	if (urlParams.get("arraySizePow") !== null) {
		console.log(urlParams.get("arraySizePow"));
		_setArraySizePow(urlParams.get("arraySizePow"));
	}
	if (urlParams.get("displaySpeed") !== null) {
		_setDisplaySpeed(urlParams.get("displaySpeed"));
	}
	if (urlParams.get("displayTimeout") !== null) {
		_setDisplayTimeout(urlParams.get("displayTimeout"));
	}
	if (urlParams.get("displayType") !== null) {
		_setDisplayType(urlParams.get("displayType"));
	}
	if (urlParams.get("sortAlgo") !== null) {
		_setSortAlgo(urlParams.get("sortAlgo"));
		displaySortImmediately = true;
	}

	return displaySortImmediately;
}

function _initButtons(canvas) {
	// Display Type
	Object.keys(displays).forEach((key) => {
		const element = document.getElementById(key);
		element.addEventListener("click", () => {
			_setDisplayType(key);
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
	Object.keys(sorts).forEach((key) => {
		document.getElementById(key).addEventListener("click", () => {
			_setSortAlgo(key);
			_invokeSort(sortingArray, canvas);
		});
	});

	// Etc
	document.getElementById("share").addEventListener("click", () => {
		_getShareLink();
	});
	document.getElementById("sort-again").addEventListener("click", () => {
		_invokeSort(sortingArray, canvas);
	});

	// ETC - Volume
	const muteCheckbox = document.getElementById("vol-mute");
	muteCheckbox.addEventListener("change", () => {
		_setMuted(muteCheckbox.checked);
	});
	const volSlider = document.getElementById("vol-slider");
	volSlider.addEventListener("change", () => {
		_setVolume(volSlider.value);
	});
}

function _getShareLink() {
	const baseUrl = window.location.origin + window.location.pathname;
	let queryString = "?";

	const keys = Object.keys(settings);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];

		if (settings[key] !== settingsDefault[key]) {
			queryString += `${key}=${settings[key]}`;

			if (i < keys.length - 1) {
				queryString += "&";
			}
		}
	}

	if (queryString === "?") {
		queryString = "";
	}

	const finalUrl = baseUrl + queryString;
	_shareLinkTempDisplay(finalUrl);
	copyTextToSystemClipboard(finalUrl);
}
async function _shareLinkTempDisplay(link) {
	const button = document.getElementById("share");
	const prevText = button.innerText;
	button.innerText = "Copied To Clipboard!";
	for (let i = 0; i < 4; i++) {
		await new Promise((resolve) => setTimeout(resolve, 750));
		button.innerText += ".";
	}

	button.innerText = prevText;
}

// ====================================

async function _invokeSort(array, canvas) {
	jumpToId(canvas.id);
	await _preSortRandomize(array, canvas);

	const sortMethod = sorts[settings["sortAlgo"]];
	await sortMethod(array, canvas);

	await algo_validate(array, canvas);
}

async function _preSortRandomize(array, canvas) {
	await algo_util_shuffle(array, canvas);
	// const setting = settings["randomizeType"];
	// let mixupFunction;
	// if (setting === "Randomize") {
	// 	mixupFunction = algo_util_randomize;
	// } else {
	// 	mixupFunction = algo_util_shuffle;
	// }
	// await mixupFunction(array, canvas);
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

// Creates a link
async function _shareSettings() {}

// ====================================
