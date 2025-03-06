import { Database } from '../types/supabase';
import { BaseService } from './BaseService';

type Cliente = Database['public']['Tables']['clients']['Row'];

export class ClienteService extends BaseService<Cliente> {
  constructor() {
    super('clients');
  }
}