const express = require('express');
const projetoController = require('../controllers/projetoController');

const router = express.Router();

router.get('/', projetoController.listarProjetos);
router.get('/:codigo/resumo', projetoController.obterResumo); 
router.get('/:codigo/tarefas', projetoController.listarTarefasDoProjeto);
router.get('/:codigo', projetoController.buscarPorCodigo);

router.post('/', projetoController.cadastrarProjeto);
router.post('/:codigo/tarefas', projetoController.adicionarTarefa);

router.put('/:codigo', projetoController.atualizarProjeto);
router.put('/:codigo/tarefas/:codigoTarefa', projetoController.atualizarTarefa);

router.delete('/:codigo', projetoController.excluirProjeto);
router.delete('/:codigo/tarefas/:codigoTarefa', projetoController.removerTarefa);

module.exports = router;