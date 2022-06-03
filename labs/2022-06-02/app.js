// Main pieces:
// -- Node
// -- express
// -- mongodb (interacted with via mongoose)

// ================================

const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const SingularStringSave = require("./src/schemas/SingularStringSaveSchema");

const wwwroot = __dirname + "\\wwwroot\\";
const databaseURI = "mongodb://localhost:27017";

const hostname = "127.0.0.1";
const port = 3000;

mongoose.connect(databaseURI + "/newDatabase");

// ================================

// for parsing body of requests
app.use(express.json());

app.get("/test", (req, res) => {
	res.sendFile(wwwroot + "index.html");
});

app.post("/test", (req, res) => {
	let newData = {
		test: req.body.textField,
	};

	let newSaveModelData = SingularStringSave(newData);

	let entryID = newSaveModelData._id.toString();
	console.log(entryID);

	newSaveModelData.save().then(() => {
		SingularStringSave.findById(entryID, (error, data) => {
			console.log(`Found data with id ${entryID}, data: ${data}`);
			let json = JSON.stringify(data);
			console.log(json);
			res.send(json);
		});
	});
});

const server = http.createServer(app);
server.listen(port);
