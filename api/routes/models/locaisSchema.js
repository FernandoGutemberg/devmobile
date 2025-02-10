const mongoose = require("mongoose");

const locaisSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  capturedAt: { type: Date, default: Date.now }, // Salva a data/hora automática
});

const LocalModel = mongoose.model("Locais", locaisSchema);

module.exports = LocalModel;
