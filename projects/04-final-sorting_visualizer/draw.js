// Below link was a huge help for figuring out how size the canvas
// ... responsively and avoid blurring
// https://www.jgibson.id.au/blog/responsive-canvas/

// ========================================

function _canvasDimensions(canvas) {}

// ========================================

// Callback method for displaying state at each comparison
async function display(array, canvas, props) {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientWidth / 2;

	let context = canvas.getContext("2d");
	context.fillStyle = "#FFF";
	context.translate(0, canvas.height);
	context.scale(1, -1);

	/*
		Available Props documenting here
		props.activeBounds.min/max
		props.compareIndex (stays put)
		props.searchIndex (moves around)
		props.freeColors[] (array)
		{
			color: hex_code
			min: int
			max: int
		}
	*/

	let drawMethod = undefined;
	const displayType = settings["displayType"];
	if (displayType === "_Points") {
		//
	} else {
		drawMethod = _drawBar;
	}

	_drawArray(array, context, drawMethod, props);
	await new Promise((resolve) => setTimeout(resolve, timeout));
}

function _drawArray(array, ctx, drawMethod, props) {
	// Basic White Rects
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	array.forEach((x, i) => {
		drawMethod(array, ctx, i);
	});

	// If props are given, use them!
	if (props !== undefined) {
		// remember original color
		const originalFillStyle = ctx.fillStyle;

		// Show "Active" area
		ctx.fillStyle = color_grey;
		if (props.activeBounds !== undefined) {
			array.forEach((x, i) => {
				if (i < props.activeBounds.min || props.activeBounds.max < i) {
					drawMethod(array, ctx, i);
				}
			});
		}

		// Show compared indices
		ctx.fillStyle = color_red;
		if (props.compareIndex !== undefined)
			drawMethod(array, ctx, props.compareIndex);
		if (props.searchIndex !== undefined)
			drawMethod(array, ctx, props.searchIndex);

		// Show free colors
		if (props.freeColors !== undefined) {
			props.freeColors.forEach((item) => {
				ctx.fillStyle = item.color;
				for (let i = item.min; i <= item.max; i++) {
					drawMethod(array, ctx, i);
				}
			});
		}

		// return to default
		ctx.fillStyle = originalFillStyle;
	}
}

function _drawBar(array, ctx, index) {
	const rectWidth = ctx.canvas.width / array.length;
	const rectHeight = (ctx.canvas.height / array.length) * array[index];

	const canvasHalfWidth = ctx.canvas.width / 2;
	const smallArrayBorderAdjust = array.length < canvasHalfWidth ? 1 : 0;

	ctx.fillRect(
		rectWidth * index,
		0,
		rectWidth - smallArrayBorderAdjust,
		rectHeight - smallArrayBorderAdjust
	);
}
