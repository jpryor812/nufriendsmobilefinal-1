import { supabase } from '@/config/supabase';

// Update demographics information
export async function updateDemographics(userId: string, data: {
  age?: number;
  birthDate?: number;
  city?: string;
  gender?: string;
  state?: string;
}) {
  const { error } = await supabase
    .from('demographics')
    .upsert({ 
      user_id: userId,
      ...data,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
}

// Update onboarding responses
export async function updateOnboardingResponse(
  userId: string,
  questionKey: 'location' | 'entertainment' | 'hobbies' | 'music' | 'aspirations',
  answer: string
) {
  const { error } = await supabase
    .from('onboarding_responses')
    .upsert({ 
      user_id: userId,
      [questionKey]: answer,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
}