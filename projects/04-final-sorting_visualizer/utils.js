function clampNum(number, min, max) {
	return Math.min(Math.max(min, number), max);
}

function swap(array, index1, index2) {
	const a = array[index1];
	array[index1] = array[index2];
	array[index2] = a;
}
