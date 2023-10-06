const express = require("express");
const {intermediarioListagem, senhaConta, senhaContaQuery} = require("./intermediarios");
const contas = require("./controladores/controladorcontas");
const transacoes = require("./controladores/controladortransacoes");

const rotas = express();

rotas.get("/contas", intermediarioListagem, contas.listarContas);
rotas.post("/contas", contas.criarConta);
rotas.put("/contas/:numeroConta/usuario", contas.atualizarConta);
rotas.delete("/contas/:numeroConta", contas.excluirConta);
rotas.get("/contas/saldo", senhaContaQuery, contas.verificarSaldo);
rotas.get("/contas/extrato", senhaContaQuery, contas.tirarExtrato);

rotas.post("/transacoes/depositar", transacoes.depositar);
rotas.post("/transacoes/sacar",senhaConta, transacoes.sacar);
rotas.post("/transacoes/transferir", senhaConta, transacoes.transferir);

module.exports = rotas;