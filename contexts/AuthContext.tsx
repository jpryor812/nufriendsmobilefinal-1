import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseUrl } from '../config/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateDemographics: (age: number, gender: string, state: string, city: string, birthDate: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { username },
          emailRedirectTo: undefined
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            username,
            email: email,
            created_at: new Date().toISOString(),
            demographics: {
              age: null,
              birth_date: null,
              city: null,
              gender: null,
              state: null
            },
            onboarding: {
              responses: {
                aspirations: { answer: null, updatedAt: null },
                entertainment: { answer: null, updatedAt: null },
                hobbies: { answer: null, updatedAt: null },
                location: { answer: null, updatedAt: null },
                music: { answer: null, updatedAt: null },
                travel: { answer: null, updatedAt: null }
              },
              status: {
                isComplete: false,
                completedAt: null,
                lastUpdated: null
              }
            },
            stats: {
              ai_interactions: 0,
              conversations_started: 0,
              messages_sent: 0
            },
            subscription: {
              type: 'free',
              validUntil: null
            }
          });

        if (profileError) throw profileError;
      }

      return { error: null };
    } catch (err) {
      console.error('Signup error:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateDemographics = async (age: number, gender: string, state: string, city: string, birthDate: number) => {
    if (!user) throw new Error('No user');
    
    const { error } = await supabase
      .from('profiles')
      .update({
        demographics: {
          age,
          gender,
          state,
          city,
          birth_date: birthDate
        }
      })
      .eq('user_id', user.id);

    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateDemographics,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};