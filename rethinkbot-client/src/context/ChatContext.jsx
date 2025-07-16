import { createContext, useContext, useEffect, useState } from 'react';
import { getConversations } from '../services/conversation';
import { getOrCreateAnonId } from '../utils/anon';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const userId = user?.id || getOrCreateAnonId();
      const convs = await getConversations(userId);
      setConversations(convs);
      setError(null);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Your conversations could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  const addConversation = (newConv) => {
    setConversations((prev) => [newConv, ...prev]);
  };

  const deleteConversation = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      isLoading,
      error,
      reload: loadConversations,
      addConversation,
      deleteConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
