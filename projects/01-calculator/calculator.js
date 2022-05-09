const nbsp = "\u00A0";

// Variables
let prevNumInfo;
let operationSign;

// "numInfo"
let input;
let isPercent;
let isNegative;

// Elements
let numberDisplay = null;
let numberDisplayPrevious = null;

// "Higher" importance functions
function _initListeners() {
	// Display
	numberDisplay = document.getElementsByClassName("number-display")[0];
	numberDisplayPrevious = document.getElementsByClassName(
		"number-display-previous"
	)[0];

	// Number Buttons
	for (let i = 0; i <= 9; i++) {
		const element = this.document.getElementById("calc-number-" + i);
		element.addEventListener("click", (e) => calc_clickNumber(i));
	}

	this.document
		.getElementById("calc-number-decimal")
		.addEventListener("click", (e) => calc_clickNumber("."));

	// Operation Buttons
	this.document
		.getElementById("calc-button-ac")
		.addEventListener("click", (e) => calc_clickAC());

	this.document
		.getElementById("calc-button-sign")
		.addEventListener("click", (e) => calc_clickPlusMinus());

	this.document
		.getElementById("calc-button-percent")
		.addEventListener("click", (e) => calc_clickPercent());

	// expression buttons
	this.document
		.getElementById("calc-button-divide")
		.addEventListener("click", (e) => calc_clickSign("/"));

	this.document
		.getElementById("calc-button-multiply")
		.addEventListener("click", (e) => calc_clickSign("*"));

	this.document
		.getElementById("calc-button-subtract")
		.addEventListener("click", (e) => calc_clickSign("-"));

	this.document
		.getElementById("calc-button-add")
		.addEventListener("click", (e) => calc_clickSign("+"));

	this.document
		.getElementById("calc-button-equals")
		.addEventListener("click", (e) => _calculate());

	this.document.addEventListener("keyup", (e) => _handleInput(e));
}

function _handleInput(keyEvent) {
	keyEvent.preventDefault();
	let keypadNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => x.toString());
	let keypadSigns = ["*", "/", "+", "-"];

	let key = keyEvent.key;
	if (key === "Shift") {
		return;
	}

	// Operations
	else if (key === "Escape") {
		calc_clickAC();
	} else if (key === "%") {
		calc_clickPercent();
	} else if (key === "~") {
		// Using tilde to flip sign because
		// ... key combo is complex at this point
		calc_clickPlusMinus();
	}

	// Numbers
	else if (anyInArrayMatches(keypadNums, key)) {
		// key is a number
		calc_clickNumber(key);
	} else if (key === ".") {
		calc_clickNumber(".");
	}

	// Expressions
	else if (anyInArrayMatches(keypadSigns, key)) {
		calc_clickSign(key);
	} else if (key === "=" || key === "Enter") {
		_calculate();
	}

	console.log(keyEvent.key);
}

function _resetData() {
	operationSign = null;
	prevNumInfo = {
		value: NaN,
		isPercent: false,
		isNegative: false,
	};
	input = "";
	isPercent = false;
	isNegative = false;
}

function _updateDisplay() {
	let mainDisplay = "";
	if (isNegative === true) {
		mainDisplay += "-";
	}
	mainDisplay += input === "" ? 0 : input;
	if (isPercent === true) {
		mainDisplay += "%";
	}
	numberDisplay.textContent = mainDisplay;

	if (operationSign === null) {
		numberDisplayPrevious.textContent = nbsp;
	} else {
		let prevDisplay = prevNumInfo.value;
		let numPercent = prevNumInfo.isPercent ? "%" : "";
		numberDisplayPrevious.textContent = `${prevDisplay}${numPercent} ${operationSign}`;
	}
}

function _calculate() {
	if (prevNumInfo.value === NaN || !Number.parseFloat(input)) {
		return;
	}

	// Get first num
	let prevNumber = Number.parseFloat(prevNumInfo.value);
	if (prevNumInfo.isNegative) {
		prevNumber *= -1;
	}
	if (prevNumInfo.isPercent) {
		prevNumber /= 100.0;
	}

	// Get second num
	let thisNumber = Number.parseFloat(input);
	if (isNegative) {
		thisNumber *= -1;
	}
	if (isPercent) {
		thisNumber /= 100.0;
	}

	// Calculate
	let result = NaN;
	if (operationSign === "+") {
		result = prevNumber + thisNumber;
	} else if (operationSign === "-") {
		result = prevNumber - thisNumber;
	} else if (operationSign === "*") {
		result = prevNumber * thisNumber;
	} else if (operationSign === "/") {
		result = prevNumber / thisNumber;
	}

	_resetData();
	_updateDisplay();

	// Display result, overriding the normal "update display".
	// -- will be overwritten when next button is clicked.
	numberDisplay.textContent = "" + result;
}

// Helper
function anyInArrayMatches(array, compare) {
	return !array.every((x) => x != compare);
}

// Main
window.addEventListener("load", function (event) {
	_initListeners();
	_resetData();
	_updateDisplay();
});

// ==========================

function calc_clickSign(clickedSign) {
	const inputNum = Number.parseFloat(input);
	if (inputNum === NaN) {
		console.log("Error: currentInput is not a number (" + input + ")");
		return;
	}

	let tempNumInfo = {
		value: input,
		isNegative: isNegative,
		isPercent: isPercent,
	};

	_resetData();
	operationSign = clickedSign;
	prevNumInfo = tempNumInfo;
	_updateDisplay();
}

function calc_clickNumber(number) {
	input += number;
	_updateDisplay();
}

// Set: Operations
function calc_clickAC() {
	_resetData();
	_updateDisplay();
}

function calc_clickPlusMinus() {
	isNegative = !isNegative;
	_updateDisplay();
}

function calc_clickPercent() {
	isPercent = !isPercent;
	_updateDisplay();
}
