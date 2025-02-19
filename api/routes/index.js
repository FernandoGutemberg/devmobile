var express = require('express');
var router = express.Router();
const cors = require("cors");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

console.log("Olhá, o Back-End está rodando viu!");

//Os schema aqui
const LocalModel = require("./models/locaisSchema"); // Importa o modelo

// ----------------------------------------------------------------------->  

mongoose.connect('mongodb://localhost:27017/meu_bancomongodb',)
.then(() => console.log('✅ Conectado ao MongoDB local'))
.catch(err => console.error('❌ Erro ao conectar ao MongoDB local:', err));


// ----------------------------------------------------------------------->  
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
// ----------------------------------------------------------------------->  

// AQUI EU TENHO O CREATE - C - POST
router.post("/salvar-localizacao", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ erro: "Latitude e Longitude são obrigatórios" });
    }

    const local = new LocalModel({ latitude, longitude });
    await local.save();

    res.json({ mensagem: "Localização salva com sucesso!", local });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
// ----------------------------------------------------------------------->  
// AQUI EU TENHO O READ - (R) - GET



// ----------------------------------------------------------------------->  
// AQUI EU TENHO O UPDATE - (U) - PATCH


// ----------------------------------------------------------------------->  
// AQUI EU TENHO O DELETE - (D) - DELETE



// ----------------------------------------------------------------------->  



// ----------------------------------------------------------------------->  




//faça uma rota do tipo post que recebe os dados de latitude e longitude do React




module.exports = router;
