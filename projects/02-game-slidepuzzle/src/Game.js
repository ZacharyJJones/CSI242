import React from "react";
import "./Game.css";

function setImageToUploaded(event) {
	console.log("event method called!");
	let imageOutputTag = document.getElementById("imageDisplay");
	imageOutputTag.src = URL.createObjectURL(event.target.files[0]);

	sliceImage(imageOutputTag, 3, 3);
}

// https://stackoverflow.com/questions/8912917/cutting-an-image-into-pieces-through-javascript
function sliceImage(image, numColumns, numRows) {
	console.log("Piece Width: " + image.width, "Piece Height: " + image.height);

	const pieceWidth = Math.floor(image.width / numColumns);
	const pieceHeight = Math.floor(image.height / numRows);

	console.log("Piece Width: " + pieceWidth, "Piece Height: " + pieceHeight);

	var slices = [];
	for (let col = 0; col < numColumns; col++) {
		for (let row = 0; row < numRows; row++) {
			let canvas = document.createElement("canvas");
			canvas.width = pieceWidth;
			canvas.height = pieceHeight;
			var canvasContext = canvas.getContext("2d");

			console.log(
				image,
				col * pieceWidth,
				row * pieceHeight,
				pieceWidth,
				pieceHeight
			);
			canvasContext.drawImage(
				image,
				col * pieceWidth,
				row * pieceHeight,
				pieceWidth,
				pieceHeight
			);
			/*
			canvasContext.drawImage(
				image,
				col * pieceWidth, // sx -- x coord for reference point to start drawing from
				row * pieceHeight, // sy -- y coord for reference point to start drawing from
				pieceWidth, // sWidth -- width of image to draw
				pieceHeight, // sHeight -- height of image to draw
				0, // dx -- custom reference point (instead of top left of canvas)
				0, // dy -- custom reference point (instead of top left of canvas)
				canvas.width, // dw -- allows for scaling of width
				canvas.height // dh -- allows for scaling of height
			);
			*/
			const dataUrl = canvas.toDataURL();
			console.log(dataUrl);
			slices.push(dataUrl);
		}
	}

	const divRoot = document.getElementById("set");
	slices.forEach((imgSrcUrl) => {
		let img = new Image();
		img.src = imgSrcUrl;
		divRoot.appendChild(img);
	});
}

function Game() {
	return (
		<div className="bg" id="set">
			<div className="flex-center">
				<input
					type="file"
					accept="image/*"
					id="imageUpload"
					onChange={setImageToUploaded}
				></input>
			</div>
			<div className="flex-center">
				<img id="imageDisplay" width="80%" alt="Your Upload" />
			</div>
			<div className="flex-center"></div>
			<div className="flex-center"></div>
			<br></br>
		</div>
	);
}

export default Game;
