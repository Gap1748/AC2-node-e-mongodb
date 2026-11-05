const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const projetoRoutes = require('./routes/projetoRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Conexão com o MongoDB utilizando a variável de ambiente (.env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.use('/projetos', projetoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});