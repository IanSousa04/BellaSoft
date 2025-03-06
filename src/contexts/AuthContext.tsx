import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/AuthService';
import type { Database } from '../types/supabase';

// Tipos de Usuário e Empresa
type Usuario = Database['public']['Tables']['users']['Row'];
type Empresa = Database['public']['Tables']['tenants']['Row'];

// Interface do Contexto de Autenticação
interface AuthContextType {
  usuario: Usuario | null;
  empresa: Empresa | null;
  isAutenticado: boolean;
  isCarregando: boolean;
  entrar: (email: string, senha: string) => Promise<boolean>;
  cadastrar: (email: string, senha: string, nome: string, nomeEmpresa: string) => Promise<boolean>;
  sair: () => Promise<void>;
  convidarUsuario: (email: string, nome: string, papel: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  empresa: null,
  isAutenticado: false,
  isCarregando: true,
  entrar: async () => false,
  cadastrar: async () => false,
  sair: async () => {},
  convidarUsuario: async () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [isCarregando, setIsCarregando] = useState(true);
  const authService = new AuthService();

  useEffect(() => {
    verificarUsuario();
  }, []);

  const verificarUsuario = async () => {
    try {
      const usuario = await authService.getCurrentUser();
      const empresa = await authService.getCurrentTenant();
      setUsuario(usuario);
      setEmpresa(empresa);
      console.log('usuario', usuario);
      console.log('empresa', empresa);
    } catch (erro) {
      console.error('Erro ao verificar usuário:', erro);
    } finally {
      setIsCarregando(false);
    }
  };

  const entrar = async (email: string, senha: string) => {
    const sucesso = await authService.signIn(email, senha);
console.log('sucesso', sucesso);
    if (sucesso) {
      await verificarUsuario();
    }
    return sucesso;
  };

  const cadastrar = async (email: string, senha: string, nome: string, nomeEmpresa: string) => {
    const sucesso = await authService.signUp(email, senha, nome, nomeEmpresa);
    if (sucesso) {
      await verificarUsuario();
    }
    return sucesso;
  };

  const sair = async () => {
    await authService.signOut();
    setUsuario(null);
    setEmpresa(null);
  };

  const convidarUsuario = async (email: string, nome: string, papel: string) => {
    return await authService.inviteUser(email, nome, papel);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        empresa,
        isAutenticado: !!usuario,
        isCarregando,
        entrar,
        cadastrar,
        sair,
        convidarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};