import { Request, Response } from 'express';
import MunicipioBe from '../be/MunicipioBe';
import MunicipioVo from '../vo/MunicipioVo';
import Conexao from "../../framework/banco/Conexao";
import AbstractError from '../../framework/exceptions/AbstractError';
import NumeroFormatoInvalidoError from '../../framework/exceptions/NumeroFormatoInvalidoError';

class MunicipioController {

    public async incluirMunicipio(request: Request, response: Response) {
        try {
            const conexao = await Conexao.abrirConexao();
            const municipioBe: MunicipioBe = new MunicipioBe(conexao);
            const municipioVo: MunicipioVo = request.body;
            await municipioBe.verificarSeExisteMunicipio(municipioVo, "incluir", "Municipio"); // Adicione essa linha
            const registros = await municipioBe.incluirMunicipio(municipioVo);
            await Conexao.commit();
            return response.status(200).json(registros);
        } catch (error) {
            console.error(error);
            await Conexao.rollback();
            const codigoErro: number = error instanceof AbstractError ? error.status : 404;
            return response.status(codigoErro).json(
                error instanceof AbstractError ? error : {
                    status: 404,
                    mensagem: "Não foi possível incluir Município."
                }
            );
        } finally {
            await Conexao.fecharConexao();
        }
    }

    public async alterarMunicipio(request: Request, response: Response) {
        try {
            const conexao = await Conexao.abrirConexao();
            const municipioBe: MunicipioBe = new MunicipioBe(conexao);
            const municipioVo: MunicipioVo = request.body;
            const registros = await municipioBe.alterarMunicipio(municipioVo);
            await Conexao.commit();
            return response.status(200).json(registros);
        } catch (error) {
            console.error(error);
            await Conexao.rollback();
            const codigoErro: number = error instanceof AbstractError ? error.status : 404;
            return response.status(codigoErro).json(
                error instanceof AbstractError ? error : {
                    status: 404,
                    mensagem: "Não foi possível alterar Município."
                }
            );
        } finally {
            await Conexao.fecharConexao();
        }
    }

    public async pesquisarMunicipio(request: Request, response: Response) {
        try {
            const conexao = await Conexao.abrirConexao();
            const municipioBe: MunicipioBe = new MunicipioBe(conexao);
            const { codigoMunicipio, codigoUF, nome, status } = request.query;
            const municipioVoFiltroPesquisa: MunicipioVo = new MunicipioVo();

            if (codigoMunicipio !== undefined) {
                if (isNaN(parseInt(`${codigoMunicipio}`))) {
                    throw new NumeroFormatoInvalidoError(
                        "consultar", "Município", "codigoMunicipio", `${codigoMunicipio}`, 404
                    );
                }
                municipioVoFiltroPesquisa.codigoMunicipio = parseInt(`${codigoMunicipio}`);
            }
            if (codigoUF !== undefined) {
                if (isNaN(parseInt(`${codigoUF}`))) {
                    throw new NumeroFormatoInvalidoError(
                        "consultar", "Município", "codigoUF", `${codigoUF}`, 404
                    );
                }
                municipioVoFiltroPesquisa.codigoUF = parseInt(`${codigoUF}`);
            }
            if (nome !== undefined) {
                municipioVoFiltroPesquisa.nome = `${nome}`;
            }
            if (status !== undefined) {
                if (isNaN(parseInt(`${status}`))) {
                    throw new NumeroFormatoInvalidoError(
                        "consultar", "Município", "status", `${status}`, 404
                    );
                }
                municipioVoFiltroPesquisa.status = parseInt(`${status}`);
            }

            const registros = await municipioBe.pesquisarMunicipio(municipioVoFiltroPesquisa);

            const registrosArray: any[] = [];

            if (Array.isArray(registros)) {
                registros.forEach((registro: any) => {
                    const registroObj: any = {
                        codigoMunicipio: registro.codigoMunicipio,
                        codigoUF: registro.codigoUF,
                        nome: registro.nome,
                        status: registro.status
                    };

                    registrosArray.push(registroObj);
                });
            } else {
                const registroObj: any = {
                    codigoMunicipio: registros.codigoMunicipio,
                    codigoUF: registros.codigoUF,
                    nome: registros.nome,
                    status: registros.status
                };

                registrosArray.push(registroObj);
            }

            return response.status(200).json(registrosArray);
        } catch (error) {
            console.error(error);
            const codigoErro: number = error instanceof AbstractError ? error.status : 404;
            return response.status(codigoErro).json(
                error instanceof AbstractError ? error : {
                    status: 404,
                    mensagem: "Não foi possível consultar Município."
                }
            );
        } finally {
            await Conexao.fecharConexao();
        }
    }





}

export default MunicipioController;
