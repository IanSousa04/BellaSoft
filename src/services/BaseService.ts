import { SupabaseClient } from '@supabase/supabase-js'
import supabase from '../config/supabase'

class BaseService<T> {
  private supabase: SupabaseClient
  private tableName: string

  constructor(tableName: string) {
    // Inicializa o cliente Supabase com as credenciais
    this.supabase = supabase
    this.tableName = tableName
  }

  // Método para buscar um único item
  async getOne(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar o item:', error.message)
      return null
    }
    return data
  }

  // Método para buscar múltiplos itens
  async getMany(): Promise<T[]> {
    const { data, error } = await this.supabase.from(this.tableName).select('*')

    if (error) {
      console.error('Erro ao buscar os itens:', error.message)
      return []
    }
    return data
  }

  // Método para inserir um item
  async insert(item: T): Promise<T | null> {
    const { data, error } = await this.supabase.from(this.tableName).insert([item])

    if (error) {
      console.error('Erro ao adicionar o item:', error.message)
      return null
    }

    if (!data) {
        throw new Error('Item não encontrado')
    }

    return data[0]
  }

  // Método para atualizar um item
  async update(id: string, item: T): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(item)
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar o item:', error.message)
      return null
    }

    if (!data) {
        throw new Error('Item não encontrado')
    }

    return data[0]
  }

  // Método para deletar um item
  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase.from(this.tableName).delete().eq('id', id)

    if (error) {
      console.error('Erro ao deletar o item:', error.message)
      return false
    }
    return true
  }
}

export default BaseService
