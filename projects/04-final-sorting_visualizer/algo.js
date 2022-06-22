// ==========
// To-Do List
// ==========
/*
	Need: Radix Sort, Merge sort, binary insertion sort, cocktail shaker sort, heap sort
*/

// ===============
// Util Algorithms
// ===============

// Shuffles around existing values in the array
async function algo_util_shuffle(array, canvas) {
	for (let i = 0; i < array.length; i++) {
		const swapIndex = i + Math.floor(Math.random() * (array.length - i));
		await display(array, canvas, {
			compareIndex: i,
			searchIndex: swapIndex,
			activeBounds: {
				min: i,
				max: array.length - 1,
			},
		});

		// Swap
		swap(array, i, swapIndex);
	}
	await display(array, canvas);
}

// Places new randomized values in the array
async function algo_util_randomize(array, canvas) {
	for (let i = 0; i < array.length; i++) {
		array[i] = Math.ceil(Math.random() * array.length);
		await display(array, canvas, {
			compareIndex: i,
			activeBounds: {
				min: i,
				max: array.length - 1,
			},
		});
	}
	await display(array, canvas);
}

// Validates that an array is sorted
async function algo_validate(array, canvas) {
	for (let i = 1; i < array.length; i++) {
		const prev = array[i - 1];
		const curr = array[i];

		if (prev > curr) {
			await display(array, canvas, { show: true });
			return false;
		}

		await display(array, canvas, {
			freeColors: [
				{
					color: color_green,
					min: 0,
					max: i,
				},
			],
		});
	}

	await display(array, canvas, { show: true });
	return true;
}

// =================================
// Real Sorts -- O(n^x) -- The Worst
// =================================

// Slowsort | O(n^( (log_2(n))/(n-k) ))
// -- Behaves okay on inputs of size 64 or less. Slows down hugely for each step past 64.
async function algo_slowsort(array, canvas) {
	await algo_slowsort_recursive(array, canvas, 0, array.length - 1);
}
async function algo_slowsort_recursive(array, canvas, min, max) {
	if (min >= max) {
		return;
	}

	const mid = Math.floor((min + max) / 2);
	await algo_slowsort_recursive(array, canvas, min, mid);
	await algo_slowsort_recursive(array, canvas, mid + 1, max);

	if (array[max] < array[mid]) {
		await display(array, canvas, { compareIndex: mid, searchIndex: max });
		swap(array, max, mid);
	}
	await algo_slowsort_recursive(array, canvas, min, max - 1);
}

// Stooge Sort | ~O(n^2.71) | O(n^(log(3) / log(1.5)))
// -- VERY SLOW, even on smaller input sizes.
async function algo_stooge(array, canvas) {
	await algo_stooge_recursive(array, canvas, 0, array.length - 1);
}
async function algo_stooge_recursive(array, canvas, min, max) {
	await display(array, canvas, {
		compareIndex: min,
		searchIndex: max,
	});

	if (array[min] > array[max]) {
		swap(array, min, max);
	}

	const numElements = max - min + 1;
	if (numElements >= 3) {
		const t = Math.floor((max - min + 1) / 3);
		await algo_stooge_recursive(array, canvas, min, max - t); // sort first 2/3rds
		await algo_stooge_recursive(array, canvas, min + t, max); // sort second 2/3rds
		await algo_stooge_recursive(array, canvas, min, max - t); // sort first 2/3rds again
	}
}

//

// Gnome Sort | O(n^2)
async function algo_gnome(array, canvas) {
	let i = 0;
	while (i < array.length) {
		if (i == 0 || array[i] >= array[i - 1]) {
			i++;
		} else {
			swap(array, i, i - 1);
			i--;
		}
		await display(array, canvas, { compareIndex: i });
	}
}

// Selection Sort | O(n^2)
async function algo_selection(array, canvas) {
	let props = {
		activeBounds: {
			min: 0,
			max: array.length - 1,
		},
		compareIndex: 0,
		searchIndex: 0,
	};

	for (let placeIndex = 0; placeIndex < array.length - 1; placeIndex++) {
		let indexOfLowest = placeIndex;

		props.activeBounds.min = placeIndex;
		props.compareIndex = placeIndex;

		for (let i = placeIndex; i < array.length; i++) {
			props.searchIndex = i;

			if (array[i] < array[indexOfLowest]) {
				indexOfLowest = i;
			}

			await display(array, canvas, {
				...props,
				freeColors: [
					{ color: color_blue, min: indexOfLowest, max: indexOfLowest },
				],
			});
		}

		props.searchIndex = indexOfLowest;

		swap(array, placeIndex, indexOfLowest);
		await display(array, canvas, props);
	}
}

// Insertion Sort | O(n^2) -- but typically outperforms other n^2 algorithms
async function algo_insertion(array, canvas) {
	let props = {
		activeBounds: {
			min: 0,
			max: 0,
		},
		compareIndex: 0,
		searchIndex: 0,
	};

	for (let i = 1; i < array.length; i++) {
		props.activeBounds.max = i;
		props.compareIndex = i;
		props.searchIndex = i - 1;
		await display(array, canvas, { ...props });

		if (array[i] > array[i - 1]) {
			continue;
		}

		for (let j = i; j >= 0; j--) {
			props.searchIndex = j;
			await display(array, canvas, props);

			if (array[j] < array[j - 1]) {
				swap(array, j, j - 1);
			} else {
				break;
			}
		}
	}
}

// ====================================
// Real Sorts -- O(n log n) -- The Best
// ====================================

// Merge Sort | O(n log n)
async function algo_mergesort(array, canvas) {
	await algo_mergesort_recursive(array, canvas, 0, array.length - 1);
}
async function algo_mergesort_recursive(array, canvas, min, max) {
	if (min >= max) {
		return;
	}

	const mid = Math.floor(min + (max - min) / 2);
	await algo_mergesort_recursive(array, canvas, min, mid);
	await algo_mergesort_recursive(array, canvas, mid + 1, max);

	// And merge
	await algo_mergesort_merge(array, canvas, min, mid, max);
}
async function algo_mergesort_merge(array, canvas, min, mid, max) {
	let aIndex = min;
	let bIndex = mid + 1;

	// if already sorted
	if (array[mid] <= array[bIndex]) {
		return;
	}

	while (aIndex <= mid && bIndex <= max) {
		if (array[aIndex] <= array[bIndex]) {
			aIndex++;
		} else {
			let value = array[bIndex];
			let shiftingIndex = bIndex;
			bIndex++;

			// shift value into place
			while (shiftingIndex > aIndex) {
				array[shiftingIndex] = array[shiftingIndex - 1];
				shiftingIndex--;
			}
			array[aIndex] = value;
			aIndex++;

			// Update endpoint of "lower" section
			mid++;
		}

		await display(array, canvas, {
			compareIndex: aIndex,
			searchIndex: bIndex,
		});
	}
}

// QuickSort | O(n log n)
async function algo_quicksort(array, canvas) {
	await algo_quicksort_recursive(array, canvas, 0, array.length - 1);
}
async function algo_quicksort_recursive(array, canvas, min, max) {
	if (min >= max) {
		return;
	}

	const pivotIndex = await algo_quicksort_partition(array, canvas, min, max);

	await algo_quicksort_recursive(array, canvas, min, pivotIndex - 1);
	await algo_quicksort_recursive(array, canvas, pivotIndex + 1, max);
}
async function algo_quicksort_partition(array, canvas, min, max) {
	if (min > max) {
		return min;
	}

	// pivot == first element
	const pivot = array[min];

	// set up working indices
	let lowIndex = min;
	let highIndex = max;

	while (lowIndex < highIndex) {
		// Look for next value > pivot
		while (lowIndex < max && array[lowIndex] <= pivot) {
			lowIndex++;

			await display(
				array,
				canvas,
				_quicksortProps(min, max, lowIndex, highIndex)
			);
		}

		// Find next value < pivot
		while (highIndex > min && array[highIndex] > pivot) {
			highIndex--;

			await display(
				array,
				canvas,
				_quicksortProps(min, max, lowIndex, highIndex)
			);
		}

		// Swap if indices have not crossed
		if (lowIndex < highIndex) {
			swap(array, lowIndex, highIndex);

			await display(
				array,
				canvas,
				_quicksortProps(min, max, lowIndex, highIndex)
			);
		}
	}

	// At this point low and high indexes have crossed each other
	// - this means that the array is partitioned into two sides
	swap(array, min, highIndex);
	return highIndex;
}
function _quicksortProps(min, max, lowIndex, highIndex) {
	return {
		compareIndex: min,
		activeBounds: { min: min, max: max },
		freeColors: [
			{
				color: color_blue,
				min: lowIndex,
				max: lowIndex,
			},
			{
				color: color_orange,
				min: highIndex,
				max: highIndex,
			},
		],
	};
}

// ==========
// Joke Sorts
// ==========

// Bogo Sort - Check if array is in order. If it is not, randomize the entire array (and check again, etc). O(n!^n)
// Bozo Sort - Check if array is in order. If it is not, swap two random elements. O(n!)
// Stooge Sort - ... O(n^(log(3) - log(1.5)))

// Assumption Sort - Assume the list is already sorted

// Miracle Sort - Check if array is sorted. If not, wait a while and check again. Eventually, alpha particles flipping bits in the memory chips should result in a successful sort. Average time complexity == O(✝)

// Stalin Sort - go through array, removing any elements that are out of order. You are left with a sorted array.

// Quantum Bogo Sort - Mainly a hypothetical sort. Randomize the list. If the list is NOT sorted, then destroy the universe. O(1), assuming the Alternate Histories theory is accurate.
// - Source: https://medium.com/@dylan.finn/the-worst-and-most-entertaining-sorting-algorithms-96efc9025f7

// Bogobogo Sort:
// - Source: https://www.dangermouse.net/esoteric/bogobogosort.html
