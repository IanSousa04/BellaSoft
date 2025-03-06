import { Database } from '../types/supabase';
import { BaseService } from './BaseService';

type Produto = Database['public']['Tables']['products']['Row'];

export class ProdutoService extends BaseService<Produto> {
  constructor() {
    super('products');
  }
}