import AbstractBe from "../../framework/be/AbstractBe";
import CampoObrigatorioError from "../../framework/exceptions/CampoObrigatorioError";
import BairroDao from "../dao/BairroDao";
import BairroVo from "../vo/BairroVo";

class BairroBe extends AbstractBe {
    private bairroDao: BairroDao;

    constructor(conexao: any) {
        super(conexao);
        this.bairroDao = new BairroDao(this.conexao);
    }

    public async incluirBairro(bairroVo: BairroVo) {
        this.validarCampos(bairroVo, "incluir Bairro", false);
        await this.bairroDao.incluirBairro(bairroVo);
        const registros = await this.bairroDao.pesquisarBairro(new BairroVo());
        return registros;
    }

    public async alterarBairro(bairroVo: BairroVo) {
        this.validarCampos(bairroVo, "alterar Bairro", true);
        await this.bairroDao.alterarBairro(bairroVo);
        const registros = await this.bairroDao.pesquisarBairro(new BairroVo());
        return registros;
    }

    public async pesquisarBairro(bairroVoFiltroPesquisa: BairroVo) {
        let registros = await this.bairroDao.pesquisarBairro(bairroVoFiltroPesquisa);
        if (
            registros.codigoBairro !== undefined &&
            bairroVoFiltroPesquisa.codigoBairro === 0 &&
            bairroVoFiltroPesquisa.nome === "" &&
            bairroVoFiltroPesquisa.codigoMunicipio === 0
        ) {
            registros = [registros];
        }
        return registros;
    }
    public async deletarBairro(codigoBairro: number) {
        if (!codigoBairro || codigoBairro < 1) {
            throw new CampoObrigatorioError("deletar Bairro", "codigoBairro");
        }

        await this.bairroDao.deletarBairro(codigoBairro);
    }
    private validarCampos(
        bairroVo: BairroVo,
        acao: string,
        alteracao: boolean
    ) {
        if (!bairroVo) {
            throw new CampoObrigatorioError(acao, "o JSON");
        }
        if (!bairroVo.codigoMunicipio || bairroVo.codigoMunicipio < 1) {
            throw new CampoObrigatorioError(acao, "codigoMunicipio");
        }
        if (!bairroVo.nome || !bairroVo.nome.trim()) {
            throw new CampoObrigatorioError(acao, "nome");
        }
        if (!bairroVo.status || bairroVo.status < 1) {
            throw new CampoObrigatorioError(acao, "status");
        }
        if (
            alteracao &&
            (!bairroVo.codigoBairro || bairroVo.codigoBairro < 1)
        ) {
            throw new CampoObrigatorioError(acao, "codigoBairro");
        }
    }
}

export default BairroBe;
