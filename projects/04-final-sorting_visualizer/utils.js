const twoPI = 2.0 * Math.PI;

// =====

function ifUndefined(maybeUndefined, ifUndefined) {
	if (maybeUndefined !== undefined) {
		return maybeUndefined;
	} else {
		return ifUndefined;
	}
}

function clampNum(number, min, max) {
	return Math.min(Math.max(min, number), max);
}

function swap(array, index1, index2) {
	const a = array[index1];
	array[index1] = array[index2];
	array[index2] = a;
}

function isInBounds(num, bounds) {
	return bounds.min <= num && num <= bounds.max;
}

// https://stackoverflow.com/questions/13735912/anchor-jumping-by-using-javascript
function jumpToId(id) {
	const url = location.href;
	location.href = `#${id}`;
	history.replaceState(null, null, url);
}

// where 0 <= t <= 1
function getCircleCoords(t) {
	const x = Math.sin(twoPI * t);
	const y = Math.cos(twoPI * t);
	// const y = (x + 0.75) % 1.0; // this is incorrect. see:
	// https://www.desmos.com/calculator/gamhctzjbl

	return { x: x, y: y };
}

function getCircleIndexDiffScalar(array, index) {
	const halfLength = array.length / 2;
	const goalIndex = array[index] - 1;
	const rawDiff = Math.abs(index - goalIndex);
	const diffFromGoal = halfLength - Math.abs(halfLength - rawDiff);
	const t = diffFromGoal / halfLength;
	return 1.0 - t;
}

function addCoords(a, b) {
	return { x: a.x + b.x, y: a.y + b.y };
}

function multCoords(coord, mult) {
	return { x: coord.x * mult.x, y: coord.y * mult.y };
}

function lerp(numA, numB, t) {
	return numA + t * (numB - numA);
}

// https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
function hslToHex(h, s, l) {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0"); // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

function floorToPowerOfTwo(number) {
	let lastPowOfTwo = 1;
	while (lastPowOfTwo < number) {
		lastPowOfTwo *= 2;
	}
	return lastPowOfTwo / 2;
}

async function copyTextToSystemClipboard(text) {
	await navigator.clipboard.writeText(text);
}
