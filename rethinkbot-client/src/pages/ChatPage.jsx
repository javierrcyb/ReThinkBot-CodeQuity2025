import './ChatPage.css'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InputBox from '../components/InputBox';
import { getConversationById, sendMessage } from '../services/conversation'; // 👈
import { useAuth } from '../context/AuthContext';
import { getOrCreateAnonId } from '../utils/anon';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const userId = isAuthenticated ? user?.id : getOrCreateAnonId();

  useEffect(() => {
    async function loadConversation() {
      try {
        const res = await getConversationById(id);
        setMessages(
          res.messages.map((m) => ({
            from: m.sender === 'USER' ? 'user' : 'bot',
            text: m.content,
          }))
        );
      } catch (err) {
        console.error('Error loading conversation', err);
      }
    }

    loadConversation();
  }, [id]);

  const handleSend = async ({ text }) => {
    try {
      const res = await sendMessage(id, userId, text);

      setMessages(prev => [
        ...prev,
        { from: 'user', text },
        { from: 'bot', text: res.botReply }
      ]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [
        ...prev,
        { from: 'user', text },
        { from: 'bot', text: '⚠️ Error sending message' }
      ]);
    }
  };

  return (
    <div className='main-page'>
      <div className='chat-log'>
        {messages.map((msg, i) => (
          <p key={i} className={msg.from}>{msg.text}</p>
        ))}
      </div>

      <InputBox onSend={handleSend} />

      <div className='session-status'>
        {isAuthenticated
          ? <p>🔓 You are in this chat as <strong>registered user</strong></p>
          : <p>👤 You are in this chat as <strong>anonymous guest</strong></p>}
      </div>
    </div>
  );
}

export default ChatPage;
