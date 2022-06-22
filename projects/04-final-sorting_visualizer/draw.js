// Below link was a huge help for figuring out
// .. how to display responsively w/ canvas
// https://www.jgibson.id.au/blog/responsive-canvas/

// ========================================

let _displaySpeedSkipCounter = 0;

// ========================================

// Callback method for displaying state at each comparison
async function display(array, canvas, props) {
	if (props !== undefined && props.show === undefined) {
		_displaySpeedSkipCounter++;
		if (_displaySpeedSkipCounter % settings["displaySpeed"] !== 0) {
			return;
		} else {
			_displaySpeedSkipCounter = 0;
		}
	}

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

	let drawMethod;
	const displayType = settings["displayType"];
	if (displayType === "Points") {
		drawMethod = _drawPoint;
	} else {
		drawMethod = _drawBar;
	}

	_drawArray(array, context, drawMethod, props);
	await new Promise((resolve) =>
		setTimeout(resolve, settings["displayTimeout"])
	);
}

function _drawArray(array, ctx, drawMethod, props) {
	// one-time computation of properties important for drawing

	const canvasHalfWidth = ctx.canvas.width / 2;
	const drawProps = {
		evenWidth: ctx.canvas.width / array.length,
		evenHeight: ctx.canvas.height / array.length,
		smallArrayBorderAdjust: array.length < canvasHalfWidth ? 1 : 0,
	};

	draw = (a) => {
		drawMethod(array, ctx, a, drawProps);
	};

	/**
	 *
	 *
	 */

	// Basic White Rects
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	array.forEach((x, i) => {
		draw(i);
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
					draw(i);
				}
			});
		}

		// Show compared indices
		ctx.fillStyle = color_red;
		if (props.compareIndex !== undefined) draw(props.compareIndex);
		if (props.searchIndex !== undefined) draw(props.searchIndex);

		// Show free colors
		if (props.freeColors !== undefined) {
			props.freeColors.forEach((item) => {
				ctx.fillStyle = item.color;
				for (let i = item.min; i <= item.max; i++) {
					draw(i);
				}
			});
		}

		// return to default
		ctx.fillStyle = originalFillStyle;
	}
}

function _drawBar(
	array,
	ctx,
	index,
	{ evenWidth, evenHeight, smallArrayBorderAdjust }
) {
	ctx.fillRect(
		evenWidth * index,
		0,
		evenWidth - smallArrayBorderAdjust,
		evenHeight * array[index] - smallArrayBorderAdjust
	);
}

function _drawPoint(array, ctx, index, { evenWidth, evenHeight }) {
	ctx.fillRect(
		evenWidth * index,
		evenHeight * (array[index] - 1),
		Math.max(1, evenWidth),
		Math.max(1, evenHeight)
	);
}
