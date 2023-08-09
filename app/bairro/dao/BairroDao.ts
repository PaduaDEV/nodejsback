import AbstractDao from "../../framework/dao/AbstractDao";
import IncluirError from "../../framework/exceptions/IncluirError";
import ConsultarError from "../../framework/exceptions/ConsultarError";
import AlterarError from "../../framework/exceptions/AlterarError";
import BairroVo from "../vo/BairroVo";

class BairroDao extends AbstractDao {
    public async incluirBairro(bairroVo: BairroVo) {
        try {
            const sequence = await this.gerarSequence("SEQUENCE_BAIRRO");
            bairroVo.codigoBairro = sequence;
            const sql =
                "INSERT INTO TB_BAIRRO (CODIGO_BAIRRO, CODIGO_MUNICIPIO, NOME, STATUS) VALUES (:codigoBairro, :codigoMunicipio, :nome, :status)";
            const parametros = [
                bairroVo.codigoBairro,
                bairroVo.codigoMunicipio,
                bairroVo.nome,
                bairroVo.status,
            ];
            const resultado = await this.conexao.execute(sql, parametros);
            console.log(
                `Foram inseridos ${resultado.rowsAffected} registros no banco de dados.`
            );
        } catch (error) {
            throw new IncluirError(
                "Bairro",
                "Erro ao inserir no banco de dados",
                404,
                error
            );
        }
    }

    public async alterarBairro(bairroVo: BairroVo) {
        try {
            const sql =
                "UPDATE TB_BAIRRO SET CODIGO_MUNICIPIO = :codigoMunicipio, NOME = :nome, STATUS = :status  WHERE CODIGO_BAIRRO = :codigoBairro";
            const parametros = [
                bairroVo.codigoMunicipio,
                bairroVo.nome,
                bairroVo.status,
                bairroVo.codigoBairro,
            ];
            const resultado = await this.conexao.execute(sql, parametros);
            console.log(
                `QUANTIDADE DE REGISTROS ALTERADOS (Bairros): ${resultado.rowsAffected}`
            );
            if (resultado.rowsAffected == 0) {
                throw new AlterarError(
                    "Bairro",
                    `Não existe Bairro com o código ${bairroVo.codigoBairro}`,
                    404,
                    null
                );
            }
        } catch (error) {
            if (error instanceof AlterarError) {
                throw error;
            } else {
                throw new AlterarError(
                    "Bairro",
                    "Erro ao alterar no banco de dados",
                    404,
                    error
                );
            }
        }
    }
    public async deletarBairro(codigoBairro: number) {
        try {
            const sql = "DELETE FROM TB_BAIRRO WHERE CODIGO_BAIRRO = :codigoBairro";
            const parametros = [codigoBairro];
            const resultado = await this.conexao.execute(sql, parametros);
            console.log(
                `QUANTIDADE DE REGISTROS DELETADOS (Bairros): ${resultado.rowsAffected}`
            );
            if (resultado.rowsAffected == 0) {
                throw new AlterarError(
                    "Bairro",
                    `Não existe Bairro com o código ${codigoBairro}`,
                    404,
                    null
                );
            }
        } catch (error) {
            if (error instanceof AlterarError) {
                throw error;
            } else {
                throw new AlterarError(
                    "Bairro",
                    "Erro ao deletar no banco de dados",
                    404,
                    error
                );
            }
        }
    }

    public async pesquisarBairro(bairroVoFiltroPesquisa: BairroVo): Promise<any> {
        try {
            const recursos: any[] = this.gerarSQLConsultarListar(bairroVoFiltroPesquisa);
            const sql = recursos[0];
            const parametros: any[] = recursos[1];
            const resultSet = await this.conexao.execute(sql, parametros);
            console.log(
                `QUANTIDADE DE REGISTROS ENCONTRADOS (Bairros): ${resultSet.rows.length}`
            );
            const retorno =
                resultSet.rows.length === 1
                    ? this.buscarUmRegistro(resultSet)
                    : this.buscarVariosRegistros(resultSet);
            return retorno;
        } catch (error) {
            throw new ConsultarError(
                "Bairro",
                "Erro ao pesquisar no banco de dados",
                404,
                error
            );
        }
    }

    private buscarUmRegistro(resultSet: any): BairroVo {
        const bairroVo = new BairroVo();
        bairroVo.codigoBairro = resultSet.rows[0][0];
        bairroVo.codigoMunicipio = resultSet.rows[0][1];
        bairroVo.nome = resultSet.rows[0][2];
        bairroVo.status = resultSet.rows[0][3];
        return bairroVo;
    }

    private buscarVariosRegistros(resultSet: any): BairroVo[] {
        const listaBairros: BairroVo[] = [];
        let numeroCampo = 0;
        let numeroLinha = 0;
        const quantidadeResultados = resultSet.rows.length;
        while (numeroLinha < quantidadeResultados) {
            const bairroAtual = new BairroVo();
            bairroAtual.codigoBairro = resultSet.rows[numeroLinha][numeroCampo++];
            bairroAtual.codigoMunicipio = resultSet.rows[numeroLinha][numeroCampo++];
            bairroAtual.nome = resultSet.rows[numeroLinha][numeroCampo++];
            bairroAtual.status = resultSet.rows[numeroLinha][numeroCampo++];
            listaBairros.push(bairroAtual);
            numeroLinha++;
            numeroCampo = 0;
        }
        return listaBairros;
    }

    private gerarSQLConsultarListar(bairroVoFiltroPesquisa: BairroVo): any[] {
        const parametros: any[] = [];
        let sql = "SELECT CODIGO_BAIRRO, CODIGO_MUNICIPIO, NOME, STATUS FROM TB_BAIRRO WHERE 1 = 1 ";
        if (bairroVoFiltroPesquisa.codigoBairro !== 0) {
            sql += " AND CODIGO_BAIRRO = :codigoBairro ";
            parametros.push(bairroVoFiltroPesquisa.codigoBairro);
        }
        if (bairroVoFiltroPesquisa.codigoMunicipio !== 0) {
            sql += " AND CODIGO_MUNICIPIO = :codigoMunicipio ";
            parametros.push(bairroVoFiltroPesquisa.codigoMunicipio);
        }
        if (bairroVoFiltroPesquisa.nome !== "") {
            sql += " AND NOME = :nome ";
            parametros.push(bairroVoFiltroPesquisa.nome);
        }
        if (bairroVoFiltroPesquisa.status !== 0) {
            sql += " AND STATUS = :status ";
            parametros.push(bairroVoFiltroPesquisa.status);
        }
        sql += " ORDER BY CODIGO_BAIRRO DESC ";
        return [sql, parametros];
    }
}

export default BairroDao;
