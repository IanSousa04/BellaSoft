import { Database } from '../types/supabase';
import { BaseService } from './BaseService';

type Profissional = Database['public']['Tables']['professionals']['Row'];

export class ProfissionalService extends BaseService<Profissional> {
  constructor() {
    super('professionals');
  }
}