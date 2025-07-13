import { useState } from 'react'
import InputBox from '../components/InputBox'

function HomePage() {
  const [messages, setMessages] = useState([])

  const handleSend = ({ text, mode }) => {
    setMessages((prev) => [
      ...prev,
      { from: 'user', text },
      { from: 'bot', text: `(${mode}) ¿Por qué piensas eso?` }
    ])
  }

  return (
    <div className="home-page">
      <h1>Hi, I am RethinkBot</h1>
      <h3>How can I help you today</h3>

      <InputBox onSend={handleSend} />
    </div>
  )
}

export default HomePage
