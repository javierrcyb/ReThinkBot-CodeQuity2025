import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputBox from '../components/InputBox';
import { useAuth } from '../context/AuthContext';
import { createConversation } from '../services/conversation';
import { getOrCreateAnonId } from '../utils/anon';
import { useChat } from '../context/ChatContext'; // 🧠 ChatContext

function HomePage() {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const { addConversation } = useChat(); // 🧠 Accede a la función

  const handleSend = async ({ text, modo }) => {
    const modeEnumMap = {
      socratic: 'SOCRATIC',
      debate: 'DEBATE',
      evidence: 'EVIDENCE',
      speech: 'SPEECH',
    };

    const mode = modeEnumMap[modo];
    const userId = user?.id || getOrCreateAnonId();

    if (currentConversationId) {
      navigate(`/chat/${currentConversationId}`);
    } else {
      const res = await createConversation(userId, mode, text);
      setMessages(res.messages.map(m => ({
        from: m.sender === 'USER' ? 'user' : 'bot',
        text: m.content
      })));

      setCurrentConversationId(res.id);
      localStorage.setItem('currentConversationId', res.id);

      addConversation(res);
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
