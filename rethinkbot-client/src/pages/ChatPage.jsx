import { useState } from 'react'
import InputBox from '../components/InputBox'

function ChatPage() {
  const [messages, setMessages] = useState([])

  const handleSend = (text) => {
    setMessages([...messages, { from: 'user', text }])
    setMessages((prev) => [...prev, { from: 'bot', text: `¿Por qué piensas eso?` }])
  }

  return (
    <div className='main-page'>
      <div className='chat-log'>
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.from}:</strong> {msg.text}</p>
        ))}
      </div>
      <InputBox onSend={handleSend} />
    </div>
  )
}

export default ChatPage