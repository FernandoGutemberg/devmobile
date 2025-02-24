var express = require('express');
var router = express.Router();
const cors = require("cors");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

console.log("Olhá, o Back-End está rodando viu!");

//Os schema aqui
const PlantacaoModel = require("./models/plantacaoSchema"); // Importa o modelo

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
router.post("/salvar-plantacao", async (req, res) => {
  try {
    const { planta, status, latitude, longitude } = req.body;

    if (!planta || !status || !latitude || !longitude) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    const novaPlantacao = new PlantacaoModel({ planta, status, latitude, longitude });
    await novaPlantacao.save();

    res.status(200).json({ mensagem: "Plantação salva com sucesso!", novaPlantacao });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
// ----------------------------------------------------------------------->  
// AQUI EU TENHO O READ - (R) - GET

// router.get("/salvar-plantacao", async (req, res) => {
//   try {
//     const { planta, status, latitude, longitude } = req.body;

//     if (!planta || !status || !latitude || !longitude) {
//       return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
//     }

//     const novaPlantacao = new PlantacaoModel({ planta, status, latitude, longitude });
//     await novaPlantacao.save();

//     res.status(200).json({ mensagem: "Plantação salva com sucesso!", novaPlantacao });
//   } catch (error) {
//     res.status(500).json({ erro: error.message });
//   }
// });


// ----------------------------------------------------------------------->  
// AQUI EU TENHO O UPDATE - (U) - PATCH

router.patch("/editar-plantacao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { planta, status, latitude, longitude } = req.body;

    const plantacao = await Plantacao.findById(id);
    if (!plantacao) {
      return res.status(404).json({ erro: "Plantação não encontrada" });
    }

    // Atualiza os campos
    plantacao.planta = planta || plantacao.planta;
    plantacao.status = status || plantacao.status;
    plantacao.latitude = latitude || plantacao.latitude;
    plantacao.longitude = longitude || plantacao.longitude;
    plantacao.updatedAt = new Date(); // Atualiza a data de edição

    await plantacao.save();

    res.json({ mensagem: "Plantação atualizada com sucesso!", plantacao });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


// ----------------------------------------------------------------------->  
// AQUI EU TENHO O DELETE - (D) - DELETE

// Esta rota lida com requisições HTTP DELETE e é usada para excluir um usuário específico do banco de dados, baseado em seu ID.

// router.delete('/excluir-plantacao/:id', async (req, res) => {
//   try {
//     let PlantacaoModel = mongoose.model("Plantacao", plantacaoSchema);
    

//     const deletePlantacao = await PlantacaoModel.findByIdAndDelete(req.params.id);

//     res.json(deletePlantacao);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });





module.exports = router;
