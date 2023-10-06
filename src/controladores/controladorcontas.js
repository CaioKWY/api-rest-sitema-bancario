const dados = require("../bancodedados");
const metodos = require("./metodoscontas");

const listarContas = (req, res) => {
    return res.status(200).json(dados.contas);
};

const criarConta = (req, res) => {
    const entradaDados = req.body;

    if(!metodos.temTodos(entradaDados)){
        return res.status(400).json({"mensagem": "Favor preencher todos os dados."})
    };
    
    if(metodos.temEmailCpf(entradaDados)){
        return res.status(400).json({"mensagem": "Já existe uma conta com o cpf ou e-mail informado!"})
    };

    metodos.novaConta(entradaDados);  

    return res.status(201).json();
};

const atualizarConta = (req, res) => {
    const {numeroConta} = req.params;
    const entradaDados = req.body;

    if(isNaN(numeroConta) || numeroConta <= 0){
        return res.status(400).json({"mensagem": "O numero da conta precisa ser positivo e sem letras"});
    }

    if(!metodos.temTodos(entradaDados)){
        return res.status(400).json({"mensagem": "Favor preencher todos os dados."});
    };

    if(metodos.verificarOutrosCpfsEmails(entradaDados, numeroConta)){
        return res.status(400).json({"mensagem": "Já existe uma conta com o cpf ou e-mail informado!"});
    };
    
    if(!metodos.pegarConta(numeroConta)){
        return res.status(404).json({"mensagem": "Conta não encontrada"})
    }
    
    metodos.atualizarUsuario(entradaDados, numeroConta)

    return res.status(201).json();
};

const excluirConta = (req, res) => {
    const {numeroConta} = req.params;

    if(isNaN(numeroConta) || numeroConta <= 0){
        return res.status(400).json({"mensagem": "O numero da conta precisa ser positivo e sem letras"});
    };

    if(!metodos.pegarConta(numeroConta)){
        return res.status(404).json({"mensagem": "Conta não encontrada"})
    };

    if(!metodos.saldoZero(numeroConta)){
        return res.status(400).json({"mensagem": "A conta só pode ser removida se o saldo for zero!"})
    }

    metodos.apagarConta(numeroConta);

    return res.status(204).json();
};

const verificarSaldo = (req, res) => {
    const{numero_conta} = req.query;

    const contaSaldo = metodos.pegarConta(numero_conta);
   

    res.status(200).json({"saldo": contaSaldo.saldo});
};

const tirarExtrato = (req, res) => {
    const {numero_conta} = req.query;

    const extrato = metodos.gerarExtrato(numero_conta);

    return res.status(201).json({extrato});
};

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    verificarSaldo,
    tirarExtrato
}