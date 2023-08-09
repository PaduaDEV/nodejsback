import { Router } from "express";
import UFController from "../controller/UFController";

const ufRotas = Router();

const ufControler: UFController = new UFController();

ufRotas.post('/', ufControler.incluirUF);
ufRotas.put('/', ufControler.alterarUF);
ufRotas.get('/', ufControler.pesquisarUF);
ufRotas.delete('/:codigoUF', ufControler.deletarUF);

export default ufRotas;
