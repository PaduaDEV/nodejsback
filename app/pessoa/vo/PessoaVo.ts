import { EnderecoVo } from "./EnderecoVo";

class PessoaVo {
    public codigoPessoa: number = 0;
    public nome: string = "";
    public sobrenome: string = "";
    public idade: number = 0;
    public login: string = "";
    public senha: string = "";
    public status: number = 0;
    public enderecos: EnderecoVo[] = [];
}

export default PessoaVo;
