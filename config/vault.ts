import { supabase } from './supabase';

export async function getVaultSecret(secretName: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_secret', {
        secret_name: secretName
      });

    if (error) {
      console.error('Error fetching secret:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error accessing vault:', error);
    return null;
  }
}