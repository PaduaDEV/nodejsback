import {Request, Response} from 'express';
import PessoaVo from '../vo/PessoaVo';
import Conexao from "../../framework/banco/Conexao";
import AbstractError from '../../framework/exceptions/AbstractError';
import NumeroFormatoInvalidoError from '../../framework/exceptions/NumeroFormatoInvalidoError';
import PessoaBe from '../be/PessoaBe';

class PessoaController
{

    public async incluirPessoa(request: Request, response : Response)
    {
        try
        {
            let conexao = await Conexao.abrirConexao();
            let pessoaBe : PessoaBe = new PessoaBe(conexao);
            let pessoaVo : any = request.body;
            let registros = await pessoaBe.incluirPessoa(pessoaVo);
            await Conexao.commit();
            return response.status(200).json(registros);
        }
        catch(error)
        {
            console.error(error);
            await Conexao.rollback();
            let codigoErro : number = error instanceof AbstractError ? error.status : 404;
            return response.status(codigoErro).json(error instanceof AbstractError ? error : {status: 404, mensagem : "Não foi possível incluir pessoa."});
        }
        finally
        {
            await Conexao.fecharConexao();
        }
    }

    public async alterarPessoa(request: Request, response : Response)
    {
        try
        {
            let conexao = await Conexao.abrirConexao();
            let pessoaBe : PessoaBe = new PessoaBe(conexao);
            let pessoaVo : any = request.body;
            let registros = await pessoaBe.alterarPessoa(pessoaVo);
            await Conexao.commit();
            return response.status(200).json(registros);
        }
        catch(error)
        {
            console.error(error);
            await Conexao.rollback();
            let codigoErro : number = error instanceof AbstractError ? error.status : 404;
            return response.status(codigoErro).json(error instanceof AbstractError ? error : {status: 404, mensagem : "Não foi possível alterar pessoa."});
        }
        finally
        {
            await Conexao.fecharConexao();
        }
    }

    public async pesquisarPessoa(request: Request, response : Response)
    {
        try
        {
            let conexao = await Conexao.abrirConexao();
            let pessoaBe : PessoaBe = new PessoaBe(conexao);
            let {codigoPessoa} = request.query;
            let {login} = request.query;
            let {status} = request.query;
            let pessoaVoFiltroPesquisa : PessoaVo = new PessoaVo();
            let registros = null;
            if(codigoPessoa != undefined)
            {
                if(isNaN(parseInt(''+codigoPessoa))) {throw new NumeroFormatoInvalidoError("consultar", "pessoa", "codigoPessoa", ""+codigoPessoa, 404);}
                pessoaVoFiltroPesquisa.codigoPessoa = parseInt(''+codigoPessoa);
            }
            if(login != undefined)
            {
                pessoaVoFiltroPesquisa.login = ""+login;
            }
            if(status != undefined)
            {
                if(isNaN(parseInt(''+status))) {throw new NumeroFormatoInvalidoError("consultar", "pessoa", "status", ""+status, 404);}
                pessoaVoFiltroPesquisa.status = parseInt(''+status);
            }
            registros = await pessoaBe.pesquisarPessoa(pessoaVoFiltroPesquisa);
            return response.status(200).json(registros);
        }
        catch(error)
        {
            console.error(error);
            let codigoErro : number = error instanceof AbstractError ? error.status : 404;
            return response.status(codigoErro).json(error instanceof AbstractError ? error : {status: 404, mensagem : "Não foi possível consultar pessoa."});
        }
        finally
        {
            await Conexao.fecharConexao();
        }
    }
}



export default PessoaController;