import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InputBox from '../components/InputBox';
import { getConversationById } from '../services/conversation'; // 👈 función que vas a crear


function ChatPage() {
  const [messages, setMessages] = useState([]);
  const { id } = useParams(); // 👈 conversation ID de la URL

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
  setMessages((prev) => [
    ...prev,
    { from: 'user', text },
    { from: 'bot', text: '🤖 (respuesta pendiente)' }
  ]);
};

  return (
    <div className='main-page'>
      <div className='chat-log'>
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.from}:</strong> {msg.text}</p>
        ))}
      </div>
      <InputBox onSend={handleSend} />
    </div>
  );
}


export default ChatPage