// Below link was a huge help for figuring out
// .. how to display responsively w/ canvas
// https://www.jgibson.id.au/blog/responsive-canvas/

// ========================================

let _displaySpeedSkipCounter = 0;

const _drawPropsSchema = {
	active1: 0, // red
	active2: 23, // red
	activeBounds: {
		min: 0,
		max: 99,
	},
	freeColors: [
		{ color: "#FFF", min: 10, max: 20 },
		{ color: "#A6B3F0", min: 99, max: 99 },
	],
};

const _drawInfo = {
	Bars: {
		type: "linear",
		func: _drawBar,
	},
	Pyramid: {
		type: "linear",
		func: _drawPyramid,
	},
	Points: {
		type: "linear",
		func: _drawPoint,
	},
	Circle: {
		type: "circle",
		func: _drawCircle,
	},
	"Circle-Slices": {
		type: "circle",
		func: _drawCircleSlices,
	},
};

const _propsMethods = {
	linear: _getLinearProps,
	circle: _getCircleProps,
};

// ========================================

// Callback method for displaying state at each comparison
async function display(array, canvas, colorProps) {
	if (_isSkip(colorProps)) {
		return;
	}

	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientWidth / 2;
	let context = canvas.getContext("2d");
	context.fillStyle = "#FFF";
	context.translate(0, canvas.height);
	context.scale(1, -1);
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Set up for draw
	const drawInfo = _drawInfo[settings["displayType"]];
	const drawMethod = drawInfo.func;
	const drawProps = _propsMethods[drawInfo.type](array, context);

	_drawArray(array, context, drawMethod, drawProps, colorProps);
	await new Promise((resolve) =>
		setTimeout(resolve, settings["displayTimeout"])
	);
}

function _drawArray(array, ctx, drawMethod, drawProps, colorProps) {
	const draw = (index) => {
		drawMethod(array, ctx, index, drawProps);
	};

	array.forEach((x, i) => {
		draw(i);
	});

	// if no props, base draw ONLY
	if (colorProps === undefined) {
		return;
	}

	const originalFillStyle = ctx.fillStyle;

	// darken inactive area
	const bounds = colorProps.activeBounds;
	if (bounds !== undefined) {
		ctx.fillStyle = color_grey;
		array.forEach((a, i) => {
			if (!isInBounds(i, bounds)) {
				draw(i);
			}
		});
	}

	// Show compared indices
	ctx.fillStyle = color_red;
	if (colorProps.active1 !== undefined) draw(colorProps.active1);
	if (colorProps.active2 !== undefined) draw(colorProps.active2);

	// Show free colors
	if (colorProps.freeColors !== undefined) {
		colorProps.freeColors.forEach((item) => {
			ctx.fillStyle = item.color;
			for (let i = item.min; i <= item.max; i++) {
				draw(i);
			}
		});
	}

	// return to default
	ctx.fillStyle = originalFillStyle;
}

// ===================
// Array Value Drawing
// ===================

// Bar Graph
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

// Horizontal Pyramid
function _drawPyramid(
	array,
	ctx,
	index,
	{ evenWidth, evenHeight, smallArrayBorderAdjust }
) {
	const height = array[index] * evenHeight;
	const halfEmptyHeight = (array.length * evenHeight - height) / 2;
	ctx.fillRect(
		evenWidth * index,
		halfEmptyHeight,
		evenWidth - smallArrayBorderAdjust,
		height
	);
}

// Scatter Plot
function _drawPoint(array, ctx, index, { evenWidth, evenHeight }) {
	ctx.fillRect(
		evenWidth * index,
		evenHeight * (array[index] - 1),
		Math.max(1, evenWidth),
		Math.max(1, evenHeight)
	);
}

// Circle (Points)
function _drawCircle(
	array,
	ctx,
	index,
	{ circleCenter, circleSize, drawSize, drawSizeHalf }
) {
	const t = getCircleIndexDiffScalar(array, index);

	const curr = getCircleCoords(index / array.length);
	const currT = multCoords(curr, { x: t, y: t });
	const { x, y } = addCoords(circleCenter, multCoords(circleSize, currT));

	ctx.fillRect(x - drawSizeHalf, y - drawSizeHalf, drawSize, drawSize);
}

// Circle (Slices)
function _drawCircleSlices(
	array,
	ctx,
	index,
	{ circleCenter, circleSize, drawSize, drawSizeHalf }
) {
	const curr = getCircleCoords(i / array.length);
	const next = getCircleCoords((i + 1) / array.length);

	const t = index / array.length;
	// need 3 coords to make a triangle.
}

// ===========
// == Utils ==
// ===========

function _isSkip(props) {
	if (props !== undefined && props.show === undefined) {
		_displaySpeedSkipCounter++;
		if (_displaySpeedSkipCounter % settings["displaySpeed"] !== 0) {
			return true;
		} else {
			_displaySpeedSkipCounter = 0;
			return false;
		}
	}
}

function _getLinearProps(array, ctx) {
	const canvasHalfWidth = ctx.canvas.width / 2;

	return {
		evenWidth: ctx.canvas.width / array.length,
		evenHeight: ctx.canvas.height / array.length,
		smallArrayBorderAdjust: array.length < canvasHalfWidth ? 1 : 0,
	};
}

function _getCircleProps(array, ctx) {
	const circleCenter = {
		x: ctx.canvas.width / 2,
		// x: ctx.canvas.height / 2,
		y: ctx.canvas.height / 2,
	};

	const circleSize = multCoords(circleCenter, {
		x: 0.95,
		y: 0.95,
	});
	circleSize.x = circleSize.y;

	const drawSize = clampNum(
		(5 * circleSize.y) / array.length,
		1,
		circleSize.y / 15
	);

	return {
		circleCenter: circleCenter,
		circleSize: circleSize,
		drawSize: drawSize,
		drawSizeHalf: drawSize / 2,
	};
}
