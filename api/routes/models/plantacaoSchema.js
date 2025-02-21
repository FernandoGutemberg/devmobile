const mongoose = require("mongoose");

const plantacaoSchema = new mongoose.Schema({
  planta: { type: String, required: true }, // Nome da planta
  status: { type: String, required: true }, // Status da plantação
  createdAt: { type: Date, default: Date.now }, // Data de criação automática
  // criar um data de atualização Date toda vez que edita, só será salvo se for edição
  latitude: { type: String, required: true }, // Coordenada geográfica
  longitude: { type: String, required: true }, // Coordenada geográfica
});

const PlantacaoModel = mongoose.model("Plantacao", plantacaoSchema);

module.exports = PlantacaoModel;


