var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

console.log("Olhá, o Back-End está rodando viu!");

//Os schema aqui
const LocalModel = require("./models/locaisSchema"); // Importa o modelo

mongoose.connect('mongodb+srv://fernando_projeto_x:FeksECxj2200hQ5v@cluster.w0jlt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster')
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB', err);
  });
 
  
  router.post("/salvar-localizacao", async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
  
      if (!latitude || !longitude) {
        return res.status(400).json({ erro: "Latitude e Longitude são obrigatórios" });
      }
  
      const local = new LocalModel({ latitude, longitude });
      console.log(local);
  
      await local.save();
  
      res.json({ mensagem: "Localização salva com sucesso!", local: novoLocal });
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  });
  
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//faça uma rota do tipo post que recebe os dados de latitude e longitude do React




module.exports = router;
