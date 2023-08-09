import BairroBe from "../../bairro/be/BairroBe";
import BairroVo from "../../bairro/vo/BairroVo";
import AbstractBe from "../../framework/be/AbstractBe";
import CampoObrigatorioError from "../../framework/exceptions/CampoObrigatorioError";
import RegistroJaExisteError from "../../framework/exceptions/RegistroJaExisteError";
import MunicipioBe from "../../municipio/be/MunicipioBe";
import MunicipioVo from "../../municipio/vo/MunicipioVo";
import UFBe from "../../uf/be/UFBe";
import UFVo from "../../uf/vo/UFVo";
import EnderecoDao from "../dao/EnderecoDao";
import PessoaDao from "../dao/PessoaDao";
import { EnderecoVo } from "../vo/EnderecoVo";
import PessoaVo from "../vo/PessoaVo";

class PessoaBe extends AbstractBe
{
    private pessoaDao : PessoaDao = new PessoaDao(this.conexao);
    private enderecoDao : EnderecoDao = new EnderecoDao(this.conexao);

    constructor(conexao : any)
    {
        super(conexao);
    }

    public async incluirPessoa(pessoaVo : PessoaVo)
    {
        this.validarCampos(pessoaVo, "incluir pessoa", false);
        await this.verificarSeExistePessoa(pessoaVo, "incluir", "pessoa");
        await this.pessoaDao.incluirPessoa(pessoaVo);
        await this.incluirEnderecos(pessoaVo, "incluir", false);
        let registros = await this.pessoaDao.pesquisarPessoa(new PessoaVo());
        return registros;
    }

    private async incluirEnderecos(pessoaVo : PessoaVo, acao: string, isAlteracao : boolean)
    {
        let posicao = 0;
        while(pessoaVo.enderecos.length > posicao)
        {
            let enderecoVoAtual : EnderecoVo = pessoaVo.enderecos[posicao];
            enderecoVoAtual.codigoPessoa = pessoaVo.codigoPessoa;
            await this.incluirEndereco(enderecoVoAtual, acao);
            posicao++;
        }
    }

    public async alterarPessoa(pessoaVo : PessoaVo)
    {
        this.validarCampos(pessoaVo, "alterar pessoa", true);
        await this.verificarSeExistePessoa(pessoaVo, "alterar pessoa", "pessoa");
        await this.pessoaDao.alterarPessoa(pessoaVo);
        await this.gerirEnderecos(pessoaVo, "alterar pessoa", true);
        let registros = await this.pessoaDao.pesquisarPessoa(new PessoaVo());
        return registros;
    }

    private async gerirEnderecos(pessoaVo : PessoaVo, acao: string, isAlteracao : boolean)
    {
        let posicao = 0;
        let codigosEnderecosAtuais = [];
        //ENDEREÇOS QUE SERÃO ALTERADOS OU INCLUIDOS
        while(pessoaVo.enderecos.length > posicao)
        {
            let enderecoVoAtual : EnderecoVo = pessoaVo.enderecos[posicao];
            if(enderecoVoAtual.codigoEndereco == undefined || enderecoVoAtual.codigoEndereco == 0)
            {
                enderecoVoAtual.codigoPessoa = pessoaVo.codigoPessoa;
                await this.incluirEndereco(enderecoVoAtual, acao);
                codigosEnderecosAtuais.push(enderecoVoAtual.codigoEndereco);
            }
            else
            {
                await this.alterarEndereco(enderecoVoAtual);
                codigosEnderecosAtuais.push(enderecoVoAtual.codigoEndereco);
            }
            posicao++;
        }
        //ENDEREÇOS QUE SERÃO EXCLUÍDOS
        let enderecoVoFiltroPesquisa : EnderecoVo = new EnderecoVo();
        enderecoVoFiltroPesquisa.codigoPessoa = pessoaVo.codigoPessoa;
        let listaEnderecosOriginal = await this.enderecoDao.pesquisarEndereco(enderecoVoFiltroPesquisa);
        posicao = 0;
        while(listaEnderecosOriginal.length > posicao)
        {
            let enderecoVoAtual : EnderecoVo = listaEnderecosOriginal[posicao];
            let posicaoEncontrada = codigosEnderecosAtuais.indexOf(enderecoVoAtual.codigoEndereco);
            if(posicaoEncontrada == -1)
            {
                await this.excluirEndereco(enderecoVoAtual, acao);
            }
            posicao++;
        }
    }

    private async incluirEndereco(enderecoVoAtual : EnderecoVo, acao: string)
    {
        this.validarCamposEndereco(enderecoVoAtual, acao, false);
        await this.enderecoDao.incluirEndereco(enderecoVoAtual);
    }

    private async alterarEndereco(enderecoVoAtual : EnderecoVo)
    {
        this.validarCamposEndereco(enderecoVoAtual, "alterar", true);
        await this.enderecoDao.alterarEndereco(enderecoVoAtual);
    }

    private async excluirEndereco(enderecoVoAtual : EnderecoVo, acao: string)
    {
        if(enderecoVoAtual.codigoEndereco == undefined || enderecoVoAtual.codigoEndereco == null || enderecoVoAtual.codigoEndereco < 1){throw new CampoObrigatorioError(acao, "codigoEndereco")}
        await this.enderecoDao.excluirEndereco(enderecoVoAtual);
    }

    private async verificarSeExistePessoa(pessoaVo : PessoaVo, acao : string, modulo : string)
    {
        let pessoaVoFiltroPesquisa = new PessoaVo();
        pessoaVoFiltroPesquisa.login = pessoaVo.login;
        let registros = await this.pessoaDao.pesquisarPessoa(pessoaVoFiltroPesquisa);
        if( (registros!= undefined && ((registros.length != undefined && registros.length > 0 && registros[0].codigoPessoa != pessoaVo.codigoPessoa)  || (registros.codigoPessoa != undefined && registros.codigoPessoa > 0 && registros.codigoPessoa != pessoaVo.codigoPessoa))))
        {
            throw new RegistroJaExisteError(acao, modulo, "o login " + pessoaVo.login, 404);
        }
    }

    public async pesquisarPessoa(pessoaVoFiltroPesquisa : PessoaVo)
    {
        let registros = await this.pessoaDao.pesquisarPessoa(pessoaVoFiltroPesquisa);
        if(registros.codigoPessoa != undefined && pessoaVoFiltroPesquisa.codigoPessoa == 0) //REGRA: ADICIONAR EM UMA LISTA SE A PESQUISA NÃO POR PELA PK
        {
            let lista = [];
            lista.push(registros);
            registros = lista;
        }
        else
        {
            let enderecoVoFiltroPesquisa : EnderecoVo = new EnderecoVo();
            enderecoVoFiltroPesquisa.codigoPessoa = pessoaVoFiltroPesquisa.codigoPessoa;
            let listaEnderecos = await this.enderecoDao.pesquisarEndereco(enderecoVoFiltroPesquisa);
            let pessoaVo = registros;
            pessoaVo.enderecos = listaEnderecos;
            let posicao = 0;
            while(pessoaVo.enderecos.length > posicao)
            {
                let enderecoVo = pessoaVo.enderecos[posicao];
                //ADICIONANDO OS DADOS DO BAIRRO
                let bairroVo = new BairroVo();
                bairroVo.codigoBairro = enderecoVo.codigoBairro;
                let bairroAtual = await new BairroBe(this.conexao).pesquisarBairro(bairroVo);
                enderecoVo.bairro = bairroAtual;
                //ADICIONANDO OS DADOS DO MUNICÍPIO
                let municipioVo = new MunicipioVo();
                municipioVo.codigoMunicipio = enderecoVo.bairro.codigoMunicipio;
                let municipioAtual = await new MunicipioBe(this.conexao).pesquisarMunicipio(municipioVo);
                enderecoVo.bairro.municipio = municipioAtual;
                //ADICIONANDO OS DADOS DO UF
                let ufVo = new UFVo();
                ufVo.codigoUF = enderecoVo.bairro.municipio.codigoUF;
                let ufAtual = await new UFBe(this.conexao).pesquisarUF(ufVo);
                enderecoVo.bairro.municipio.uf = ufAtual;
                //
                posicao++;
            }
            registros = pessoaVo;
        }
        return registros;
    }

    private validarCampos(pessoaVo : PessoaVo, acao : string, alteracao : boolean)
    {
        if(pessoaVo == null || pessoaVo == undefined){throw new CampoObrigatorioError(acao, "o JSON ");}
        if(pessoaVo.nome == undefined || pessoaVo.nome == null || pessoaVo.nome.trim() == ""){throw new CampoObrigatorioError(acao, "nome");}
        if(pessoaVo.sobrenome == undefined || pessoaVo.sobrenome == null || pessoaVo.sobrenome.trim() == ""){throw new CampoObrigatorioError(acao, "sobrenome");}
        if(pessoaVo.idade == undefined || pessoaVo.idade == null){throw new CampoObrigatorioError(acao, "idade");}
        if(pessoaVo.login == undefined || pessoaVo.login == null || pessoaVo.login.trim() == ""){throw new CampoObrigatorioError(acao, "login");}
        if(pessoaVo.senha == undefined || pessoaVo.senha == null || pessoaVo.senha.trim() == ""){throw new CampoObrigatorioError(acao, "senha");}
        if(pessoaVo.status == undefined || pessoaVo.status == null || pessoaVo.status < 1){throw new CampoObrigatorioError(acao, "status")}
        if(pessoaVo.enderecos == undefined || pessoaVo.enderecos == null || pessoaVo.enderecos.length == 0){throw new CampoObrigatorioError(acao, "enderecos")}
        if(alteracao && (pessoaVo.codigoPessoa == undefined || pessoaVo.codigoPessoa < 1)){throw new CampoObrigatorioError(acao, "codigoPessoa")}
    }

    private validarCamposEndereco(enderecoVo : EnderecoVo, acao : string, alteracao : boolean)
    {
        if(enderecoVo == null || enderecoVo == undefined){throw new CampoObrigatorioError(acao, "endereço no JSON ");}
        if(enderecoVo.codigoPessoa == undefined || enderecoVo.codigoPessoa == null || enderecoVo.codigoPessoa < 1){throw new CampoObrigatorioError(acao, "codigoPessoa")}
        if(enderecoVo.codigoBairro == undefined || enderecoVo.codigoBairro == null || enderecoVo.codigoBairro < 1){throw new CampoObrigatorioError(acao, "codigoBairro")}
        if(enderecoVo.nomeRua == undefined || enderecoVo.nomeRua == null || enderecoVo.nomeRua.trim() == ""){throw new CampoObrigatorioError(acao, "nomeRua");}
        if(enderecoVo.numero == undefined || enderecoVo.numero == null){throw new CampoObrigatorioError(acao, "numero");}
        if(enderecoVo.complemento == undefined || enderecoVo.complemento == null || enderecoVo.complemento.trim() == ""){throw new CampoObrigatorioError(acao, "complemento");}
        if(enderecoVo.cep == undefined || enderecoVo.cep == null || enderecoVo.cep.trim() == ""){throw new CampoObrigatorioError(acao, "cep");}
        if(alteracao && (enderecoVo.codigoEndereco == undefined || enderecoVo.codigoEndereco == null || enderecoVo.codigoEndereco < 1)){throw new CampoObrigatorioError(acao, "codigoEndereco")}
    }


}

export default PessoaBe;