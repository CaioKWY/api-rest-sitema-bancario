const mc = require("./metodoscontas");
const dados = require("../bancodedados");

const temTodos2 = (entradaDadosBody) => {
    const { numero_conta, valor } = entradaDadosBody;

    if(!numero_conta || !valor){

        return false;
    };

    return true;
};


const registrarValor = (entradaBody, transacao) => {
    const {numero_conta, valor, numero_conta_origem, numero_conta_destino} = entradaBody

    if(transacao === "deposito"){
        dados.depositos.push({
            "data": new Date(),
            numero_conta,
            valor
        });
    };

    if(transacao === "saque"){
        dados.saques.push({
            "data": new Date(),
            numero_conta,
            valor
        });
    };

    if(transacao === "transferencia"){
        dados.transferencias.push({
            "data": new Date(),
            numero_conta_origem,
            numero_conta_destino,
            valor
        });
    };
};

const verificarSenha = (senha, numeroConta) => {

    const conta = mc.pegarConta(numeroConta);

    if(conta.usuario.senha == senha){

        return true;
    }

    return false;
};

const temSaldo = (entradaDados) => {
    const { numero_conta, valor, numero_conta_origem} = entradaDados;

    let contaEncontrada = mc.pegarConta(numero_conta);

    if(numero_conta_origem){
        contaEncontrada = mc.pegarConta(numero_conta_origem);
    };

    const indiceBusca = dados.contas.indexOf(contaEncontrada);

    if(dados.contas[indiceBusca].saldo < valor){
        return false;
    };

    return true;
}

const sacarValor = (entradaDados) => {
    const { numero_conta, valor} = entradaDados;

    const contaEncontrada = mc.pegarConta(numero_conta);
    const indiceBusca = dados.contas.indexOf(contaEncontrada);

   
    dados.contas[indiceBusca].saldo -= Number(valor);

    registrarValor(entradaDados, "saque");
};

const depositarValor = (entradaBody) => {
    const { numero_conta, valor} = entradaBody;

    const contaEncontrada = mc.pegarConta(numero_conta);
    const indiceBusca = dados.contas.indexOf(contaEncontrada);

    dados.contas[indiceBusca].saldo += Number(valor);

    registrarValor(entradaBody, "deposito");
};

const transferirValor = (entradaBody) => {
    const {numero_conta_origem, numero_conta_destino, valor} = entradaBody;

    const contaOrigem = mc.pegarConta(numero_conta_origem);
    const indiceOrigem = dados.contas.indexOf(contaOrigem);

    const contaDestino = mc.pegarConta(numero_conta_destino);
    const indiceDestino = dados.contas.indexOf(contaDestino);

    dados.contas[indiceOrigem].saldo -= Number(valor);
    dados.contas[indiceDestino].saldo += Number(valor);

    registrarValor(entradaBody, "transferencia");
};

module.exports = {
    temTodos2,
    depositarValor,
    registrarValor,
    verificarSenha,
    sacarValor,
    temSaldo,
    transferirValor
}