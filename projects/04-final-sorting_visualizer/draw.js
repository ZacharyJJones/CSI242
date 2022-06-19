// Callback method for displaying state at each comparison
async function display(array, ctx, props) {
	// props.activeBounds.min/max
	// props.compareIndex (stays put)
	// props.searchIndex (moves around)
	// props.freeColors[] (array)
	/* {
		color: hex_code
		min: int
		max: int
	} */

	_drawArray(array, ctx, props);
	await new Promise((resolve) => setTimeout(resolve, timeout));
}

function _drawArray(array, ctx, props) {
	// Basic White Rects
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	array.forEach((x, i) => {
		_drawRectangle(array, ctx, i);
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
					_drawRectangle(array, ctx, i);
				}
			});
		}

		// Show compared indices
		ctx.fillStyle = color_red;
		if (props.compareIndex !== undefined)
			_drawRectangle(array, ctx, props.compareIndex);
		if (props.searchIndex !== undefined)
			_drawRectangle(array, ctx, props.searchIndex);

		// Show free colors
		if (props.freeColors !== undefined) {
			props.freeColors.forEach((item) => {
				ctx.fillStyle = item.color;
				for (let j = item.min; j <= item.max; j++) {
					_drawRectangle(array, ctx, j);
				}
			});
		}

		// return to default
		ctx.fillStyle = originalFillStyle;
	}
}

function _drawRectangle(array, ctx, index) {
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

function _initCanvasAndContext(canvasID, ctx, width, height) {
	let canvas = document.getElementById(canvasID);
	canvas.setAttribute("width", `${width}px`);
	canvas.setAttribute("height", `${height}px`);

	// Setting up color and ref point
	let context = canvas.getContext(ctx);
	context.fillStyle = "#FFF";
	context.translate(0, canvas.height);
	context.scale(1, -1);

	return {
		canvas: canvas,
		ctx: context,
		width: width,
		height: height,
	};
}
