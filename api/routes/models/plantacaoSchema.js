const mongoose = require("mongoose");

const plantacaoSchema = new mongoose.Schema({
  planta: { type: String, required: true },       // Nome da planta
  status: { type: String, required: true },       // Status da plantação
  latitude: { type: String, required: true },     // Latitude
  longitude: { type: String, required: true },    // Longitude
  createdAt: { type: Date, default: Date.now },   // Data de criação automática
  updatedAt: { type: Date }                       // Data de atualização
});

const PlantacaoModel = mongoose.model("Plantacao", plantacaoSchema);

module.exports = PlantacaoModel;
