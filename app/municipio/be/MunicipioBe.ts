import AbstractBe from "../../framework/be/AbstractBe";
import CampoObrigatorioError from "../../framework/exceptions/CampoObrigatorioError";
import RegistroJaExisteError from "../../framework/exceptions/RegistroJaExisteError";
import MunicipioDao from "../dao/MunicipioDao";
import MunicipioVo from "../vo/MunicipioVo";

class MunicipioBe extends AbstractBe {
    private municipioDao: MunicipioDao;

    constructor(conexao: any) {
        super(conexao);
        this.municipioDao = new MunicipioDao(this.conexao);
    }

    public async incluirMunicipio(municipioVo: MunicipioVo) {
        this.validarCampos(municipioVo, "incluir Município", false);
        await this.verificarSeExisteMunicipio(municipioVo, "incluir", "Municipio");
        await this.municipioDao.incluirMunicipio(municipioVo);
        const registros = await this.municipioDao.pesquisarMunicipio(new MunicipioVo());
        return registros;
    }

    public async alterarMunicipio(municipioVo: MunicipioVo) {
        this.validarCampos(municipioVo, "alterar Município", true);
        await this.verificarSeExisteMunicipio(municipioVo, "alterar", "Municipio");
        await this.municipioDao.alterarMunicipio(municipioVo);
        const registros = await this.municipioDao.pesquisarMunicipio(new MunicipioVo());
        return registros;
    }

    public async verificarSeExisteMunicipio(municipioVo: MunicipioVo, acao: string, modulo: string) {
        let municipioVoFiltroPesquisa: MunicipioVo = new MunicipioVo();
        municipioVoFiltroPesquisa.nome = municipioVo.nome;
        municipioVoFiltroPesquisa.codigoUF = municipioVo.codigoUF;
        let registros = await this.municipioDao.pesquisarMunicipio(municipioVoFiltroPesquisa);
        if (
            registros !== undefined &&
            (
                (Array.isArray(registros) && registros.length > 0 && registros[0].codigoMunicipio !== municipioVo.codigoMunicipio) ||
                (!Array.isArray(registros) && registros.codigoMunicipio !== undefined && registros.codigoMunicipio > 0 && registros.codigoMunicipio !== municipioVo.codigoMunicipio)
            )
        ) {
            throw new RegistroJaExisteError(acao, modulo, `o nome ${municipioVo.nome}`, 404);
        }
    }

    public async pesquisarMunicipio(municipioVoFiltroPesquisa: MunicipioVo) {
        let registros = await this.municipioDao.pesquisarMunicipio(municipioVoFiltroPesquisa);
        if (
            registros.codigoMunicipio !== undefined &&
            municipioVoFiltroPesquisa.codigoMunicipio === 0 &&
            municipioVoFiltroPesquisa.nome === "" &&
            municipioVoFiltroPesquisa.codigoUF === 0
        ) {
            let lista = [];
            lista.push(registros);
            registros = lista;
        }
        return registros;
    }

    private validarCampos(municipioVo: MunicipioVo, acao: string, alteracao: boolean) {
        if (!municipioVo) {
            throw new CampoObrigatorioError(acao, "o objeto Município");
        }
        if (!municipioVo.nome || municipioVo.nome.trim() === "") {
            throw new CampoObrigatorioError(acao, "nome");
        }
        if (!municipioVo.codigoUF || municipioVo.codigoUF < 1) {
            throw new CampoObrigatorioError(acao, "código UF");
        }
        if (alteracao && (!municipioVo.codigoMunicipio || municipioVo.codigoMunicipio < 1)) {
            throw new CampoObrigatorioError(acao, "código Município");
        }
    }
}

export default MunicipioBe;
