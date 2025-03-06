import { Database } from '../types/supabase';
import { BaseService } from './BaseService';

type Cidade = Database['public']['Tables']['cities']['Row'];

export class CidadeService extends BaseService<Cidade> {
  constructor() {
    super('cities');
  }
}