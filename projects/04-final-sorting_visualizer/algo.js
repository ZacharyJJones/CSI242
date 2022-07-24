/*
	Great Sources:
	1) Wikipedia
	2) https://github.com/Gaming32/ArrayV
	3) https://github.com/w0rthy/ArrayVisualizer
*/
// ===============
// Util Algorithms
// ===============

// Shuffles around existing values in the array
async function algo_util_shuffle(array, canvas) {
	for (let i = 0; i < array.length; i++) {
		const swapIndex = i + Math.floor(Math.random() * (array.length - i));
		await display(array, canvas, {
			activeIndices: [i, swapIndex],
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
			activeIndices: [i],
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
	let isSorted = true;
	for (let i = 1; i < array.length; i++) {
		const prev = array[i - 1];
		const curr = array[i];

		if (prev > curr) {
			isSorted = false;
			break;
		}

		await display(array, canvas, {
			activeIndices: [i],
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
	if (isSorted && !settings["muted"]) {
		_playDingSound(settings["volume"]);
	}
	return isSorted;
}

function algo_util_shiftTo(array, indexToShift, destinationIndex) {
	//
	if (destinationIndex - indexToShift > 0) {
		// right shift
		for (let i = indexToShift; i < destinationIndex; i++) {
			swap(array, i, i + 1);
		}
	} else {
		// left shift
		for (let i = indexToShift; i > destinationIndex; i--) {
			swap(array, i, i - 1);
		}
	}
}

async function algo_util_partition(array, canvas, min, max) {
	if (min > max) {
		return min;
	}

	// Choose pivot. Picking random element in range is...
	// ... more robust, compared to picking first.
	const pivotIndex = min + Math.floor(Math.random() * (max - min + 1));
	swap(array, pivotIndex, min);
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
				_algo_util_partition_props(min, max, lowIndex, highIndex)
			);
		}

		// Find next value < pivot
		while (highIndex > min && array[highIndex] > pivot) {
			highIndex--;

			await display(
				array,
				canvas,
				_algo_util_partition_props(min, max, lowIndex, highIndex)
			);
		}

		// Swap if indices have not crossed
		if (lowIndex < highIndex) {
			swap(array, lowIndex, highIndex);

			await display(
				array,
				canvas,
				_algo_util_partition_props(min, max, lowIndex, highIndex)
			);
		}
	}

	// At this point low and high indexes have crossed each other
	// - this means that the array is partitioned into two sides
	swap(array, min, highIndex);
	return highIndex;
}
function _algo_util_partition_props(min, max, lowIndex, highIndex) {
	return {
		activeIndices: [min],
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
		await display(array, canvas, { activeIndices: [mid, max] });
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
	await display(array, canvas, { activeIndices: [min, max] });

	if (array[min] > array[max]) {
		swap(array, min, max);
	}

	const numElements = max - min + 1;
	if (numElements >= 3) {
		const t = Math.floor(numElements / 3);
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
		await display(array, canvas, { activeIndices: [i] });
	}
}

// Selection Sort | O(n^2)
async function algo_selection(array, canvas) {
	let props = {
		activeIndices: [0, 0],
		activeBounds: {
			min: 0,
			max: array.length - 1,
		},
	};

	for (let placeIndex = 0; placeIndex < array.length - 1; placeIndex++) {
		let indexOfLowest = placeIndex;

		props.activeBounds.min = placeIndex;
		props.activeIndices[0] = placeIndex;

		for (let i = placeIndex; i < array.length; i++) {
			props.activeIndices[1] = i;

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

		props.activeIndices[1] = indexOfLowest;

		swap(array, placeIndex, indexOfLowest);
		await display(array, canvas, props);
	}
}

async function algo_selection_double(array, canvas) {
	let low = 0;
	let high = array.length - 1;
	let min = 0;
	let max = 0;

	while (low <= high) {
		for (let i = low; i <= high; i++) {
			if (array[i] > array[max]) {
				max = i;
			}
			if (array[i] < array[min]) {
				min = i;
			}

			await display(array, canvas, {
				activeIndices: [low, high, i],
				activeBounds: {
					min: low,
					max: high,
				},
				freeColors: [
					{
						color: color_blue,
						min: min,
						max: min,
					},
					{
						color: color_orange,
						min: max,
						max: max,
					},
				],
			});
		}

		if (max === low) {
			max = min;
		}

		swap(array, low, min);
		swap(array, high, max);
		await display(array, canvas, {
			activeIndices: [low, high],
			activeBounds: {
				min: low,
				max: high,
			},
		});

		low++;
		high--;

		min = low;
		max = high;
	}
}

async function algo_bubble(array, canvas) {
	for (let i = array.length - 1; i >= 0; i--) {
		for (let j = 1; j <= i; j++) {
			if (array[j] < array[j - 1]) {
				swap(array, j, j - 1);
			}

			await display(array, canvas, {
				activeIndices: [j],
				activeBounds: {
					min: 0,
					max: i,
				},
			});
		}
	}
}

// https://en.wikipedia.org/wiki/Cocktail_shaker_sort
async function algo_cocktail(array, canvas) {
	let min = 0;
	let max = array.length - 1;
	while (min <= max) {
		let newMin = max;
		let newMax = min;

		for (let i = min; i < max; i++) {
			if (array[i] > array[i + 1]) {
				swap(array, i, i + 1);
				newMax = i;
			}

			await display(array, canvas, {
				activeIndices: [i + 1],
				activeBounds: { min: min, max: max },
			});
		}
		max = newMax;

		for (let j = max - 1; j >= min; j--) {
			if (array[j] > array[j + 1]) {
				swap(array, j, j + 1);
				newMin = j;
			}

			await display(array, canvas, {
				activeIndices: [j],
				activeBounds: { min: min, max: max },
			});
		}
		min = newMin + 1;
	}
}

async function algo_oddeven(array, canvas) {
	let sorted = false;
	while (!sorted) {
		sorted = true;
		for (let i = 1; i < array.length - 1; i += 2) {
			if (array[i] > array[i + 1]) {
				swap(array, i, i + 1);
				sorted = false;
			}
			await display(array, canvas, {
				activeIndices: [i, i + 1],
			});
		}
		for (let i = 0; i < array.length - 1; i += 2) {
			if (array[i] > array[i + 1]) {
				swap(array, i, i + 1);
				sorted = false;
			}
			await display(array, canvas, {
				activeIndices: [i, i + 1],
			});
		}
	}
}

// https://en.wikipedia.org/wiki/Comb_sort
async function algo_comb(array, canvas) {
	const shrinkFactor = 1.3;
	let gap = array.length;
	let sorted = false;

	while (!sorted) {
		gap = Math.floor(gap / shrinkFactor);
		if (gap <= 1) {
			gap = 1;

			// Could only POSSIBLY be sorted at gap=1
			sorted = true;
		}

		for (let i = 0; i + gap < array.length; i++) {
			if (array[i] > array[i + gap]) {
				swap(array, i, i + gap);
				sorted = false;
			}
			await display(array, canvas, {
				activeIndices: [i, i + gap],
			});
		}
	}
}

async function algo_shell(array, canvas) {
	// Compute gaps (since input is of any size)
	let gaps = [1];
	const gapMult = 2.25;
	while (gaps.at(-1) < array.length) {
		gaps.push(Math.floor(gaps.at(-1) * gapMult));
	}
	gaps.pop();

	// Algo
	for (let i = gaps.length - 1; i >= 0; i--) {
		const gap = gaps[i];

		for (let j = gap; j < array.length; j++) {
			const element = array[j];
			let k = j;

			while (array[k - gap] > element) {
				array[k] = array[k - gap];
				k -= gap;

				await display(array, canvas, {
					activeIndices: [k, k - gap],
				});
			}
			array[k] = element;
		}
	}
}

// Insertion Sort | O(n^2) -- but typically outperforms other n^2 algorithms
async function algo_insertion(array, canvas) {
	for (let i = 1; i < array.length; i++) {
		await display(array, canvas, {
			activeIndices: [i, i - 1],
			activeBounds: {
				min: 0,
				max: i,
			},
		});

		if (array[i] > array[i - 1]) {
			continue;
		}

		for (let j = i; j >= 0; j--) {
			await display(array, canvas, {
				activeIndices: [i, j],
				activeBounds: {
					min: 0,
					max: i,
				},
			});

			if (array[j] < array[j - 1]) {
				swap(array, j, j - 1);
			} else {
				break;
			}
		}
	}
}

// https://en.wikipedia.org/wiki/Bead_sort
// https://github.com/w0rthy/ArrayVisualizer/blob/master/src/array/visualizer/ArrayController.java
// ... aka Bead Sort
async function algo_gravity(array, canvas) {
	let max = array.reduce((prev, curr) => Math.max(prev, curr));
	let abacus = Array.from(Array(array.length), () => new Array(max).fill(0));

	for (let i = 0; i < array.length; i++) {
		await display(array, canvas, { activeIndices: [i] });
		for (let j = 0; j < array[i]; j++) {
			abacus[i][abacus[0].length - j - 1] = 1;
		}
	}

	// Apply Gravity
	for (let i = 0; i < abacus[0].length; i++) {
		for (let j = 0; j < abacus.length; j++) {
			if (abacus[j][i] === 1) {
				let dropPos = j;
				while (dropPos + 1 < abacus.length && abacus[dropPos][i] === 1) {
					dropPos++;
				}
				if (abacus[dropPos][i] === 0) {
					abacus[dropPos][i] = 1;
					abacus[j][i] = 0;
				}
			}
		}

		let activeIndices = [];
		for (let x = 0; x < abacus.length; x++) {
			let count = 0;
			for (let y = 0; y < abacus[0].length; y++) {
				count += abacus[x][y];
			}

			if (array[x] !== count) {
				activeIndices.push(x);
			}

			array[x] = count;
		}

		// display here, after each gravity wave
		await display(array, canvas, { activeIndices: activeIndices });
	}
}

//https://en.wikipedia.org/wiki/Bitonic_sorter
async function algo_bitonic(array, canvas) {
	for (let k = 2; k <= array.length; k *= 2) {
		for (let j = k / 2; j > 0; j = Math.floor(j / 2)) {
			for (let i = 0; i < array.length; i++) {
				const l = i ^ j; // bitwise XOR
				if (l > i) {
					// "i & k" is bitwise AND function
					if (
						((i & k) === 0 && array[i] > array[l]) ||
						((i & k) !== 0 && array[i] < array[l])
					) {
						swap(array, i, l);
					}
				}

				await display(array, canvas, {
					activeIndices: [i, l],
				});
			}
		}
	}
}

// https://en.wikipedia.org/wiki/Batcher_odd%E2%80%93even_mergesort
async function algo_batcher_oddeven(array, canvas) {
	for (let p = 1; p < array.length; p *= 2) {
		for (let k = p; k >= 1; k = Math.floor(k / 2)) {
			for (let j = k % p; j < array.length - k; j += 2 * k) {
				for (let i = 0; i < k; i++) {
					const a = Math.floor((i + j) / (p * 2));
					const b = Math.floor((i + j + k) / (p * 2));
					await display(array, canvas, {
						activeIndices: [i + j, i + j + k],
					});
					if (a === b) {
						const aVal = array[i + j];
						const bVal = array[i + j + k];
						if (aVal > bVal) {
							swap(array, i + j, i + j + k);
						}
					}
				}
			}
		}
	}
}

// ====================================
// Real Sorts -- O(n log n) -- The Best
// ====================================

// https://github.com/Mrrl/GrailSort/blob/master/GrailSort.h
// Grail Sort -- TODO

// https://github.com/BonzaiThePenguin/WikiSort/blob/master/WikiSort.cpp
// Block Sort / Wiki Sort -- TODO

// AKA Tim sort
async function algo_weave(array, canvas) {
	await algo_weave_recursive(array, canvas, 0, array.length - 1);
}
async function algo_weave_recursive(array, canvas, min, max) {
	// Just 1 element, nothing to be done
	if (max - min === 0) {
		return;
	}

	// Only 2 elements, simple comparison
	if (max - min === 1 && array[min] > array[max]) {
		swap(array, min, max);
		await display(array, canvas, { activeIndices: [min, max] });
		return;
	}

	// Need to further break down the array
	const mid = Math.floor((min + max) / 2);
	await algo_weave_recursive(array, canvas, min, mid);
	await algo_weave_recursive(array, canvas, mid + 1, max);
	await algo_weave_merge(array, canvas, min, max, mid);
}
async function algo_weave_merge(array, canvas, min, max, mid) {
	const target = mid - min;
	for (let i = 1; i <= target; i++) {
		const a = mid + i;
		const b = min + i * 2 - 1;
		algo_util_shiftTo(array, a, b);
		await display(array, canvas, { activeIndices: [a, b] });
	}

	await algo_weave_insertion(array, canvas, min, max + 1);
}
async function algo_weave_insertion(array, canvas, start, end) {
	for (let i = start; i < end; i++) {
		await display(array, canvas, { activeIndices: [i] });

		for (let pos = i; pos > start && array[pos] < array[pos - 1]; pos--) {
			swap(array, pos, pos - 1);
			await display(array, canvas, { activeIndices: [i, pos - 1] });
		}
	}
}

async function algo_heap(array, canvas) {
	await algo_heap_heapify(array, canvas);

	for (let i = array.length - 1; i > 0; i--) {
		swap(array, 0, i);
		await display(array, canvas, {
			activeIndices: [0, i],
			activeBounds: {
				min: 0,
				max: i,
			},
		});
		await algo_heap_siftdown(array, canvas, 0, i - 1);
	}
}
async function algo_heap_heapify(array, canvas) {
	for (let i = array.length - 1; i >= 0; i--) {
		await algo_heap_siftdown(array, canvas, i, array.length - 1);
	}
}
async function algo_heap_siftdown(array, canvas, start, end) {
	let parentIndex = start;

	// "while this node has a child"
	while (algo_heap_leftChildIndex(parentIndex) <= end) {
		let indexToSwapWithParent = parentIndex; // default as no swap

		const leftChildIndex = algo_heap_leftChildIndex(parentIndex);
		const rightChildIndex = algo_heap_rightChildIndex(parentIndex);

		if (array[parentIndex] < array[leftChildIndex]) {
			indexToSwapWithParent = leftChildIndex;
		}
		if (
			rightChildIndex <= end &&
			array[indexToSwapWithParent] < array[rightChildIndex]
		) {
			indexToSwapWithParent = rightChildIndex;
		}

		if (indexToSwapWithParent === parentIndex) {
			return;
		} else {
			swap(array, parentIndex, indexToSwapWithParent);
			parentIndex = indexToSwapWithParent; // sift down next node	also

			await display(array, canvas, {
				activeIndices: [parentIndex, indexToSwapWithParent],
				activeBounds: {
					min: start,
					max: end,
				},
			});
		}
	}
}
function algo_heap_parentIndex(index) {
	return Math.floor((index - 1) / 2);
}
function algo_heap_leftChildIndex(index) {
	return 2 * index + 1;
}
function algo_heap_rightChildIndex(index) {
	return algo_heap_leftChildIndex(index) + 1;
}

// https://www.geeksforgeeks.org/binary-insertion-sort/
async function algo_insertion_binary(array, canvas) {
	for (let i = 1; i < array.length; i++) {
		const element = array[i];

		let insertIndex = Math.abs(
			await algo_insertion_binary_search(
				array,
				canvas,
				{
					activeIndices: [i],
					activeBounds: {
						min: 0,
						max: i,
					},
				},
				element,
				0,
				i - 1
			)
		);

		let j = i - 1;
		while (j >= insertIndex) {
			array[j + 1] = array[j];
			j--;
		}
		array[j + 1] = element;
	}
}
async function algo_insertion_binary_search(
	array,
	canvas,
	props,
	value,
	low,
	high
) {
	if (high <= low) {
		const ret = value > array[low] ? low + 1 : low;
		await display(array, canvas, {
			...props,
			...{ freeColors: [{ color: color_blue, min: ret, max: ret }] },
		});
		return ret;
	}

	let mid = Math.floor((low + high) / 2);
	await display(array, canvas, {
		...props,
		...{ freeColors: [{ color: color_blue, min: mid, max: mid }] },
	});

	if (value === array[mid]) {
		return mid + 1;
	}

	if (value <= array[mid]) {
		return await algo_insertion_binary_search(
			array,
			canvas,
			props,
			value,
			low,
			mid - 1
		);
	} else {
		return await algo_insertion_binary_search(
			array,
			canvas,
			props,
			value,
			mid + 1,
			high
		);
	}
}

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

		await display(array, canvas, { activeIndices: [aIndex, bIndex] });
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

	const pivotIndex = await algo_util_partition(array, canvas, min, max);

	await algo_quicksort_recursive(array, canvas, min, pivotIndex - 1);
	await algo_quicksort_recursive(array, canvas, pivotIndex + 1, max);
}

// Radix Sort(s)
async function algo_radix_lsd_base10(array, canvas) {
	await algo_radix_lsd_anyBase(array, canvas, 10);
}
async function algo_radix_lsd_base4(array, canvas) {
	await algo_radix_lsd_anyBase(array, canvas, 4);
}
async function algo_radix_lsd_base2(array, canvas) {
	await algo_radix_lsd_anyBase(array, canvas, 2);
}
async function algo_radix_lsd_anyBase(array, canvas, radix) {
	// Moved to "for" loop to show initial iteration.
	// -> Array aggregate functions cannot have await.
	// const mostDigits = array
	// 	.map((x) => algo_radix_digitCount(x - 1, radix))
	// 	.reduce((prev, curr) => Math.max(prev, curr));
	let mostDigits = 0;
	for (let i = 0; i < array.length; i++) {
		const digitCountAtIndex = algo_radix_digitCount(array[i] - 1, radix);
		mostDigits = Math.max(mostDigits, digitCountAtIndex);
		await display(array, canvas, { activeIndices: [i] });
	}

	for (let k = 0; k < mostDigits; k++) {
		const bucketInsertIndices = new Array(radix).fill(array.length - 1);

		for (let i = 0; i < array.length; i++) {
			const digit = algo_radix_getDigit(array[0] - 1, k, radix);

			algo_util_shiftTo(array, 0, bucketInsertIndices[digit]);

			for (let j = 0; j < digit; j++) {
				bucketInsertIndices[j]--;
			}

			await display(array, canvas, {
				activeIndices: [0, array.length - i, ...bucketInsertIndices],
			});
		}
	}

	await display(array, canvas);
}
function algo_radix_getDigit(num, place, radix) {
	return Math.floor(num / Math.pow(radix, place)) % radix;
}
function algo_radix_digitCount(num, radix) {
	// log_a(x) == log(x) / log(a)
	return 1 + Math.floor(Math.log(num) / Math.log(radix));
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
