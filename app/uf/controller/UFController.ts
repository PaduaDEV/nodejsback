import { Request, Response } from 'express';
import UFBe from '../be/UFBe';
import UFVo from '../vo/UFVo';
import Conexao from "../../framework/banco/Conexao";
import AbstractError from '../../framework/exceptions/AbstractError';
import NumeroFormatoInvalidoError from '../../framework/exceptions/NumeroFormatoInvalidoError';

class UFController {

    public async incluirUF(request: Request, response: Response) {
        try {
            let conexao = await Conexao.abrirConexao();
            let ufBe: UFBe = new UFBe(conexao);
            let ufVo: UFVo = new UFVo();

            const { sigla, nome, status } = request.body;

            // Validate incoming data here if needed

            ufVo.sigla = sigla;
            ufVo.nome = nome;
            ufVo.status = status;

            let registros = await ufBe.incluirUF(ufVo);
            await Conexao.commit();
            return response.status(200).json(registros);
        } catch (error) {
            console.error(error);
            await Conexao.rollback();
            let codigoErro: number = error instanceof AbstractError ? error.status : 404;
            return response.status(codigoErro).json(error instanceof AbstractError ? error : { status: 404, mensagem: "Não foi possível incluir UF." });
        } finally {
            await Conexao.fecharConexao();
        }
    }


    public async alterarUF(request: Request, response : Response)
    {
        try
        {
            let conexao = await Conexao.abrirConexao();
            let ufBe : UFBe = new UFBe(conexao);
            let uf : any = request.body;
            let registros = await ufBe.alterarUF(uf);
            await Conexao.commit();
            return response.status(200).json(registros);
        }
        catch(error)
        {
            console.error(error);
            await Conexao.rollback();
            let codigoErro : number = error instanceof AbstractError ? error.status : 404;
            return response.status(codigoErro).json(error instanceof AbstractError ? error : {status: 404, mensagem : "Não foi possível alterar UF."});
        }
        finally
        {
            await Conexao.fecharConexao();
        }
    }

    public async pesquisarUF(request: Request, response : Response)
    {
        try
        {
            let conexao = await Conexao.abrirConexao();
            let ufBe : UFBe = new UFBe(conexao);
            let {codigoUF} = request.query;
            let {sigla} = request.query;
            let {nome} = request.query;
            let {status} = request.query;
            let ufVoFiltroPesquisa : UFVo = new UFVo();
            let registros = null;
            if(codigoUF != undefined)
            {
                if(isNaN(parseInt(''+codigoUF))) {throw new NumeroFormatoInvalidoError("consultar", "UF", "codigoUF", ""+codigoUF, 404);}
                ufVoFiltroPesquisa.codigoUF = parseInt(''+codigoUF);
            }
            if(sigla != undefined)
            {
                ufVoFiltroPesquisa.sigla = ""+sigla;
            }
            if(nome != undefined)
            {
                ufVoFiltroPesquisa.nome = ""+nome;
            }
            if(status != undefined)
            {
                if(isNaN(parseInt(''+status))) {throw new NumeroFormatoInvalidoError("consultar", "UF", "status", ""+status, 404);}
                ufVoFiltroPesquisa.status = parseInt(''+status);
            }
            registros = await ufBe.pesquisarUF(ufVoFiltroPesquisa);
            return response.status(200).json(registros);
        }
        catch(error)
        {
            console.error(error);
            let codigoErro : number = error instanceof AbstractError ? error.status : 404;
            return response.status(codigoErro).json(error instanceof AbstractError ? error : {status: 404, mensagem : "Não foi possível consultar UF."});
        }
        finally
        {
            await Conexao.fecharConexao();
        }
    }
    public async deletarUF(request: Request, response: Response) {
        try {
            let conexao = await Conexao.abrirConexao();
            let ufBe: UFBe = new UFBe(conexao);

            // Extrair o codigoUF a ser deletado dos parâmetros da requisição
            const { codigoUF } = request.params;

            // Verificar se o codigoUF é um número válido
            if (isNaN(parseInt(codigoUF))) {
                throw new NumeroFormatoInvalidoError(
                    "deletar",
                    "UF",
                    "codigoUF",
                    codigoUF,
                    404
                );
            }

            // Chamar o método de exclusão da camada BE passando o codigoUF
            await ufBe.deletarUF(parseInt(codigoUF));

            await Conexao.commit();
            return response.status(200).json({ mensagem: "UF deletada com sucesso!" });
        } catch (error) {
            console.error(error);
            await Conexao.rollback();
            let codigoErro: number = error instanceof AbstractError ? error.status : 404;
            return response.status(codigoErro).json(
                error instanceof AbstractError
                    ? error
                    : { status: 404, mensagem: "Não foi possível deletar UF." }
            );
        } finally {
            await Conexao.fecharConexao();
        }
    }

}

export default UFController;
