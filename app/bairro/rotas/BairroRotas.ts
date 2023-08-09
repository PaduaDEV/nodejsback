import { Router } from "express";
import BairroController from "../controller/BairroController";

const bairroRotas = Router();

const bairroController: BairroController = new BairroController();

bairroRotas.post('/', bairroController.incluirBairro);
bairroRotas.put('/', bairroController.alterarBairro);
bairroRotas.get('/', bairroController.pesquisarBairro);

export default bairroRotas;
