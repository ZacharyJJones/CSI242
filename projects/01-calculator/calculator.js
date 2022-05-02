// Const
const nbsp = "\u00A0";

// Variables
let nums;
let sign;

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

	// Expression Buttons
	// this.document
	// 	.getElementById("calc-number-decimal")
	// 	.addEventListener("click", (e) => {});

	/*
	<div class="calc-button operation" id="calc-button-ac">AC</div>
	<div class="calc-button operation" id="calc-button-sign">±</div>
	<div class="calc-button operation" id="calc-button-percent">%</div>

	<div class="calc-button expression" id="calc-button-divide">÷</div>
	<div class="calc-button expression" id="calc-button-multiply">x</div>
	<div class="calc-button expression" id="calc-button-subtract">-</div>
	<div class="calc-button expression" id="calc-button-add">+</div>
	<div class="calc-button expression" id="calc-button-equals">=</div>
	*/
}

function _resetData() {
	sign = null;
	nums = [
		{ value: NaN, isPercent: false },
		{ value: NaN, isPercent: false },
	];
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

	if (sign === null) {
		numberDisplayPrevious.textContent = nbsp;
	} else {
		let prevDisplay = nums[0]["value"];
		let numPercent = nums[0]["isPercent"] ? "%" : "";
		numberDisplayPrevious.textContent = `${prevDisplay}${numPercent} ${sign}`;
	}
}

function _calculate() {
	let result = NaN;
	if (sign === "+") {
		result = nums[0] + nums[1];
	} else if (sign === "-") {
		result = nums[0] - nums[1];
	} else if (sign === "*") {
		result = nums[0] * nums[1];
	} else if (sign === "/") {
		result = nums[0] / nums[1];
	}

	// account for percentage operation(s) !!!

	_resetData();
	_updateDisplay();

	// Display result, overriding the normal "update display".
	// -- will be overwritten when next button is clicked.
	numberDisplay.textContent = "" + result;
}

// Main
window.addEventListener("load", function (event) {
	_initListeners();
	_resetData();
	_updateDisplay();
});

// ==========================

function enterSign(sign) {
	const inputNum = Number.parseFloat(input);
	if (inputNum === NaN) {
		console.log("Error: currentInput is not a number (" + input + ")");
		return;
	}

	if (sign === "+") {
	} else if (sign === "-") {
	} else if (sign === "*") {
	} else if (sign === "/") {
	}

	// set number,
}

function calc_clickNumber(number) {
	console.log("Button pressed, num is: " + number);

	if (number === ".") {
		input += ".";
		return;
	} else {
		input += number;
	}

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
