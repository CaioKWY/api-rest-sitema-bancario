const dados = require("../bancodedados");
let idBase = 1;

const temCpf = (cpf, array) => {
    let tem;

    if(array){
        tem = array.some((conta) => {
            return conta.usuario.cpf === cpf;
        })
    }else{
        tem = dados.contas.some((conta) => {
            return conta.usuario.cpf === cpf;
        });
    }
    return tem;
};
        
const temEmail = (email, array) => {
   let tem;

    if(array){
        tem = array.some((conta) => {
            return conta.usuario.email === email;
        });
    }else{
        tem = dados.contas.some((conta) => {
            return conta.usuario.email === email;
        });
    };

    return tem;
};

const temTodos = (dados) => {
    const {nome, cpf, data_nascimento, telefone, email, senha} = dados;

    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
        return false;
    };

    return true
};

 //Sempre usar o metodo temTodos() antes para garantir um objeto completo
const construirUsuario = (dados) => {
    const {nome, cpf, data_nascimento, telefone, email, senha} = dados;
    
    const usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    };
        
    return usuario;
};

const temEmailCpf = (dados, array) => {
    const {email, cpf} = dados;

    if(array){
        if(temCpf(cpf, array) || temEmail(email, array)){
            
            return true;
        }
        return false;

    }else{
        if(temCpf(cpf) || temEmail(email)){

            return true;
        };
        return false;
    };
};

const retirarNumero = (numeroConta) => {
    
    const filtrado = dados.contas.filter((conta) => {
        return conta.numero != Number(numeroConta);
    });

    return filtrado;
};

const verificarOutrosCpfsEmails = (dadosEntrada, numeroConta) => {
    const contasFiltro = retirarNumero(numeroConta);
    
    return temEmailCpf(dadosEntrada, contasFiltro);
};

const pegarConta = (numeroConta) => {

    const contaEncontrada = dados.contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    })

    return contaEncontrada;

};

//Fazer as verificaçoes antes de usar, od metodos temTodos() e temEmailCpf() podem ajudar.
const novaConta = (dadosEntrada) => {
    
    dados.contas.push({
        "numero": idBase++,
        "saldo": 0,
        "usuario": construirUsuario(dadosEntrada)
    });
};

const atualizarUsuario = (dadosEntrada, numeroConta) => {

    const contaEncontrada = pegarConta(numeroConta);
    const indiceBusca = dados.contas.indexOf(contaEncontrada);

    dados.contas[indiceBusca].usuario = construirUsuario(dadosEntrada);
};

const saldoZero = (numeroConta) => {
    const conta = pegarConta(numeroConta);
    
    if(conta.saldo === 0){
        
        return true;
    }

    return false;
}

const apagarConta = (numeroConta) => {
    const listaContas = retirarNumero(numeroConta);

    dados.contas = listaContas;
};

const gerarExtrato = (numeroConta) => {

    const saques = dados.saques.filter((saque) => {
        return saque.numero_conta == numeroConta;
    });

    const depositos = dados.depositos.filter((deposito) => {
        return deposito.numero_conta == numeroConta;
    });

    const transferenciasEnviadas = dados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem == numeroConta;
    });

    const transferenciaRecebidas = dados.transferencias.filter((tranferencia) => {
        return tranferencia.numero_conta_destino == numeroConta;
    });

    const extrato = {
        depositos,
        saques,
        transferenciasEnviadas,
        transferenciaRecebidas
    };

    return extrato;
};

module.exports = {

    temCpf,
    temEmail,
    temTodos,
    construirUsuario,
    temEmailCpf,
    retirarNumero,
    verificarOutrosCpfsEmails,
    novaConta,
    atualizarUsuario,
    pegarConta,
    saldoZero,
    apagarConta,
    gerarExtrato
};