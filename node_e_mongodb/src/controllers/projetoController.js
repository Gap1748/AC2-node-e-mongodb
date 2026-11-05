const Projeto = require('../models/Projeto');

// 1. GET /projetos (Com filtros por nome e por tarefa)
exports.listarProjetos = async (req, res) => {
  try {
    const { nome, tarefa } = req.query;
    let filtro = {};

    if (nome) {
      filtro.nome = { $regex: nome, $options: 'i' };
    }

    if (tarefa) {
      filtro['tarefas.codigo'] = tarefa;
    }

    const projetos = await Projeto.find(filtro);
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};


// 2. GET /projetos/:codigo
exports.buscarPorCodigo = async (req, res) => {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (projeto) {
      res.json(projeto);
    } else {
      res.status(404).json({ erro: "Projeto não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// 3. GET /projetos/:codigo/tarefas
exports.listarTarefasDoProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (projeto) {
      res.json(projeto.tarefas);
    } else {
      res.status(404).json({ erro: "Projeto não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }

};


// 4. POST /projetos
exports.cadastrarProjeto = async (req, res) => {
  try {
    const { codigo, nome, tarefas } = req.body;

    if (!codigo || !nome) {
      return res.status(400).json({ erro: "Código e nome são obrigatórios" });
    }

    const existe = await Projeto.findOne({ codigo });
    if (existe) {
      return res.status(409).json({ erro: "Projeto duplicado" });
    }

    const novoProjeto = await Projeto.create({ codigo, nome, tarefas: tarefas || [] });
    res.status(201).json(novoProjeto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// 5. PUT /projetos/:codigo
exports.atualizarProjeto = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: "Nome obrigatório" });
    }

    const projeto = await Projeto.findOneAndUpdate(
      { codigo: req.params.codigo },
      { nome },
      { new: true }
    );

    if (projeto) {
      res.json(projeto);
    } else {
      res.status(404).json({ erro: "Projeto não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};


// 6. DELETE /projetos/:codigo
exports.excluirProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findOneAndDelete({ codigo: req.params.codigo });
    if (projeto) {
      res.status(204).send();
    } else {
      res.status(404).json({ erro: "Projeto não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// 7. POST /projetos/:codigo/tarefas
exports.adicionarTarefa = async (req, res) => {
  try {
    const { codigo, nome, responsavel } = req.body;

    if (!codigo || !nome || !responsavel) {
      return res.status(400).json({ erro: "Código, nome e responsável são obrigatórios" });
    }

    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    const tarefaExiste = projeto.tarefas.some(t => t.codigo === codigo);
    if (tarefaExiste) {
      return res.status(409).json({ erro: "Tarefa duplicada" });
    }

    projeto.tarefas.push({ codigo, nome, responsavel });
    await projeto.save();
    res.status(201).json(projeto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};


// 8. PUT /projetos/:codigo/tarefas/:codigoTarefa
exports.atualizarTarefa = async (req, res) => {
  try {
    const { nome, responsavel } = req.body;
    const { codigo, codigoTarefa } = req.params;

    const projeto = await Projeto.findOne({ codigo });
    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    const tarefa = projeto.tarefas.find(t => t.codigo === codigoTarefa);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    if (nome) tarefa.nome = nome;
    if (responsavel) tarefa.responsavel = responsavel;

    await projeto.save();
    res.json(projeto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};


// 9. DELETE /projetos/:codigo/tarefas/:codigoTarefa
exports.removerTarefa = async (req, res) => {
  try {
    const { codigo, codigoTarefa } = req.params;

    const projeto = await Projeto.findOne({ codigo });
    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    const tamanhoInicial = projeto.tarefas.length;
    projeto.tarefas = projeto.tarefas.filter(t => t.codigo !== codigoTarefa);

    if (projeto.tarefas.length === tamanhoInicial) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    await projeto.save();
    res.json(projeto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};


// 10. GET /projetos/:codigo/resumo
exports.obterResumo = async (req, res) => {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    const totalTarefas = projeto.tarefas.length;
    const responsaveis = [...new Set(projeto.tarefas.map(t => t.responsavel))];

    res.json({
      codigo: projeto.codigo,
      nome: projeto.nome,
      totalTarefas,
      responsaveis
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};