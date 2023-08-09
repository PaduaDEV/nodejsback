import AbstractDao from "../../framework/dao/AbstractDao";
import AlterarError from "../../framework/exceptions/AlterarError";
import ConsultarError from "../../framework/exceptions/ConsultarError";
import IncluirError from "../../framework/exceptions/IncluirError";
import MunicipioVo from "../vo/MunicipioVo";

class MunicipioDao extends AbstractDao {
    public async incluirMunicipio(municipioVo: MunicipioVo) {
        const sequence = await this.gerarSequence('SEQUENCE_MUNICIPIO');
        try {
            municipioVo.codigoMunicipio = sequence;
            const sql = 'INSERT INTO TB_MUNICIPIO (CODIGO_MUNICIPIO, CODIGO_UF, NOME, STATUS) VALUES (:codigoMunicipio, :codigoUF, :nome, :status)';
            const resultado = await this.conexao.execute(sql, [municipioVo.codigoMunicipio, municipioVo.codigoUF, municipioVo.nome, municipioVo.status]);
            console.log(`Foram inseridos ${resultado.rowsAffected} registros no banco de dados.`);
        } catch (error) {
            throw new IncluirError("Município", "Erro ao inserir no banco de dados", 404, error);
        }
    }

    public async alterarMunicipio(municipioVo: MunicipioVo) {
        let resultado = null;
        try {
            const sql = 'UPDATE TB_MUNICIPIO SET CODIGO_UF = :codigoUF, NOME = :nome, STATUS = :status  WHERE CODIGO_MUNICIPIO = :codigoMunicipio';
            resultado = await this.conexao.execute(sql, [municipioVo.codigoUF, municipioVo.nome, municipioVo.status, municipioVo.codigoMunicipio]);
            console.log(`QUANTIDADE DE REGISTROS ALTERADOS (Municípios): ${resultado.rowsAffected}`);
            if (resultado.rowsAffected === 0) {
                throw new AlterarError("Município", `Não existe Município com o código ${municipioVo.codigoMunicipio}`, 404, null);
            }
        } catch (error) {
            if (error instanceof AlterarError) {
                throw error;
            } else {
                throw new AlterarError("Município", "Erro ao alterar no banco de dados", 404, error);
            }
        }
    }

    public async pesquisarMunicipio(municipioVoFiltroPesquisa: MunicipioVo): Promise<any> {
        try {
            const recursos: any[] = this.gerarSQLConsultarListar(municipioVoFiltroPesquisa);
            const sql = recursos[0]; // sql
            const parametros: any[] = recursos[1]; // parametros
            const resultSet = await this.conexao.execute(sql, parametros);
            console.log(`QUANTIDADE DE REGISTROS ENCONTRADOS (Municípios): ${resultSet.rows.length}`);
            const retorno = (resultSet.rows.length === 1 ? this.buscarUmRegistro(resultSet) : this.buscarVariosRegistros(resultSet));
            return retorno;
        } catch (error) {
            throw new ConsultarError("Município", "Erro ao pesquisar no banco de dados", 404, error);
        }
    }

    private buscarUmRegistro(resultSet: any): MunicipioVo {
        const municipioVo = new MunicipioVo();
        municipioVo.codigoMunicipio = resultSet.rows[0][0];
        municipioVo.codigoUF = resultSet.rows[0][1];
        municipioVo.nome = resultSet.rows[0][2];
        municipioVo.status = resultSet.rows[0][3];
        return municipioVo;
    }

    private buscarVariosRegistros(resultSet: any): MunicipioVo[] {
        const listaMunicipios: MunicipioVo[] = [];
        let numeroCampo = 0;
        let numeroLinha = 0;
        const quantidadeResultados = resultSet.rows.length;
        while (numeroLinha < quantidadeResultados) {
            const municipioAtual = new MunicipioVo();
            {
                municipioAtual.codigoMunicipio = resultSet.rows[numeroLinha][numeroCampo++];
                municipioAtual.codigoUF = resultSet.rows[numeroLinha][numeroCampo++];
                municipioAtual.nome = resultSet.rows[numeroLinha][numeroCampo++];
                municipioAtual.status = resultSet.rows[numeroLinha][numeroCampo++];
            };
            listaMunicipios.push(municipioAtual);
            numeroLinha++;
            numeroCampo = 0;
        }
        return listaMunicipios;
    }

    private gerarSQLConsultarListar(municipioVoFiltroPesquisa: MunicipioVo): any[] {
        const parametros: any[] = [];
        let sql = 'SELECT CODIGO_MUNICIPIO, CODIGO_UF, NOME, STATUS FROM TB_MUNICIPIO WHERE 1 = 1 ';
        if (municipioVoFiltroPesquisa.codigoMunicipio !== 0) {
            sql += ' AND CODIGO_MUNICIPIO = :codigoMunicipio ';
            parametros.push(municipioVoFiltroPesquisa.codigoMunicipio);
        }
        if (municipioVoFiltroPesquisa.codigoUF !== 0) {
            sql += ' AND CODIGO_UF = :codigoUF ';
            parametros.push(municipioVoFiltroPesquisa.codigoUF);
        }
        if (municipioVoFiltroPesquisa.nome !== "") {
            sql += ' AND NOME = :nome ';
            parametros.push(municipioVoFiltroPesquisa.nome);
        }
        if (municipioVoFiltroPesquisa.status !== 0) {
            sql += ' AND STATUS = :status ';
            parametros.push(municipioVoFiltroPesquisa.status);
        }
        sql += " ORDER BY CODIGO_MUNICIPIO DESC ";
        return [sql, parametros];
    }
}

export default MunicipioDao;