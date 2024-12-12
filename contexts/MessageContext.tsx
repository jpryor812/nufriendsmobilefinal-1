import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  updateDoc,
  increment
} from 'firebase/firestore';
import { useAuth } from './AuthContext'; // Import your existing AuthContext

// Types for messages and conversations
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'text' | 'ai_generated' | 'voice' | 'image';
  timestamp: Timestamp;
  read: boolean;
  mediaUrl?: string;
}

interface Conversation {
  id: string;
  participants: {
    [userId: string]: {
      lastRead: Timestamp;
      lastTyping: Timestamp;
      unreadCount: number;
    };
  };
  lastMessage: {
    content: string;
    timestamp: Timestamp;
    senderId: string;
    type: 'text' | 'ai_generated' | 'voice' | 'image';
  };
  isInitialAiConversation: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Context type definition
interface MessagingContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  error: string | null;
  sendMessage: (
    conversationId: string,
    content: string,
    type?: 'text' | 'ai_generated' | 'voice' | 'image',
    mediaUrl?: string
  ) => Promise<void>;
  createConversation: (recipientId: string, isAiGenerated?: boolean) => Promise<string>;
  setCurrentConversation: (conversationId: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  setTypingStatus: (conversationId: string, isTyping: boolean) => Promise<void>;
}

// Create the context
const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

// Provider component
export function MessagingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to user's conversations
  useEffect(() => {
    if (!user?.uid) return;

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where(`participants.${user.uid}`, '!=', null),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const conversationList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Conversation));
        setConversations(conversationList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching conversations:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const sendMessage = async (
    conversationId: string,
    content: string,
    type: 'text' | 'ai_generated' | 'voice' | 'image' = 'text',
    mediaUrl?: string
  ) => {
    if (!user?.uid) throw new Error('User not authenticated');

    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversation = await getDoc(conversationRef);
      
      if (!conversation.exists()) {
        throw new Error('Conversation not found');
      }

      const conversationData = conversation.data() as Conversation;
      const recipientId = Object.keys(conversationData.participants).find(id => id !== user.uid);
      
      if (!recipientId) {
        throw new Error('Recipient not found');
      }

      const messagesRef = collection(db, `conversations/${conversationId}/messages`);
      const newMessageRef = doc(messagesRef);

      const message: Message = {
        id: newMessageRef.id,
        conversationId,
        senderId: user.uid,
        recipientId,
        content,
        type,
        timestamp: serverTimestamp() as Timestamp,
        read: false,
        mediaUrl
      };

      await Promise.all([
        setDoc(newMessageRef, message),
        updateDoc(conversationRef, {
          lastMessage: {
            content,
            timestamp: serverTimestamp(),
            senderId: user.uid,
            type
          },
          updatedAt: serverTimestamp(),
          [`participants.${recipientId}.unreadCount`]: increment(1)
        })
      ]);
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const createConversation = async (recipientId: string, isAiGenerated: boolean = false) => {
    if (!user?.uid) throw new Error('User not authenticated');

    try {
      const conversationsRef = collection(db, 'conversations');
      const newConversationRef = doc(conversationsRef);

      const conversation: Conversation = {
        id: newConversationRef.id,
        participants: {
          [user.uid]: {
            lastRead: serverTimestamp() as Timestamp,
            lastTyping: serverTimestamp() as Timestamp,
            unreadCount: 0
          },
          [recipientId]: {
            lastRead: serverTimestamp() as Timestamp,
            lastTyping: serverTimestamp() as Timestamp,
            unreadCount: 0
          }
        },
        lastMessage: {
          content: '',
          timestamp: serverTimestamp() as Timestamp,
          senderId: '',
          type: 'text'
        },
        isInitialAiConversation: isAiGenerated,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
      };

      await setDoc(newConversationRef, conversation);
      return newConversationRef.id;
    } catch (err) {
      console.error('Error creating conversation:', err);
      throw err;
    }
  };

  const setConversationById = async (conversationId: string) => {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversation = await getDoc(conversationRef);
      
      if (!conversation.exists()) {
        throw new Error('Conversation not found');
      }

      setCurrentConversation(conversation.data() as Conversation);
    } catch (err) {
      console.error('Error setting current conversation:', err);
      throw err;
    }
  };

  const markConversationAsRead = async (conversationId: string) => {
    if (!user?.uid) throw new Error('User not authenticated');

    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        [`participants.${user.uid}.lastRead`]: serverTimestamp(),
        [`participants.${user.uid}.unreadCount`]: 0
      });
    } catch (err) {
      console.error('Error marking conversation as read:', err);
      throw err;
    }
  };

  const setTypingStatus = async (conversationId: string, isTyping: boolean) => {
    if (!user?.uid) throw new Error('User not authenticated');

    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        [`participants.${user.uid}.lastTyping`]: isTyping ? serverTimestamp() : null
      });
    } catch (err) {
      console.error('Error updating typing status:', err);
      throw err;
    }
  };

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        currentConversation,
        loading,
        error,
        sendMessage,
        createConversation,
        setCurrentConversation: setConversationById,
        markConversationAsRead,
        setTypingStatus,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

// Custom hook
export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}
   