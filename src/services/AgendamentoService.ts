import { Database } from '../types/supabase';
import { BaseService } from './BaseService';

type Agendamento = Database['public']['Tables']['appointments']['Row'];

export class AgendamentoService extends BaseService<Agendamento> {
  constructor() {
    super('appointments');
  }
}