import { createClient } from '@supabase/supabase-js';
import { TEST_USERS } from './testUtils';

const supabaseUrl = 'https://cjmhepjsxklaffursazj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbWhlcGpzeGtsYWZmdXJzYXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNTAxOTcsImV4cCI6MjA0ODcyNjE5N30.WbmpqsJzVc6b4tFXQ1bP6peb_d5E0rkI-Jwg1DCN7SI';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

async function uploadTestUsers() {
  for (const user of TEST_USERS) {
    try {
      console.log(`Starting to create user: ${user.username}`);

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            username: user.username
          }
        }
      });

      if (authError) {
        console.error(`Auth error for ${user.username}:`, authError);
        continue;
      }

      const userId = authData.user!.id;
      const now = new Date().toISOString();
      console.log(`Created auth user with ID: ${userId}`);

      // 2. Insert into profiles - matches exact schema
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: user.username,
          created_at: now,
          updated_at: now
        });

      if (profileError) {
        console.error(`Profile error for ${user.username}:`, profileError);
        continue;
      }

      // 3. Insert demographics - matches exact schema
      const { error: demoError } = await supabase
        .from('demographics')
        .insert({
          user_id: userId,
          age: user.demographics.age,
          birth_date: user.demographics.birth_date,
          city: user.demographics.city,
          gender: user.demographics.gender,
          state: user.demographics.state
        });

      if (demoError) {
        console.error(`Demographics error for ${user.username}:`, demoError);
        continue;
      }

      // 4. Insert onboarding responses - matches exact schema
      const { error: onboardError } = await supabase
        .from('onboarding_responses')
        .insert({
          user_id: userId,
          aspirations: user.onboarding_responses.aspirations,
          entertainment: user.onboarding_responses.entertainment,
          hobbies: user.onboarding_responses.hobbies,
          location: user.onboarding_responses.location,
          music: user.onboarding_responses.music,
          travel: user.onboarding_responses.travel,
          is_complete: true,
          completed_at: now,
          last_updated: now
        });

      if (onboardError) {
        console.error(`Onboarding error for ${user.username}:`, onboardError);
        continue;
      }

      // 5. Initialize user stats - matches exact schema
      const { error: statsError } = await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          ai_interactions: 0,
          conversations_started: 0,
          messages_sent: 0
        });

      if (statsError) {
        console.error(`Stats error for ${user.username}:`, statsError);
        continue;
      }

      console.log(`Successfully created test user: ${user.username}`);

    } catch (error) {
      console.error(`Failed to create test user ${user.username}:`, error);
    }
  }
}

// Run the upload
console.log('Starting user upload process...');
uploadTestUsers()
  .then(() => console.log('Finished uploading test users'))
  .catch(error => console.error('Fatal error during upload:', error));