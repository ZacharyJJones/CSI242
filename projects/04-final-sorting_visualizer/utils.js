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
	// half length ~= 180 degrees
	const halfLength = array.length / 2;
	const indexDiff = Math.abs(array[index] - index);
	const diffT = (indexDiff % halfLength) / halfLength;
	return 1.0 - diffT;
}

function addCoords(a, b) {
	return { x: a.x + b.x, y: a.y + b.y };
}

function multCoords(coord, mult) {
	return { x: coord.x * mult.x, y: coord.y * mult.y };
}
