const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  nome: { type: String, required: true },
  responsavel: { type: String, required: true }
});

const projetoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  tarefas: [tarefaSchema]
}, { versionKey: false });

const Projeto = mongoose.model('Projeto', projetoSchema, 'projetos');

module.exports = Projeto;