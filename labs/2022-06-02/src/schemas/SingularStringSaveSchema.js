const mongoose = require("mongoose");

const SingularStringSchema = new mongoose.Schema({
	test: {
		type: String,
		required: false,
	},
});

const StringSaveModel = mongoose.model("StringSave", SingularStringSchema);

module.exports = StringSaveModel;
