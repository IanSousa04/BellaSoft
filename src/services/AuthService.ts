import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';

type Tenant = Database['public']['Tables']['tenants']['Row'];
type User = Database['public']['Tables']['users']['Row'];

export class AuthService {
  async signUp(email: string, password: string, name: string, tenantName: string): Promise<boolean> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from sign up');

      // Create tenant
      const slug = tenantName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .insert([{ name: tenantName, slug }])
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          tenant_id: tenantData.id,
          name,
          role: 'admin'
        }]);

      if (userError) throw userError;

      return true;
    } catch (error) {
      console.error('Error during sign up:', error);
      return false;
    }
  }

  async signIn(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return !!data.user;
    } catch (error) {
      console.error('Error during sign in:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*, tenants(*)')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getCurrentTenant(): Promise<Tenant | null> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', user.tenant_id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting current tenant:', error);
      return null;
    }
  }

  async inviteUser(email: string, name: string, role: string): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { name }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from creation');

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          tenant_id: currentUser.tenant_id,
          name,
          role
        }]);

      if (userError) throw userError;

      return true;
    } catch (error) {
      console.error('Error inviting user:', error);
      return false;
    }
  }
}