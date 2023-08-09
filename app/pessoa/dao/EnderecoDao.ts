import AbstractDao from "../../framework/dao/AbstractDao";
import AlterarError from "../../framework/exceptions/AlterarError";
import ConsultarError from "../../framework/exceptions/ConsultarError";
import DeletarError from "../../framework/exceptions/DeletarError";
import IncluirError from "../../framework/exceptions/IncluirError";
import {EnderecoVo} from "../vo/EnderecoVo";

class EnderecoDao extends AbstractDao
{
  public async incluirEndereco(enderecoVo : EnderecoVo)
  {
    let sequence = await this.gerarSequence('SEQUENCE_ENDERECO');
    try
    {
      enderecoVo.codigoEndereco = sequence;
      let sql = 'INSERT INTO TB_ENDERECO (CODIGO_ENDERECO, CODIGO_PESSOA, CODIGO_BAIRRO, NOME_RUA, NUMERO, COMPLEMENTO, CEP)';
      sql += ' VALUES (:codigoEndereco, :codigoPessoa, :codigoBairro, :nomeRua, :numero, :complemento, :cep)';
      let parametros = [enderecoVo.codigoEndereco, enderecoVo.codigoPessoa, enderecoVo.codigoBairro, enderecoVo.nomeRua, enderecoVo.numero, enderecoVo.complemento, enderecoVo.cep];
      let resultado = await this.conexao.execute(sql, parametros);
      console.log('Foram inseridos ' + resultado.rowsAffected + ' registros no banco de dados.');
    }
    catch(error)
    {
      throw new IncluirError("endereço", "Erro ao inserir no banco de dados", 404, error);
    }
  }

  public async alterarEndereco(enderecoVo : EnderecoVo)
  {
    let resultado = null;
    try
    {
      let sql = 'UPDATE TB_ENDERECO SET CODIGO_PESSOA = :codigoPessoa, CODIGO_BAIRRO = :codigoBairro, NOME_RUA = :nomeRua, ';
      sql += ' NUMERO = :numero, COMPLEMENTO = :complemento, CEP = :cep  WHERE CODIGO_ENDERECO = :codigoEndereco';
      let parametros = [enderecoVo.codigoPessoa, enderecoVo.codigoBairro, enderecoVo.nomeRua, enderecoVo.numero, enderecoVo.complemento, enderecoVo.cep, enderecoVo.codigoEndereco];
      resultado = await this.conexao.execute(sql, parametros);
      console.log('QUANTIDADE DE REGISTROS ALTERADOS (ENDEREÇOS): ' + resultado.rowsAffected);
      if(resultado.rowsAffected == 0)
      {
        throw new AlterarError("endereço", "Não existe endereço com o código " + enderecoVo.codigoEndereco, 404, null);
      }
    }
    catch(error)
    {
      if(error instanceof AlterarError) {throw error} else {throw new AlterarError("endereço", "Erro ao alterar no banco de dados", 404, error);}
    }
  }

  public async excluirEndereco(enderecoVo : EnderecoVo)
  {
    try
    {
      let sql = 'DELETE FROM TB_ENDERECO WHERE CODIGO_ENDERECO = :codigoEndereco ';
      let resultSet = await this.conexao.execute(sql, [enderecoVo.codigoEndereco]);
      console.log('QUANTIDADE DE REGISTROS DELETADOS (ENDEREÇOS): ' + resultSet.rowsAffected);
    }
    catch(error)
    {
      throw new DeletarError("endereço", "Erro ao deletar no banco de dados", 404, error);
    }
  }

  public async pesquisarEndereco(enderecoVoFiltroPesquisa : EnderecoVo) : Promise<any>
  {
    try
    {
      let recursos : any[] = this.gerarSQLConsultarListar(enderecoVoFiltroPesquisa);
      let sql = recursos[0]; //sql
      let parametros : any[] = recursos[1];
      let resultSet = await this.conexao.execute(sql, parametros);
      console.log('QUANTIDADE DE REGISTROS ENCONTRADOS (ENDEREÇOS): ' + resultSet.rows.length);
      return this.buscarVariosRegistros(resultSet);
    }
    catch(error)
    {
      throw new ConsultarError("endereço", "Erro ao pesquisar no banco de dados", 404, error);
    }
  }

  private buscarVariosRegistros(resultSet : any) : EnderecoVo[]
  {
    let listaEnderecos : EnderecoVo[] = [];
    let numeroCampo = 0;
    let numeroLinha = 0;
    let quantidadeResultados = resultSet.rows.length;
    while(numeroLinha < quantidadeResultados)
    {
      let enderecoAtual = new EnderecoVo();
      {
        enderecoAtual.codigoEndereco = resultSet.rows[numeroLinha][numeroCampo++],
            enderecoAtual.codigoPessoa = resultSet.rows[numeroLinha][numeroCampo++],
            enderecoAtual.codigoBairro = resultSet.rows[numeroLinha][numeroCampo++],
            enderecoAtual.nomeRua = resultSet.rows[numeroLinha][numeroCampo++],
            enderecoAtual.numero = resultSet.rows[numeroLinha][numeroCampo++],
            enderecoAtual.complemento = resultSet.rows[numeroLinha][numeroCampo++],
            enderecoAtual.cep = resultSet.rows[numeroLinha][numeroCampo++]
      }

      listaEnderecos.push(enderecoAtual);
      numeroLinha++;
      numeroCampo = 0;
    }
    return listaEnderecos;
  }


  private gerarSQLConsultarListar(enderecoVoFiltroPesquisa : EnderecoVo) : any []
  {
    let parametros : any[] = [];
    let sql = 'SELECT CODIGO_ENDERECO, CODIGO_PESSOA, CODIGO_BAIRRO, NOME_RUA, NUMERO, COMPLEMENTO, CEP FROM TB_ENDERECO WHERE 1 = 1 ';
    if(enderecoVoFiltroPesquisa.codigoEndereco != 0)
    {
      sql += ' AND CODIGO_ENDERECO = :codigoEndereco ';
      parametros = [...parametros, enderecoVoFiltroPesquisa.codigoEndereco];
    }
    if(enderecoVoFiltroPesquisa.codigoPessoa != 0)
    {
      sql += ' AND CODIGO_PESSOA = :codigoPessoa ';
      parametros = [...parametros, enderecoVoFiltroPesquisa.codigoPessoa];
    }
    if(enderecoVoFiltroPesquisa.codigoBairro != 0)
    {
      sql += ' AND CODIGO_BAIRRO = :codigoBairro ';
      parametros = [...parametros, enderecoVoFiltroPesquisa.codigoBairro];
    }
    sql += " ORDER BY CODIGO_ENDERECO DESC ";
    return [sql, parametros];
  }
}

export default EnderecoDao;