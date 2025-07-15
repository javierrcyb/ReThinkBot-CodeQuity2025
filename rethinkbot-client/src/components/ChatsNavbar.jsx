import { useChat } from '../context/ChatContext';
import { Link } from 'react-router-dom';

function ChatsNavBar() {
  const { conversations, isLoading, error } = useChat();

  return (
    <div className="chats-navbar">
      <h3>Tus conversaciones</h3>

      {isLoading && <p>🔄 Cargando conversaciones...</p>}
      {error && <p className="error">{error}</p>}

      {!isLoading && !error && (
        <ul>
          {conversations.length === 0 ? (
            <p>No tienes conversaciones aún.</p>
          ) : (
            conversations.map((conv) => (
              <li key={conv.id}>
                <Link to={`/chat/${conv.id}`}>
                  🗨️ Chat {conv.id.slice(0, 6)}... – {conv.mode}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}


export default ChatsNavBar;
