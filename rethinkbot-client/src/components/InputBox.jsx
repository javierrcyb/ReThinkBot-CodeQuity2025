import './InputBox.css'
import { useEffect, useRef, useState } from 'react'

const MODOS_DISPONIBLES = [
  { id: 'socratic', label: '🟢 Socratic' },
  { id: 'debate', label: '🟠 Ethical Debate' },
  { id: 'evidence', label: '🔵 Evidence Test' },
  { id: 'speech', label: '🟣 Discourse Analysis' },
]

function InputBox({ onSend }) {
  const [text, setText] = useState('')
  const [modoActivo, setModoActivo] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    if (!modoActivo) {
      alert("Please select a mode before sending.");
      return;
    }

    if (text.trim()) {
      onSend({ text, modo: modoActivo });
      setText('');
    }
  };


  // Efecto para ampliar el recuadro de Input
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto' // Reset
      textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px' // Máximo 400px
    }
  }, [text])

  return (
    <div className="input-box">
      <div className="texto-box-input">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here..."
          className={`textarea ${text.trim() === '' ? 'empty' : ''}`}
        />

        <button onClick={handleSend}>Send</button>
      </div>

      <div className="modo-enviar-row">
        {MODOS_DISPONIBLES.map((modo) => (
          <label key={modo.id} className="modo-radio">
            <input
              type="radio"
              name="modo"
              value={modo.id}
              checked={modoActivo === modo.id}
              onChange={() => setModoActivo(modo.id)}
            />
            {modo.label}
          </label>
        ))}
      </div>
    </div>
  )
}

export default InputBox
