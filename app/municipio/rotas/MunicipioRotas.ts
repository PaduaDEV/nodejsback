import { Router } from "express";
import MunicipioController from "../controller/MunicipioController";

const municipioRotas = Router();

const municipioController: MunicipioController = new MunicipioController();

municipioRotas.post('/', municipioController.incluirMunicipio);
municipioRotas.put('/', municipioController.alterarMunicipio);
municipioRotas.get('/', municipioController.pesquisarMunicipio);

export default municipioRotas;
