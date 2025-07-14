import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputBox from '../components/InputBox';
import { useAuth } from '../context/AuthContext';
import { createConversation } from '../services/conversation';
import { getOrCreateAnonId } from '../utils/anon';

function HomePage() {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentConversationId, setCurrentConversationId] = useState(null);

  useEffect(() => {
    // Recuperar conversación activa del localStorage si existe
    const savedConvId = localStorage.getItem('currentConversationId');
    if (savedConvId) setCurrentConversationId(savedConvId);
  }, []);

  const handleSend = async ({ text, modo }) => {
    const modeEnumMap = {
      socratic: 'SOCRATIC',
      debate: 'DEBATE',
      evidence: 'EVIDENCE',
      speech: 'SPEECH',
    };

    const mode = modeEnumMap[modo];

    const token = user?.token || getOrCreateAnonId(); // user ID o anonId

    if (currentConversationId) {
      // Ya está en conversación, enviar mensaje en esa conversación
      navigate(`/chat/${currentConversationId}`);
    } else {
      const res = await createConversation(token, mode, text);
      setMessages(res.messages.map(m => ({
        from: m.sender === 'USER' ? 'user' : 'bot',
        text: m.content
      })));
      setCurrentConversationId(res.id);
      localStorage.setItem('currentConversationId', res.id);
      navigate(`/chat/${res.id}`);
    }
  };

  return (
    <div className="home-page">
      <h1>Hi, I am RethinkBot</h1>
      <InputBox onSend={handleSend} />
      <div>
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.from}:</strong> {msg.text}</p>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
