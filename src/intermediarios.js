const {pegarConta} = require("./controladores/metodoscontas");

const intermediarioListagem = (req, res, next) => {
    const {senha_banco} = req.query;
    
    if(senha_banco != "Cubos123Bank"){
        return res.status(401).json({"mensagem": "A senha do banco informada é inválida!"})
    };

    return next();
};

const senhaConta = (req, res, next) => {
    const {numero_conta, numero_conta_origem, senha} = req.body;
 
    let conta = pegarConta(numero_conta);

    if(numero_conta_origem){
        conta = pegarConta(numero_conta_origem);
    }

    if(conta.usuario.senha == senha){

        return next();
    }

    return res.status(401).json({"mensagem": "Senha Incorreta!"});
};

const senhaContaQuery = (req, res, next) => {
    try{
    const {numero_conta, senha} = req.query
   
    let conta = pegarConta(numero_conta);

    if(conta.usuario.senha == senha){

        return next();
    }
    return res.status(401).json({"mensagem": "Senha Incorreta!"});
    
    }catch(erro){

        return res.status(404).json({"mensagem": "Conta não encontrada!"})
}
}

module.exports = {
    intermediarioListagem,
    senhaConta,
    senhaContaQuery
};

