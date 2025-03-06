import { Database } from '../types/supabase';
import { BaseService } from './BaseService';

type Servico = Database['public']['Tables']['services']['Row'];

export class ServicoService extends BaseService<Servico> {
  constructor() {
    super('services');
  }
}