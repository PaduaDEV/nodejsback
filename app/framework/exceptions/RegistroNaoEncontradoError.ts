import AbstractError from "./AbstractError";

class RegistroNaoEncontradoError extends Error {
    public statusCode: number;

    constructor(acao: string, modulo: string, mensagem: string, statusCode: number = 404) {
        super(mensagem);
        this.name = "RegistroNaoEncontradoError";
        this.message = `Erro ao ${acao} ${modulo}: ${mensagem}`;
        this.statusCode = statusCode;
    }
}

export default RegistroNaoEncontradoError;
