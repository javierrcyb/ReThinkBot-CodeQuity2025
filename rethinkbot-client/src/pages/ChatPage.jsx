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
        console.error('Error cargando conversación', err);
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
      console.error('❌ Error enviando mensaje:', err);
      setMessages(prev => [
        ...prev,
        { from: 'user', text },
        { from: 'bot', text: '⚠️ Error enviando mensaje' }
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
          ? <p>🔓 Estás viendo este chat como <strong>usuario registrado</strong></p>
          : <p>👤 Estás viendo este chat como <strong>invitado anónimo</strong></p>}
      </div>
    </div>
  );
}

export default ChatPage;
