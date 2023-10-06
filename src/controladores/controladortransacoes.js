const mt = require("./metodostransacoes");
const mc = require("./metodoscontas");

const depositar = (req, res) => {
    const entradaBody = req.body;
    const {numero_conta, valor} = entradaBody;

    if(!mt.temTodos2(entradaBody)){
        return res.status(400).json({"mensagem": "O número da conta e o valor são obrigatórios!"})
    };

    if(isNaN(numero_conta) || isNaN(valor) ||  numero_conta <= 0 || valor <= 0){
        return res.status(400).json({"mensagem": "O numero da conta e valor precisam ser positivos e sem letras"});
    };

    if(!mc.pegarConta(numero_conta)){
        return res.status(404).json({"mensagem": "Conta não encontrada"})
    };

    mt.depositarValor(entradaBody);

    return res.status(204).json();
};

const sacar = (req, res) => {
    const entradaBody = req.body;
    const {numero_conta, valor, senha} = entradaBody;

    if(!numero_conta || !valor || !senha){
        return res.status(400).json({"mensagem": "Numero da conta, valor e senha são obrigatorios."})
    };

    if(!mc.pegarConta(numero_conta)){
        return res.status(404).json({"mensagem": "Conta não encontrada"})
    };

    if(isNaN(numero_conta) || isNaN(valor) || numero_conta <= 0 || valor <= 0){
        return res.status(400).json({"mensagem": "O numero da conta e valor precisam ser positivos e sem letras"});
    };

    if(!mt.temSaldo(entradaBody)){
        return res.status(400).json({"mensagem": "Valor do saque maior que o saldo da conta!"})
    };

    mt.sacarValor(entradaBody);

    return res.status(204).json();
};

const transferir = (req, res) => {
    const entradaBody = req.body;
    const {numero_conta_origem, numero_conta_destino, valor} = entradaBody;

    if(!numero_conta_origem || !numero_conta_destino || !valor){
        return res.status(400).json({"mensagem": "Favor preencher todos os campos!"});
    };

    if(!mc.pegarConta(numero_conta_destino || !mc.pegarConta(numero_conta_origem))){
        return res.status(404).json({"mensagem": "Conta não encontrada"});
    };

    if(!mt.temSaldo(entradaBody)){
        return res.status(400).json({"mensagem": "Valor do saque maior que o saldo da conta!"})
    };

    mt.transferirValor(entradaBody);

    return res.status(204).json();
};

module.exports = {
    depositar,
    sacar,
    transferir
};