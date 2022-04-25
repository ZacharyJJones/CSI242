// Const
const nbsp = "\u00A0";

// Variables
let nums;
let currentSign;
let currentInput;

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
		.addEventListener("click", (e) => calc_clickAC());

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
	nums = [null, null];
	currentSign = null;
	currentInput = "";
}

// Main
window.addEventListener("load", function (event) {
	_initListeners();

	// let sample = {
	// 	firstNum: 0,
	// 	sign: "+",
	// 	lastNum: 0
	// };

	//this.document.getElementById("").style.color = "red";
	//this.document.getElementsByClassName("number-display")[0].style.color = "red";

	_resetData();
	updateDisplay();
});

// ==========================

function calc_clickAC() {
	_resetData();
	updateDisplay();
}

function calc_clickPlusMinus() {
	const firstChar = currentInput[0];
	console.log(firstChar);
}

function calc_clickPercent() {
	const firstChar = currentInput[0];
	console.log(firstChar);
}

function calc_clickNumber(number) {
	console.log("Button pressed, num is: " + number);

	if (number === ".") {
		currentInput += ".";
		return;
	} else {
		currentInput += number;
	}

	updateDisplay(null);
}

function calculate() {
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

	_resetData();
	updateDisplay();

	// Display result, overriding the normal "update display".
	// -- will be overwritten when next button is clicked.
	numberDisplay.textContent = "" + result;
}

function updateDisplay() {
	let mainDisplay = currentInput;
	if (currentInput === "") {
		mainDisplay = 0;
	}
	numberDisplay.textContent = mainDisplay;

	if (currentSign === null) {
		numberDisplayPrevious.textContent = nbsp;
	} else {
		numberDisplayPrevious.textContent = `${nums[0]} ${currentSign}`;
	}
}

function enterSign(sign) {
	const inputNum = Number.parseFloat(currentInput);
	if (inputNum === NaN) {
		console.log("Error: currentInput is not a number (" + currentInput + ")");
		return;
	}

	if (sign === "+") {
	} else if (sign === "-") {
	} else if (sign === "*") {
	} else if (sign === "/") {
	}

	// set number,
}
