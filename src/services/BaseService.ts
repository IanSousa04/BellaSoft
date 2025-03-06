import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';
import { Cliente } from '../entities/Cliente';

export class BaseService<T extends { id: string; tenant_id: string }> {
  protected supabase: SupabaseClient<Database>;
  protected tableName: string;

  constructor(tableName: string) {
    this.supabase = supabase;
    this.tableName = tableName;
  }

  protected async getCurrentTenantId(): Promise<string | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data: userData } = await this.supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    return userData?.tenant_id || null;
  }

  async getOne(id: string): Promise<T | null> {
    try {
      const tenantId = await this.getCurrentTenantId();
      if (!tenantId) throw new Error('No tenant ID found');

      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .single();

      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      return null;
    }
  }

  async getMany(): Promise<Cliente[]> {
    try {
      const tenantId = await this.getCurrentTenantId();
      if (!tenantId) throw new Error('No tenant ID found');

      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Cliente[];
    } catch (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      return [];
    }
  }

  async insert(item: Omit<T, 'id'>): Promise<T | null> {
    try {
      const tenantId = await this.getCurrentTenantId();
      if (!tenantId) throw new Error('No tenant ID found');

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert([{ ...item, tenant_id: tenantId }])
        .select()
        .single();

      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`Error inserting ${this.tableName}:`, error);
      return null;
    }
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    try {
      const tenantId = await this.getCurrentTenantId();
      if (!tenantId) throw new Error('No tenant ID found');

      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(item)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const tenantId = await this.getCurrentTenantId();
      if (!tenantId) throw new Error('No tenant ID found');

      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      return false;
    }
  }
}

export default BaseService