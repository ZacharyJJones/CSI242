// Below link was a huge help for figuring out
// .. how to display responsively w/ canvas
// https://www.jgibson.id.au/blog/responsive-canvas/

// ========================================

const _drawSettings = {
	circleSpiralMinT: 0.33,
};

let _displaySpeedSkipCounter = 0;

const _colorPropsSchema = {
	show: true, // either true or the prop is not defined
	activeIndices: [], // red
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
	"vis-bars": {
		color: _drawArray_fillStyles_monochrome,
		props: _getLinearProps,
		func: _drawBar,
		iter: "Forward",
	},
	"vis-pyramid": {
		color: _drawArray_fillStyles_monochrome,
		props: _getLinearProps,
		func: _drawPyramid,
		iter: "Forward",
	},
	"vis-points": {
		color: _drawArray_fillStyles_monochrome,
		props: _getLinearProps,
		func: _drawPoint,
		iter: "Forward",
	},
	"vis-circle": {
		color: _drawArray_fillStyles_color,
		props: _getCircleProps,
		func: _drawCircle,
		iter: "Forward",
	},

	"vis-disp-rings": {
		color: _drawArray_fillStyles_color,
		props: _getCircleProps,
		func: _drawDisparityRings,
		iter: "Backward",
	},
	"vis-spiral": {
		color: _drawArray_fillStyles_monochrome,
		props: _getCircleProps,
		func: _drawCircleSpiral,
		iter: "Forward",
	},
	"vis-circle-slices": {
		color: _drawArray_fillStyles_color,
		props: _getCircleProps,
		func: _drawCircleSlices,
		iter: "Forward",
	},
	"vis-spiral-slices": {
		color: _drawArray_fillStyles_monochrome,
		props: _getCircleProps,
		func: _drawCircleSlicesSpiral,
		iter: "Forward",
	},
};

// hue is determined by value of item in array,
// ... not the index.
const _hslSettings = {
	// 90 & 90 == pastel
	// 90 & 50 == normal
	sat: 90,
	lum: 50,
};

// ========================================

// Callback method for displaying state at each comparison
async function display(array, canvas, colorProps) {
	if (_shouldSkipDrawing(colorProps)) {
		return;
	}

	const ctx = _initCanvasContext(canvas);
	const drawInfo = _drawInfo[settings["displayType"]];

	_drawArray(array, ctx, drawInfo, colorProps);
	if (!audioSettings["muted"]) {
		playSoundForIndices(array, colorProps, audioSettings["volume"]);
	}

	await new Promise((resolve) =>
		setTimeout(resolve, displaySettings["timeout"])
	);
}

function _drawArray(array, ctx, drawInfo, colorProps) {
	const originalFillStyle = ctx.fillStyle;

	// Setup for Draw
	const indexFillStyles = drawInfo.color(array, ctx, colorProps);
	const drawProps = drawInfo.props(array, ctx);

	// Set up Draw method
	const draw = (index) => {
		ctx.fillStyle = indexFillStyles[index];
		drawInfo.func(array, ctx, index, drawProps);
	};

	// Finish up
	if (drawInfo.iter === "Backward") {
		for (let i = array.length - 1; i > 0; i--) {
			draw(i);
		}
	} else {
		for (let i = 0; i < array.length; i++) {
			draw(i);
		}
	}

	// drawInfo.iter(array, draw);
	// drawInfo.iter(array, (i) => draw(i));
	ctx.fillStyle = originalFillStyle;
	return;
}
function _drawArray_fillStyles_monochrome(array, ctx, colorProps) {
	// Initial Fill
	const indexFillStyles = new Array(array.length).fill(ctx.fillStyle);

	// darken inactive area
	const bounds = colorProps?.activeBounds;
	if (bounds !== undefined) {
		for (let i = 0; i < bounds.min; i++) {
			indexFillStyles[i] = color_grey;
		}
		for (let i = bounds.max + 1; i < indexFillStyles.length; i++) {
			indexFillStyles[i] = color_grey;
		}
	}

	// Show free colors
	if (colorProps?.freeColors !== undefined) {
		colorProps.freeColors.forEach((item) => {
			for (let i = item.min; i <= item.max; i++) {
				indexFillStyles[i] = item.color;
			}
		});
	}

	// Show compared indices
	if (colorProps?.activeIndices !== undefined) {
		colorProps.activeIndices.forEach((x) => {
			indexFillStyles[x] = color_red;
		});
	}

	return indexFillStyles;
}
function _drawArray_fillStyles_color(array, ctx, colorProps) {
	// Initial Fill
	const indexFillStyles = new Array(array.length).fill(undefined);
	for (let i = 0; i < indexFillStyles.length; i++) {
		const hue = Math.floor(lerp(0, 360, array[i] / array.length));
		indexFillStyles[i] = hslToHex(hue, _hslSettings.sat, _hslSettings.lum);
	}

	// darken inactive area
	const bounds = colorProps?.activeBounds;
	if (bounds !== undefined) {
		const lowLum = _hslSettings.lum * 0.8;
		for (let i = 0; i < bounds.min; i++) {
			const hue = Math.floor(lerp(0, 360, array[i] / array.length));
			indexFillStyles[i] = hslToHex(hue, _hslSettings.sat, lowLum);
		}
		for (let i = bounds.max + 1; i < indexFillStyles.length; i++) {
			const hue = Math.floor(lerp(0, 360, array[i] / array.length));
			indexFillStyles[i] = hslToHex(hue, _hslSettings.sat, lowLum);
		}
	}

	// Show free colors
	if (colorProps?.freeColors !== undefined) {
		colorProps.freeColors.forEach((freeColor, i) => {
			for (let i = freeColor.min; i <= freeColor.max; i++) {
				indexFillStyles[i] = "#FFF";
			}
		});
	}

	// Show active indices
	if (colorProps?.activeIndices !== undefined) {
		colorProps.activeIndices.forEach((x) => {
			indexFillStyles[x] = "#FFF";
		});
	}

	return indexFillStyles;
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

// Circle Points
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

	// ctx.fillRect(x - drawSizeHalf, y - drawSizeHalf, drawSize, drawSize);
	_ctxDrawCircle(ctx, x, y, drawSizeHalf);
}

// Circle Slices
function _drawCircleSlices(
	array,
	ctx,
	index,
	{ circleCenter, circleSize, drawSize, drawSizeHalf }
) {
	const currBase = getCircleCoords(index / array.length);
	const { x: currX, y: currY } = addCoords(
		circleCenter,
		multCoords(circleSize, currBase)
	);

	const nextBase = getCircleCoords((index + 1) / array.length);
	const { x: nextX, y: nextY } = addCoords(
		circleCenter,
		multCoords(circleSize, nextBase)
	);

	// need 3 coords to make a triangle.
	ctx.beginPath();
	ctx.moveTo(circleCenter.x, circleCenter.y);
	ctx.lineTo(currX, currY);
	ctx.lineTo(nextX, nextY);
	ctx.closePath();
	ctx.fill();
}

// Circle Spiral Points
function _drawCircleSpiral(
	array,
	ctx,
	index,
	{ circleCenter, circleSize, drawSize, drawSizeHalf }
) {
	const t = lerp(
		_drawSettings["circleSpiralMinT"],
		1,
		array[index] / array.length
	);

	const curr = getCircleCoords(index / array.length);
	const currT = multCoords(curr, { x: t, y: t });
	const { x, y } = addCoords(circleCenter, multCoords(circleSize, currT));

	// ctx.fillRect(x - drawSizeHalf, y - drawSizeHalf, drawSize, drawSize);
	_ctxDrawCircle(ctx, x, y, drawSizeHalf);
}

// Circle Spiral Slices
function _drawCircleSlicesSpiral(
	array,
	ctx,
	index,
	{ circleCenter, circleSize }
) {
	const t = lerp(
		_drawSettings["circleSpiralMinT"],
		1,
		array[index] / array.length
	);

	const curr = getCircleCoords(index / array.length);
	const currT = multCoords(curr, { x: t, y: t });
	const { x: currX, y: currY } = addCoords(
		circleCenter,
		multCoords(circleSize, currT)
	);

	const next = getCircleCoords((index + 1) / array.length);
	const nextT = multCoords(next, { x: t, y: t });
	const { x: nextX, y: nextY } = addCoords(
		circleCenter,
		multCoords(circleSize, nextT)
	);

	// need 3 coords to make a triangle.
	ctx.beginPath();
	ctx.moveTo(circleCenter.x, circleCenter.y);
	ctx.lineTo(currX, currY);
	ctx.lineTo(nextX, nextY);
	ctx.closePath();
	ctx.fill();
}

function _drawDisparityRings(array, ctx, index, { circleCenter, circleSize }) {
	const circleRadiusT_valueAtIndex = (array[index] + 1) / array.length;

	const indexDiff = Math.abs(index - array[index] - 1) / array.length;
	const circleRadiusT_indexDiffScalar = 1.0 - indexDiff;
	// const circleRadiusT_indexDiffScalar = getCircleIndexDiffScalar(array, index);

	const circleYOffset = lerp(0, circleSize.y, index / array.length);
	const circleRadius =
		circleSize.y *
		circleRadiusT_valueAtIndex *
		circleRadiusT_indexDiffScalar *
		circleRadiusT_indexDiffScalar;

	// Huge hack here just to get it
	// .... to show as rings instead of full circles.
	// -> Draw functions should not be altering context
	// ... properties while drawing
	const prevstrokeStyle = ctx.strokeStyle;
	ctx.strokeStyle = ctx.fillStyle;
	_ctxDrawCircleOutline(
		ctx,
		circleCenter.x,
		circleCenter.y + circleYOffset - circleRadius,
		circleRadius
	);
	ctx.strokeStyle = prevstrokeStyle;
}

// ===========
// == Utils ==
// ===========

function _initCanvasContext(canvas) {
	// Responsive Resize
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientWidth / 2;

	// Context props
	let context = canvas.getContext("2d");
	context.fillStyle = "#FFF";
	context.translate(0, canvas.height);
	context.scale(1, -1);
	context.clearRect(0, 0, canvas.width, canvas.height);

	return context;
}

function _shouldSkipDrawing(colorProps) {
	if (colorProps?.show === true) {
		return false;
	}

	_displaySpeedSkipCounter++;
	if (_displaySpeedSkipCounter % displaySettings["speed"] !== 0) {
		return true;
	} else {
		_displaySpeedSkipCounter = 0;
		return false;
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

function _ctxDrawCircle(ctx, x, y, radius) {
	ctx.beginPath();
	ctx.ellipse(x, y, radius, radius, 0, 0, TWO_PI);
	ctx.fill();
}

function _ctxDrawCircleOutline(ctx, x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, TWO_PI);
	ctx.stroke();
}
