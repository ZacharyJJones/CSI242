async function algo_randomize(array, ctx) {
	for (let i = 0; i < array.length; i++) {
		const swapIndex = i + Math.floor(Math.random() * (array.length - i));
		const displayProps = {
			compareIndex: i,
			searchIndex: swapIndex,
			activeBounds: {
				min: i,
				max: array.length - 1,
			},
		};

		await displayFunc(array, ctx, displayProps);

		// Swap
		const a = array[i];
		array[i] = array[swapIndex];
		array[swapIndex] = a;

		await displayFunc(array, ctx, displayProps);
	}
	await displayFunc(array, ctx);
}

async function algo_gnome(array, ctx) {
	let i = 0;
	let props = {
		compareIndex: i,
	};

	while (i < array.length) {
		if (i == 0 || array[i] >= array[i - 1]) {
			i++;
		} else {
			const a = array[i];
			array[i] = array[i - 1];
			array[i - 1] = a;
			i--;
		}
		props.compareIndex = i;
		await displayFunc(array, ctx, props);
	}
	await displayFunc(array, ctx);
}

// Joke Sorts

// Bogo Sort - Check if array is in order. If it is not, randomize the entire array (and check again, etc). O(n!^n)
// Bozo Sort - Check if array is in order. If it is not, swap two random elements. O(n!)
// Stooge Sort - ... O(n^(log(3) - log(1.5)))

// --- Sorts which do not actually function, despite being hilarious
// Assumption Sort - Assume the list is sorted!

// Miracle Sort - Check if array is sorted. If not, wait a while and check again. Eventually, alpha particles flipping bits in the memory chips should result in a successful sort. Average time complexity == O(✝)

// Stalin Sort - Go through array, eliminating elements which are not in order. You are left with an ordered list.

// Quantum Bogo Sort - Mainly a hypothetical sort. Randomize the list. If the list is NOT sorted, then destroy the universe. O(1), assuming the Alternate Histories theory is accurate.
// - Source: https://medium.com/@dylan.finn/the-worst-and-most-entertaining-sorting-algorithms-96efc9025f7

// Bogobogo Sort:
// - Source: https://www.dangermouse.net/esoteric/bogobogosort.html
