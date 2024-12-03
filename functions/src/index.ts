import { supabase } from '../../config/supabase';

export { findMatch } from './matchmaking/findMatch';

export async function getOpenAIKey(): Promise<string | undefined> {
  try {
    const { data, error } = await supabase
      .rpc('get_secret', {
        secret_name: 'OPENAI_API_KEY'
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching API key:', error);
    throw new Error('Could not fetch API key');
  }
}