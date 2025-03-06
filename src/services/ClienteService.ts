import { Cliente } from "../entities/Cliente";
import BaseService from "./BaseService";

class ClienteService extends BaseService<Cliente> {
    constructor() {
      super('clientes') 
    }
}

export default ClienteService;