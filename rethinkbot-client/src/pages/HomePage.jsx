import { useState } from 'react';
import InputBox from '../components/InputBox';
import { useAuth } from '../context/AuthContext';
import { createConversation } from '../services/conversation';

function HomePage() {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  const handleSend = async ({ text, modo }) => {
    const modeIdMap = {
      socratic: 1,
      debate: 2,
      evidence: 3,
      speech: 4,
    };
    const modeId = modeIdMap[modo];

    const res = await createConversation(user.token, modeId, text);

    setMessages(res.messages.map(m => ({
      from: m.sender === 'USER' ? 'user' : 'bot',
      text: m.content
    })));
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

export default HomePage